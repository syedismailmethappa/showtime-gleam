import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, Calendar, MapPin, DollarSign, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  price_min: number;
  price_max: number;
  total_seats: number;
  available_seats: number;
  trending: boolean;
  featured: boolean;
}

const categories = ['movie', 'concert', 'comedy', 'sports'];

const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'movie',
    image_url: '',
    date: '',
    time: '',
    venue: '',
    city: '',
    price_min: 0,
    price_max: 0,
    total_seats: 100,
    trending: false,
    featured: false,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const eventData = {
        ...formData,
        available_seats: formData.total_seats,
      };

      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id);

        if (error) throw error;
        toast.success('Event updated successfully');
      } else {
        const { error } = await supabase
          .from('events')
          .insert([eventData]);

        if (error) throw error;
        toast.success('Event created successfully');
      }

      setIsModalOpen(false);
      setEditingEvent(null);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const openEditModal = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      category: event.category,
      image_url: event.image_url || '',
      date: event.date,
      time: event.time,
      venue: event.venue,
      city: event.city,
      price_min: event.price_min,
      price_max: event.price_max,
      total_seats: event.total_seats,
      trending: event.trending,
      featured: event.featured,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'movie',
      image_url: '',
      date: '',
      time: '',
      venue: '',
      city: '',
      price_min: 0,
      price_max: 0,
      total_seats: 100,
      trending: false,
      featured: false,
    });
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Events</h1>
          <p className="text-muted-foreground">Manage your events and listings</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setEditingEvent(null);
            setIsModalOpen(true);
          }}
          className="gradient-primary text-primary-foreground neon-glow"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-muted/50"
        />
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No events found</h3>
          <p className="text-muted-foreground">Create your first event to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-2xl overflow-hidden group"
            >
              <div className="relative aspect-video">
                <img
                  src={event.image_url || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  {event.trending && (
                    <span className="px-2 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                      Trending
                    </span>
                  )}
                  {event.featured && (
                    <span className="px-2 py-1 rounded-full bg-neon-gold/90 text-primary-foreground text-xs font-medium">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium text-muted-foreground capitalize">
                  {event.category}
                </span>
                <h3 className="font-semibold mt-2 line-clamp-1">{event.title}</h3>
                
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(event.date), 'MMM d, yyyy')} • {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{event.venue}, {event.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>${event.price_min} - ${event.price_max}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(event)}
                    className="flex-1"
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(event.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl glass-strong rounded-2xl p-6 max-h-[90vh] overflow-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {editingEvent ? 'Edit Event' : 'Create Event'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full glass flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-sm text-muted-foreground mb-1 block">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="bg-muted/50"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm text-muted-foreground mb-1 block">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-muted/50 rounded-xl px-4 py-3 text-sm resize-none h-24 border border-border"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-muted/50 rounded-xl px-4 py-3 text-sm border border-border"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Image URL</label>
                    <Input
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://..."
                      className="bg-muted/50"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Date</label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                      className="bg-muted/50"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Time</label>
                    <Input
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      placeholder="7:30 PM"
                      required
                      className="bg-muted/50"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Venue</label>
                    <Input
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      required
                      className="bg-muted/50"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">City</label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                      className="bg-muted/50"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Min Price ($)</label>
                    <Input
                      type="number"
                      value={formData.price_min}
                      onChange={(e) => setFormData({ ...formData, price_min: Number(e.target.value) })}
                      required
                      className="bg-muted/50"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Max Price ($)</label>
                    <Input
                      type="number"
                      value={formData.price_max}
                      onChange={(e) => setFormData({ ...formData, price_max: Number(e.target.value) })}
                      required
                      className="bg-muted/50"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Total Seats</label>
                    <Input
                      type="number"
                      value={formData.total_seats}
                      onChange={(e) => setFormData({ ...formData, total_seats: Number(e.target.value) })}
                      required
                      className="bg-muted/50"
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.trending}
                        onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm">Trending</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm">Featured</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 gradient-primary text-primary-foreground neon-glow"
                  >
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminEvents;
