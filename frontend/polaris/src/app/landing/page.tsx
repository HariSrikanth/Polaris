"use client"
import React from 'react';
import { useAuth, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const { isSignedIn } = useAuth();

  const buttonClasses = cn(
    "inline-flex h-9 w-max items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium",
    "text-white transition-colors hover:bg-blue-700 focus:bg-blue-700 focus:outline-none",
    "disabled:pointer-events-none disabled:opacity-50"
  );

  return (
    <div className="max-w-3xl mx-auto p-8 text-center font-sans">
      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full inline-block mb-4">
        Master the Market
      </div>
      <h1 className="text-5xl font-serif mb-4">
        <span className="italic">Let</span> the <span className="font-bold">North Star</span> guide your financial decisions
      </h1>
      <p className="text-xl mb-6 text-gray-500">
        In this step-by-step course, learn the exact settings and techniques to capture amazing photos
        with your iPhone. No experience needed — just follow the steps and see the difference!
      </p>
      {!isSignedIn && (
        <SignInButton mode="redirect">
          <Button className={buttonClasses}>
            Sign In to Start
          </Button>
        </SignInButton>
      )}
      {isSignedIn && (
        <Button className={buttonClasses}>
          Continue to Dashboard
        </Button>
      )}
      
      <p className="text-sm text-gray-600 mt-2">Limited time only launch price.</p>
    </div>
  );
}
