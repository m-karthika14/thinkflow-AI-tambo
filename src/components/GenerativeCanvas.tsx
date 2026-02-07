interface GenerativeCanvasProps {
  activeIntent: number;
  context: string;
}

export default function GenerativeCanvas({ activeIntent: _activeIntent, context: _context }: GenerativeCanvasProps) {
  // Intentionally render nothing — the blue rectangle panel has been removed per request.
  return null;
}
