export function Head() {
  const siteName = "Testkun Portfolio";
  const title = "Testkun | Portfolio";
  const description =
    "Testkun's portfolio site. Showcasing shader development, LookDev, and creative web projects bridging technology and art.";
  const siteUrl = "https://testkun08080.github.io";
  const ogImage = `${siteUrl}/utils/thumb.png`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow" />
      <link rel="canonical" href={siteUrl} />

      <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      <meta name="theme-color" content="#0f172a" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Google Fonts: preconnect first, then stylesheet — avoids blocking @import in CSS */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;700&display=swap"
      />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content="Testkun profile image" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </>
  );
}
