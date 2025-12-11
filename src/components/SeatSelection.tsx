import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, Monitor, Info } from 'lucide-react';
import { Event, Seat, generateSeats } from '@/data/events';
import { useBooking } from '@/contexts/BookingContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import CheckoutDrawer from './CheckoutDrawer';

interface SeatSelectionProps {
  event: Event;
  onClose: () => void;
}

const SeatSelection = ({ event, onClose }: SeatSelectionProps) => {
  const [seats] = useState(() => generateSeats());
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { selectedSeats, toggleSeat, getTotalPrice } = useBooking();

  const rows = useMemo(() => {
    const grouped: Record<string, Seat[]> = {};
    seats.forEach((seat) => {
      if (!grouped[seat.row]) grouped[seat.row] = [];
      grouped[seat.row].push(seat);
    });
    return Object.entries(grouped);
  }, [seats]);

  const getSeatStatus = (seat: Seat) => {
    if (selectedSeats.find((s) => s.id === seat.id)) return 'selected';
    return seat.status;
  };

  const seatColors: Record<string, string> = {
    available: 'bg-muted hover:bg-primary/50 border-border',
    booked: 'bg-muted/30 border-muted cursor-not-allowed',
    selected: 'bg-neon-green border-neon-green neon-glow-green',
    vip: 'bg-neon-gold/20 border-neon-gold hover:bg-neon-gold/40 neon-glow-gold',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl overflow-auto"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">{event.title}</h2>
            <p className="text-muted-foreground">{event.date} • {event.time} • {event.venue}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-10 h-10 rounded-full glass flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Screen */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <div className="w-80 md:w-96 h-2 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mx-auto mb-2" />
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
              <Monitor className="w-4 h-4" />
              <span>SCREEN</span>
            </div>
          </div>
        </div>

        {/* Seats Grid */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="space-y-3">
            {rows.map(([row, rowSeats]) => (
              <div key={row} className="flex items-center gap-2 justify-center">
                <span className="w-6 text-center text-sm font-medium text-muted-foreground">{row}</span>
                <div className="flex gap-2">
                  {rowSeats.map((seat) => {
                    const status = getSeatStatus(seat);
                    return (
                      <Tooltip key={seat.id}>
                        <TooltipTrigger asChild>
                          <motion.button
                            whileHover={status !== 'booked' ? { scale: 1.2 } : {}}
                            whileTap={status !== 'booked' ? { scale: 0.9 } : {}}
                            onClick={() => toggleSeat(seat)}
                            disabled={seat.status === 'booked'}
                            className={`w-8 h-8 rounded-t-lg border-2 transition-all ${seatColors[status]}`}
                          />
                        </TooltipTrigger>
                        <TooltipContent className="glass-strong">
                          <p className="font-medium">Seat {seat.row}{seat.number}</p>
                          <p className="text-sm text-muted-foreground">${seat.price}</p>
                          {seat.status === 'vip' && (
                            <p className="text-xs text-neon-gold">VIP Seat</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
                <span className="w-6 text-center text-sm font-medium text-muted-foreground">{row}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
          {[
            { label: 'Available', color: 'bg-muted border-border' },
            { label: 'Selected', color: 'bg-neon-green border-neon-green' },
            { label: 'VIP', color: 'bg-neon-gold/20 border-neon-gold' },
            { label: 'Booked', color: 'bg-muted/30 border-muted' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-t-md border-2 ${item.color}`} />
              <span className="text-sm text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        {selectedSeats.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-0 left-0 right-0 p-4 glass-strong border-t border-border"
          >
            <div className="container mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} selected
                </p>
                <p className="text-2xl font-bold text-gradient">${getTotalPrice()}</p>
              </div>
              <Button
                onClick={() => setIsCheckoutOpen(true)}
                size="lg"
                className="gradient-primary text-primary-foreground font-semibold px-8 neon-glow"
              >
                Proceed to Checkout
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      <CheckoutDrawer
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        event={event}
      />
    </motion.div>
  );
};

export default SeatSelection;
