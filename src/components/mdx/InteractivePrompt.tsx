interface InteractivePromptProps {
  children: React.ReactNode;
}

export default function InteractivePrompt({
  children,
}: InteractivePromptProps) {
  return (
    <div className="my-3 rounded-card border border-mint bg-mint/15 p-4">
      <strong className="mb-2 block font-display text-sm font-semibold tracking-tight">
        Antes de interactuar, responde:
      </strong>

      <p className="italic text-gray-700">
        {children}
      </p>
    </div>
  );
}