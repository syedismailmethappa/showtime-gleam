import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import HeroCarousel from '@/components/HeroCarousel';
import EventsSection from '@/components/EventsSection';
import SeatSelection from '@/components/SeatSelection';
import { BookingProvider, useBooking } from '@/contexts/BookingContext';
import { Event } from '@/data/events';

const TicketApp = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { setSelectedEvent: setContextEvent, clearSelection } = useBooking();

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setContextEvent(event);
  };

  const handleCloseSelection = () => {
    setSelectedEvent(null);
    setContextEvent(null);
    clearSelection();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        <HeroCarousel onSelectEvent={handleSelectEvent} />
        <EventsSection onSelectEvent={handleSelectEvent} />
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">© 2024 TicketVerse. All rights reserved.</p>
        </div>
      </footer>

      <AnimatePresence>
        {selectedEvent && (
          <SeatSelection event={selectedEvent} onClose={handleCloseSelection} />
        )}
      </AnimatePresence>
    </div>
  );
};

const Index = () => {
  return (
    <BookingProvider>
      <TicketApp />
    </BookingProvider>
  );
};

export default Index;
