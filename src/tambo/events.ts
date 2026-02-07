export type ThinkflowUiEvent =
  | {
      type: 'thinkflow.ui.card_open';
      payload: {
        componentName?: string;
        props?: Record<string, unknown>;
        selectedInsight?: unknown;
      };
    }
  | {
      type: 'thinkflow.ui.card_close';
      payload: {
        reason?: 'close' | 'back' | 'escape';
      };
    }
  | {
      type: 'thinkflow.ui.think_with_this';
      payload: {
        selectedInsight: unknown;
      };
    }
  | {
      type: 'thinkflow.ui.reset_home';
      payload: {};
    };

export function toTamboMessage(event: ThinkflowUiEvent) {
  // Tambo gets a structured envelope. We keep it deterministic.
  // No UI decision logic here.
  return JSON.stringify({
    kind: 'thinkflow:ui_event',
    event,
    at: new Date().toISOString(),
  });
}
