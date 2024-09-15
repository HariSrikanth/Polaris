import React from 'react'

interface NewsCardProps {
  id: number
  title: string
  ticker: string
  change: string
  references: string[]
}

export default function NewsCard({ id, title, ticker, change, references }: NewsCardProps) {
  return (
    <div className="bg-gray-100 rounded-lg p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      <h2 className="text-xl font-semibold mb-2">#{id} {title}</h2>
      <div className="flex mb-4">
        <div className="text-gray-600 flex-grow">GRAPH</div>
        <div className="flex flex-col items-end">
          <span className="font-bold">{ticker}</span>
          <span className={`font-bold ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">References:</h3>
        <ol className="list-decimal list-inside text-gray-600">
          {references.map((ref, index) => (
            <li key={index}>{ref}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}