import { motion } from 'framer-motion';
import { Ticket, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
  id: string;
  event_title?: string;
  user_email?: string;
  total_amount: number;
  status: string;
  created_at: string;
  seats: Array<{ id: string; row: string; number: number }>;
}

interface RecentBookingsProps {
  bookings: Booking[];
}

const statusColors: Record<string, string> = {
  confirmed: 'bg-neon-green/20 text-neon-green border-neon-green/30',
  pending: 'bg-neon-gold/20 text-neon-gold border-neon-gold/30',
  cancelled: 'bg-destructive/20 text-destructive border-destructive/30',
  refunded: 'bg-muted text-muted-foreground border-muted',
};

const RecentBookings = ({ bookings }: RecentBookingsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
      
      {bookings.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Ticket className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No bookings yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {booking.event_title || 'Unknown Event'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {booking.user_email || 'Unknown User'}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-sm">${booking.total_amount}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {format(new Date(booking.created_at), 'MMM d, h:mm a')}
                </div>
              </div>
              
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[booking.status]}`}>
                {booking.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default RecentBookings;
