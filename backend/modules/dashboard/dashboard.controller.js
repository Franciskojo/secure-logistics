import * as DashboardService from './dashboard.service.js';

export const getDashboard = async (req, res) => {
  try {
    const stats = await DashboardService.getDashboardStats();

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Dashboard Error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard'
    });
  }
};