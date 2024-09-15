import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import NewsCard from "./NewsCard"
import NewsItem from "./NewsItem"

export default async function Page() {
  const { userId } = auth()
  const user = await currentUser()
  
  // Placeholder data - replace with actual API calls
  const newsCards = [
    { id: 1, title: "News Title 1", ticker: "AAPL", change: "+2.5%", references: ["Ref 1", "Ref 2", "Ref 3"] },
    { id: 2, title: "News Title 2", ticker: "GOOGL", change: "-1.2%", references: ["Ref 1", "Ref 2", "Ref 3"] },
    { id: 3, title: "News Title 3", ticker: "TSLA", change: "+3.7%", references: ["Ref 1", "Ref 2", "Ref 3"] },
  ]

  const newsItems = [
    { id: 4, text: "Additional news item 1" },
    { id: 5, text: "Additional news item 2" },
    { id: 6, text: "Additional news item 3" },
    { id: 7, text: "Additional news item 4" },
  ]

  if (!userId) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Here's what's new in
        <span className="relative inline-block ml-2">
          <select className="appearance-none bg-transparent border-grey pr-8 focus:outline-none">
            <option>the world</option>
            <option>your portfolio</option>
          </select>
        </span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {newsCards.map((card) => (
          <NewsCard key={card.id} {...card} />
        ))}
      </div>

      <div className="space-y-4">
        {newsItems.map((item) => (
          <NewsItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  )
}

// import { auth, currentUser } from '@clerk/nextjs/server'
// import { redirect } from 'next/navigation'
// import React, { useState } from "react";

// import StockCard from "@/components/stocks/StockCard";

// export default async function Page() {



//   // const options = {method: 'GET', headers: {accept: 'application/json'}};

//   const bezinga_token = process.env.BEZINGA_API_KEY 
//   // fetch(`https://api.benzinga.com/api/v2/news?token=${bezinga_token}&tickers=AAPL`, options)
//   //   .then(response => response.json())
//   //   .then(response => console.log(response))
//   //   .catch(err => console.error(err));
//   const options = {method: 'GET'};

// // fetch(`https://api.benzinga.com/api/v1/analyst/insights?token=${bezinga_token}`, options)
// //   .then(response => response.json())
// //   .then(response => console.log(response))
// //   .catch(err => console.error(err));

//   // Get the userId from auth() -- if null, the user is not signed in
//   const { userId } = auth()

//   if (userId) {
//     // Query DB for user specific information or display assets only to signed in users
//   }

//   // Get the Backend API User object when you need access to the user's information
//   const user = await currentUser()
  
//     let stocks = user?.publicMetadata["sectors"] as [String]
//     console.log(stocks)
//     if (stocks != undefined) {
//       return (
//         <div className = "flex flex-col">
//           <div className="flex flex-col items-center">
//           {stocks.map((stock: String) => (
//               <div className = "flex flex-col px-5 py-5 space-x-10">
//               <StockCard ticker={stock} />
  
//               </div>
//           ))}

//           </div>
//           </div>
//         )
//     } else {
//       redirect('/setup')
//       // return (
//       //   <>
//       //     <p>No stock data available</p>
//       //   </>
//       // )
//     }
// }