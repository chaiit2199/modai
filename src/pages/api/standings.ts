import type { NextApiRequest, NextApiResponse } from 'next';
import { getStandingsData } from '@/api/fetchData';

const THIRTY_MINUTES_MS = 30 * 60 * 1000; // 30 phút

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { leagueId, season } = req.query;

  if (!leagueId || typeof leagueId !== 'string') {
    return res.status(400).json({ message: 'leagueId is required' });
  }

  const seasonParam = (season as string) || '2022';

  try {
    // Fetch standings với cache 30 phút
    const result = await getStandingsData(leagueId, seasonParam, THIRTY_MINUTES_MS);
    
    if (result.data) {
      return res.status(200).json({
        success: true,
        data: result.data,
        fromCache: result.fromCache,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Standings data not found',
      });
    }
  } catch (error) {
    console.error('Error in /api/standings:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
