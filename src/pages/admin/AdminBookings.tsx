import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Ticket, Calendar, User, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Booking {
  id: string;
  user_id: string;
  event_id: string;
  seats: any;
  total_amount: number;
  booking_fee: number;
  tax: number;
  status: string;
  created_at: string;
  event_title?: string;
  user_email?: string;
}

const statusColors: Record<string, string> = {
  confirmed: 'bg-neon-green/20 text-neon-green border-neon-green/30',
  pending: 'bg-neon-gold/20 text-neon-gold border-neon-gold/30',
  cancelled: 'bg-destructive/20 text-destructive border-destructive/30',
  refunded: 'bg-muted text-muted-foreground border-muted',
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          events(title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch user emails
      const bookingsWithEmails = await Promise.all(
        (data || []).map(async (booking) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', booking.user_id)
            .maybeSingle();

          return {
            ...booking,
            event_title: booking.events?.title,
            user_email: profile?.email,
          };
        })
      );

      setBookings(bookingsWithEmails);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = 
      booking.event_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Bookings</h1>
        <p className="text-muted-foreground">View and manage all ticket bookings</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by event, email, or booking ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'confirmed', 'pending', 'cancelled', 'refunded'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className={statusFilter === status ? 'gradient-primary text-primary-foreground' : ''}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl">
          <Ticket className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
          <p className="text-muted-foreground">Bookings will appear here once customers start booking</p>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Booking</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Event</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Seats</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Ticket className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-mono text-sm">
                          {booking.id.slice(0, 8)}...
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{booking.user_email || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium">{booking.event_title || 'Unknown Event'}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(booking.seats) && booking.seats.slice(0, 3).map((seat: any) => (
                          <span
                            key={seat.id}
                            className="px-2 py-0.5 rounded bg-muted text-xs"
                          >
                            {seat.row}{seat.number}
                          </span>
                        ))}
                        {Array.isArray(booking.seats) && booking.seats.length > 3 && (
                          <span className="px-2 py-0.5 rounded bg-muted text-xs">
                            +{booking.seats.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-neon-green" />
                        <span className="font-semibold">{booking.total_amount}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border cursor-pointer ${statusColors[booking.status]}`}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(booking.created_at), 'MMM d, h:mm a')}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
