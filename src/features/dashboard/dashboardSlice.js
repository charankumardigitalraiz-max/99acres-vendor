import { createSlice } from '@reduxjs/toolkit';
import {
  revenueData,
  recentActivity,
  propertyTypeData,
  transactionsData,
  propertiesData,
  supportTickets,
  staffMembers,
  subscriptionPieData,
  usersData
} from '../../data/mockData';

const CURRENT_VENDOR_ID = '10002'; // Priya Mehta
const selfProperties = propertiesData.filter(p => p.userId === CURRENT_VENDOR_ID);

const totalViews = selfProperties.reduce((sum, p) => sum + (p.views || 0), 0);

const vendorKpis = [
  { id: 1, label: 'Properties Listed', value: selfProperties.length.toLocaleString(), change: '+12.4%', trend: 'up', icon: 'building', color: 'green' },
  { id: 2, label: 'Total Property Views', value: totalViews.toLocaleString(), change: '+18.2%', trend: 'up', icon: 'trending-up', color: 'blue' },
  { id: 3, label: 'Active Subscriptions', value: 'Standard Seller (₹ 1,240)', change: '+5.1%', trend: 'up', icon: 'star', color: 'amber' },
  // { id: 4, label: 'Support Tickets', value: supportTickets.length.toString(), change: '+2', trend: 'up', icon: 'message', color: 'purple' },
];

const recentChats = usersData
  .filter(u => u.chats && u.chats.length > 0)
  .flatMap(u => u.chats.map(c => ({ ...c, userId: u.id, userAvatar: u.avatar })))
  .slice(0, 6);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    kpis: vendorKpis,
    revenueData,
    propertyTypeData,
    subscriptionPieData,
    recentActivity,
    recentChats,
    recentTransactions: transactionsData.slice(0, 5),
    allTransactions: transactionsData,
    staffCount: staffMembers.length,
    propertyAnalytics: selfProperties.map(p => ({
      id: p.id,
      title: p.title,
      views: p.views,
      city: p.city,
      status: p.status,
      image: p.coverPhoto,
      trend: Math.random() > 0.3 ? 'up' : 'down', // Mock trend
      growth: `+${Math.floor(Math.random() * 15 + 5)}%` // Mock growth
    })).sort((a, b) => b.views - a.views),
  },
  reducers: {},
});

export default dashboardSlice.reducer;
