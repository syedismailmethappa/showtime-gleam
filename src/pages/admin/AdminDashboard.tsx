import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Ticket, Calendar, TrendingUp } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import RecentBookings from '@/components/admin/RecentBookings';
import { supabase } from '@/integrations/supabase/client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Stats {
  totalRevenue: number;
  totalBookings: number;
  totalEvents: number;
  ticketsSold: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalBookings: 0,
    totalEvents: 0,
    ticketsSold: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch bookings with event info
      const { data: bookings } = await supabase
        .from('bookings')
        .select(`
          *,
          events(title)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch events count
      const { count: eventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });

      // Calculate stats
      const totalRevenue = bookings?.reduce((sum, b) => sum + Number(b.total_amount), 0) || 0;
      const totalBookings = bookings?.length || 0;
      const ticketsSold = bookings?.reduce((sum, b) => {
        const seats = Array.isArray(b.seats) ? b.seats : [];
        return sum + seats.length;
      }, 0) || 0;

      setStats({
        totalRevenue,
        totalBookings,
        totalEvents: eventsCount || 0,
        ticketsSold,
      });

      // Format recent bookings - fetch user emails separately
      const formattedBookings = await Promise.all(
        (bookings || []).map(async (b) => {
          // Fetch user email from profiles
          const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', b.user_id)
            .maybeSingle();

          return {
            id: b.id,
            event_title: b.events?.title,
            user_email: profile?.email || 'Unknown',
            total_amount: b.total_amount,
            status: b.status,
            created_at: b.created_at,
            seats: b.seats || [],
          };
        })
      );

      setRecentBookings(formattedBookings);

      // Generate chart data (mock for demo)
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const mockChartData = days.map((day) => ({
        name: day,
        revenue: Math.floor(Math.random() * 5000) + 1000,
        bookings: Math.floor(Math.random() * 50) + 10,
      }));
      setChartData(mockChartData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { title: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, change: '+12.5%', changeType: 'positive' as const },
    { title: 'Total Bookings', value: stats.totalBookings, icon: Ticket, change: '+8.2%', changeType: 'positive' as const },
    { title: 'Active Events', value: stats.totalEvents, icon: Calendar, change: '+3', changeType: 'positive' as const },
    { title: 'Tickets Sold', value: stats.ticketsSold, icon: TrendingUp, change: '+15%', changeType: 'positive' as const },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your business.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <StatsCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      {/* Charts and Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Bookings */}
        <RecentBookings bookings={recentBookings} />
      </div>
    </div>
  );
};

export default AdminDashboard;
