// https://vike.dev/onPageTransitionStart

import type { PageContextClient } from "vike/types";

export async function onPageTransitionStart(pageContext: Partial<PageContextClient>) {
  void pageContext;
  document.body.classList.add("page-transition");
}
