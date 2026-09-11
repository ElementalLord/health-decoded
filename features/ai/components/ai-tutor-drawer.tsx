"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { aiTutorDialog, openAiTutor } from "@/features/ai/components/ai-tutor-dialog";
import type { ProfileSettings } from "@/features/profile/types/profile-settings";

const AiChat = lazy(() =>
  import("@/features/ai/components/ai-chat").then((module) => ({ default: module.AiChat })),
);

const DEFAULT_DRAWER_WIDTH = 460;
const MIN_DRAWER_WIDTH = 360;
const MAX_DRAWER_WIDTH = 840;

function drawerWidthLimits() {
  const viewportMaximum = Math.max(MIN_DRAWER_WIDTH, window.innerWidth - 32);
  return { maximum: Math.min(MAX_DRAWER_WIDTH, viewportMaximum), minimum: MIN_DRAWER_WIDTH };
}

function AiTutorDrawer({ preferences }: { preferences?: ProfileSettings | undefined }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; startWidth: number; startX: number } | null>(null);
  const [drawerWidth, setDrawerWidth] = useState(DEFAULT_DRAWER_WIDTH);
  const [hasOpened, setHasOpened] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [suggestionShuffleKey, setSuggestionShuffleKey] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function resizeTo(requestedWidth: number) {
    const { maximum, minimum } = drawerWidthLimits();
    const nextWidth = Math.min(maximum, Math.max(minimum, requestedWidth));
    popupRef.current?.style.setProperty("--ai-tutor-width", `${nextWidth}px`);
    return nextWidth;
  }

  function finishResize(pointerId?: number) {
    if (pointerId !== undefined && dragRef.current?.pointerId !== pointerId) return;
    const currentWidth = popupRef.current?.getBoundingClientRect().width ?? drawerWidth;
    dragRef.current = null;
    setDrawerWidth(resizeTo(currentWidth));
    setIsResizing(false);
    document.body.style.removeProperty("cursor");
    document.body.style.removeProperty("user-select");
  }

  function beginResize(event: ReactPointerEvent<HTMLButtonElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const popup = popupRef.current;
    if (!popup) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startWidth: popup.getBoundingClientRect().width,
      startX: event.clientX,
    };
    setIsResizing(true);
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";
  }

  function continueResize(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    resizeTo(drag.startWidth + drag.startX - event.clientX);
  }

  function resizeWithKeyboard(event: ReactKeyboardEvent<HTMLButtonElement>) {
    const { maximum, minimum } = drawerWidthLimits();
    const step = event.shiftKey ? 32 : 16;
    let nextWidth: number | null = null;

    if (event.key === "ArrowLeft") nextWidth = drawerWidth + step;
    if (event.key === "ArrowRight") nextWidth = drawerWidth - step;
    if (event.key === "Home") nextWidth = minimum;
    if (event.key === "End") nextWidth = maximum;
    if (nextWidth === null) return;

    event.preventDefault();
    setDrawerWidth(resizeTo(nextWidth));
  }

  useEffect(() => {
    if (searchParams.get("ask") !== "1") return;

    openAiTutor();
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.delete("ask");
    const query = nextSearchParams.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}${window.location.hash}`, {
      scroll: false,
    });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    function keepWidthInViewport() {
      setDrawerWidth((currentWidth) => resizeTo(currentWidth));
    }

    window.addEventListener("resize", keepWidthInViewport);
    return () => {
      window.removeEventListener("resize", keepWidthInViewport);
      document.body.style.removeProperty("cursor");
      document.body.style.removeProperty("user-select");
    };
  }, []);

  return (
    <Dialog.Root
      handle={aiTutorDialog}
      onOpenChange={(open) => {
        if (open) {
          setHasOpened(true);
          setSuggestionShuffleKey((current) => current + 1);
        }
      }}
    >
      <Dialog.Portal
        className="ai-tutor-preferences"
        data-reduced-motion={preferences?.reducedMotion}
        data-text-scale={preferences?.preferredTextScale}
        keepMounted
      >
        <Dialog.Backdrop className="ai-tutor-backdrop fixed inset-0 z-[70] bg-foreground/[0.1]" />
        <Dialog.Viewport className="fixed inset-0 z-[70] overflow-hidden">
          <Dialog.Popup
            className="ai-tutor-drawer fixed inset-y-0 right-0 flex h-dvh w-[min(var(--ai-tutor-width),calc(100vw-2rem))] max-w-full flex-col overflow-hidden border-l border-border shadow-modal max-sm:inset-0 max-sm:w-full max-sm:border-l-0"
            data-resizing={isResizing || undefined}
            initialFocus={titleRef}
            ref={popupRef}
            style={{ "--ai-tutor-width": `${drawerWidth}px` } as CSSProperties}
          >
            <button
              aria-label="Resize AI Tutor"
              aria-orientation="vertical"
              aria-valuemax={MAX_DRAWER_WIDTH}
              aria-valuemin={MIN_DRAWER_WIDTH}
              aria-valuenow={Math.round(drawerWidth)}
              aria-valuetext={`${Math.round(drawerWidth)} pixels wide`}
              className="group absolute inset-y-0 left-0 z-10 hidden w-5 touch-none cursor-ew-resize items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:flex"
              onDoubleClick={() => setDrawerWidth(resizeTo(DEFAULT_DRAWER_WIDTH))}
              onKeyDown={resizeWithKeyboard}
              onLostPointerCapture={(event) => finishResize(event.pointerId)}
              onPointerCancel={(event) => finishResize(event.pointerId)}
              onPointerDown={beginResize}
              onPointerMove={continueResize}
              onPointerUp={(event) => {
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }
                finishResize(event.pointerId);
              }}
              role="separator"
              type="button"
            >
              <span className="h-12 w-1 rounded-full bg-border transition-colors group-hover:bg-muted-foreground group-focus-visible:bg-muted-foreground group-active:bg-primary" />
            </button>
            <header className="safe-area-top shrink-0 border-b border-border px-6 pb-7 pt-9 sm:px-8 sm:pb-8 sm:pt-8">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 pt-10 sm:pt-8">
                  <p className="editorial-eyebrow mb-2">Learning support</p>
                  <Dialog.Title
                    className="font-serif-display text-[length:var(--text-section-title)] font-semibold leading-tight focus-visible:ring-0 focus-visible:ring-offset-0"
                    ref={titleRef}
                    tabIndex={-1}
                  >
                    Your Companion
                  </Dialog.Title>
                  <Dialog.Description className="mt-2 text-[length:var(--text-supporting)] leading-7 text-muted-foreground">
                    Ask about what you&apos;re learning.
                  </Dialog.Description>
                </div>
                <Dialog.Close
                  aria-label="Close AI Tutor"
                  className="mt-6 grid size-11 shrink-0 place-items-center rounded-[9px] border border-border bg-background text-muted-foreground transition-[color,border-color,background-color,transform] duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:border-foreground/25 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] sm:mt-5"
                >
                  <X aria-hidden="true" className="size-5" />
                </Dialog.Close>
              </div>
            </header>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8 sm:pb-6">
              {hasOpened ? (
                <Suspense
                  fallback={
                    <p aria-live="polite" className="py-8 text-sm text-muted-foreground">
                      Preparing your companion…
                    </p>
                  }
                >
                  <AiChat suggestionShuffleKey={suggestionShuffleKey} variant="drawer" />
                </Suspense>
              ) : null}
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export { AiTutorDrawer };
