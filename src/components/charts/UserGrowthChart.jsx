import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-border rounded-lg shadow-card p-3 text-xs">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: <span className="font-medium">{p.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function UserGrowthChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={190}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="users" name="Total Users" stroke="#2E353A" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        <Line type="monotone" dataKey="newUsers" name="New Users" stroke="#F59E0B" strokeWidth={2} strokeDasharray="4 2" dot={false} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
