import axios from 'axios';
import moment from 'moment';


interface RedditPost {
  title: string;
  url: string;
  created_utc: number;
}

interface NewsArticle {
  title: string;
  sentiment: [number, number, number]; // [positive, neutral, negative]
}

export async function scrapeReddit(keywords: String[], subreddits: string, offset: number): Promise<number> {
    // Combine multiple keywords into a single query string separated by OR
    const query = keywords.map(keyword => `title:${keyword}`).join(' OR ');
  
    // Construct the Reddit API URL
    const redditUrl = `https://www.reddit.com/r/${subreddits}/search.json?q=${encodeURIComponent(query)}&sort=new&t=all`;
  
    const now = moment().unix();
    const cutoffTime = now - offset;
  
    try {
      const response = await axios.get(redditUrl);
      const posts = response.data.data.children as { data: RedditPost }[];
      let count = 0;
  
      // Filter posts based on the timestamp
      posts.forEach(post => {
        if (post.data.created_utc > cutoffTime) {
          count++;
          console.log(`${post.data.title} - ${post.data.url}`);
        }
      });
      
      console.log(count)
      return count;
    } catch (error) {
      console.error('Error fetching Reddit data:', error);
      return 0;
    }
  }

export function calculateStockScore(redditMentions: [number, number], newsArticles: [number, number], sentiment: [number, number, number]): number {
//   const sentiments = newsArticles.map(article => {
//     const [positive, neutral, negative] = article.sentiment;
//     return positive * 0.45 + neutral * 0.2 - negative * 0.35;
//   });
if (sentiment === null || sentiment.length !== 3) {
    console.error('Invalid sentiment data');
    return 0; // Or handle the error as appropriate
  }

  const [positive, neutral, negative] = sentiment;

  // Perform the weighted calculation
  const weightedSentiment = positive * 0.45 + neutral * 0.2 + negative * 0.35;

  const eps = 0.001;
  const redditFreq = redditMentions[0] / (redditMentions[1] + eps);
  const newsFreq = newsArticles[0] / (newsArticles[1] + eps);

  const finalScore = (weightedSentiment * newsFreq * 0.7) + (redditFreq * 0.3);

  return finalScore;
}

// // Example usage:
// const subreddits = 'wallstreetbets+trading+stockmarket+investing+tradingreligion';
// const redditKeyword = 'nvidia';
// const dayLength = 86400;
// const offsetDay = dayLength;
// const offsetWeek = 7 * dayLength;

// async function runExample() {
//   const countDay = await scrapeReddit(redditKeyword, subreddits, offsetDay);
//   const countWeek = await scrapeReddit(redditKeyword, subreddits, offsetWeek);

//   const exampleRedditMentions: [number, number] = [countDay, countWeek];

//   const exampleNewsArticles: NewsArticle[] = [
//     { title: 'Apple releases new iPhone', sentiment: [0.8, 0.1, 0.1] },
//     { title: 'Apple faces supply chain issues', sentiment: [0.1, 0.4, 0.5] },
//     { title: 'Analysts predict strong quarter for Apple', sentiment: [0.9, 0.1, 0.0] },
//     { title: 'Apple stock hits new high', sentiment: [0.15, 0.7, 0.15] },
//   ];
//   const newsCount = 17;

//   const finalScore = calculateStockScore(exampleRedditMentions, exampleNewsArticles, newsCount);

//   console.log(`Final Score: ${finalScore}`);
// }

// runExample();