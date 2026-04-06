import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Check, X, ShieldCheck, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';

const planColors = {
  Basic: { badge: 'slate', ring: 'ring-slate-200', activeBg: 'bg-slate-700', light: 'bg-slate-50' },
  Standard: { badge: 'amber', ring: 'ring-primary/30', activeBg: 'bg-primary', light: 'bg-amber-50' },
  Premium: { badge: 'blue', ring: 'ring-dark-500/30', activeBg: 'bg-dark-500', light: 'bg-slate-800' },
};

export default function SubscriptionPlans() {
  const { sellerPlans, billingCycle } = useSelector(s => s.subscriptions);
  const { allTransactions } = useSelector(s => s.dashboard);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(allTransactions.length / itemsPerPage);
  const paginatedTransactions = allTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const plans = sellerPlans;

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex xl:flex-row xl:items-center justify-between gap-8 mb-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            <span className="text-primary/80">Subscriptions</span>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span>Plan Settings</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Subscription Plans</h2>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map(plan => {
          const pc = planColors[plan.name.includes('Premium') ? 'Premium' : plan.name.includes('Standard') ? 'Standard' : 'Basic'];
          const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
          const isPopular = plan.popular;

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-[2.5rem] relative flex flex-col transition-all duration-500 border overflow-hidden group p-8 ${isPopular
                ? 'border-primary/40 shadow-2xl shadow-primary/5 ring-1 ring-primary/20 pt-16'
                : 'border-slate-100 shadow-sm hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/40'
                } ${plan.status === 'inactive' ? 'hidden' : ''}`}
            >
              {isPopular && (
                <div className="absolute top-0 left-0">
                  <div className="bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em] px-8 py-2.5 rounded-br-2xl shadow-xl animate-in slide-in-from-left-4 duration-500">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-10">
                <div className="flex justify-between items-start mb-6 pr-12">
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{plan.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Entity Analytics Package</p>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-primary/40 tracking-tighter">₹</span>
                  <span className="text-5xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">
                    {price.toLocaleString()}
                  </span>
                  <div className="flex flex-col ml-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">/ {billingCycle}</span>
                    <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Verified Rate</span>
                  </div>
                </div>

                {billingCycle === 'annual' && (
                  <div className="inline-flex items-center gap-2 mt-6 px-4 py-1.5 bg-emerald-50/50 text-emerald-600 rounded-xl border border-emerald-100/50 shadow-sm backdrop-blur-sm">
                    <Check size={10} strokeWidth={4} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Efficiency Savings: ₹{(plan.monthlyPrice * 12 - plan.annualPrice).toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4 mb-5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                  Service Portfolio
                  <div className="h-px flex-1 bg-slate-100" />
                </p>

                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-4 group/item">
                    <div className="w-5 h-5 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform shadow-sm">
                      <Check size={10} className="text-emerald-600" strokeWidth={4} />
                    </div>
                    <span className="text-xs font-bold text-slate-600 leading-tight group-hover/item:text-slate-900 transition-colors">{f}</span>
                  </div>
                ))}

                {plan.notIncluded?.map((f, i) => (
                  <div key={i} className="flex items-start gap-4 opacity-40 grayscale group/item hover:opacity-100 hover:grayscale-0 transition-all">
                    <div className="w-5 h-5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:rotate-12 transition-transform">
                      <X size={10} className="text-slate-400" strokeWidth={4} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 line-through leading-tight group-hover/item:text-slate-800 group-hover/item:no-underline transition-all">{f}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={() => setSelectedPlan(plan)}
                disabled={plan.name === 'Standard Seller'}
                className={`w-full py-5 rounded-[1.5rem] bg-primary text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${plan.name === 'Standard Seller'
                  ? 'bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed shadow-inner'
                  : isPopular
                    ? 'bg-primary text-white shadow-xl shadow-primary/30 hover:bg-slate-900 border-none'
                    : 'bg-primary text-white border border-slate-200 hover:border-primary/30  shadow-sm hover:shadow-md'
                  }`}
              >
                {plan.name === 'Standard Seller' ? (
                  <>
                    <ShieldCheck size={14} className="text-primary" /> Active Subscription
                  </>
                ) : (
                  <>
                    <Zap size={14} className={isPopular ? 'text-amber-300' : 'text-primary'} />
                    {price > 0 ? 'Secure This Plan' : 'Get Started'}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Subscription History Ledger */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-12" id='history'>
        <div className="px-8 py-6 bg-white border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">Subscription Ledger</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Complete Transaction History</p>
            </div>
          </div>
          {/* <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-emerald-100 shadow-sm">
            Real-time Audit
          </div> */}
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr className="bg-slate-50/20 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Transaction ID</th>
                {/* <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Customer</th> */}
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Plan Type</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">AmountPaid</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedTransactions.map(txn => (
                <tr key={txn.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 text-[10px] font-bold text-slate-400 font-mono tracking-tighter">{txn.id}</td>
                  {/* <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800">{txn.user}</span>
                      <span className="text-[9px] text-slate-400">{txn.email}</span>
                    </div>
                  </td> */}
                  <td className="px-8 py-5">
                    <span className="text-xs font-medium text-slate-600">{txn.type}</span>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-900 tabular-nums">{txn.amount}</td>
                  <td className="px-8 py-5">
                    <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border shadow-sm ${txn.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      txn.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center text-[10px] font-bold text-slate-400 tabular-nums">{txn.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Showing <span className="text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-slate-700">{Math.min(currentPage * itemsPerPage, allTransactions.length)}</span> of <span className="text-slate-700">{allTransactions.length}</span> entries
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
      </div>

      {/* Checkout Confirmation Modal */}
      <Modal
        isOpen={!!selectedPlan}
        onClose={() => !isProcessing && setSelectedPlan(null)}
        title="Secure Checkout"
        size="lg"
      >
        {selectedPlan && (
          <div className="space-y-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Plan Selected</p>
                  <h4 className="text-xl font-bold text-slate-900 tracking-tight">{selectedPlan.name}</h4>
                </div>
                <Badge variant={selectedPlan.popular ? 'primary' : 'slate'}>
                  {billingCycle} billing
                </Badge>
              </div>

              <div className="flex items-baseline gap-2 pb-6 border-b border-slate-200/50">
                <span className="text-4xl font-black text-slate-900 tabular-nums">
                  ₹{(billingCycle === 'annual' ? selectedPlan.annualPrice : selectedPlan.monthlyPrice).toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ total amount</span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tax & Fees</span>
                  <span className="text-[10px] font-black text-slate-900 italic uppercase">Included</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Instantly</span>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified</span>
                </div>
              </div>
            </div>

            {/* Plan Benefits Summary */}
            <div className="px-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                Package Benefits
                <div className="h-px flex-1 bg-slate-100" />
              </p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {selectedPlan.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={10} className="text-emerald-600" strokeWidth={3} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 leading-tight">{f}</span>
                  </div>
                ))}
                {selectedPlan.notIncluded?.map((f, i) => (
                  <div key={i} className="flex items-start gap-3 opacity-40">
                    <div className="w-5 h-5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X size={10} className="text-slate-300" strokeWidth={3} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 line-through leading-tight">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                <ShieldCheck size={20} className="text-primary" />
              </div>
              <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
                By completing this purchase, you authorize Sherla Properties to activate the <strong>{selectedPlan.name}</strong> on your vendor dashboard. All transactions are secured via enterprise-grade 256-bit encryption.
              </p>
            </div>

            <button
              onClick={() => {
                setIsProcessing(true);
                setTimeout(() => {
                  setIsProcessing(false);
                  setSelectedPlan(null);
                  alert('Subscription Activated Successfully!');
                }, 2000);
              }}
              disabled={isProcessing}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-primary transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-wait"
            >
              {isProcessing ? 'Verifying Transaction...' : 'Confirm & Activate Plan'}
            </button>

            <p className="text-[9px] text-center font-bold text-slate-400 uppercase tracking-widest">
              Secured by SherlaPay Gateway
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
