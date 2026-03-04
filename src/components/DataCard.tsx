interface DataCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

export function DataCard({ title, value, subtitle }: DataCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}
