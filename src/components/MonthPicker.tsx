import { monthYearLabel } from '../utils/formatDate';

interface MonthPickerProps {
  value: string;
  onChange: (monthyear: string) => void;
}

function getMonthOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const val = `${month}${year}`;
    options.push({ value: val, label: monthYearLabel(val) });
  }

  return options;
}

export function MonthPicker({ value, onChange }: MonthPickerProps) {
  const options = getMonthOptions();

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
