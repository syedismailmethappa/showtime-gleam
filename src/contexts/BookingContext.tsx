import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Event, Seat } from '@/data/events';

interface BookingState {
  selectedEvent: Event | null;
  selectedSeats: Seat[];
  cartCount: number;
}

interface BookingContextType extends BookingState {
  setSelectedEvent: (event: Event | null) => void;
  toggleSeat: (seat: Seat) => void;
  clearSelection: () => void;
  getTotalPrice: () => number;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const toggleSeat = (seat: Seat) => {
    if (seat.status === 'booked') return;
    
    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.id === seat.id);
      if (exists) {
        return prev.filter((s) => s.id !== seat.id);
      }
      return [...prev, seat];
    });
  };

  const clearSelection = () => {
    setSelectedSeats([]);
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  };

  return (
    <BookingContext.Provider
      value={{
        selectedEvent,
        selectedSeats,
        cartCount: selectedSeats.length,
        setSelectedEvent,
        toggleSeat,
        clearSelection,
        getTotalPrice,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
