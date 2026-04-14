import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../features/ui/uiSlice';
import {
  LayoutDashboard, CreditCard, Users, Star,
  Building2, BarChart3, MessageCircle, MessageSquare, MessageSquareText, UserCircle, ChevronLeft,
  ChevronRight, Home, ShieldCheck, UserCog, Users2, Headset, Store, ShoppingCart, Image as ImageIcon
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },

  { path: '/subscriptions', label: 'Subscription Plans', icon: CreditCard },
  // {
  //   path: '/customers', label: 'Customers', icon: Users,
  //   children: [
  //     // { path: '/customers/agent', label: 'Agent', icon: Headset },     // support / intermediary
  //     { path: '/customers/seller', label: 'Seller', icon: Store },     // selling entity
  //     { path: '/customers/buyer', label: 'Buyer', icon: ShoppingCart } // purchasing
  //   ]
  // },

  // { path: '/subscribers', label: 'Subscribers', icon: Star },

  // { path: '/categories', label: 'Categories', icon: Users },

  { path: '/products', label: 'Properties', icon: Building2 },

  // { path: '/reports', label: 'Reports', icon: BarChart3 },
  // { path: '/banners', label: 'Banners', icon: ImageIcon },
  // { path: '/transactions', label: 'Transactions', icon: CreditCard },
  // { path: '/chats', label: 'Chats', icon: MessageSquare },


  {
    label: 'Staff',
    icon: Users2,
    children: [
      { path: '/staff/roles', label: 'Roles', icon: ShieldCheck },
      { path: '/staff/members', label: 'Members', icon: UserCog },
    ]
  },
  // ✅ New Sections
  { path: '/support', label: 'Support', icon: MessageCircle },

  // { path: '/reviews', label: 'Reviews', icon: MessageSquareText },



];
const SidebarItem = ({ item, collapsed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const Icon = item.icon;
  const hasChildren = !!item.children;
  const isChildrenActive = hasChildren && item.children.some(child => location.pathname.startsWith(child.path));

  useEffect(() => {
    if (isChildrenActive && !collapsed) {
      setIsOpen(true);
    }
  }, [isChildrenActive, collapsed]);

  if (!hasChildren) {
    return (
      <NavLink
        to={item.path}
        end={item.path === '/'}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer relative overflow-hidden group ${isActive
            ? 'bg-primary text-white shadow-md shadow-primary/20'
            : 'text-slate-500 hover:bg-primary/5 hover:text-primary'
          } ${collapsed ? 'justify-center px-0' : ''}`
        }
        title={collapsed ? item.label : ''}
      >
        <Icon size={18} className="flex-shrink-0 relative z-10" />
        {!collapsed && <span className="relative z-10">{item.label}</span>}
      </NavLink>
    );
  }

  // Header (parent item with children)
  return (
    <div className="flex flex-col gap-1 w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer w-full relative ${isChildrenActive
          ? 'bg-primary text-white shadow-md shadow-primary/20'
          : isOpen
            ? 'bg-slate-50 text-slate-900 border border-slate-100 shadow-sm'
            : 'text-slate-500 hover:bg-primary/5 hover:text-primary border border-transparent'
          } ${collapsed ? 'justify-center px-0' : ''}`}
        title={collapsed ? item.label : ''}
      >
        <Icon size={18} className={`flex-shrink-0 ${isChildrenActive ? 'text-white' : 'text-slate-500 group-hover:text-primary'}`} />
        {!collapsed && (
          <>
            <span className="flex-1 text-left font-medium">{item.label}</span>
            <ChevronRight
              size={16}
              className={`transition-transform duration-200 flex-shrink-0 ${isChildrenActive ? 'text-white/80' : 'text-slate-400'} ${isOpen ? 'rotate-90' : ''}`}
            />
          </>
        )}
      </button>

      {!collapsed && (
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="flex flex-col gap-1 pl-11 pr-2 relative before:absolute before:left-[21px] before:top-0 before:-bottom-2 before:w-px before:bg-slate-100">
            {item.children.map(child => {
              const ChildIcon = child.icon;
              return (
                <NavLink
                  key={child.path}
                  to={child.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 relative ${isActive
                      ? 'text-white bg-primary shadow-md shadow-primary/20'
                      : 'text-slate-500 hover:text-primary hover:bg-primary/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <ChildIcon size={16} className={`flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                      <span>{child.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Sidebar() {
  const dispatch = useDispatch();
  const collapsed = useSelector(s => s.ui.sidebarCollapsed);

  return (
    <aside
      className={`bg-white flex flex-col fixed top-0 left-0 h-full z-30 border-r border-slate-200 transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-4 py-4 border-b border-slate-100 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-lg  flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary/20">
          <img src="/sherla-properties-text.png" alt="logo" className="w-15 h-15" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-slate-900 font-semibold text-sm leading-tight">Sherla Properties</p>
            <p className="text-slate-500 text-2xs leading-tight">Vendor Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <p className="text-2xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2">Main Menu</p>
        )}
        {navItems.map((item, index) => (
          <SidebarItem key={item.path || index} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-2 pb-4">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all duration-150 text-xs"
        >
          {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
