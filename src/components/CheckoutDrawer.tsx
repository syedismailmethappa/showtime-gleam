import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Ticket, CreditCard, Shield } from 'lucide-react';
import { Event } from '@/data/events';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

const CheckoutDrawer = ({ isOpen, onClose, event }: CheckoutDrawerProps) => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const { selectedSeats, getTotalPrice, clearSelection } = useBooking();

  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          clearSelection();
          toast.error('Session expired. Please try again.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onClose, clearSelection]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const subtotal = getTotalPrice();
  const bookingFee = Math.round(subtotal * 0.1);
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + bookingFee + tax;

  const handleCheckout = () => {
    toast.success('Booking confirmed! Check your email for tickets.');
    clearSelection();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md glass-strong border-l border-border z-50 overflow-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Checkout</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-8 h-8 rounded-full glass flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Timer */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30 mb-6">
                <Clock className="w-5 h-5 text-destructive" />
                <div>
                  <p className="text-sm text-muted-foreground">Tickets held for</p>
                  <p className="text-xl font-bold text-destructive">{formatTime(timeLeft)}</p>
                </div>
              </div>

              {/* Event Info */}
              <div className="glass rounded-xl p-4 mb-6">
                <div className="flex gap-4">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.date} • {event.time}</p>
                    <p className="text-sm text-muted-foreground">{event.venue}</p>
                  </div>
                </div>
              </div>

              {/* Selected Seats */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Selected Seats</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <motion.span
                      key={seat.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        seat.status === 'vip'
                          ? 'bg-neon-gold/20 text-neon-gold border border-neon-gold/30'
                          : 'bg-primary/20 text-primary border border-primary/30'
                      }`}
                    >
                      <Ticket className="w-3 h-3 inline mr-1" />
                      {seat.row}{seat.number} • ${seat.price}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="glass rounded-xl p-4 mb-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({selectedSeats.length} tickets)</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Booking Fee</span>
                  <span>${bookingFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-gradient">${total}</span>
                </div>
              </div>

              {/* Payment Button */}
              <Button
                onClick={handleCheckout}
                size="lg"
                className="w-full gradient-primary text-primary-foreground font-semibold neon-glow mb-4"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Pay ${total}
              </Button>

              {/* Security Notice */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Secure checkout powered by Stripe</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CheckoutDrawer;
