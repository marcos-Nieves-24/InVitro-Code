interface InteractivePromptProps {
  children: React.ReactNode;
}

export default function InteractivePrompt({
  children,
}: InteractivePromptProps) {
  return (
    <div className="my-3 rounded-lg border-2 border-blue-500 bg-blue-50 p-3">
      <strong className="block mb-2">
        Antes de interactuar, respondé:
      </strong>

      <p className="italic">
        {children}
      </p>
    </div>
  );
}