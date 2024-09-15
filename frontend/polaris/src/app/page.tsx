import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import {scrapeReddit, calculateStockScore}  from './stockScore'; 
import StockCard from "@/components/stocks/StockCard";
import { get } from 'http';


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


// async function analyzeSentiment(headlines: [String]) {
//   const response = await fetch("https://proxy.tune.app/chat/completions", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": "sk-tune-Z5cNVGmDtYmuTW3PwQ2FUOpqtYj3oJB2efQ",
//     },
//     body: JSON.stringify({
//       temperature: 0.9, 
//       messages: [
//         {
//           "role": "system",
//           "content": "You are a financial analyst. Identify the stock tickers for the companies discussed in the text, and give them a score in positive, negative, or neutral sentiment. The sum of these scores should add up to one. The answer should be of format [TICKER]: [positive score, neutral score, negative score]. No other text should be returned."
//         },
//         {
//           "role": "user",
//           "content": `Analyze this headline: ${headline}`
//         }
//       ],
//       model: "anthropic/claude-3.5-sonnet",
//       stream: false,
//       "frequency_penalty": 0.2,
//       "max_tokens": 100
//     })
//   });

//   const data = await response.json();
//   return data.choices[0].message.content;
// }
function parseAndStructureSentiment(sentimentArray: string[]): { [key: string]: number[] }[] {
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



// Assuming 'sentiment' is your original array of strings


async function analyzeSentiment(headlines: String[]) {
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
  news_article: BezNewsArticle;
}

function getTrends(structuredSentiment: { [key: string]: number[] }[], topData: BezNewsArticle[]): Trend[] {
  const trends: Trend[] = [];

  structuredSentiment.forEach((sentimentGroup, index) => {
    let maxScore = -Infinity;
    let topTicker = '';

    // Process each ticker in the sentiment group
    Object.entries(sentimentGroup).forEach(([ticker, sentimentValues]) => {
      const [a, b, c] = sentimentValues;
      const score = Math.pow(a + 0.01, 2) + Math.pow(c, 2);

      trends.push({
        ticker,
        sentiments: sentimentValues,
        top: false, // Will be updated later for the top ticker
        news_article: topData[index] // Assign the corresponding news article
      });

      if (score > maxScore) {
        maxScore = score;
        topTicker = ticker;
      }
    });

    // Set the top ticker for this group
    const topTrendIndices = trends
      .map((trend, i) => trend.ticker === topTicker && trend.news_article === topData[index] ? i : -1)
      .filter(i => i !== -1);
    
    topTrendIndices.forEach(i => {
      trends[i].top = true;
    });
  });

  return trends;
}

async function getNews(topic: String) {
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


export default async function Page() {
  const bezinga_token = process.env.BEZINGA_API_KEY 
  const options = {method: 'GET'};

  // Get the userId from auth() -- if null, the user is not signed in
  const { userId } = auth()

  if (userId) {
    // Query DB for user specific information or display assets only to signed in users
  }

  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser()
  
  let stocks = user?.publicMetadata["sectors"] as [String]
  console.log(stocks)

  if (stocks != undefined) {
    // Example headline for sentiment analysis

    const topic = "finance"
    const data = await getNews(topic)
    console.log(data)

    const topData = data.slice(5,15)

    const titles: String[] = topData.map((item: BezNewsArticle) => item.title);
    // const combinedTitles: String = titles.join('; ');

    const sentiment = await analyzeSentiment(titles);
    console.log(sentiment)
    
    const structuredSentiment = parseAndStructureSentiment(sentiment);

    console.log(structuredSentiment);

    const trends = getTrends(structuredSentiment, topData)
    
    console.log(trends)
    





    const dayLength = 86400;
    const offsetDay = dayLength;
    const offsetWeek = 7 * dayLength;
   
    const teslaKeywords = [
      "Tesla stock",
      "buy Tesla stock",
      "reasons to buy Tesla",
      "Tesla investment",
      "Tesla financials",
      "Tesla growth",
      "Tesla market analysis",
      "Tesla earnings",
      "Tesla stock tips",
      "Tesla trading",
      "Tesla innovation",
      "Tesla future outlook",
      "Tesla electric vehicles",
      "Tesla performance",
      "Tesla technology",
      "TSLA"
    ];
    
    

    //const redditMentionsToday = await scrapeReddit(teslaKeywords, "wallstreetbets", offsetDay);
    const redditMentionsWeek = await scrapeReddit(teslaKeywords, "wallstreetbets", offsetWeek);

    //const score = await calculateStockScore([redditMentionsToday, redditMentionsWeek], [8, 10], [0.5, 0.2, 0.1])

    //console.log(score)

    return (
      <div>
        <p>hello</p>
        <div>
          <h2>Sentiment Analysis:</h2>
          <p>{sentiment}</p>
        </div>
        <div>
          {stocks.map((stock: String) => (
            <StockCard key={stock as string} ticker={stock} />
          ))}
          <p>{redditMentionsWeek}</p>
        </div>
      </div>
    )
  } else {
    redirect('/setup')
  }
}