import { useId } from "react";

import styles from "../../styles/caregiver-foundation.module.css";

const privacyNotices = {
  "session-tool": {
    heading: "Session-only tool",
    copy: "Your responses are not saved to your account or shared with another person. They will clear when this session ends or when you reset the tool.",
  },
  reflection: {
    heading: "Optional private reflection",
    copy: "This reflection is optional and stays in this session. It is not sent to the AI Tutor, added to your account, or shared with the person you support.",
  },
  "local-save": {
    heading: "Local-save tool",
    copy: "Saved only on this device when you choose Save. It does not sync to another account. Anyone using this device may be able to see it.",
  },
  "print-export": {
    heading: "Print or export",
    copy: "This document may contain sensitive information. Store it carefully, share it only with permission, and verify that emergency details are current.",
  },
} as const;

export interface CaregiverPrivacyNoticeProps {
  readonly variant: keyof typeof privacyNotices;
}

export function CaregiverPrivacyNotice({ variant }: CaregiverPrivacyNoticeProps) {
  const headingId = useId();
  const notice = privacyNotices[variant];

  return (
    <aside className={styles.privacyNotice} aria-labelledby={headingId}>
      <p id={headingId} className={styles.noticeHeading}>
        {notice.heading}
      </p>
      <p>{notice.copy}</p>
    </aside>
  );
}
