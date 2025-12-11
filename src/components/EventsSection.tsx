import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { events, Event } from '@/data/events';
import EventCard from './EventCard';
import EventFilters from './EventFilters';

interface EventsSectionProps {
  onSelectEvent: (event: Event) => void;
}

const EventsSection = ({ onSelectEvent }: EventsSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const categoryMatch = selectedCategory === 'all' || event.category === selectedCategory;
      const priceMatch = event.price.min >= priceRange[0] && event.price.min <= priceRange[1];
      return categoryMatch && priceMatch;
    });
  }, [selectedCategory, priceRange]);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-2">Explore Events</h2>
          <p className="text-muted-foreground">Find your next unforgettable experience</p>
        </motion.div>

        <div className="mb-8">
          <EventFilters
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              onSelect={onSelectEvent}
              index={index}
            />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-muted-foreground text-lg">No events found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setPriceRange([0, 500]);
              }}
              className="mt-4 text-primary hover:underline"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
