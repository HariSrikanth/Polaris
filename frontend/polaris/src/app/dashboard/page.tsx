"use client"
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import NewsCard from "./NewsCard"
import NewsItem from "./NewsItem"
import { scrapeReddit }  from './stockScore'; 
import StockCard from "@/components/stocks/StockCard";
import { get } from 'http';
import Link from "next/link"
import NewsFeed from './NewsFeed'
//simport SideChatbar from './SideBar'
import { useState } from 'react';

interface Image {
  size: 'small' | 'large' | 'thumb';
  url: string;
}

interface Channel {
  name: string;
}

interface Stock {
  name: string;
}

interface Tag {
  name: string;
}

interface BezNewsArticle {
  id: number;
  author: string;
  created: string;
  updated: string;
  title: string;
  teaser: string;
  body: string;
  url: string;
  image: Image[];
  channels: Channel[];
  stocks: Stock[];
  tags: Tag[];
}

interface SimpleArticle {
  title: string;
  url: string;
}

export function parseAndStructureSentiment(sentimentArray: string[]): { [key: string]: number[] }[] {
  return sentimentArray.map(item => {
    const lines = item.split('\n');
    const result: { [key: string]: number[] } = {};

    lines.forEach(line => {
      const [ticker, scores] = line.split(']:');
      const [positive, neutral, negative] = scores
        .replace('[', '')
        .replace(']', '')
        .split(',')
        .map(score => parseFloat(score.trim()));
      
      result[ticker.replace('[', '').trim()] = [positive, neutral, negative];
    });

    return result;
  });
}

export async function analyzeSentiment(headlines: String[]) {
  const analyzeHeadline = async (headline: String) => {
    const response = await fetch("https://proxy.tune.app/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "sk-tune-Z5cNVGmDtYmuTW3PwQ2FUOpqtYj3oJB2efQ",
      },
      body: JSON.stringify({
        temperature: 0.9, 
        messages: [
          {
            "role": "system",
            "content": "You are a financial analyst. Identify the stock tickers for the companies discussed in the text, and give them a score in positive, negative, or neutral sentiment. The sum of these scores should add up to one. The answer should be of format [TICKER]: [positive score, neutral score, negative score]. No other text should be returned. If you cannot identify a stock ticker, infer one with your best guess."
          },
          {
            "role": "user",
            "content": `Analyze this headline: ${headline}`
          }
        ],
        model: "anthropic/claude-3.5-sonnet",
        stream: false,
        "frequency_penalty": 0.2,
        "max_tokens": 100
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  try {
    const sentimentResults = await Promise.all(headlines.map(analyzeHeadline));
    return sentimentResults;
  } catch (error) {
    console.error("Error analyzing sentiments:", error);
    throw error;
  }
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


export function calculateImpact(trend: Trend): number {
  const [positive, neutral, negative] = trend.sentiments;
  
  // Sentiment score with positive bias
  const sentimentScore = positive * 0.4 + neutral * 0.2 - negative * 0.4;

  // News production increase
  const newsToday = trend.news_articles_today.length;
  const newsWeek = trend.news_articles_week.length / 7; // Average per day
  const newsIncrease = (newsToday - newsWeek) / (newsWeek || 1); // Avoid division by zero

  // Reddit usage increase
  const redditIncrease = (trend.reddit_mentions_today - trend.reddit_mentions_week / 7) / (trend.reddit_mentions_week / 7 || 1);

  //New proposed weighin, Oliver and Sri *unsure about the java code but you get the weighin idea, just make the sentiment scale the frequency values'
  let weightedSum: number = Math.abs(newsIncrease) * 0.60 + Math.abs(redditIncrease) * 0.40;

  let impact: number = sentimentScore * weightedSum;

  
  //const impact: number = Math.abs(sentimentScore) * weightedSum;
  // Combine factors with weights
  //let impact = Math.abs(sentimentScore) * 0.5 + Math.abs(newsIncrease) * 0.30 + Math.abs(redditIncrease) * 0.20;

  // Take the absolute value to make all scores positive (dont we lose information on whether to sell then??)
  impact = Math.abs(impact);

  // Normalize to [0, 1] range
  impact = Math.min(Math.max(impact, 0), 1);

  // Scale to [1, 10] range
  impact = impact * 9 + 1;

  // Round to nearest integer
  return Math.round(impact);
}

export function getTrends(
  structuredSentiment: { [key: string]: number[] }[], 
  topData: BezNewsArticle[], 
  tickerNews: TickerNews, 
  tickerRedditData: { [ticker: string]: RedditData }
): Trend[] {
  const trends: Trend[] = [];

  structuredSentiment.forEach((sentimentGroup, index) => {
    let maxScore = -Infinity;
    let topTicker = '';

    Object.entries(sentimentGroup).forEach(([ticker, sentimentValues]) => {
      const [a, b, c] = sentimentValues;
      const score = Math.pow(a + 0.01, 2) + Math.pow(c, 2);

      if (score > maxScore) {
        maxScore = score;
        topTicker = ticker;
      }

      const tickerNewsData = tickerNews[ticker] || { article_today: [], article_lastweek: [] };
      const topDataArticle: SimpleArticle = {
        title: topData[index].title,
        url: topData[index].url
      };
      const combinedTodayArticles = [topDataArticle, ...tickerNewsData.article_today];
      const redditData = tickerRedditData[ticker] || { countDay: 0, countWeek: 0 };

      const trend: Trend = {
        ticker,
        sentiments: sentimentValues,
        top: false,
        news_articles_today: combinedTodayArticles,
        news_articles_week: tickerNewsData.article_lastweek,
        reddit_mentions_today: redditData.countDay,
        reddit_mentions_week: redditData.countWeek,
        impact: 0 // Placeholder, will be calculated later
      };

      trend.impact = calculateImpact(trend);
      trends.push(trend);
    });

    const topTrendIndex = trends.findIndex(trend => trend.ticker === topTicker);
    if (topTrendIndex !== -1) {
      trends[topTrendIndex].top = true;
    }
  });

  return trends;
}

interface TickerNews {
  [ticker: string]: {
    article_today: SimpleArticle[];
    article_lastweek: SimpleArticle[];
  };
}

export async function fetchNewsForTickers(tickers: string[]): Promise<TickerNews> {
  const apiKey = ...
  const today = new Date().toISOString().split('T')[0];
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const tickerNews: TickerNews = {};

  for (const ticker of tickers) {
    tickerNews[ticker] = { article_today: [], article_lastweek: [] };

    // Fetch today's news
    const todayUrl = `https://api.polygon.io/v2/reference/news?ticker=${ticker}&published_utc=${today}&limit=20&apiKey=${apiKey}`;
    const todayResponse = await fetch(todayUrl);
    const todayData = await todayResponse.json();

    tickerNews[ticker].article_today = todayData.results.map((article: any) => ({
      title: article.title,
      url: article.article_url
    }));

    // Fetch last week's news
    const lastWeekUrl = `https://api.polygon.io/v2/reference/news?ticker=${ticker}&published_utc=${lastWeek}&limit=20&apiKey=${apiKey}`;
    const lastWeekResponse = await fetch(lastWeekUrl);
    const lastWeekData = await lastWeekResponse.json();

    tickerNews[ticker].article_lastweek = lastWeekData.results.map((article: any) => ({
      title: article.title,
      url: article.article_url
    }));
  }

  return tickerNews;
}


export async function getNews(topic: String) {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");


  const options = {method: 'GET', headers: {accept: 'application/json'}};

  if (topic == "consumer_staples") {
    const response = await fetch("https://api.benzinga.com/api/v2/news?token=374f2cf2f46f43e5958a5cf4659c35c2&content_types=Essentials%2C%20Food%20%26%20Beverage%2C%20Household%20Products%2C%20Personal%20Care%2C%20Supermarkets&topics=Essentials%2C%20Food%20%26%20Beverage%2C%20Household%20Products%2C%20Personal%20Care%2C%20Supermarkets&channels=Essentials%2C%20Food%20%26%20Beverage%2C%20Household%20Products%2C%20Personal%20Care%2C%20Supermarkets", options)
    const data = await response.json();
    return data;
  } else if (topic == "automobiles") {
    const response = await fetch("https://api.benzinga.com/api/v2/news?token=374f2cf2f46f43e5958a5cf4659c35c2&channels=Electric%20Vehicles%20(EVs)%2C%20cars%2C%20automobiles%2C%20automotives%2C%20transportation%2C%20energy%2C%20EVs&topics=Electric%20Vehicles%20(EVs)%2C%20cars%2C%20automobiles%2C%20automotives%2C%20transportation%2C%20energy%2C%20EVs&content_types=Electric%20Vehicles%20(EVs)%2C%20cars%2C%20automobiles%2C%20automotives%2C%20transportation%2C%20energy%2C%20EVs", options)
    const data = await response.json();
    return data;
  } else if (topic == "finance") {
    const response = await fetch("https://api.benzinga.com/api/v2/news?token=374f2cf2f46f43e5958a5cf4659c35c2&content_types=Banking%2C%20Investment%2C%20Insurance%2C%20Wealth%20Management%2C%20Financial%20Services&channels=Banking%2C%20Investment%2C%20Insurance%2C%20Wealth%20Management%2C%20Financial%20Services&topics=Banking%2C%20Investment%2C%20Insurance%2C%20Wealth%20Management%2C%20Financial%20Services", options)
    const data = await response.json();
    return data;
  } else if (topic == "technology") {
    const response = await fetch("https://api.benzinga.com/api/v2/news?token=374f2cf2f46f43e5958a5cf4659c35c2&topics=Innovation%2C%20Software%2C%20Hardware%2C%20Cloud%20Computing%2C%20Artificial%20Intelligence&content_types=Innovation%2C%20Software%2C%20Hardware%2C%20Cloud%20Computing%2C%20Artificial%20Intelligence&channels=Innovation%2C%20Software%2C%20Hardware%2C%20Cloud%20Computing%2C%20Artificial%20Intelligence", options)
    const data = await response.json(); 
    return data;
  } else if (topic == "healthcare") {
    const response = await fetch("https://api.benzinga.com/api/v2/news?token=374f2cf2f46f43e5958a5cf4659c35c2&channels=Pharmaceuticals%2C%20Biotechnology%2C%20Medical%20Devices%2C%20Health%2C%20Vaccines&topics=Pharmaceuticals%2C%20Biotechnology%2C%20Medical%20Devices%2C%20Health%20Services%2C%20Vaccines&content_types=Pharmaceuticals%2C%20Biotechnology%2C%20Medical%20Devices%2C%20Health%20Services%2C%20Vaccines", options)
    const data = await response.json(); 
    return data;
  }
  
}


interface RedditData {
  countDay: number;
  countWeek: number;
}

export async function fetchRedditData(tickers: string[]): Promise<{ [ticker: string]: RedditData }> {
  const subreddits = 'wallstreetbets+trading+stockmarket+investing+tradingreligion';
  const dayLength = 86400;
  const offsetDay = dayLength;
  const offsetWeek = 7 * dayLength;

  const tickerRedditData: { [ticker: string]: RedditData } = {};

  for (const ticker of tickers) {
    try {
    //   const countDay = await scrapeReddit([ticker], subreddits, offsetDay);
    //   const countWeek = await scrapeReddit([ticker], subreddits, offsetWeek);
      const countDay = 0
      const countWeek = 0

      tickerRedditData[ticker] = {
        countDay,
        countWeek
      };
    } catch (error) {
      console.error(`Error fetching Reddit data for ${ticker}:`, error);
      tickerRedditData[ticker] = {
        countDay: 0,
        countWeek: 0
      };
    }
  }

  return tickerRedditData;
}
  

export default async function Page() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Toggle chat state
  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const handleChatOpen = () => {
    setIsChatOpen(true);
  };

  // Function to close the chat
  const handleChatClose = () => {
    setIsChatOpen(false);
  };


  const bezinga_token = process.env.BEZINGA_API_KEY 
  const options = {method: 'GET'};
  const initialTopic = "finance";
  const data = await getNews(initialTopic);
  const topData = data.slice(0, 10);
  const titles = topData.map((item: any) => item.title);
  const sentiment = await analyzeSentiment(titles);
  const structuredSentiment = parseAndStructureSentiment(sentiment);
  const tickers = Object.keys(structuredSentiment.reduce((acc: String, curr: String) => ({ ...acc, ...curr }), {}));
  const tickerNews = await fetchNewsForTickers(tickers);
  const tickerRedditData = await fetchRedditData(tickers);
  const initialTrends = getTrends(structuredSentiment, topData, tickerNews, tickerRedditData);

  return (
    <div>
      <NewsFeed initialTopic={initialTopic} initialTrends={initialTrends} />;
   </div>
  )

}



