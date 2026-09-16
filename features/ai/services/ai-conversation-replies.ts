/** Social turns need no medical evidence or provider quota. Match the entire
 * message so a greeting followed by a real question still gets answered. */
export function conversationReplyFor(message: string): string | null {
  const text = message
    .trim()
    .toLowerCase()
    .replace(/[.!?,]+$/g, "")
    .trim();
  if (/^(?:hi|hello|hey|hiya|howdy)(?: there)?$|^good (?:morning|afternoon|evening)$/.test(text)) {
    return "Hello! What would you like to talk about? I can help explain diabetes, medicines, food, blood sugar, or something from your lessons.";
  }
  if (/^(?:thanks|thank you|thank you so much|thanks a lot|thank you very much)$/.test(text)) {
    return "You’re welcome! You can ask another question whenever you’re ready.";
  }
  if (/^(?:help|help me|what can you do|how can you help(?: me)?)$/.test(text)) {
    return "You can ask me to explain a diabetes concept, a medicine, food, or blood sugar in plain language. You can also ask a follow-up or say which part feels confusing. What would you like to understand?";
  }
  return null;
}
