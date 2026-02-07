# 🧠 Text Box Mental Model (LOCKED)

## Golden Rule

> **Intent decides "HOW to think"**
> **Text box decides "WHAT to focus on"**

## What the Text Box IS

✅ A **refinement/filter input**
✅ Extra **context for intent**
✅ A way to say *"focus on this slice"*

**Examples users can type:**
- `Last 7 days`
- `APAC region`
- `Top 5 products`
- `High-risk accounts only`

## What the Text Box is NOT

❌ Not a chat message
❌ Not a question
❌ Not something that triggers thinking by itself
❌ Not something that Tambo should "answer"

**TYPING ALONE DOES NOTHING.**
**ONLY INTENT CLICK TRIGGERS TAMBO.**

## Correct Payload Format

```typescript
const payload = {
  intent: 'EXPLORE' | 'UNDERSTAND' | 'DECIDE' | 'ACT',
  refinement: textBoxValue || null,  // NOT a question
  focusedInsight: selectedInsight || null,
  instruction: 'Compose a UI using registered components only. Do not output text.'
};

sendThreadMessage(JSON.stringify(payload), { streamResponse: true });
```

## Examples

### ✅ GOOD (SAFE)
```json
{
  "intent": "UNDERSTAND",
  "refinement": "Last 7 days",
  "focusedInsight": null
}
```

```json
{
  "intent": "DECIDE",
  "refinement": "Top 5 products",
  "focusedInsight": { "id": "rev-drop-q3", "type": "trend" }
}
```

### ❌ BAD (WILL BREAK STREAM)
```text
"Show me understand analytics"
"Why is revenue dropping?"
"Explain this chart"
```

## System Prompt (Final)

```
You are a Generative UI composer.

Rules:
- Respond ONLY with UI composition events.
- Use ONLY registered UI components and tools.
- Do NOT output explanations or text.
- The "refinement" field narrows focus; it is not a question.
- You MUST render at least one component.
- If uncertain, render TrendView.
```

## Judge-Ready Explanation

**"What does the text box do?"**

> "It's not chat. It just adds context. Intent decides the thinking, the text refines the focus."

## Implementation Checklist

- [x] Text box does NOT auto-trigger anything
- [x] Intent click is the only trigger
- [x] Text box value goes into `refinement`
- [x] No chat-style text sent to Tambo
- [x] System prompt enforces UI-only output
- [x] Fallback renderer for when Tambo fails
