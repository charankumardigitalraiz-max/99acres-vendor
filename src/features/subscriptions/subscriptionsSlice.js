import { createSlice } from '@reduxjs/toolkit';
import { agentPlans, sellerPlans, subscribersData, subscriptionPieData } from '../../data/mockData';

const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState: {
    agentPlans,
    sellerPlans,
    subscribers: subscribersData,
    pieData: subscriptionPieData,
    billingCycle: 'annual',
    planFilter: 'All',
    statusFilter: 'All',
    typeFilter: 'All',
    searchQuery: '',
    editingPlan: null,
    showPlanModal: false,
  },
  reducers: {
    setBillingCycle: (state, action) => { state.billingCycle = action.payload; },
    setPlanFilter: (state, action) => { state.planFilter = action.payload; },
    setStatusFilter: (state, action) => { state.statusFilter = action.payload; },
    setTypeFilter: (state, action) => { state.typeFilter = action.payload; },
    setSearch: (state, action) => { state.searchQuery = action.payload; },
    setEditingPlan: (state, action) => { state.editingPlan = action.payload; },
    setShowPlanModal: (state, action) => { state.showPlanModal = action.payload; },
    togglePlanStatus: (state, action) => {
      const { type, id } = action.payload;
      const plans = type === 'agent' ? state.agentPlans : state.sellerPlans;
      const plan = plans.find(p => p.id === id);
      if (plan) {
        plan.status = plan.status === 'active' ? 'inactive' : 'active';
      }
    },
  },
});

export const {
  setBillingCycle,
  setPlanFilter,
  setStatusFilter,
  setTypeFilter,
  setSearch,
  setEditingPlan,
  setShowPlanModal,
  togglePlanStatus
} = subscriptionsSlice.actions;

export const selectFilteredSubscribers = (state) => {
  const { subscribers, planFilter, statusFilter, typeFilter, searchQuery } = state.subscriptions;
  return subscribers.filter(s => {
    const matchSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPlan = planFilter === 'All' || s.plan.includes(planFilter);
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    const matchType = typeFilter === 'All' || (s.type && s.type.toLowerCase() === typeFilter.toLowerCase());
    return matchSearch && matchPlan && matchStatus && matchType;
  });
};

export default subscriptionsSlice.reducer;
