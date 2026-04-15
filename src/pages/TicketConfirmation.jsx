import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Ticket, Calendar, MapPin, Download, X, User } from 'lucide-react';
import { useState } from 'react';
import jsPDF from 'jspdf';

export default function TicketConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;
  const [showNameModal, setShowNameModal] = useState(false);
  const [fullName, setFullName] = useState('');

  const generatePDF = (name) => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pw = pdf.internal.pageSize.getWidth();

    // Dark background
    pdf.setFillColor(10, 15, 28);
    pdf.rect(0, 0, pw, 297, 'F');

    // Red header banner
    pdf.setFillColor(255, 0, 51);
    pdf.rect(0, 0, pw, 52, 'F');

    // Cinema name
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);
    pdf.setTextColor(255, 255, 255);
    pdf.text('KRISHNA CINEMAS', pw / 2, 20, { align: 'center' });

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Official Ticket Receipt', pw / 2, 31, { align: 'center' });

    pdf.setFontSize(10);
    pdf.text(`Booking ID: ${booking.bookingId}`, pw / 2, 44, { align: 'center' });

    // Dashed separator
    pdf.setDrawColor(60, 70, 90);
    pdf.setLineDashPattern([3, 3], 0);
    pdf.line(15, 60, pw - 15, 60);
    pdf.setLineDashPattern([], 0);

    // Row helper
    const row = (label, value, y) => {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(130, 145, 165);
      pdf.text(label, 20, y);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(230, 235, 245);
      pdf.text(String(value), 20, y + 7);
    };

    let y = 70;
    row('PASSENGER NAME', name.toUpperCase(), y);         y += 22;
    row('EMAIL', booking.userEmail || 'N/A', y);           y += 22;
    row('MOVIE', booking.movie.title, y);                  y += 22;
    row('THEATRE', booking.theatre.name, y);               y += 22;
    row('SHOW TIME', `Today,  ${booking.time}`, y);       y += 22;
    row('SEATS', booking.seats.map(s => s.id).join(', '), y); y += 22;
    row('CATEGORY', booking.seats[0]?.tier || 'N/A', y); y += 22;
    row('NO. OF TICKETS', `${booking.seats.length} ticket(s)`, y); y += 22;

    // Total amount box
    pdf.setFillColor(18, 24, 42);
    pdf.roundedRect(15, y, pw - 30, 24, 4, 4, 'F');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.setTextColor(130, 145, 165);
    pdf.text('TOTAL AMOUNT PAID', 22, y + 10);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(17);
    pdf.setTextColor(255, 80, 80);
    pdf.text(`Rs. ${booking.amountPaid}/-`, pw - 22, y + 14, { align: 'right' });

    y += 38;

    // Footer dashed line
    pdf.setDrawColor(60, 70, 90);
    pdf.setLineDashPattern([3, 3], 0);
    pdf.line(15, y, pw - 15, y);
    pdf.setLineDashPattern([], 0);
    y += 10;

    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(9);
    pdf.setTextColor(90, 100, 120);
    pdf.text('Thank you for choosing Krishna Cinemas! Enjoy your movie experience.', pw / 2, y, { align: 'center' });
    pdf.text('This is a system-generated receipt and does not require a signature.', pw / 2, y + 7, { align: 'center' });

    pdf.save(`KrishnaCinemas_Ticket_${booking.bookingId}.pdf`);
  };

  const handleConfirmName = (e) => {
    e.preventDefault();
    if (fullName.trim()) {
      setShowNameModal(false);
      generatePDF(fullName.trim());
      setFullName('');
    }
  };

  if (!booking) return <div className="text-white text-center py-20">No booking data found.</div>;

  return (
    <div className="w-full flex-grow p-4 md:p-12 flex items-center justify-center bg-[#0a0f1c] animate-fade-in">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative animate-slide-up">

        {/* Ticket Header */}
        <div className="bg-[#ff0033] p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
          <CheckCircle2 className="h-16 w-16 text-white mx-auto mb-4 relative z-10" />
          <h2 className="text-2xl font-black text-white uppercase tracking-widest relative z-10">Booking Confirmed</h2>
          <p className="text-red-100 font-medium tracking-wide relative z-10">Booking ID: {booking.bookingId}</p>
        </div>

        {/* Perforated Dash Separator */}
        <div className="flex justify-between items-center -mt-3 -mb-3 z-20 relative px-2">
          <div className="w-6 h-6 bg-[#0a0f1c] rounded-full border border-slate-800"></div>
          <div className="flex-grow border-t-2 border-dashed border-slate-700"></div>
          <div className="w-6 h-6 bg-[#0a0f1c] rounded-full border border-slate-800"></div>
        </div>

        {/* Ticket Details */}
        <div className="p-8 pt-6">
          <h3 className="text-3xl font-black text-white mb-6 uppercase leading-none">{booking.movie.title}</h3>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-slate-300">
              <MapPin className="h-5 w-5 text-[#ff0033]" />
              <span className="font-medium text-lg leading-tight">{booking.theatre.name}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Calendar className="h-5 w-5 text-amber-500" />
              <span className="font-medium text-lg">Today, {booking.time}</span>
            </div>
            <div className="flex items-start gap-3 text-slate-300">
              <Ticket className="h-5 w-5 text-blue-400 mt-1" />
              <div>
                <span className="font-bold text-white text-lg block">{booking.seats.length} Tickets</span>
                <span className="text-sm font-medium text-slate-400">
                  {booking.seats.map(s => s.id).join(', ')} ({booking.seats[0]?.tier || 'N/A'})
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#111] p-4 rounded-xl flex justify-between items-center border border-slate-800 mb-8">
            <span className="text-slate-400 font-medium">Total Paid</span>
            <span className="text-2xl font-black text-white">₹{booking.amountPaid}</span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-bold transition-colors cursor-pointer"
            >
              View Profile
            </button>
            <button
              onClick={() => setShowNameModal(true)}
              className="flex-1 bg-[#ff0033] hover:bg-red-700 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-red-900/30"
            >
              <Download className="h-5 w-5" /> Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Name Prompt Modal */}
      {showNameModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-red-900/50 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="text-[#ff0033] h-5 w-5" />
                Ticket Holder Name
              </h2>
              <button onClick={() => setShowNameModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleConfirmName} className="p-6 space-y-5">
              <p className="text-slate-400 text-sm leading-relaxed">
                Your name will appear on the PDF ticket as the official ticket holder.
              </p>
              <input
                required
                autoFocus
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ashish Kumar"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033] transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-[#ff0033] hover:bg-red-700 text-white font-bold py-3.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
              >
                <Download className="h-5 w-5" /> Generate & Download PDF
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
