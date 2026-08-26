import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { jsonLdFor, pages, SITE_NAME } from "./src/seo/pages.js";

function escapeAttr(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;");
}

function setMeta(html, attr, key, content) {
  const pattern = new RegExp(
    `<meta[^>]*${attr}="${key}"[^>]*>`,
    "i"
  );
  const tag = `<meta ${attr}="${key}" content="${escapeAttr(content)}" />`;
  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function applyPage(html, page, siteUrl) {
  const origin = siteUrl.replace(/\/$/, "");
  const path = page.path === "/" ? "/" : page.path;
  const url = origin ? `${origin}${path}` : path;
  const robots = page.noindex ? "noindex,follow" : "index,follow";
  const json = JSON.stringify(jsonLdFor(page, origin || undefined));
  const image = origin ? `${origin}/logo.png` : "/logo.png";

  let out = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeAttr(page.title)}</title>`
  );
  out = setMeta(out, "name", "description", page.description);
  out = setMeta(out, "name", "robots", robots);
  out = setMeta(out, "property", "og:type", "website");
  out = setMeta(out, "property", "og:site_name", SITE_NAME);
  out = setMeta(out, "property", "og:title", page.title);
  out = setMeta(out, "property", "og:description", page.description);
  out = setMeta(out, "property", "og:url", url);
  out = setMeta(out, "property", "og:image", image);
  out = setMeta(out, "name", "twitter:card", "summary");
  out = setMeta(out, "name", "twitter:title", page.title);
  out = setMeta(out, "name", "twitter:description", page.description);

  if (/<link rel="canonical"[^>]*>/i.test(out)) {
    out = out.replace(
      /<link rel="canonical"[^>]*>/i,
      `<link rel="canonical" href="${escapeAttr(url)}" />`
    );
  } else {
    out = out.replace(
      "</head>",
      `    <link rel="canonical" href="${escapeAttr(url)}" />\n  </head>`
    );
  }

  if (/id="seo-jsonld"/.test(out)) {
    out = out.replace(
      /<script type="application\/ld\+json" id="seo-jsonld">[\s\S]*?<\/script>/,
      `<script type="application/ld+json" id="seo-jsonld">${json}</script>`
    );
  } else {
    out = out.replace(
      "</head>",
      `    <script type="application/ld+json" id="seo-jsonld">${json}</script>\n  </head>`
    );
  }

  return out;
}

export function seoPrerenderPlugin(siteUrl = "") {

  return {
    name: "seo-prerender",
    transformIndexHtml(html) {
      const home = pages.find((page) => page.path === "/");
      return applyPage(html, home, siteUrl);
    },
    closeBundle() {
      const dist = resolve("dist");
      const built = readFileSync(resolve(dist, "index.html"), "utf8");
      const prerender = pages.filter((page) => page.path !== "/" && !page.noindex);

      for (const page of prerender) {
        const html = applyPage(built, page, siteUrl);
        const file = resolve(dist, page.path.replace(/^\//, ""), "index.html");
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, html);
      }

      const locs = pages
        .filter((page) => !page.noindex)
        .map((page) => {
          const path = page.path === "/" ? "/" : page.path;
          const loc = siteUrl ? `${siteUrl.replace(/\/$/, "")}${path}` : path;
          const priority = page.path === "/" ? "1.0" : "0.8";
          return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
        })
        .join("\n");

      writeFileSync(
        resolve(dist, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${locs}\n</urlset>\n`
      );

      const sitemapLine = siteUrl
        ? `\nSitemap: ${siteUrl.replace(/\/$/, "")}/sitemap.xml\n`
        : "\n";
      writeFileSync(
        resolve(dist, "robots.txt"),
        `User-agent: *\nAllow: /\n\nDisallow: /api/\nDisallow: /health${sitemapLine}`
      );
    },
  };
}
