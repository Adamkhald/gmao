import ChatInterface from "@/components/ChatInterface";

export default function ChatPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Assistant IA GMAO</h1>
        <p className="text-[var(--text-light)]">
          Posez vos questions sur la maintenance et obtenez des réponses
          instantanées
        </p>
      </div>

      <ChatInterface />
    </div>
  );
}