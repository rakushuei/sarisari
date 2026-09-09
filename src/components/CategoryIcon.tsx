import React from 'react';
import {
  LayoutGrid,
  Cookie,
  Soup,
  Flame,
  Wine,
  Sparkles,
  Smile,
  LucideProps,
} from 'lucide-react';
import { CategoryId } from '../types';

interface CategoryIconProps extends LucideProps {
  category: CategoryId;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, ...props }) => {
  switch (category) {
    case 'all':
      return <LayoutGrid {...props} />;
    case 'chichirya':
      return <Cookie {...props} />;
    case 'canned':
      return <Soup {...props} />;
    case 'condiments':
      return <Flame {...props} />;
    case 'beverages':
      return <Wine {...props} />;
    case 'laundry':
      return <Sparkles {...props} />;
    case 'personal':
      return <Smile {...props} />;
    default:
      return <LayoutGrid {...props} />;
  }
};
