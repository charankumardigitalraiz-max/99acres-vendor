import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import SubscriptionPlans from './pages/SubscriptionPlans';
import Users from './pages/Users';
import UserDetails from './pages/UserDetails';
import Subscribers from './pages/Subscribers';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import PropertyDetails from './pages/PropertyDetails';
import Reports from './pages/Reports';
import VendorProfile from './pages/VendorProfile';
import Categories from './pages/Categories';
import Support from './pages/Support';
import TicketDetails from './pages/TicketDetails';
import Reviews from './pages/Reviews';
import StaffRoles from './pages/StaffRoles';
import StaffMembers from './pages/StaffMembers';
import Banners from './pages/Banners';
import Transactions from './pages/Transactions';
import Chats from './pages/Chats';
import Login from './pages/Login';
import CreateProperty from './pages/CreateProperty';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes index="/login">
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="subscriptions" element={<SubscriptionPlans />} />
            <Route path="customers/:role" element={<Users />} />
            <Route path="customers/details/:id" element={<UserDetails />} />
            <Route path="subscribers" element={<Subscribers />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="chats" element={<Chats />} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="properties/:id" element={<PropertyDetails />} />
            <Route path="create-property" element={<CreateProperty />} />
            <Route path="reports" element={<Reports />} />
            <Route path="profile" element={<VendorProfile />} />
            <Route path="support" element={<Support />} />
            <Route path="support/:id" element={<TicketDetails />} />
            <Route path="banners" element={<Banners />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="staff/roles" element={<StaffRoles />} />
            <Route path="staff/members" element={<StaffMembers />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
