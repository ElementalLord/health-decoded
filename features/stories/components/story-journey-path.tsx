"use client";

import { useEffect, useRef } from "react";

type StoryJourneyPathProps = {
  className?: string | undefined;
  markerClassName?: string | undefined;
};

const VIEWBOX_HEIGHT = 2200;
const VIEWBOX_WIDTH = 1000;

export function StoryJourneyPath({ className, markerClassName }: StoryJourneyPathProps) {
  const desktopPathRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const mobilePathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const marker = markerRef.current;
    const svg = svgRef.current;
    if (!marker || !svg) return;

    const mobileQuery = window.matchMedia("(max-width: 60rem)");
    let animationFrame = 0;

    const updateMarker = () => {
      animationFrame = 0;
      const rect = svg.getBoundingClientRect();
      const path = mobileQuery.matches ? mobilePathRef.current : desktopPathRef.current;
      const containingBlock = marker.offsetParent;
      if (
        !path ||
        !(containingBlock instanceof HTMLElement) ||
        rect.height === 0 ||
        rect.width === 0
      ) {
        return;
      }

      const viewportGuide = window.innerHeight * 0.42;
      const journeyTop = window.scrollY + rect.top;
      const startScroll = journeyTop - viewportGuide;
      const endScroll = Math.max(
        startScroll + 1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const progress = Math.min(
        1,
        Math.max(0, (window.scrollY - startScroll) / (endScroll - startScroll)),
      );
      const point = path.getPointAtLength(path.getTotalLength() * progress);
      const containingRect = containingBlock.getBoundingClientRect();
      const x = rect.left - containingRect.left + (point.x / VIEWBOX_WIDTH) * rect.width;
      const y = rect.top - containingRect.top + (point.y / VIEWBOX_HEIGHT) * rect.height;

      const journeyIsVisible =
        window.scrollY >= startScroll && rect.bottom > 0 && rect.top < window.innerHeight;
      marker.style.opacity = journeyIsVisible ? "1" : "0";
      marker.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const scheduleMarkerUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateMarker);
    };

    const resizeObserver = new ResizeObserver(scheduleMarkerUpdate);
    resizeObserver.observe(svg);
    if (svg.parentElement) resizeObserver.observe(svg.parentElement);

    scheduleMarkerUpdate();
    window.addEventListener("resize", scheduleMarkerUpdate);
    window.addEventListener("scroll", scheduleMarkerUpdate, { passive: true });
    mobileQuery.addEventListener("change", scheduleMarkerUpdate);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", scheduleMarkerUpdate);
      window.removeEventListener("scroll", scheduleMarkerUpdate);
      mobileQuery.removeEventListener("change", scheduleMarkerUpdate);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <>
      <svg
        aria-hidden="true"
        className={className}
        focusable="false"
        preserveAspectRatio="none"
        ref={svgRef}
        viewBox="0 0 1000 2200"
      >
        <path
          className="desktopJourneyPath"
          d="M500 15C470 155 475 300 525 405S545 690 510 835 470 1100 500 1288s55 245 30 443-55 250-30 469"
          fill="none"
          ref={desktopPathRef}
          stroke="currentColor"
          strokeDasharray="2 12"
          strokeLinecap="round"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <path
          className="mobileJourneyPath"
          d="M38 0C58 350 23 720 45 1100s-7 748 15 1100"
          fill="none"
          ref={mobilePathRef}
          stroke="currentColor"
          strokeDasharray="2 11"
          strokeLinecap="round"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          className="desktopJourneyPath"
          cx="525"
          cy="405"
          fill="var(--background)"
          r="7"
          stroke="currentColor"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          className="desktopJourneyPath"
          cx="500"
          cy="1288"
          fill="var(--background)"
          r="7"
          stroke="currentColor"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span aria-hidden="true" className={markerClassName} ref={markerRef} />
    </>
  );
}
