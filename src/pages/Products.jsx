import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  setSearch, setTypeFilter, setStatusFilter, setCityFilter,
  setPage, setSelectedProperty, updatePropertyStatus, selectFilteredProperties
} from '../features/products/productsSlice';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import { Search, Filter, Download, ChevronLeft, ChevronRight, Eye, CheckCircle, XCircle, Building2, MapPin, Clock, TrendingUp } from 'lucide-react';

const types = [
  { label: 'All Types', value: '' },
  { label: 'Villas', value: 'villas' },
  { label: 'Home', value: 'home' },
  { label: 'Plots', value: 'plots' },
  { label: 'Flats', value: 'flats' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Independent House', value: 'independent house' },
  { label: 'Apartments', value: 'Appartments' },
  { label: 'Lands', value: 'Lands' },
  { label: 'Other', value: 'other' },
];
const statuses = [
  { label: 'All Statuses', value: '' },
  { label: 'New', value: 'new' },
  { label: 'Processing', value: 'processing' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Verified', value: 'verified' },
  { label: 'Draft', value: 'draft' },
];
const cities = [
  { label: 'All Cities', value: '' },
  { label: 'Mumbai', value: 'Mumbai' },
  { label: 'Bangalore', value: 'Bangalore' },
  { label: 'Delhi NCR', value: 'Delhi NCR' },
  { label: 'Hyderabad', value: 'Hyderabad' },
  { label: 'Chennai', value: 'Chennai' },
];

const typeVariants = {
  Villas: 'green',
  Flats: 'violet',
  Plots: 'amber',
  Commercial: 'rose',
  'Independent House': 'indigo',
  Apartments: 'sky',
  Land: 'orange',
  other: 'slate',
};

export default function Products() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { searchQuery, typeFilter, statusFilter, cityFilter, currentPage, pageSize } = useSelector(s => s.products);
  const filtered = useSelector(selectFilteredProperties);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const counts = {
    all: filtered.length,
    new: filtered.filter(p => p.status?.toLowerCase() === 'new').length,
    processing: filtered.filter(p => p.status?.toLowerCase() === 'processing').length,
    rejected: filtered.filter(p => p.status?.toLowerCase() === 'rejected').length,
    verified: filtered.filter(p => p.status?.toLowerCase() === 'verified').length,
    draft: filtered.filter(p => p.status?.toLowerCase() === 'draft').length,
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1.5">
            <span>Admin</span>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span className="text-primary/80">Properties</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Property Management</h2>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:shadow-sm transition-all active:scale-95 shadow-sm">
          <Download size={14} className="text-primary" /> Export Data
        </button>
      </div>

      {/* Premium KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Properties', value: counts.all, icon: Building2, color: 'slate' },
          { label: 'New', value: counts.new, icon: TrendingUp, color: 'blue' },
          { label: 'Processing', value: counts.processing, icon: Clock, color: 'amber' },
          { label: 'Verified', value: counts.verified, icon: CheckCircle, color: 'emerald' },
          { label: 'Rejected', value: counts.rejected, icon: XCircle, color: 'rose' },
          { label: 'Draft', value: counts.draft, icon: Filter, color: 'slate' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm group hover:border-primary/30 transition-all cursor-pointer">
            <div className={`w-10 h-10 rounded-lg bg-${s.color === 'slate' ? 'slate' : s.color}-50 flex items-center justify-center text-${s.color === 'slate' ? 'slate-500' : s.color + '-600'} mb-4 group-hover:scale-110 transition-transform`}>
              <s.icon size={16} />
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{s.label}</p>
            <p className="text-xl font-bold text-slate-900 tabular-nums leading-none">{s.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Modern Filter Interface */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[280px]">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
            placeholder="Search within my properties..."
            value={searchQuery}
            onChange={e => dispatch(setSearch(e.target.value))}
          />
        </div>

        <div className="flex gap-4">
          <div className="w-40">
            <Select
              value={typeFilter}
              onChange={e => dispatch(setTypeFilter(e.target.value))}
              options={types}
            />
          </div>
          <div className="w-40">
            <Select
              value={statusFilter}
              onChange={e => dispatch(setStatusFilter(e.target.value))}
              options={statuses}
            />
          </div>
          <div className="w-40">
            <Select
              value={cityFilter}
              onChange={e => dispatch(setCityFilter(e.target.value))}
              options={cities}
            />
          </div>
        </div>
      </div>

      {/* Enhanced Property Repository Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th>Property</th>
                <th>Type</th>
                <th>Location</th>
                <th>Price</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.map(prop => (
                <tr key={prop.id} className="group hover:bg-slate-50/80 transition-all">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center p-1 group-hover:rotate-3 transition-transform overflow-hidden shadow-sm">
                        {prop.coverPhoto ? (
                          <img src={prop.coverPhoto} className="w-full h-full object-cover rounded-lg" alt="Prop" />
                        ) : (
                          <Building2 size={16} className="text-slate-300" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors mb-0.5">{prop.title}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                          #{prop.id} {prop.bedrooms && <><div className="w-1 h-1 rounded-full bg-slate-300" /> {prop.bedrooms} BHK</>}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Badge variant={typeVariants[prop.propertyType]}>
                      {prop.propertyType}
                    </Badge>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <MapPin size={10} className="text-primary/50" />
                      <span className="text-xs font-bold text-slate-600">{prop.city}</span>
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{prop.area}</p>
                  </td>
                  <td className="px-6 py-5 tabular-nums">
                    <div className="font-bold text-slate-900 text-sm">{prop.price}</div>
                    <div className="text-[8px] text-emerald-600 font-bold uppercase tracking-[0.1em] mt-1 flex items-center gap-1">
                      <TrendingUp size={8} /> Verified
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <Badge variant={
                      prop.status?.toLowerCase() === 'verified' ? 'green' :
                        prop.status?.toLowerCase() === 'processing' ? 'amber' :
                          prop.status?.toLowerCase() === 'new' ? 'blue' :
                            prop.status?.toLowerCase() === 'rejected' ? 'red' :
                              'slate'
                    } className="text-[8px] font-bold uppercase tracking-widest px-3 py-1 shadow-sm">
                      {prop.status}
                    </Badge>
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-1.5 opacity-100 transition-opacity">
                      <button
                        onClick={() => navigate(`/properties/${prop.id}`)}
                        className="btn-action btn-action-view"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-20">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Building2 size={32} className="mb-4 opacity-20" />
                      <p className="text-xs font-bold uppercase tracking-widest">No property listings found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-slate-500">
            Showing {Math.min((currentPage - 1) * pageSize + 1, filtered.length)}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => dispatch(setPage(currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => dispatch(setPage(p))}
                className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${p === currentPage ? 'bg-primary text-white' : 'hover:bg-slate-100 text-slate-600'}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => dispatch(setPage(currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
