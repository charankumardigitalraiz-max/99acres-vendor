import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { supportTickets } from '../data/mockData';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import {
  ArrowLeft, Mail, Phone, Clock, AlertCircle,
  CheckCircle2, MessageSquare, Send, User,
  Shield, Calendar, MoreVertical, Edit2
} from 'lucide-react';

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reply, setReply] = useState('');

  const ticket = supportTickets.find(t => t.id === id);

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-border mt-10">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={32} className="text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Ticket not found</h2>
        <p className="text-slate-500 mt-1">The support ticket you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/support')} className="mt-6 btn-secondary">
          <ArrowLeft size={14} /> Back to Support
        </button>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Medium': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Low': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open': return <AlertCircle size={14} className="text-blue-500" />;
      case 'In Progress': return <Clock size={14} className="text-amber-500" />;
      case 'Closed': return <CheckCircle2 size={14} className="text-emerald-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 -m-4 lg:-m-6 px-4 lg:px-6">
      {/* Immersive Header Section */}
      <div className="relative h-[240px] bg-slate-900 border-b border-white/5 -mx-4 lg:-mx-6 mb-[-100px] z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center pb-20 pt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/support')}
                className="p-3 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl text-white transition-all active:scale-95 group shrink-0"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-none truncate">{ticket.id}</h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border shrink-0 ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority} Priority
                  </span>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium truncate">{ticket.subject}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="flex-1 sm:flex-initial px-4 sm:px-5 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                <Edit2 size={14} /> <span className="sm:inline">Edit</span>
              </button>
              <button className="flex-1 sm:flex-initial px-4 sm:px-6 py-3 bg-primary text-white rounded-2xl text-[9px] sm:text-[10px] font-bold uppercase tracking-widest shadow-2xl shadow-primary/40 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 active:scale-95 font-bold">
                <CheckCircle2 size={14} /> <span className="sm:inline">Resolve</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Main Content Area (LHS) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Ticket Description */}
            <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 border border-white shadow-xl shadow-slate-200/40">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                <Shield size={14} className="text-primary" /> Description
              </h3>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium bg-slate-50/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100">
                {ticket.description}
              </p>
            </div>

            {/* Conversation/Timeline */}
            <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 border border-white shadow-xl shadow-slate-200/40">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                <MessageSquare size={14} className="text-primary" /> Activity
              </h3>

              <div className="space-y-8 relative before:absolute before:left-5 sm:before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {ticket.messages.map((msg, idx) => (
                  <div key={idx} className={`relative pl-12 sm:pl-14`}>
                    <div className="absolute left-0 top-0 ring-[6px] sm:ring-[8px] ring-white">
                      <Avatar name={msg.sender} size="sm" className="sm:w-12 sm:h-12 shadow-lg" />
                    </div>
                    <div className={`p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border transition-all ${msg.role === 'admin'
                        ? 'bg-slate-900 text-white border-slate-800 shadow-xl shadow-slate-900/10'
                        : 'bg-white text-slate-700 border-slate-100'
                      }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 sm:mb-3 gap-1 sm:gap-0">
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest truncate">
                          {msg.sender} {msg.role === 'admin' && <span className="text-primary ml-1">• Admin</span>}
                        </span>
                        <span className="text-[9px] sm:text-[10px] opacity-40 font-bold uppercase tracking-tighter shrink-0">
                          {msg.time}
                        </span>
                      </div>
                      <p className="text-[13px] sm:text-sm leading-relaxed font-medium opacity-90">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <Avatar name="Admin" size="md" className="hidden sm:block shrink-0 shadow-lg ring-4 ring-white" />
                <div className="flex-1 w-full relative group">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your response to the user..."
                    className="form-input w-full min-h-[120px] p-6 rounded-[2rem] border-slate-200 focus:border-primary focus:ring-primary/5 transition-all text-sm font-medium pr-16"
                  />
                  <button
                    className="absolute bottom-4 right-4 p-3 bg-primary text-white rounded-2xl shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    disabled={!reply.trim()}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area (RHS) */}
          <div className="lg:col-span-4 space-y-6">
            {/* User Details */}
            <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 border border-white shadow-xl shadow-slate-200/40 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />

              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                <User size={14} className="text-primary" /> User Details
              </h3>

              <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
                <Avatar name={ticket.user} size="xl" className="sm:size-2xl mb-4 ring-8 ring-slate-50" />
                <h4 className="text-lg sm:text-xl font-bold text-slate-900 leading-none mb-1">{ticket.user}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Premium Member</p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-100 hover:bg-white hover:border-primary hover:shadow-lg transition-all cursor-pointer group">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-0.5 sm:mb-1">Email Address</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2 truncate">
                    <Mail size={12} className="text-primary shrink-0" /> <span className="truncate">{ticket.email}</span>
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-100 hover:bg-white hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer group">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-0.5 sm:mb-1">Phone Number</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Phone size={12} className="text-amber-500 shrink-0" /> {ticket.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Ticket Metadata */}
            <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 border border-white shadow-xl shadow-slate-200/40">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                <Clock size={14} className="text-primary" /> Details
              </h3>

              <div className="space-y-6">
                {[
                  { label: 'Date Submitted', value: ticket.date, icon: Calendar, color: 'blue' },
                  { label: 'Status', value: ticket.status, icon: () => getStatusIcon(ticket.status), color: 'amber' },
                  { label: 'Category', value: ticket.category, icon: Shield, color: 'purple' },
                  { label: 'Response Time', value: '2 hours', icon: Clock, color: 'rose' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600`}>
                      {typeof item.icon === 'function' ? item.icon() : <item.icon size={16} />}
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                      <p className="text-sm font-bold text-slate-900">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
