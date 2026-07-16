import "server-only";

type LogValue = boolean | number | string | null | undefined;

type ServerLogLevel = "error" | "info";

export type ServerLogContext = Record<string, LogValue>;

export type ServerLogEvent = {
  event: string;
  level: ServerLogLevel;
  context?: ServerLogContext;
};

export type ServerLogSink = (event: ServerLogEvent) => void;

const sensitiveKeyPattern =
  /authorization|cookie|diagnosis|email|health|medical|message|password|prompt|reflection|secret|token/i;

function redactContext(context: ServerLogContext | undefined): ServerLogContext | undefined {
  if (!context) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(context).map(([key, value]) => [
      key,
      sensitiveKeyPattern.test(key) ? "[REDACTED]" : value,
    ]),
  );
}

function defaultServerLogSink(event: ServerLogEvent) {
  process.stderr.write(`${JSON.stringify({ ...event, timestamp: new Date().toISOString() })}\n`);
}

export function createServerLogger(sink: ServerLogSink = defaultServerLogSink) {
  function emit(level: ServerLogLevel, event: string, context?: ServerLogContext) {
    const redactedContext = redactContext(context);

    sink(redactedContext ? { event, level, context: redactedContext } : { event, level });
  }

  return {
    error(event: string, context?: ServerLogContext) {
      emit("error", event, context);
    },
    info(event: string, context?: ServerLogContext) {
      emit("info", event, context);
    },
  };
}
