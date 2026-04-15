import { useState } from 'react';
import { X, CreditCard, LayoutDashboard, Landmark, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CheckoutModal({ isOpen, onClose, totalAmount, bookingDetails }) {
  const { addBooking } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('card');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  if (!isOpen) return null;

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === 'KRISHNA200') {
      setDiscount(200);
      toast.success('🎉 Coupon Applied! ₹200 off.', { theme: "dark" });
    } else {
      toast.error('Invalid coupon code.', { theme: "dark" });
      setDiscount(0);
    }
  };

  const finalAmount = Math.max(0, totalAmount - discount);

  const handlePayment = async (e) => {
    e.preventDefault();
    toast.info("Processing Payment Securely...", { theme: "dark", autoClose: 2000 });
    setTimeout(async () => {
      const confirmedBooking = await addBooking({
        ...bookingDetails,
        amountPaid: finalAmount,
        date: new Date().toISOString()
      });
      onClose();
      navigate('/confirmation', { state: { booking: confirmedBooking } });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#111] border border-red-900/40 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col md:flex-row">
        
        {/* Sidebar Tabs */}
        <div className="w-full md:w-1/3 bg-slate-900 border-r border-slate-800 p-4 space-y-2">
          <div className="flex justify-between items-center mb-6 md:hidden">
            <h2 className="text-xl font-bold text-white">Payment</h2>
            <button onClick={onClose} className="text-slate-400"><X className="h-5 w-5" /></button>
          </div>
          
          <button onClick={() => setActiveTab('card')} className={`w-full flex items-center gap-3 p-3 rounded-lg font-medium text-sm transition-colors cursor-pointer ${activeTab === 'card' ? 'bg-[#ff0033]/20 text-[#ff0033] border border-[#ff0033]/30' : 'text-slate-400 hover:bg-slate-800'}`}>
            <CreditCard className="h-5 w-5" /> Credit/Debit Card
          </button>
          <button onClick={() => setActiveTab('upi')} className={`w-full flex items-center gap-3 p-3 rounded-lg font-medium text-sm transition-colors cursor-pointer ${activeTab === 'upi' ? 'bg-[#ff0033]/20 text-[#ff0033] border border-[#ff0033]/30' : 'text-slate-400 hover:bg-slate-800'}`}>
            <LayoutDashboard className="h-5 w-5" /> UPI
          </button>
          <button onClick={() => setActiveTab('netbanking')} className={`w-full flex items-center gap-3 p-3 rounded-lg font-medium text-sm transition-colors cursor-pointer ${activeTab === 'netbanking' ? 'bg-[#ff0033]/20 text-[#ff0033] border border-[#ff0033]/30' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Landmark className="h-5 w-5" /> Net Banking
          </button>
        </div>

        {/* Content Area */}
        <div className="w-full md:w-2/3 p-6 flex flex-col justify-between relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white hidden md:block transition-colors cursor-pointer">
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex-grow">
            {activeTab === 'card' && (
              <form id="pay-form" onSubmit={handlePayment} className="space-y-4 animate-fade-in pt-2">
                <h3 className="text-lg font-bold text-white mb-4">Enter Card Details</h3>
                <input required type="text" placeholder="Card Number" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]" />
                <div className="flex gap-4">
                  <input required type="text" placeholder="MM/YY" className="w-1/2 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]" />
                  <input required type="text" placeholder="CVV" className="w-1/2 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]" />
                </div>
                <input required type="text" placeholder="Cardholder Name" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]" />
              </form>
            )}

            {activeTab === 'upi' && (
              <form id="pay-form" onSubmit={handlePayment} className="space-y-6 animate-fade-in pt-2">
                <h3 className="text-lg font-bold text-white mb-4">Pay via UPI</h3>
                <input required type="text" placeholder="Enter UPI ID (e.g., name@okhdfcbank)" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]" />
                <p className="text-xs text-slate-500">A payment request will be sent to your UPI app.</p>
              </form>
            )}

            {activeTab === 'netbanking' && (
              <form id="pay-form" onSubmit={handlePayment} className="space-y-6 animate-fade-in pt-2">
                <h3 className="text-lg font-bold text-white mb-4">Select Bank</h3>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033] cursor-pointer">
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                </select>
                <p className="text-xs text-slate-500">You will be redirected to your bank's secure portal.</p>
              </form>
            )}

            {/* Coupon Section */}
            <div className="mt-8 border-t border-slate-800 pt-6">
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={coupon}
                   onChange={(e) => setCoupon(e.target.value)}
                   placeholder="Have a promo code?" 
                   className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ff0033] uppercase" 
                 />
                 <button type="button" onClick={handleApplyCoupon} className="bg-slate-800 hover:bg-slate-700 text-white px-4 rounded-lg font-semibold transition-colors cursor-pointer">
                   Apply
                 </button>
               </div>
               {discount > 0 && <p className="text-green-500 text-xs font-bold mt-2 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> KRISHNA200 matched! Saved ₹200.</p>}
            </div>
          </div>

          <div className="mt-6 pt-4">
             <button form="pay-form" type="submit" className="w-full bg-[#ff0033] hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-transform hover:scale-105 shadow-xl shadow-red-900/30 flex justify-between px-6 items-center cursor-pointer">
               <span>Pay Securely</span>
               <span className="text-xl">₹{finalAmount}</span>
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
