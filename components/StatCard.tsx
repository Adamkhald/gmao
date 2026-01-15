interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
}

export default function StatCard({ label, value, trend }: StatCardProps) {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
      <div className="text-sm text-[var(--text-light)] uppercase tracking-wide mb-2">
        {label}
      </div>
      <div className="text-3xl font-bold text-[var(--accent)]">{value}</div>
      {trend && (
        <div className="text-sm mt-2 text-[var(--text-light)]">{trend}</div>
      )}
    </div>
  );
}