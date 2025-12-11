import { motion } from 'framer-motion';
import { Calendar, MapPin, Star, TrendingUp } from 'lucide-react';
import { Event } from '@/data/events';

interface EventCardProps {
  event: Event;
  onSelect: (event: Event) => void;
  index: number;
}

const EventCard = ({ event, onSelect, index }: EventCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => onSelect(event)}
      className="group relative rounded-2xl overflow-hidden glass cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
        
        {/* Trending Badge */}
        {event.trending && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-primary/90 backdrop-blur-sm">
            <TrendingUp className="w-3 h-3 text-primary-foreground" />
            <span className="text-xs font-medium text-primary-foreground">Trending</span>
          </div>
        )}

        {/* Rating */}
        {event.rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full glass-strong">
            <Star className="w-3 h-3 text-neon-gold fill-neon-gold" />
            <span className="text-xs font-medium">{event.rating}</span>
          </div>
        )}

        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center"
        >
          <motion.button
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            className="px-6 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold neon-glow"
          >
            Book Now
          </motion.button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium text-muted-foreground capitalize">
            {event.category}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        
        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{event.date} • {event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">Starting from</span>
            <p className="text-lg font-bold text-primary">${event.price.min}</p>
          </div>
          <motion.div
            whileHover={{ x: 4 }}
            className="text-sm text-muted-foreground group-hover:text-primary transition-colors"
          >
            View Details →
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
