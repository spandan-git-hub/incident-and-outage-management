import express from 'express';
import Incident from '../models/Incident.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /api/stats/overview - Get dashboard statistics
router.get('/overview', auth, async (req, res) => {
  try {
    // Get total incidents
    const totalIncidents = await Incident.countDocuments();

    // Get status breakdown
    const statusStats = await Incident.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 } // Stable alphabetical sort
      }
    ]);

    // Get severity breakdown
    const severityStats = await Incident.aggregate([
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { 
          _id: 1 // This will sort but we need custom order
        }
      }
    ]);

    // Get incidents per operator
    const operatorStats = await Incident.aggregate([
      {
        $match: {
          assignedOperator: { $ne: null }
        }
      },
      {
        $group: {
          _id: '$assignedOperator',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'operator'
        }
      },
      {
        $unwind: '$operator'
      },
      {
        $project: {
          name: '$operator.name',
          count: 1
        }
      },
      {
        $sort: { name: 1 } // Stable alphabetical sort by operator name
      }
    ]);

    // Get recent incidents trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentIncidents = await Incident.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Calculate open vs closed
    const openIncidents = await Incident.countDocuments({
      status: { $in: ['open', 'acknowledged', 'in-progress'] }
    });
    const closedIncidents = await Incident.countDocuments({
      status: { $in: ['resolved', 'closed'] }
    });

    // Get unassigned count
    const unassignedCount = await Incident.countDocuments({
      assignedOperator: null
    });

    res.json({
      totalIncidents,
      openIncidents,
      closedIncidents,
      unassignedCount,
      statusStats: statusStats.map(s => ({ name: s._id, value: s.count })),
      severityStats: severityStats.map(s => ({ 
        name: s._id.charAt(0).toUpperCase() + s._id.slice(1), 
        value: s.count 
      })),
      operatorStats: operatorStats.map(o => ({ name: o.name, value: o.count })),
      recentTrend: recentIncidents.map(r => ({ date: r._id, count: r.count }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
