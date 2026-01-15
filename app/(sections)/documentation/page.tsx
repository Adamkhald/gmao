export default function DocumentationPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-8 py-8 pt-24">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Documentation GMAO</h1>
        <p className="text-[var(--text-light)]">
          Guide complet des fonctionnalités de la plateforme et concepts techniques
        </p>
      </div>

      <div className="space-y-8">
        {/* 1. Maintenance Prédictive (Modèles IA) */}
        <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-[var(--accent)] flex items-center gap-2">
            🚀 Maintenance Prédictive (Nouveau)
          </h2>
          <p className="mb-6 text-[var(--text-light)]">
            Notre plateforme intègre des modèles de Deep Learning (LSTM) pour anticiper l'évolution de la maintenance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[var(--bg)] p-4 rounded-lg border border-[var(--border)]">
              <h3 className="font-semibold mb-2 text-red-500">Prévision des Pannes</h3>
              <p className="text-sm text-[var(--text-light)]">
                Modèle LSTM entraîné sur l'historique des pannes (AMDEC + GMAO Integrator).
                Prédit le nombre d'occurrences de pannes pour les semaines à venir.
              </p>
            </div>

            <div className="bg-[var(--bg)] p-4 rounded-lg border border-[var(--border)]">
              <h3 className="font-semibold mb-2 text-amber-500">Prévision du Temps d'Arrêt</h3>
              <p className="text-sm text-[var(--text-light)]">
                Anticipe le volume d'heures d'arrêt machine. Permet de planifier
                la production en tenant compte des indisponibilités probables.
              </p>
            </div>

            <div className="bg-[var(--bg)] p-4 rounded-lg border border-[var(--border)]">
              <h3 className="font-semibold mb-2 text-blue-500">Charge de Travail (Workload)</h3>
              <p className="text-sm text-[var(--text-light)]">
                Prédit la charge horaire nécessaire pour les techniciens. Indispensable
                pour le dimensionnement des équipes et la gestion du budget MO.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Indicateurs KPI */}
        <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-[var(--accent)]">
            Indicateurs de Performance (KPIs)
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                MTBF - Mean Time Between Failures
              </h3>
              <p className="mb-3 text-[var(--text-light)]">
                Indicateur de fiabilité. Temps moyen de bon fonctionnement entre deux défaillances.
              </p>
              <div className="bg-[var(--bg)] border border-[var(--border)] p-4 rounded-lg font-mono mb-3">
                MTBF = Temps total de fonctionnement / Nombre de pannes
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                MTTR - Mean Time To Repair
              </h3>
              <p className="mb-3 text-[var(--text-light)]">
                Indicateur de maintenabilité. Temps moyen nécessaire pour réparer une panne.
              </p>
              <div className="bg-[var(--bg)] border border-[var(--border)] p-4 rounded-lg font-mono">
                MTTR = Temps total de réparation / Nombre de pannes
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Disponibilité</h3>
              <div className="bg-[var(--bg)] border border-[var(--border)] p-4 rounded-lg font-mono">
                Disponibilité = MTBF / (MTBF + MTTR) × 100
              </div>
            </div>
          </div>
        </section>

        {/* 3. Défaillances & RPN */}
        <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-[var(--accent)]">
            Analyse AMDEC (FMEA)
          </h2>
          <div className="space-y-4">
            <p className="text-[var(--text-light)]">
              L'AMDEC (Analyse des Modes de Défaillance, de leurs Effets et de leur Criticité) permet de hiérarchiser les risques grâce au score RPN.
            </p>
            <div className="bg-[var(--bg)] border border-[var(--border)] p-4 rounded-lg font-mono mb-4">
              RPN = Gravité × Occurrence × Détection
            </div>

            <ul className="list-disc pl-6 space-y-1 text-sm text-[var(--text-light)]">
              <li><strong>Gravité (S) :</strong> Impact de la défaillance sur le client/processus.</li>
              <li><strong>Occurrence (O) :</strong> Fréquence d'apparition de la cause.</li>
              <li><strong>Détection (D) :</strong> Probabilité de détecter la défaillance avant qu'elle n'impacte le client.</li>
            </ul>
          </div>
        </section>

        {/* 4. Assistant IA */}
        <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-[var(--accent)]">
            Assistant IA (RAG)
          </h2>
          <div className="space-y-4">
            <p className="text-[var(--text-light)]">
              L'assistant conversationnel intégré utilise une approche RAG (Retrieval-Augmented Generation) pour répondre aux questions techniques.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[var(--bg)] rounded border border-[var(--border)]">
                <h4 className="font-semibold mb-2">Capacités Actuelles</h4>
                <ul className="text-sm list-disc pl-4 space-y-1 text-[var(--text-light)]">
                  <li>Définitions des concepts GMAO</li>
                  <li>Aide au calcul des KPIs</li>
                  <li>Explication des méthodes (AMDEC, 5S...)</li>
                </ul>
              </div>
              <div className="p-4 bg-[var(--bg)] rounded border border-[var(--border)]">
                <h4 className="font-semibold mb-2">Architecture</h4>
                <p className="text-sm text-[var(--text-light)]">
                  Système hybride combinant recherche par mots-clés et génération de réponses contextuelles.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}