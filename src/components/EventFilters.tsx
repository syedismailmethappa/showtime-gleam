import { motion } from 'framer-motion';
import { Film, Music, Laugh, Trophy, Sparkles, SlidersHorizontal } from 'lucide-react';
import { categories } from '@/data/events';
import { Slider } from '@/components/ui/slider';

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Film,
  Music,
  Laugh,
  Trophy,
};

interface EventFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
}

const EventFilters = ({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
}: EventFiltersProps) => {
  return (
    <div className="space-y-6">
      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon];
          const isActive = selectedCategory === cat.id;
          
          return (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'gradient-primary text-primary-foreground neon-glow'
                  : 'glass hover:bg-muted/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </motion.button>
          );
        })}
      </div>

      {/* Price Range Filter */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Price Range</span>
        </div>
        
        <Slider
          value={priceRange}
          onValueChange={(value) => onPriceChange(value as [number, number])}
          min={0}
          max={500}
          step={10}
          className="mb-2"
        />
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}+</span>
        </div>
      </div>
    </div>
  );
};

export default EventFilters;
