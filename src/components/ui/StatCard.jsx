import { TrendingUp, TrendingDown, Users, Star, Building2, IndianRupee, BarChart3, MessageCircle, UserCog } from 'lucide-react';

const iconMap = {
  users: Users,
  star: Star,
  building: Building2,
  rupee: IndianRupee,
  chart: BarChart3,
  message: MessageCircle,
  staff: UserCog,
  'trending-up': TrendingUp,
};

const colorMap = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-500', border: 'border-blue-100' },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-500', border: 'border-amber-100' },
  green: { bg: 'bg-emerald-50', icon: 'text-emerald-500', border: 'border-emerald-100' },
  purple: { bg: 'bg-violet-50', icon: 'text-violet-500', border: 'border-violet-100' },
  rose: { bg: 'bg-rose-50', icon: 'text-rose-500', border: 'border-rose-100' },
};

export default function StatCard({ label, value, change, trend, icon, color = 'blue' }) {
  const Icon = iconMap[icon] || BarChart3;
  const colors = colorMap[color];
  const isUp = trend === 'up';

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-primary/30 transition-all cursor-pointer group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{label}</p>
          <p className="text-xl font-bold text-slate-900 leading-none">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon size={16} className={colors.icon} />
        </div>
      </div>
      {change && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-50">
          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md ${isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'} text-[10px] font-bold`}>
            {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            <span>{change}</span>
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">vs baseline</span>
        </div>
      )}
    </div>
  );
}
