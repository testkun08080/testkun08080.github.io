import { isBlockedDevRoute } from "../lib/routeGuards";

type RouteContext = {
  urlPathname: string;
};

export function onBeforeRoute(pageContext: RouteContext) {
  if (!import.meta.env.PROD) return;

  const { urlPathname } = pageContext;
  const isDevRoute = isBlockedDevRoute(urlPathname);
  if (!isDevRoute) return;

  return {
    pageContext: {
      abortStatusCode: 404,
    },
  };
}
