"use client"
import React from 'react';
import Image from 'next/image';
import { useAuth, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from 'next/link';


export default function LandingPage() {
  const { isSignedIn } = useAuth();

  const buttonClasses = cn(
    "inline-flex h-9 w-max items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium",
    "text-white transition-colors hover:bg-blue-700 focus:bg-blue-700 focus:outline-none",
    "disabled:pointer-events-none disabled:opacity-50"
  );

  return (
    <div className="max-w-3xl mx-auto p-8 text-center font-sans">
      <div className="flex justify-center mb-6">
        <Image
          src="https://cdn.discordapp.com/attachments/1283171026032918549/1284870280539410473/Screenshot_from_2024-09-15_15-32-28.png?ex=66e83432&is=66e6e2b2&hm=21416872a9b9e5929676525520f4898af110b3d81459f0e70eeae62359702900&"
          alt="Polaris Logo"
          width={200}
          height={200}
          objectFit="cover"
        />
      </div>

      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full inline-block mb-4">
        Master the Market
      </div>
      <h1 className="text-5xl font-serif mb-4">
        <span className="italic">Let</span> the <span className="font-bold">North Star</span> guide your financial decisions
      </h1>
      <p className="text-xl mb-6 text-gray-500">
      Polaris is a real-time market analysis tool that leverages an agentic LLM 
      with RAG to align financial data with sentiment and frequency analysis on 
      news and social media, thereby offering crucial investment insights and a 
      helpful advisor feature for user support.
      </p>
      {!isSignedIn && (
        <SignInButton mode="redirect">
          <Button className={buttonClasses}>
            Sign In to Start
          </Button>
        </SignInButton>
      )}
      {isSignedIn && (
        <Link href="/dashboard">
          <Button className={buttonClasses}>
            Continue to Dashboard
          </Button>
        </Link>
      )}

        {isSignedIn ? (
        <p className="text-sm text-gray-600 mt-2">You are already signed in!</p>
            ) : (
        <p className="text-sm text-gray-600 mt-2">Let us guide you!</p>
        )}
    </div>
  );
}
