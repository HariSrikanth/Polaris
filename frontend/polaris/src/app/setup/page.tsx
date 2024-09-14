"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { clerkClient } from "@clerk/nextjs/server";
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'


import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
export default function Setup() {
    const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY
    const url = `https://www.alphavantage.co/query?function=SECTOR&apikey=${apiKey}`;


        
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const sectors = [
        "Information Technology",
        "Health Care",
        "Financials",
        "Consumer Discretionary",
        "Communication Services",
        "Industrials",
        "Consumer Staples",
        "Energy",
        "Utilities",
        "Real Estate",
        "Materials"
      ];
    // const sectors = [
    //     "AAPL",
    //     "NVDA",
    //     "GOO"
    // ]

    const toggleItem = (item: string) => {
        setSelectedItems(prevItems => 
          prevItems.includes(item)
            ? prevItems.filter(i => i !== item)
            : [...prevItems, item]
        );
      };

      const callAPI = async (selectedItems: string[]) => {
        try {
            const res = await fetch('/api/updateUserData', {
                method: 'POST', // or 'POST' if you want to send data
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sectors: selectedItems,  // Pass the selectedItems array in the body
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to fetch data from API');
            }

            const data = await res.json();

        } catch (err) {
            console.error("Error fetching API:", err);
        }
    };

    const handleSubmit = () => {
        callAPI(selectedItems); // Call the API when submit button is clicked

    };
    
      return (
        <div className="flex flex-col items-center p-4 pt-[100px]">
        <Card>
            <CardHeader>
                <CardTitle>What sectors are you interested in?</CardTitle>
            </CardHeader>
        </Card>

          <div className="flex flex-wrap gap-2 mb-4 pl-[30px] w-[600px] pt-[25px]">
            {sectors.map((sector) => (
              <Button
                key={sector}
                variant={selectedItems.includes(sector) ? "default" : "outline"}
                onClick={() => toggleItem(sector)}
              >
                {sector}
              </Button>
            ))}
          </div>
          <Button onClick={handleSubmit}>Submit</Button>
    
        </div>
      );
   };
    
//     "use client";

// import Image from 'next/image''

// export default function Home() {

//   function handleClick() {
//     console.log("Clicked me!");
//     alert("Clicked me!");
//   }


//   return (
//     <main>
//       <div>
//         <p>
//           Get started by editing&nbsp;
//           <code className={styles.code}>src/app/page.js</code>
//         </p>
//         <div>
//           TESTE
//         </div>
//         <button onClick={handleClick}>Click me</button>
//       </div>
//     </main>
//   )
// }
