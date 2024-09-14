// "use client";

// import React from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { useState } from "react";

// interface StockCardProps {
//   ticker: String;
// }

// export default function StockCard({ ticker }: StockCardProps) {
//     const [response, setResponse] = useState<string>();

//   const options = {method: 'GET', headers: {accept: 'application/json'}};

//   const bezinga_token = process.env.BEZINGA_API_KEY 
//   fetch(`https://api.benzinga.com/api/v2/news?token=${bezinga_token}&tickers=${ticker}`, options)
//     .then(response => response.json())
//     .then(response => console.log(response))
//     .catch(err => console.error(err));

//   return (
//     <Card className="w-[1000px]">
//       <CardHeader>
//         <CardTitle>{ticker.toUpperCase()}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <p>Stock ticker: {ticker.toUpperCase()}</p>
//         <p></p>
//       </CardContent>
//     </Card>
//   );
// }


"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// types.ts

export interface NewsArticle {
    id: number;
    author: string;
    created: string;
    updated: string;
    title: string;
    teaser: string;
    body: string;
    url: string;
    image: Array<object>; // Define more specific type if available
    channels: Array<object>; // Define more specific type if available
    stocks: Array<object>; // Define more specific type if available
    tags: Array<object>; // Define more specific type if available
  }
  
  export interface NewsResponse {
    articles: NewsArticle[];
  }

interface StockCardProps {
  ticker: String;
}

export default function StockCard({ ticker }: StockCardProps) {
    const [data, setData] = useState(null)

//   useEffect(() => {

    const options = {method: 'GET', headers: {accept: 'application/json'}};
    const bezingaToken = process.env.BEZINGA_API_KEY;


    
//   }, [])
fetch(`https://api.benzinga.com/api/v2/news?token=${bezingaToken}`, options)
        .then(data => data.json())
        .then(data => 
            console.log(data))
  if (data) {
    return (
        <Card className="w-full max-w-[1000px] mx-auto">
        <CardHeader>
            <CardTitle className="text-2xl font-bold">{ticker.toUpperCase()} News</CardTitle>
        </CardHeader>
        <CardContent>

            {data[0]}
        </CardContent>
        </Card>
    );}
}