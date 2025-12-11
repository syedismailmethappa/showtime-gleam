export interface Event {
  id: string;
  title: string;
  category: 'movie' | 'concert' | 'comedy' | 'sports';
  image: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  price: { min: number; max: number };
  rating?: number;
  trending?: boolean;
  featured?: boolean;
  description: string;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  price: number;
  status: 'available' | 'booked' | 'selected' | 'vip';
}

export const events: Event[] = [
  {
    id: '1',
    title: 'Dune: Part Three',
    category: 'movie',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80',
    date: '2024-03-15',
    time: '7:30 PM',
    venue: 'IMAX Theatre',
    city: 'Los Angeles',
    price: { min: 18, max: 35 },
    rating: 9.2,
    trending: true,
    featured: true,
    description: 'The epic conclusion to the Dune saga.'
  },
  {
    id: '2',
    title: 'Taylor Swift - Eras Tour',
    category: 'concert',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    date: '2024-03-20',
    time: '8:00 PM',
    venue: 'SoFi Stadium',
    city: 'Los Angeles',
    price: { min: 150, max: 500 },
    rating: 9.8,
    trending: true,
    featured: true,
    description: 'A journey through all musical eras.'
  },
  {
    id: '3',
    title: 'Dave Chappelle Live',
    category: 'comedy',
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80',
    date: '2024-03-18',
    time: '9:00 PM',
    venue: 'The Comedy Store',
    city: 'Hollywood',
    price: { min: 75, max: 150 },
    rating: 9.5,
    trending: true,
    description: 'An unforgettable night of comedy.'
  },
  {
    id: '4',
    title: 'NBA Finals 2024',
    category: 'sports',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
    date: '2024-04-10',
    time: '6:00 PM',
    venue: 'Crypto.com Arena',
    city: 'Los Angeles',
    price: { min: 200, max: 1200 },
    rating: 9.9,
    featured: true,
    description: 'Championship basketball at its finest.'
  },
  {
    id: '5',
    title: 'Oppenheimer',
    category: 'movie',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    date: '2024-03-16',
    time: '6:45 PM',
    venue: 'Dolby Cinema',
    city: 'New York',
    price: { min: 15, max: 28 },
    rating: 8.9,
    description: 'The story of J. Robert Oppenheimer.'
  },
  {
    id: '6',
    title: 'Coldplay World Tour',
    category: 'concert',
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80',
    date: '2024-03-25',
    time: '7:00 PM',
    venue: 'Rose Bowl',
    city: 'Pasadena',
    price: { min: 120, max: 400 },
    rating: 9.4,
    trending: true,
    description: 'Music of the Spheres World Tour.'
  },
  {
    id: '7',
    title: 'Kevin Hart Comedy Night',
    category: 'comedy',
    image: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800&q=80',
    date: '2024-03-22',
    time: '8:30 PM',
    venue: 'Madison Square Garden',
    city: 'New York',
    price: { min: 85, max: 200 },
    rating: 9.0,
    description: 'Reality Check Tour 2024.'
  },
  {
    id: '8',
    title: 'Avatar 3: Fire and Ash',
    category: 'movie',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80',
    date: '2024-03-28',
    time: '7:00 PM',
    venue: 'AMC Empire 25',
    city: 'New York',
    price: { min: 20, max: 40 },
    rating: 9.1,
    featured: true,
    description: 'Return to Pandora.'
  },
];

export const generateSeats = (): Seat[] => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 12;
  const seats: Seat[] = [];
  
  rows.forEach((row, rowIndex) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      const isVip = rowIndex >= 3 && rowIndex <= 4 && i >= 4 && i <= 9;
      const isBooked = Math.random() < 0.25;
      
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        price: isVip ? 45 : rowIndex < 3 ? 25 : 18,
        status: isBooked ? 'booked' : isVip ? 'vip' : 'available',
      });
    }
  });
  
  return seats;
};

export const recentSearches = [
  'Taylor Swift',
  'Dune',
  'Comedy shows near me',
  'NBA Finals',
  'IMAX movies',
];

export const categories = [
  { id: 'all', label: 'All Events', icon: 'Sparkles' },
  { id: 'movie', label: 'Movies', icon: 'Film' },
  { id: 'concert', label: 'Concerts', icon: 'Music' },
  { id: 'comedy', label: 'Comedy', icon: 'Laugh' },
  { id: 'sports', label: 'Sports', icon: 'Trophy' },
];
