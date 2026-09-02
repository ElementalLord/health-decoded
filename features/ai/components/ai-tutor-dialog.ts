"use client";

import { Dialog } from "@base-ui/react/dialog";

const aiTutorDialog = Dialog.createHandle<void>();

function openAiTutor() {
  aiTutorDialog.open(null);
}

export { aiTutorDialog, openAiTutor };
