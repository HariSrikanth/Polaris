import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
  } from '@clerk/nextjs'
  

export default function SignInCard() {
    return (
  
            <div className = "flex flex-col items-center pt-[100px]">
            <Card className = "flex flex-col w-[250px] items-center gap-4">
                <CardHeader className = "text-center">
                    <CardTitle>Polaris</CardTitle>
                    <CardDescription>Your Financial North Star</CardDescription>
                </CardHeader>
                <CardContent>
                <SignInButton>
                    <button className="bg-black text-white py-1 px-3 rounded-lg hover:bg-gray-800">
                        Sign in
                    </button>
                </SignInButton>
                </CardContent>
            </Card>
        </div>

      

    )

}