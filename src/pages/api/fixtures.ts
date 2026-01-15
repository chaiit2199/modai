import type { NextApiRequest, NextApiResponse } from 'next';
import { getFixturesDataByDate } from '@/api/fetchData';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { date } = req.query;

  if (!date || typeof date !== 'string') {
    return res.status(400).json({ message: 'date parameter is required (YYYY-MM-DD)' });
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return res.status(400).json({ message: 'Invalid date format. Expected YYYY-MM-DD' });
  }

  try {
    // Fetch fixtures với cache thông minh
    // - Đã thi đấu: cache 1 ngày
    // - Chưa thi đấu: cache 1 phút
    const result = await getFixturesDataByDate(date);
    
    return res.status(200).json({
      success: true,
      data: result.data || [],
      fromCache: result.fromCache,
    });
  } catch (error) {
    console.error('Error in /api/fixtures:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
