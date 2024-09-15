import React from 'react'

interface NewsItemProps {
  id: number
  text: string
}

export default function NewsItem({ id, text }: NewsItemProps) {
  return (
    <div className="mb-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-150 hover:bg-gray-50">
      <p className="text-lg">
        <span className="font-semibold mr-2">{id}.</span>
        {text}
      </p>
    </div>
  )
}