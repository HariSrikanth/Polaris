import { NextResponse } from 'next/server';
import { getNews, analyzeSentiment, parseAndStructureSentiment, fetchNewsForTickers, fetchRedditData, getTrends } from '../../page'; // Adjust the import path as needed

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic');

  if (!topic) {
    return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
  }

  try {
    const data = await getNews(topic);
    const topData = data.slice(0, 10);
    const titles = topData.map((item: any) => item.title);
    const sentiment = await analyzeSentiment(titles);
    const structuredSentiment = parseAndStructureSentiment(sentiment);
    const tickers = Object.keys(structuredSentiment.reduce((acc, curr) => ({ ...acc, ...curr }), {}));
    const tickerNews = await fetchNewsForTickers(tickers);
    const tickerRedditData = await fetchRedditData(tickers);
    const trends = getTrends(structuredSentiment, topData, tickerNews, tickerRedditData);

    return NextResponse.json(trends);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'An error occurred while fetching news' }, { status: 500 });
  }
}