import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-border rounded-lg shadow-card p-3 text-xs">
        <p className="font-semibold text-slate-700">{payload[0].name}</p>
        <p style={{ color: payload[0].payload.color }} className="font-medium">{payload[0].value} subscribers</p>
      </div>
    );
  }
  return null;
};

export default function SubscriptionPieChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={140} height={140}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={42}
            outerRadius={60}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex-1 space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
              <span className="text-xs text-slate-600">{d.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-800">{d.value}</span>
              <span className="text-2xs text-slate-400">{((d.value / total) * 100).toFixed(0)}%</span>
            </div>
          </div>
        ))}
        <div className="pt-1 border-t border-border flex justify-between">
          <span className="text-xs text-slate-500">Total</span>
          <span className="text-xs font-semibold text-slate-800">{total}</span>
        </div>
      </div>
    </div>
  );
}
