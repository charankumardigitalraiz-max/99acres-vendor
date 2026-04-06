import { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, Search, Menu, ChevronDown, User, Shield, LogOut, Settings, Calendar, MapPin, Users, Building2, CreditCard } from 'lucide-react';
import { clearNotifications } from '../../features/ui/uiSlice';
import { adminProfile } from '../../data/mockData';
import Modal from '../ui/Modal';
import Avatar from '../ui/Avatar';

const routeLabels = {
  '/': 'Dashboard',
  '/subscriptions': 'Subscription Plans',
  '/users': 'Users',
  '/subscribers': 'Subscribers',
  '/products': 'Properties',
  '/reports': 'Reports',
  '/profile': 'Admin Profile',
};

export default function Topbar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const notifications = useSelector(s => s.ui.notifications);
  const collapsed = useSelector(s => s.ui.sidebarCollapsed);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  // Sample Notifications Data
  const sampleNotifications = [
    { id: 1, type: 'user', title: 'New User Signup', desc: 'Rahul Sharma joined the platform', time: '2m ago' },
    { id: 2, type: 'property', title: 'Approval Required', desc: 'New villa listing in Palm Springs', time: '15m ago' },
    { id: 3, type: 'billing', title: 'Payment Received', desc: 'Subscription upgrade: Pro Plan', time: '1h ago' },
    { id: 4, type: 'report', title: 'System Alert', desc: 'Monthly report is ready for review', time: '5h ago' },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileModalOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    if (isProfileModalOpen || isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileModalOpen, isNotificationsOpen]);

  const pageTitle = routeLabels[location.pathname] || 'Admin';

  return (
    <header
      className={`fixed top-0 right-0 z-20 bg-white border-b border-slate-200 flex items-center justify-between h-14 px-5 transition-all duration-300 ${collapsed ? 'left-16' : 'left-56'}`}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-sm font-semibold text-slate-800">Seller</h1>
          <p className="text-2xs text-slate-400">Sherla Properties Vendor Panel</p>
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-xs mx-6 hidden md:block">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Quick search..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`relative p-2 rounded-lg transition-all duration-200 ${isNotificationsOpen ? 'bg-primary/10 text-primary shadow-sm' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-700'}`}
          >
            <Bell size={16} />
            {notifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-primary rounded-full text-white text-[9px] flex items-center justify-center font-bold border-2 border-white">
                {notifications}
              </span>
            )}
          </button>

          {/* Smart Notification Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute top-[calc(100%+8px)] right-0 w-[19rem] bg-white rounded-2xl shadow-xl border border-slate-200 z-50 animate-scale-in overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-xs font-bold text-slate-800">Notifications</h3>
                <button
                  onClick={() => {
                    dispatch(clearNotifications());
                    setIsNotificationsOpen(false);
                  }}
                  className="text-[10px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
                >
                  Mark all as read
                </button>
              </div>

              <div className="max-h-[22rem] overflow-y-auto divide-y divide-border/60">
                {sampleNotifications.map((n) => (
                  <div key={n.id} className="p-3.5 hover:bg-slate-50/80 transition-colors group cursor-pointer">
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${n.type === 'user' ? 'bg-blue-50 text-blue-500' :
                        n.type === 'property' ? 'bg-amber-50 text-amber-500' :
                          n.type === 'billing' ? 'bg-emerald-50 text-emerald-500' :
                            'bg-slate-50 text-slate-500'
                        }`}>
                        {n.type === 'user' ? <Users size={14} /> :
                          n.type === 'property' ? <Building2 size={14} /> :
                            n.type === 'billing' ? <CreditCard size={14} /> :
                              <Bell size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-[11px] font-bold text-slate-800 truncate">{n.title}</p>
                          <span className="text-[9px] font-medium text-slate-400 flex-shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">{n.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-border mt-auto">
                <Link
                  to="/reports"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="flex items-center justify-center w-full py-2 rounded-lg text-[10px] font-bold text-slate-500 hover:text-primary hover:bg-primary/5 transition-all uppercase tracking-widest"
                >
                  View All Activity
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-border mx-1" />

        {/* Admin Profile Section - Relative for Smart Positioning */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileModalOpen(!isProfileModalOpen)}
            className="flex items-center gap-2 py-1.5 px-2.5 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-border"
          >
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-sm">
              <span className="text-white text-2xs font-semibold">{adminProfile.avatar}</span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-700 leading-tight">{adminProfile.name}</p>
              <p className="text-[10px] text-slate-400 leading-tight font-medium uppercase tracking-wider">Seller</p>
            </div>
            <ChevronDown size={12} className={`text-slate-400 hidden md:block transition-transform duration-200 ${isProfileModalOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Smart Positioned Dropdown Modal */}
          {isProfileModalOpen && (
            <div className="absolute top-[calc(100%+8px)] right-0 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 animate-scale-in p-1 overflow-hidden">
              <div className="p-4 space-y-5">
                {/* 1. Profile header */}
                <div className="bg-slate-50 rounded-xl p-4 border border-border flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    <Avatar initials={adminProfile.avatar} size="lg" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">{adminProfile.name}</h3>
                  <p className="text-[11px] text-slate-500">{adminProfile.email}</p>
                  <div className="flex items-center gap-1.5 mt-3 bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/10">
                    <Shield size={11} className="flex-shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Seller</span>
                  </div>
                </div>

                {/* 2. Quick Details */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white p-2.5 rounded-xl border border-border/60">
                    <div className="flex items-center gap-1.5 mb-1">
                      <MapPin size={10} className="text-slate-400" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Dept</span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-700 truncate">Platform</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-border/60">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Calendar size={10} className="text-slate-400" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Joined</span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-700">Jan 2023</p>
                  </div>
                </div>

                {/* 3. Actions */}
                <div className="space-y-1">
                  {[
                    { icon: User, label: 'Full Profile View', path: '/profile' },
                    { icon: Settings, label: 'Account Preferences', path: '/profile' },
                    { icon: Shield, label: 'Security & Privacy', path: '/profile' },
                  ].map(({ icon: Icon, label, path }) => (
                    <Link
                      key={label}
                      to={path}
                      onClick={() => setIsProfileModalOpen(false)}
                      className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-slate-50 transition-colors group border border-transparent hover:border-border"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                          <Icon size={13} />
                        </div>
                        <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900">{label}</span>
                      </div>
                      <ChevronDown size={12} className="text-slate-300 -rotate-90 group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>

                {/* 4. Logout */}
                <div className="pt-1">
                  <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-rose-50 text-rose-600 font-bold text-xs hover:bg-rose-100 transition-colors border border-rose-100 shadow-sm shadow-rose-100/30">
                    <LogOut size={14} />
                    Logout
                  </button>
                  <p className="text-[9px] text-center text-slate-400 mt-2 italic">Session ends: 15:42 Today</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
