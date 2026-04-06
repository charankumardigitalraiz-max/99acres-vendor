import { useState } from 'react';
import {
    Search, Download, CreditCard, ArrowUpRight, Clock,
    CheckCircle2, XCircle, AlertCircle, ChevronLeft, ChevronRight, Eye
} from 'lucide-react';
import { transactionsData } from '../data/mockData';
import Modal from '../components/ui/Modal';

const statusColors = {
    Completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Pending: 'bg-amber-50 text-amber-600 border-amber-100',
    Failed: 'bg-rose-50 text-rose-600 border-rose-100',
};

const statusIcons = {
    Completed: <CheckCircle2 size={12} />,
    Pending: <Clock size={12} />,
    Failed: <XCircle size={12} />,
};

export default function Transactions() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTxn, setSelectedTxn] = useState(null);
    const itemsPerPage = 8;

    // Calculation Helpers
    const parseAmount = (amt) => Number(amt.replace(/[^0-9.-]+/g, ""));

    const completedTxns = transactionsData.filter(t => t.status === 'Completed');
    const pendingTxns = transactionsData.filter(t => t.status === 'Pending');
    const totalRevenue = completedTxns.reduce((acc, t) => acc + parseAmount(t.amount), 0);
    const pendingVolume = pendingTxns.reduce((acc, t) => acc + parseAmount(t.amount), 0);
    const successRate = transactionsData.length > 0
        ? ((completedTxns.length / transactionsData.length) * 100).toFixed(1)
        : 0;

    const stats = [
        {
            label: 'Total Revenue',
            value: `₹${totalRevenue.toLocaleString()}`,
            sub: `Based on ${completedTxns.length} successful tasks`,
            icon: <ArrowUpRight size={16} />,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50'
        },
        {
            label: 'Pending Volume',
            value: `₹${pendingVolume.toLocaleString()}`,
            sub: `${pendingTxns.length} transactions in queue`,
            icon: <Clock size={16} />,
            color: 'text-amber-500',
            bg: 'bg-amber-50'
        },
        {
            label: 'Success Rate',
            value: `${successRate}%`,
            sub: `From ${transactionsData.length} total activities`,
            icon: <CreditCard size={16} />,
            color: 'text-blue-500',
            bg: 'bg-blue-50'
        },
    ];

    // Filtering & Pagination Logic
    const filteredTransactions = transactionsData.filter(txn => {
        const matchesSearch = txn.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            txn.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || txn.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusFilter = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                        <span className="text-primary/80">Financial Ledger</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        <span>Revenue Stream Control</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Transaction History</h2>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                        <Download size={14} className="text-primary" /> Export CSV
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/40">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} shadow-sm`}>
                                {stat.icon}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time</div>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-slate-900 mb-1 tabular-nums tracking-tight">{stat.value}</p>
                        <p className="text-[10px] font-bold text-slate-500">{stat.sub}</p>
                    </div>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by ID or User Name..."
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select
                        className="flex-1 md:flex-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-600 focus:outline-none"
                        value={statusFilter}
                        onChange={handleStatusFilter}
                    >
                        <option value="All">All Status</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                    </select>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/40 overflow-hidden">
                <table className="data-table w-full">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Subscription Plan</th>
                            <th>Payment Info</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedTransactions.map((txn) => (
                            <tr key={txn.id} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="w-24">
                                    <span className="text-[10px] font-bold text-slate-400 tabular-nums">#{txn.id.split('-')[1]}</span>
                                </td>

                                <td>
                                    <span className="text-xs font-bold text-slate-600">{txn.type}</span>
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                            <CreditCard size={12} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">{txn.method}</span>
                                            <span className="text-[9px] font-medium text-slate-400">{txn.date}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="text-sm font-bold text-slate-900 tabular-nums">{txn.amount}</span>
                                </td>
                                <td >
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[8px] font-bold uppercase tracking-widest shadow-sm ${statusColors[txn.status]}`}>
                                        {statusIcons[txn.status]}
                                        {txn.status}
                                    </div>
                                </td>
                                <td className="text-center">
                                    <button
                                        onClick={() => setSelectedTxn(txn)}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-all active:scale-95 mx-auto"
                                    >
                                        <Eye size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))} 
                    </tbody>
                </table>

                {/* Pagination Controls */}
                {filteredTransactions.length > 0 && (
                    <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Showing <span className="text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-slate-700">{Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</span> of <span className="text-slate-700">{filteredTransactions.length}</span> entries
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white text-slate-400 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                            >
                                <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all border ${currentPage === i + 1
                                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-primary/30 hover:text-primary'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white text-slate-400 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                            >
                                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                )}

                {filteredTransactions.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                            <AlertCircle size={24} className="text-slate-300" />
                        </div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No matching activities discovered</p>
                    </div>
                )}
            </div>

            {/* Transaction Details Modal */}
            <Modal
                isOpen={!!selectedTxn}
                onClose={() => setSelectedTxn(null)}
                title="Audit Specification"
            >
                {selectedTxn && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</span>
                                <span className="text-lg font-bold text-slate-900 tracking-tight">{selectedTxn.id}</span>
                            </div>
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest shadow-sm ${statusColors[selectedTxn.status]}`}>
                                {statusIcons[selectedTxn.status]}
                                {selectedTxn.status}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Name</span>
                                <p className="text-sm font-bold text-slate-800">{selectedTxn.user}</p>
                                <p className="text-[10px] font-medium text-slate-400">{selectedTxn.email}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount Paid</span>
                                <p className="text-xl font-black text-slate-900 tracking-tighter">{selectedTxn.amount}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subscription Plan</span>
                                <p className="text-sm font-bold text-slate-600">{selectedTxn.type}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paid Via</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-5 h-5 rounded bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                        <CreditCard size={10} />
                                    </div>
                                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{selectedTxn.method}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 space-y-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Date</span>
                            <div className="flex items-center gap-2">
                                <Clock size={12} className="text-slate-300" />
                                <p className="text-[11px] font-bold text-slate-600">{selectedTxn.date}</p>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-500 italic leading-relaxed text-center">
                                This document serves as a digital verification of financial activity.
                                All transactions are secured and encrypted.
                            </p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
