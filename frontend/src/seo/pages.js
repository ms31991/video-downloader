export const SITE_NAME = "ClipSnap";

export const pages = [
  {
    id: "home",
    path: "/",
    title: "Free Video Downloader for TikTok, Instagram & YouTube | ClipSnap",
    description:
      "Free online video downloader for TikTok, Instagram and YouTube. Paste a public video link and save an MP4 on your phone or computer. No app install.",
    h1: "Free Video Downloader",
    intro:
      "ClipSnap lets you save public videos from TikTok, Instagram and YouTube in a few clicks. Paste the link, pick a format, and download. It works in the browser on phones and desktops.",
  },
  {
    id: "tiktok",
    path: "/tiktok-downloader",
    title: "TikTok Video Downloader – Save MP4 Online Free | ClipSnap",
    description:
      "Download TikTok videos online for free. Paste a TikTok link and save the MP4 to your phone or computer. Fast, no signup, works on mobile.",
    h1: "TikTok Video Downloader",
    intro:
      "Save a public TikTok video by pasting the video URL. ClipSnap fetches available formats so you can download the file in your browser.",
  },
  {
    id: "instagram",
    path: "/instagram-downloader",
    title: "Instagram Video Downloader – Reels & Posts | ClipSnap",
    description:
      "Download Instagram Reels and video posts for free. Paste an Instagram URL and save the video as MP4. Works on iPhone, Android and desktop.",
    h1: "Instagram Video Downloader",
    intro:
      "Use ClipSnap to download public Instagram Reels and video posts. Copy the share link, paste it below, then choose a download option.",
  },
  {
    id: "youtube",
    path: "/youtube-downloader",
    title: "YouTube Video Downloader – Save Videos Online | ClipSnap",
    description:
      "Download YouTube videos online. Paste a YouTube or youtu.be link and save an available MP4 format. Free to use in any modern browser.",
    h1: "YouTube Video Downloader",
    intro:
      "Paste a public YouTube video URL to see available download formats. Pick the quality you need and save the file to your device.",
  },
  {
    id: "privacy",
    path: "/privacy",
    title: "Privacy Policy | ClipSnap",
    description:
      "How ClipSnap handles video URLs, logs and cookies when you use the online video downloader.",
    noindex: false,
  },
  {
    id: "terms",
    path: "/terms",
    title: "Terms of Service | ClipSnap",
    description:
      "Terms for using ClipSnap. Download only content you have the right to save and follow platform rules.",
  },
  {
    id: "dmca",
    path: "/dmca",
    title: "DMCA Copyright Policy | ClipSnap",
    description:
      "Copyright complaint process for ClipSnap. Rights holders can request removal of infringing material.",
  },
];

export function pageByPath(path) {
  return pages.find((page) => page.path === path);
}

export function indexablePages() {
  return pages.filter((page) => !page.noindex);
}

export function faqFor(id) {
  const shared = [
    {
      q: "Is ClipSnap free to use?",
      a: "Yes. You can paste a supported video link and download available formats without creating an account.",
    },
    {
      q: "Do I need to install an app?",
      a: "No. ClipSnap runs in the browser on iPhone, Android, tablets and desktop computers.",
    },
    {
      q: "Is it legal to download videos?",
      a: "Only download videos you own or have permission to save. Respect copyright and each platform’s terms of service.",
    },
  ];

  if (id === "home") {
    return [
      {
        q: "Which sites can I download from?",
        a: "ClipSnap supports public TikTok, Instagram and YouTube links, plus Facebook URLs on the same downloader.",
      },
      ...shared,
    ];
  }

  if (id === "tiktok") {
    return [
      {
        q: "How do I download a TikTok video?",
        a: "Open TikTok, copy the video link, paste it into ClipSnap and tap Download. Then choose an available file.",
      },
      {
        q: "Can I download TikTok videos on my phone?",
        a: "Yes. Open this page in Safari, Chrome or another mobile browser, paste the TikTok URL and save the MP4.",
      },
      ...shared,
    ];
  }

  if (id === "instagram") {
    return [
      {
        q: "How do I download an Instagram Reel?",
        a: "Copy the Reel or post URL from Instagram, paste it into the box above and select a download format.",
      },
      {
        q: "Does this work with Instagram posts?",
        a: "Public video posts and Reels with a shareable URL can be checked. Private or restricted posts will not work.",
      },
      ...shared,
    ];
  }

  if (id === "youtube") {
    return [
      {
        q: "How do I download a YouTube video?",
        a: "Copy the YouTube watch URL or youtu.be short link, paste it here and pick a format from the list.",
      },
      {
        q: "Can I choose video quality?",
        a: "When YouTube provides more than one format, ClipSnap lists the options so you can pick the size you want.",
      },
      ...shared,
    ];
  }

  return shared;
}

export function jsonLdFor(page, origin) {
  const url = origin
    ? `${origin}${page.path === "/" ? "/" : page.path}`
    : page.path;
  const faqs = faqFor(page.id);
  const graph = [
    {
      "@type": "WebSite",
      "@id": origin ? `${origin}/#website` : "#website",
      name: SITE_NAME,
      url: origin ? `${origin}/` : "/",
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: origin ? `${origin}/` : "/",
      },
    },
    {
      "@type": "WebPage",
      name: page.title,
      description: page.description,
      url,
      isPartOf: { "@id": origin ? `${origin}/#website` : "#website" },
    },
  ];

  if (faqs.length && ["home", "tiktok", "instagram", "youtube"].includes(page.id)) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    });
  }

  if (page.id === "tiktok" || page.id === "instagram" || page.id === "youtube") {
    const label =
      page.id === "tiktok"
        ? "TikTok"
        : page.id === "instagram"
          ? "Instagram"
          : "YouTube";
    graph.push({
      "@type": "HowTo",
      name: `How to download ${label} videos with ClipSnap`,
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Copy the video URL",
          text: `Open ${label} and copy the public video link.`,
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Paste it into ClipSnap",
          text: "Paste the URL into the downloader and start the check.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Save the file",
          text: "Choose an available format and download the video to your device.",
        },
      ],
    });
    graph.push({
      "@type": "WebApplication",
      name: `${label} Video Downloader`,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      url,
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
