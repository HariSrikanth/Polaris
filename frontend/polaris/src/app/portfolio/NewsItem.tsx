import React from 'react'

interface NewsItemProps {
  id: number
  text: string
}

export default function NewsItem({ id, text }: NewsItemProps) {
  return (
    <div className="border-b border-gray-200 py-4 hover:bg-gray-100 transition-colors duration-200">
      <p className="text-lg">
        <span className="font-semibold mr-2">{id}.</span>
        {text}
      </p>
    </div>
  )
}