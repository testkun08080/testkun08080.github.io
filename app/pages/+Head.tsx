// https://vike.dev/Head
import logoUrl from "../../images/logo.svg";

export function Head() {
  return (
    <>
      <link rel="icon" href={logoUrl} />
      <meta name="theme-color" content="#e0d4c5" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  );
}
