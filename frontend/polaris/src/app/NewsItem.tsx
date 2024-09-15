import React from 'react'
import Link from 'next/link'

interface NewsItemProps {
  id: number
  text: String
  url: String
}

export default function NewsItem({ id, text, url}: NewsItemProps) {
  return (
    <div className="flex mb-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-150 hover:bg-gray-50">
      <p className="text-lg">
        <span className="font-semibold mr-5">{id}.</span>
        {text}
      </p>
    </div>
  )
}