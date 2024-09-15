import React from 'react'

// interface NewsCardProps {
//   id: number
//   title: string
//   ticker: string
//   change: string
//   references: string[]
// }

interface NewsCardProps {
  id: number;
  title: string;
  change: string;
  impact: string;
  references: React.ReactNode; // Change this to React.ReactNode
}

import Link from 'next/link';

export default function NewsCard({ id, title, change, references,  impact }: NewsCardProps) {
  const getBadgeColor = (impact) => {
    if (impact < 3) return 'bg-red-500';
    if (impact < 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-gray-100 rounded-lg p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      <h2 className="text-xl font-semibold mb-2">#{id} {title}</h2>
      <div className="flex mb-4">
        <div className="flex-grow">
          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold ${getBadgeColor(impact)}`}>
            {impact}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className={`font-bold ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">References:</h3>
        {references}
      </div>
    </div>
  );
}