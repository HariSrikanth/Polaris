// "use client"
// import Link from "next/link"
// import React, { useEffect, useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// interface NewsArticle {
//     id: string;
//     publisher: {
//       name: string;
//       homepage_url: string;
//       logo_url: string;
//       favicon_url: string;
//     };
//     title: string;
//     author: string;
//     published_utc: string;
//     article_url: string;
//     tickers: string[];
//     image_url: string;
//     description: string;
//     keywords: string[];
//     insights: {
//       ticker: string;
//       sentiment: string;
//       sentiment_reasoning: string;
//     }[];
//   }

// interface NewsResponse {
//   results: NewsArticle[];
// }

// interface StockCardProps {
//   ticker: String;
// }

// export default function NewsCard() {
//     const [data, setData] = useState<NewsResponse | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const options = { method: 'GET', headers: { accept: 'application/json' } };
//         const apiKey = process.env.POLYGON_KEY

//         fetch(`https://api.polygon.io/v2/reference/news?ticker=${ticker}&limit=2&apiKey=${apiKey}`)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//                 return response.json();
//             })
//             .then((data: NewsResponse) => {
//                 console.log(data);
//                 setData(data);
//                 setLoading(false);
//             })
//             .catch(error => {
//                 console.error("Fetching error:", error);
//                 setError(error.message);
//                 setLoading(false);
//             });
//     }, [ticker]);

//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>Error: {error}</p>;

//     return (
//         <Card className="w-[1000px] mx-auto">
//             <CardHeader>
//                 <CardTitle className="text-2xl font-bold">{ticker.toUpperCase()}</CardTitle>
//             </CardHeader>
//             <CardContent>
//                 {data && data.results && data.results.length > 0 ? (
//                     <div>
//                         <h3 className="text-lg font-semibold mb-4">Current News:</h3>
//                         <ul className="list-disc pl-5 space-y-2">
//                             {data.results.map((article, index) => (
//                                 <li key={article.id} className="text-sm">
//                                     <Link href = {article.article_url} className="text-blue-600 hover:text-blue-800 underline">{article.title} </Link>
//                                     <ul className="ml-6 mt-1 list-disc">
//                                         <li className="text-xs text-gray-600">
//                                         Description: {article.description}
//                                         </li>
//                                         <li className="text-xs text-gray-600">
//                                         Sentiment: {article.insights[0].sentiment_reasoning}
//                                         </li>
        
                        
//                                     </ul>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 ) : (
//                     <p>No news articles available.</p>
//                 )}
//             </CardContent>
//         </Card>
//     );
// }