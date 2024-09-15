'use client';



import { useState, useEffect } from 'react';
import NewsCard from './NewsCard';
import NewsItem from './NewsItem';

interface NewsFeedProps {
    initialTopic: string;
    initialTrends: Trend[];
    onTopicChange: (topic: string) => Promise<void>;
  }
  
  interface Trend {
    ticker: string;
    sentiments: number[];
    top: boolean;
    news_articles_today: SimpleArticle[];
    news_articles_week: SimpleArticle[];
    reddit_mentions_today: number;
    reddit_mentions_week: number;
    impact: number;
  }
  
  interface SimpleArticle {
    title: string;
    url: string;
  }

export default function NewsFeed({ initialTopic, initialTrends }: NewsFeedProps) {
  const [topic, setTopic] = useState(initialTopic);
  const [trends, setTrends] = useState(initialTrends);

  useEffect(() => {
    const fetchNews = async () => {
      const response = await fetch(`/api/news?topic=${topic}`);
      if (response.ok) {
        const data = await response.json();
        setTrends(data);
      } else {
        console.error('Failed to fetch news');
      }
    };

    if (topic !== initialTopic) {
      fetchNews();
    }
  }, [topic, initialTopic]);

  const newsCards = trends.slice(0, 3).map((trend, index) => ({
    id: index + 1,
    title: trend.ticker,
    ticker: trend.ticker,
    change: "+2.5%", // This should be calculated or fetched
    impact: trend.impact,
    references: (
      <ul>
        {trend.news_articles_today.map((article, idx) => (
          <li key={idx}>{article.title}</li>
        ))}
      </ul>
    ),
  }));

  const newsItems = trends.slice(3, 10).map((trend, index) => ({
    id: index + 4,
    text: trend.news_articles_today[0]?.title || '',
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Here's what's new in
        <span className="relative inline-block ml-2">
          <select
            className="appearance-none bg-transparent border-grey pr-8 focus:outline-none"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            <option value="technology">technology</option>
            <option value="consumer_staples">consumer staples</option>
            <option value="automobiles">automobiles</option>
            <option value="healthcare">healthcare</option>
            <option value="finance">finance</option>
          </select>
        </span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {newsCards.map((card) => (
          <NewsCard key={card.id} {...card} />
        ))}
      </div>

      <div className="flex flex-col items-start pl-[5%]">
        {newsItems.map((item) => (
          <NewsItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}