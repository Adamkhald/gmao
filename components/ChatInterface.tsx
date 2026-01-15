"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: number;
  text: string;
  type: "user" | "assistant";
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Bonjour ! Je suis votre assistant IA GMAO. Posez-moi des questions sur les KPIs, l'analyse AMDEC, la gestion des stocks, ou tout autre sujet de maintenance.",
      type: "assistant",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (question: string): string => {
    const q = question.toLowerCase();

    if (q.includes("mtbf")) {
      return "Le MTBF (Mean Time Between Failures) mesure la fiabilité d'un équipement. Formule : MTBF = Temps total de fonctionnement / Nombre de pannes. Un MTBF élevé indique un équipement fiable avec peu de pannes.";
    } else if (q.includes("mttr")) {
      return "Le MTTR (Mean Time To Repair) mesure le temps moyen nécessaire pour réparer un équipement. Formule : MTTR = Temps total de réparation / Nombre de pannes. Un MTTR faible indique une bonne maintenabilité.";
    } else if (q.includes("amdec") || q.includes("fmea")) {
      return "L'AMDEC (Analyse des Modes de Défaillance, de leurs Effets et de leur Criticité) est une méthode préventive pour identifier et prioriser les risques. Elle utilise le RPN (Gravité × Occurrence × Détection) pour classer les défaillances.";
    } else if (q.includes("disponibilité") || q.includes("availability")) {
      return "La disponibilité mesure le pourcentage de temps où l'équipement est opérationnel. Formule : Disponibilité = MTBF / (MTBF + MTTR) × 100. Objectif : > 95% est excellent, > 90% est bon.";
    } else if (q.includes("oee")) {
      return "L'OEE (Overall Equipment Effectiveness) est un indicateur global combinant trois facteurs : Disponibilité × Performance × Qualité. Il mesure l'efficacité réelle d'un équipement de production.";
    } else if (q.includes("pdr") || q.includes("stock")) {
      return "Les PDR (Pièces De Rechange) sont essentielles pour assurer une maintenance rapide. Stock minimum = Consommation moyenne × Délai réapprovisionnement. Point de commande = Stock min + Stock de sécurité.";
    } else if (q.includes("préventive")) {
      return "La maintenance préventive planifie les interventions pour éviter les pannes. Types : Systématique (basée sur le temps) et Conditionnelle (basée sur l'état réel). Réduit les pannes imprévues et augmente la durée de vie.";
    } else if (q.includes("prédictive")) {
      return "La maintenance prédictive utilise l'analyse de données pour prévoir les défaillances. Techniques : analyse vibratoire, thermographie, Machine Learning. Permet de planifier les interventions au moment optimal.";
    } else if (q.includes("rpn")) {
      return "Le RPN (Risk Priority Number) évalue la criticité dans l'AMDEC. RPN = Gravité × Occurrence × Détection. Seuils : > 500 = Urgent, 200-500 = Prioritaire, 100-200 = Important, < 100 = Normal.";
    } else if (q.includes("rag")) {
      return "Le RAG (Retrieval-Augmented Generation) combine recherche d'information et IA générative. Il trouve les documents pertinents puis génère une réponse en citant les sources. Idéal pour répondre à partir de documentation technique.";
    } else {
      return "Je peux vous aider avec les KPIs (MTBF, MTTR, Disponibilité, OEE), l'analyse AMDEC/RPN, la gestion des stocks PDR, et les stratégies de maintenance. Posez-moi une question spécifique !";
    }
  };

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: messages.length,
      text: trimmed,
      type: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      const response = getAIResponse(trimmed);
      const assistantMessage: Message = {
        id: messages.length + 1,
        text: response,
        type: "assistant",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const askQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => sendMessage(), 100);
  };

  const suggestions = [
    "Comment calculer le MTBF ?",
    "Qu'est-ce que l'AMDEC ?",
    "Comment optimiser les PDR ?",
    "Différence maintenance préventive et prédictive ?",
  ];

  const capabilities = [
    "Calculs KPI",
    "Analyse AMDEC",
    "Gestion stocks",
    "Stratégies maintenance",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl flex flex-col h-[600px]">
        <div className="p-6 border-b border-[var(--border)]">
          <h3 className="font-semibold">RAG Assistant</h3>
          <p className="text-sm text-[var(--text-light)]">
            Recherche augmentée par génération
          </p>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 p-4 rounded-lg max-w-[80%] ${
                message.type === "user"
                  ? "ml-auto bg-[var(--accent)] text-white"
                  : "bg-[var(--bg)] border border-[var(--border)]"
              }`}
            >
              {message.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 border-t border-[var(--border)] flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Posez votre question..."
            className="flex-1 px-3 py-2 rounded-lg text-sm"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-2 bg-[var(--accent)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm"
          >
            Envoyer
          </button>
        </div>
      </div>

      <div className="hidden lg:block space-y-6">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">
            Suggestions
          </h3>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => askQuestion(suggestion)}
              className="py-2 border-b border-[var(--border)] last:border-0 text-sm cursor-pointer hover:text-[var(--accent)] transition-colors"
            >
              {suggestion}
            </div>
          ))}
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">
            Capacités
          </h3>
          {capabilities.map((capability, index) => (
            <div
              key={index}
              className="py-2 border-b border-[var(--border)] last:border-0 text-sm"
            >
              {capability}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}