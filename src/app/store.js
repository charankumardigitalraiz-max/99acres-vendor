import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import usersReducer from '../features/users/usersSlice';
import subscriptionsReducer from '../features/subscriptions/subscriptionsSlice';
import productsReducer from '../features/products/productsSlice';
import reportsReducer from '../features/reports/reportsSlice';
import uiReducer from '../features/ui/uiSlice';
import categoryReducer from '../features/categories/categorySlice';
import supportReducer from '../features/support/supportSlice';
import roleReducer from '../features/staff/roleSlice';
import staffReducer from '../features/staff/staffMember';
import reviewReducer from '../features/reviews/reviewSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    users: usersReducer,
    subscriptions: subscriptionsReducer,
    products: productsReducer,
    reports: reportsReducer,
    ui: uiReducer,
    categories: categoryReducer,
    tickets: supportReducer,
    roles: roleReducer,
    staff: staffReducer,
    reviews: reviewReducer,
  },
});

export default store;
