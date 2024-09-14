import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import StockCard from "@/components/stocks/StockCard";

export default async function Page() {

  // const options = {method: 'GET', headers: {accept: 'application/json'}};

  const bezinga_token = process.env.BEZINGA_API_KEY 
  // fetch(`https://api.benzinga.com/api/v2/news?token=${bezinga_token}&tickers=AAPL`, options)
  //   .then(response => response.json())
  //   .then(response => console.log(response))
  //   .catch(err => console.error(err));
  const options = {method: 'GET'};

// fetch(`https://api.benzinga.com/api/v1/analyst/insights?token=${bezinga_token}`, options)
//   .then(response => response.json())
//   .then(response => console.log(response))
//   .catch(err => console.error(err));

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
      return (
        <p>hello</p>
        )
    } else {
      redirect('/setup')
      // return (
      //   <>
      //     <p>No stock data available</p>
      //   </>
      // )
    }
}