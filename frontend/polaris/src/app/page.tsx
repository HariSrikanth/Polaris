import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function Page() {
  // Get the userId from auth() -- if null, the user is not signed in
  const { userId } = auth()

  if (userId) {
    // Query DB for user specific information or display assets only to signed in users
  }

  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser()
  
    let stocks = user?.publicMetadata["sectors"] as [String: any]
    console.log(stocks)
    if (stocks != undefined) {
      return (
        <>
          <p>{stocks}</p>
        </>
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