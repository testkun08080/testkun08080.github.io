// https://vike.dev/Head
const logoUrl = new URL("../../images/logo.svg", import.meta.url).href;

export function Head() {
  return (
    <>
      <link rel="icon" href={logoUrl} />
      <meta name="theme-color" content="#e0d4c5" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  );
}
