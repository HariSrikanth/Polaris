import { NextRequest, NextResponse } from 'next/server'
import { getAuth, clerkClient } from '@clerk/nextjs/server'

// If you use `request` you don't need the type
export async function POST(req: NextRequest) {
  // Get the user ID from the session
  const { userId } = getAuth(req)
  try {
    // Parse the request body
    const { sectors } = await req.json();  // Get the sectors array from the request body

    if (!userId) return NextResponse.redirect('/sign-in')
        
    if (!sectors || !Array.isArray(sectors)) {
        return NextResponse.json({ error: 'Invalid sectors data' }, { status: 400 });
    }

    // Update the user's public metadata with the selected sectors
    const params = { publicMetadata: { sectors } };

    const updatedUser = await clerkClient.users.updateUser(userId, params);

    return NextResponse.json({ updatedUser });
} catch (error) {
    return NextResponse.json({ error: 'Failed to update user data' }, { status: 500 });
}
}
