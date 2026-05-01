export function Head() {
  const siteName = "Testkun Portfolio";
  const title = "Testkun | Portfolio";
  const description =
    "Testkun's portfolio site. Showcasing shader development, LookDev, and creative web projects bridging technology and art.";
  const siteUrl = "https://testkun08080.github.io";
  const ogImage = `${siteUrl}/utils/thumb.webp`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow" />
      <link rel="canonical" href={siteUrl} />

      <link rel="icon" href="/utils/thumb.webp" type="image/webp" />
      <link rel="icon" href="/utils/thumb.png" type="image/png" />
      <link rel="apple-touch-icon" href="/utils/thumb.png" />
      <meta name="theme-color" content="#0f172a" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-EY0MWFVRQB"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EY0MWFVRQB');
          `,
        }}
      />

      {/* Google Fonts: preconnect first, then stylesheet — avoids blocking @import in CSS.
          Mobile を含む初回ロード軽量化のため weight を 400/700 に絞る（500 はシステムへ fallback）。 */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&family=Noto+Sans+JP:wght@400;700&display=swap"
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
