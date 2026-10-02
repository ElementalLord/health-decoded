"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

import styles from "./demo.module.css";

export function DemoQrCode({ compact = false }: { compact?: boolean }) {
  const [value, setValue] = useState("/demo/explore");

  useEffect(() => {
    setValue(`${window.location.origin}/demo/explore`);
  }, []);

  return (
    <div className={compact ? styles.qrCompact : styles.qrCard}>
      <div className={styles.qrFrame}>
        <QRCodeSVG
          aria-label="QR code for the audience demo"
          bgColor="#fffaf3"
          fgColor="#382c26"
          includeMargin
          level="M"
          role="img"
          size={compact ? 112 : 152}
          value={value}
        />
      </div>
      <div>
        <strong>Explore on your phone</strong>
        <span>No login. No account changes.</span>
      </div>
    </div>
  );
}
