type DriverEvent = "scroll" | "resize";
type DriverCallback = (event: DriverEvent) => void;

type SubscriptionOptions = {
  scroll?: boolean;
  resize?: boolean;
  runOnSubscribe?: boolean;
};

type Subscription = {
  callback: DriverCallback;
  wantsScroll: boolean;
  wantsResize: boolean;
};

const subscriptions = new Set<Subscription>();

let listening = false;
let rafId = 0;
let pendingScroll = false;
let pendingResize = false;

const flush = () => {
  rafId = 0;
  const shouldNotifyScroll = pendingScroll;
  const shouldNotifyResize = pendingResize;
  pendingScroll = false;
  pendingResize = false;

  if (!shouldNotifyScroll && !shouldNotifyResize) return;

  subscriptions.forEach((sub) => {
    if (shouldNotifyScroll && sub.wantsScroll) sub.callback("scroll");
    if (shouldNotifyResize && sub.wantsResize) sub.callback("resize");
  });
};

const schedule = (event: DriverEvent) => {
  if (event === "scroll") pendingScroll = true;
  if (event === "resize") pendingResize = true;
  if (rafId) return;
  rafId = window.requestAnimationFrame(flush);
};

const onScroll = () => schedule("scroll");
const onResize = () => schedule("resize");

const ensureListeners = () => {
  if (listening || typeof window === "undefined") return;
  listening = true;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
};

const teardownListeners = () => {
  if (!listening || typeof window === "undefined") return;
  listening = false;
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onResize);
  if (rafId) {
    window.cancelAnimationFrame(rafId);
    rafId = 0;
  }
  pendingScroll = false;
  pendingResize = false;
};

export function subscribeWindowRaf(
  callback: DriverCallback,
  options?: SubscriptionOptions,
) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const wantsScroll = options?.scroll ?? true;
  const wantsResize = options?.resize ?? true;
  const sub: Subscription = { callback, wantsScroll, wantsResize };
  subscriptions.add(sub);
  ensureListeners();

  if (options?.runOnSubscribe) {
    if (wantsResize) callback("resize");
    else if (wantsScroll) callback("scroll");
  }

  return () => {
    subscriptions.delete(sub);
    if (subscriptions.size === 0) {
      teardownListeners();
    }
  };
}
