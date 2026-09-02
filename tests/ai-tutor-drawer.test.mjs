import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const [routes, shell, header, bottomNavigation, drawer, trigger, dialogHandle, chat, globals] =
  await Promise.all([
    read("lib/routes.ts"),
    read("components/layout/app-shell.tsx"),
    read("components/layout/app-header.tsx"),
    read("components/layout/bottom-navigation.tsx"),
    read("features/ai/components/ai-tutor-drawer.tsx"),
    read("features/ai/components/ai-tutor-trigger.tsx"),
    read("features/ai/components/ai-tutor-dialog.ts"),
    read("features/ai/components/ai-chat.tsx"),
    read("app/globals.css"),
  ]);

test("Ask is a detached tool instead of a protected navigation destination", () => {
  assert.doesNotMatch(routes, /href: "\/ai", label: "Ask"/);
  assert.doesNotMatch(header, /DesktopAiTutorTrigger|showAiTutor/);
  assert.match(shell, /<AppHeader routes=\{routes\} \/>/);
  assert.match(shell, /: <AppHeader \/>/);
  assert.match(trigger, /<Dialog\.Trigger/);
  assert.match(trigger, /src="\/ai\/your-companion\.png"/);
  assert.match(trigger, />Your companion<\/span>/);
  assert.match(dialogHandle, /Dialog\.createHandle<void>\(\)/);
});

test("the authenticated shell owns one persistent drawer and hides it during onboarding", () => {
  assert.match(shell, /routes \? <FloatingAiTutorTrigger \/> : null/);
  assert.match(shell, /routes \? \([\s\S]*<AiTutorDrawer preferences=\{preferences\} \/>/);
  assert.equal((shell.match(/<AiTutorDrawer/g) ?? []).length, 1);
  assert.match(drawer, /<Dialog\.Root[\s\S]*handle=\{aiTutorDialog\}/);
  assert.match(drawer, /<Dialog\.Portal[\s\S]*keepMounted/);
  assert.match(
    drawer,
    /<AiChat suggestionShuffleKey=\{suggestionShuffleKey\} variant="drawer" \/>/,
  );
});

test("the AI drawer is a fixed modal surface with native dialog semantics", () => {
  assert.match(drawer, /<Dialog\.Backdrop/);
  assert.match(drawer, /<Dialog\.Viewport/);
  assert.match(drawer, /<Dialog\.Popup/);
  assert.match(drawer, /fixed inset-y-0 right-0/);
  assert.match(drawer, /w-\[min\(var\(--ai-tutor-width\),calc\(100vw-2rem\)\)\]/);
  assert.match(drawer, /max-sm:inset-0 max-sm:w-full/);
  assert.match(drawer, /initialFocus=\{titleRef\}/);
  assert.match(drawer, /<Dialog\.Title/);
  assert.match(drawer, /<Dialog\.Description/);
  assert.match(drawer, /<Dialog\.Close/);
  assert.match(drawer, /aria-label="Close AI Tutor"/);
});

test("desktop users can resize the drawer by pointer or keyboard", () => {
  assert.match(drawer, /aria-label="Resize AI Tutor"/);
  assert.match(drawer, /setPointerCapture\(event\.pointerId\)/);
  assert.match(drawer, /drag\.startWidth \+ drag\.startX - event\.clientX/);
  assert.match(drawer, /event\.key === "ArrowLeft"/);
  assert.match(drawer, /event\.key === "ArrowRight"/);
  assert.match(drawer, /event\.key === "Home"/);
  assert.match(drawer, /event\.key === "End"/);
  assert.match(drawer, /hidden w-5 touch-none cursor-ew-resize[\s\S]*sm:flex/);
  assert.match(drawer, /MIN_DRAWER_WIDTH = 360/);
  assert.match(drawer, /MAX_DRAWER_WIDTH = 840/);
});

test("drawer motion is compositor-only and honors both reduced-motion signals", () => {
  const drawerMotion = globals.slice(
    globals.indexOf(".ai-tutor-backdrop"),
    globals.indexOf("@supports (animation-timeline: view())"),
  );
  assert.match(drawerMotion, /transition: opacity/);
  assert.match(drawerMotion, /transition: transform/);
  assert.match(drawerMotion, /translateX\(100%\)/);
  assert.doesNotMatch(drawerMotion, /transition:\s*(?:width|right|left|margin|padding)/);
  assert.match(globals, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.ai-tutor-drawer/);
  assert.match(globals, /data-reduced-motion="true"[\s\S]*\.ai-tutor-drawer/);
});

test("portaled content receives app text and motion preferences", () => {
  assert.match(drawer, /data-reduced-motion=\{preferences\?\.reducedMotion\}/);
  assert.match(drawer, /data-text-scale=\{preferences\?\.preferredTextScale\}/);
  assert.match(drawer, /className="ai-tutor-preferences"/);
});

test("the drawer chat owns its scrolling while keeping shared AI behavior", () => {
  assert.match(chat, /variant = "page"/);
  assert.match(chat, /isDrawer && conversationRef\.current/);
  assert.match(chat, /conversationRef\.current\.scrollTo/);
  assert.match(chat, /conversationEndRef\.current\?\.scrollIntoView/);
  assert.match(chat, /Private to this session\. Not saved\./);
  assert.match(chat, /Educational guidance only · Safety & limits/);
  assert.match(chat, /isDrawer \? "Try asking" : "A place to begin"/);
  assert.match(chat, /Stop response/);
  assert.match(chat, /Regenerate/);
  assert.doesNotMatch(chat, /Connected to today&apos;s lesson|Continue learning/);
});

test("suggested questions shuffle on open and on demand", () => {
  assert.match(drawer, /onOpenChange=\{\(open\) =>/);
  assert.match(drawer, /setSuggestionShuffleKey\(\(current\) => current \+ 1\)/);
  assert.match(drawer, /suggestionShuffleKey=\{suggestionShuffleKey\}/);
  assert.match(chat, /\[suggestionShuffleKey\]/);
  assert.match(chat, /aria-label="Shuffle suggested questions"/);
  assert.match(chat, />\s*Shuffle\s*<\/Button>/);
  assert.match(chat, /aria-live="polite"/);
});

test("seven mobile routes keep the existing two-row navigation rhythm", () => {
  assert.match(bottomNavigation, /routes\.length === 7\s*\? "grid-cols-4"/);
  assert.match(globals, /\.ai-companion-trigger\s*\{\s*bottom:/);
  assert.match(globals, /\.shell-mobile-offset\s*\{\s*padding-bottom: calc\(12\.25rem/);
});

test("the standalone AI page has been removed", async () => {
  await assert.rejects(access(new URL("../app/(app)/ai/page.tsx", import.meta.url)));
});
