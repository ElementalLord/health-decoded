"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type ComponentPropsWithoutRef,
} from "react";

import styles from "../../styles/caregiver-foundation.module.css";

export interface CaregiverFocusTargetProps extends ComponentPropsWithoutRef<"div"> {
  readonly focusWhen?: boolean;
}

export const CaregiverFocusTarget = forwardRef<HTMLDivElement, CaregiverFocusTargetProps>(
  function CaregiverFocusTarget(
    { children, className, focusWhen = false, ...props },
    forwardedRef,
  ) {
    const localRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardedRef, () => localRef.current as HTMLDivElement);

    useEffect(() => {
      if (focusWhen) localRef.current?.focus();
    }, [focusWhen]);

    const classes = [styles.focusTarget, className].filter(Boolean).join(" ");

    return (
      <div ref={localRef} className={classes} tabIndex={-1} {...props}>
        {children}
      </div>
    );
  },
);
