import { Link } from 'react-router-dom';
// import { reviewsData } from '../data/mockData';
import StatCard from '../components/ui/StatCard';
import Avatar from '../components/ui/Avatar';
import { Plus, Search, Filter, Pencil, Trash2, X, Star, MessageSquare, Shield, CheckCircle, XCircle, AlertCircle, ChevronDown, Download, ExternalLink, Flag } from 'lucide-react';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import { useSelector, useDispatch } from 'react-redux';
import { setStatusFilter, setPropertyFilter, selectFilteredReviews } from '../features/reviews/reviewSlice';

export default function Reviews() {
  const dispatch = useDispatch();
  const reviews = useSelector(selectFilteredReviews);
  const { statusFilter, propertyFilter } = useSelector((state) => state.reviews);
  const properties = useSelector((state) => state.products.list);

  const stats = [
    { id: 1, label: 'Total Reviews', value: '1,248', change: '+12%', trend: 'up', icon: 'chart', color: 'blue' },
    { id: 2, label: 'Avg Rating', value: '4.7', change: '+0.2', trend: 'up', icon: 'star', color: 'amber' },
    { id: 3, label: 'Pending Approval', value: '42', change: '-5', trend: 'down', icon: 'chart', color: 'purple' },
    { id: 4, label: 'Flagged Content', value: '3', change: '-2', trend: 'down', icon: 'chart', color: 'green' },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            <span className="text-primary/80">Feedback</span>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span>Reviews</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">User Reviews</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
            <Download size={14} className="text-primary" /> Download Report
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all shadow-md active:scale-95">
            Moderation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <div key={stat.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm group hover:border-primary/30 transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform`}>
                <Star size={16} />
              </div>
              <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 shadow-sm">
                {stat.change}
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-xl font-bold text-slate-900 tabular-nums leading-none tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 bg-white border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-[0.3em] flex items-center gap-3">
              Customer Reviews
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white border border-slate-200 shadow-sm">
              <Star size={14} className="text-amber-500 fill-amber-500" />
              <span className="text-[11px] font-bold text-slate-700">4.7 Rating</span>
            </div>

            <div className="flex items-center gap-4 bg-slate-100/30 px-3 py-1.5 rounded-xl border border-slate-200/50">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-400" />
                <Select
                  value={propertyFilter}
                  onChange={(e) => dispatch(setPropertyFilter(e.target.value))}
                  options={[
                    { value: 'All', label: 'All Properties' },
                    ...properties.map(p => ({ value: p.id, label: p.title }))
                  ]}
                  placeholder={null}
                  containerClassName="!gap-0"
                  className="!bg-transparent !border-none !ring-0 !py-1 !px-2 !text-[10px] !w-auto min-w-[140px]"
                />
              </div>

              <div className="w-px h-6 bg-slate-200/60" />

              <Select
                value={statusFilter}
                onChange={(e) => dispatch(setStatusFilter(e.target.value))}
                options={['All Status', 'Approved', 'Pending', 'Flagged']}
                placeholder={null}
                containerClassName="!gap-0"
                className="!bg-transparent !border-none !ring-0 !py-1 !px-2 !text-[10px] !w-auto min-w-[120px]"
              />
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {reviews.map((review) => (
            <div key={review.id} className="p-8 hover:bg-slate-50/50 transition-colors group">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
                <div className="flex items-start gap-6 flex-1">
                  <Avatar name={review.user} size="lg" className="ring-4 ring-slate-50 shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{review.user}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest tabular-nums">{review.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className={i < review.rating ? 'fill-amber-500' : 'text-slate-100'} />
                      ))}
                    </div>
                    <p className="mt-4 text-sm font-medium text-slate-600 leading-relaxed max-w-3xl">
                      "{review.comment}"
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-4">
                      <Link
                        to={`/products/${review.propertyId}`}
                        className="flex items-center gap-2.5 bg-slate-50 text-slate-600 hover:bg-white hover:shadow-md px-4 py-2 rounded-lg transition-all border border-slate-100 group/link"
                      >
                        <Shield size={14} className="text-primary/60" />
                        <span className="text-[10px] font-bold uppercase tracking-widest truncate max-w-[200px]">Property: {review.property}</span>
                        <ExternalLink size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      </Link>
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${review.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        review.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                        {review.status}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-col items-center gap-3 w-full lg:w-auto">
                  {/* <button className="flex-1 lg:flex-none w-10 h-10 flex items-center justify-center bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-100 hover:shadow-md rounded-xl transition-all active:scale-90" title="Approve">
                    <CheckCircle size={20} />
                  </button> */}
                  <button className="flex-1 lg:flex-none btn-action btn-action-reject" title="Delete">
                    <Trash2 size={14} />
                  </button>
                  <button className="flex-1 lg:flex-none btn-action btn-action-edit" title="Flag">
                    <Flag size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-8 bg-slate-50/80 border-t border-slate-200 flex items-center justify-center">
          <button className="px-10 py-3.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
            Load More
          </button>
        </div>
      </div>
    </div>
  );
}
