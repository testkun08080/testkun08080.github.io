export function isBlockedDevRoute(urlPathname: string) {
  return urlPathname === "/dev" || urlPathname.startsWith("/dev-");
}
