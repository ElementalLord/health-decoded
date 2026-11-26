// Shared class names for the landing page's interactive pieces, so every choice, card, and panel
// looks and behaves the same way.

export const landingPanel =
  "rounded-[22px] border border-[#e2d6ca] bg-[#fffaf3] p-5 shadow-[0_2px_0_rgb(61_47_41/0.06)] sm:p-8";

export const landingChoice =
  "flex min-h-12 w-full items-center rounded-[14px] border border-[#d9cabd] bg-[#fffdf8] px-4 py-3 text-left text-[15px] font-semibold leading-snug text-[#382c26] transition duration-150 hover:-translate-y-px hover:border-[#b8a493] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c97860] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8f4ed] disabled:pointer-events-none aria-pressed:border-[#382c26] aria-pressed:bg-[#382c26] aria-pressed:text-[#fffaf3]";

export const landingChip =
  "inline-flex min-h-11 items-center rounded-full border border-[#d9cabd] bg-[#fffdf8] px-4 text-sm font-semibold text-[#493a32] transition hover:border-[#b8a493] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c97860] focus-visible:ring-offset-2 aria-pressed:border-[#382c26] aria-pressed:bg-[#382c26] aria-pressed:text-[#fffaf3]";

export const landingLink =
  "inline-flex min-h-11 items-center gap-2 font-semibold text-[#382c26] underline decoration-[#c97860]/50 decoration-2 underline-offset-[6px] hover:decoration-[#c97860]";

export const landingPrimaryLink =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[12px] bg-[#382c26] px-6 text-base font-semibold text-[#fffaf3] shadow-[0_3px_0_#211814] transition hover:-translate-y-px hover:bg-[#4b3931] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c97860] focus-visible:ring-offset-2";

export const landingPrimaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] bg-[#382c26] px-5 text-[15px] font-semibold text-[#fffaf3] shadow-[0_3px_0_#211814] transition hover:-translate-y-px hover:bg-[#4b3931] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c97860] focus-visible:ring-offset-2";

// Body copy color with enough contrast on both the cream and beige backgrounds (WCAG AA).
export const landingMuted = "text-[#6b5b52]";
