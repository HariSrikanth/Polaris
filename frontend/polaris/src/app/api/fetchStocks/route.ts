// pages/api/fetchAllStocks.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const apiKey = process.env.FINNHUB_API_KEY;

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(`https://finnhub.io/api/v1/stock/symbols?token=${apiKey}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch stock symbols');
    }
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
