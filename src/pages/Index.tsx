import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import HeroCarousel from '@/components/HeroCarousel';
import EventsSection from '@/components/EventsSection';
import SeatSelection from '@/components/SeatSelection';
import { BookingProvider, useBooking } from '@/contexts/BookingContext';
import { Event } from '@/data/events';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Settings, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TicketApp = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { setSelectedEvent: setContextEvent, clearSelection } = useBooking();
  const { user, isAdmin, signOut, loading } = useAuth();

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
      
      {/* Auth/Admin Bar */}
      <div className="fixed top-16 right-4 z-40 flex items-center gap-2">
        {!loading && (
          <>
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="glass" size="sm" className="gap-2">
                      <Settings className="w-4 h-4" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="glass" size="sm" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </>
        )}
      </div>
      
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
