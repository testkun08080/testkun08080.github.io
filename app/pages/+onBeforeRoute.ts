type RouteContext = {
  urlPathname: string;
};

export function onBeforeRoute(pageContext: RouteContext) {
  if (!import.meta.env.PROD) return;

  const { urlPathname } = pageContext;
  const isDevRoute = urlPathname === "/dev" || urlPathname.startsWith("/dev-");
  if (!isDevRoute) return;

  return {
    pageContext: {
      abortStatusCode: 404,
    },
  };
}
