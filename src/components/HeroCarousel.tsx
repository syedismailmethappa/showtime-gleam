import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Calendar, MapPin, TrendingUp } from 'lucide-react';
import { events, Event } from '@/data/events';
import { Button } from '@/components/ui/button';

const featuredEvents = events.filter((e) => e.featured);

const HeroCarousel = ({ onSelectEvent }: { onSelectEvent: (event: Event) => void }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featuredEvents.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => setCurrent(index);
  const prev = () => setCurrent((c) => (c === 0 ? featuredEvents.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c + 1) % featuredEvents.length);

  const event = featuredEvents[current];

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={event.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${event.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative container mx-auto px-4 h-full flex items-center">
        <motion.div
          key={`content-${event.id}`}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-xl"
        >
          {/* Trending Badge */}
          {event.trending && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass mb-4"
            >
              <TrendingUp className="w-4 h-4 text-primary animate-pulse-glow" />
              <span className="text-xs font-medium text-primary">Trending Now</span>
            </motion.div>
          )}

          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            {event.title}
          </h1>

          <p className="text-muted-foreground text-lg mb-6">
            {event.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-muted-foreground">
            {event.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-neon-gold fill-neon-gold" />
                <span className="text-foreground font-medium">{event.rating}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{event.date} • {event.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{event.venue}, {event.city}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => onSelectEvent(event)}
              size="lg"
              className="gradient-primary text-primary-foreground font-semibold px-8 neon-glow hover:opacity-90 transition-opacity"
            >
              Book Now • ${event.price.min}+
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="glass border-border/50 hover:bg-muted/50"
            >
              Watch Trailer
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prev}
          className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-muted/50"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        <div className="flex gap-2">
          {featuredEvents.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-primary neon-glow' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={next}
          className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-muted/50"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </section>
  );
};

export default HeroCarousel;
