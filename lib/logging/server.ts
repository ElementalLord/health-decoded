type LogValue = boolean | number | string | null | undefined;

export type ServerLogContext = Record<string, LogValue>;

export type ServerLogEvent = {
  event: string;
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

export function createServerLogger(sink: ServerLogSink = () => undefined) {
  function emit(event: string, context?: ServerLogContext) {
    const redactedContext = redactContext(context);

    sink(redactedContext ? { event, context: redactedContext } : { event });
  }

  return {
    error(event: string, context?: ServerLogContext) {
      emit(event, context);
    },
    info(event: string, context?: ServerLogContext) {
      emit(event, context);
    },
  };
}
