const PASSWORD_RECOVERY_SESSION_COOKIE = "health-decoded-password-recovery";
// Recovery sessions are temporary authorization for one password change. Keep the marker aligned
// with the normal one-hour access-token window rather than a long-lived account session.
const PASSWORD_RECOVERY_SESSION_MAX_AGE_SECONDS = 60 * 60;

export { PASSWORD_RECOVERY_SESSION_COOKIE, PASSWORD_RECOVERY_SESSION_MAX_AGE_SECONDS };
