import type { ActivityItem } from '../types/activity';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';

interface ActivityTableProps {
  items: ActivityItem[];
}

export function ActivityTable({ items }: ActivityTableProps) {
  if (items.length === 0) {
    return <p className="text-gray-500 text-sm text-center py-8">Geen activiteit gevonden</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left">
            <th className="py-2 px-3 font-medium text-gray-500">Winkel</th>
            <th className="py-2 px-3 font-medium text-gray-500">Bedrag</th>
            <th className="py-2 px-3 font-medium text-gray-500">Status</th>
            <th className="py-2 px-3 font-medium text-gray-500">Datum</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-2 px-3">{item.store_name ?? '-'}</td>
              <td className="py-2 px-3">{formatCurrency(item.amount)}</td>
              <td className="py-2 px-3">
                <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                  item.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {item.status ?? '-'}
                </span>
              </td>
              <td className="py-2 px-3 text-gray-500">{formatDate(item.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
