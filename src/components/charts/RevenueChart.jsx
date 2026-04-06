import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-border rounded-lg shadow-card p-3 text-xs">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: p.color }} />
            {p.name}: <span className="font-medium">₹{(p.value / 100000).toFixed(2)}L</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}K`} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#F59E0B"
          strokeWidth={2}
          fill="url(#colorRevenue)"
          dot={{ r: 3, fill: '#F59E0B', strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#F59E0B' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
