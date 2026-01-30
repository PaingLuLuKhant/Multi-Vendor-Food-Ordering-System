// utils/categoryColors.js

export const getCategoryColors = (category) => {
  const categoryLower = (category || '').toLowerCase().trim();
  
  const colorMap = {
    // Myanmar Food - Golden/Brown theme
    'myanmar': { 
      primary: '#D97706', 
      secondary: '#FEF3C7',
      gradient: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
      light: '#FFFBEB',
      text: '#7C2D12',
      icon: '🍜'
    },
    'myanmar food': { 
      primary: '#D97706', 
      secondary: '#FEF3C7',
      gradient: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
      light: '#FFFBEB',
      text: '#7C2D12',
      icon: '🍜'
    },
    'burmese': { 
      primary: '#D97706', 
      secondary: '#FEF3C7',
      gradient: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
      light: '#FFFBEB',
      text: '#7C2D12',
      icon: '🍜'
    },
    
    // Chinese Food - Red theme
    'chinese': { 
      primary: '#DC2626', 
      secondary: '#FEE2E2',
      gradient: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
      light: '#FEF2F2',
      text: '#991B1B',
      icon: '🥟'
    },
    'chinese food': { 
      primary: '#DC2626', 
      secondary: '#FEE2E2',
      gradient: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
      light: '#FEF2F2',
      text: '#991B1B',
      icon: '🥟'
    },
    
    // Thai Cuisine - Purple theme
    'thai': { 
      primary: '#7C3AED', 
      secondary: '#EDE9FE',
      gradient: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
      light: '#F5F3FF',
      text: '#5B21B6',
      icon: '🍛'
    },
    'thai cuisine': { 
      primary: '#7C3AED', 
      secondary: '#EDE9FE',
      gradient: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
      light: '#F5F3FF',
      text: '#5B21B6',
      icon: '🍛'
    },
    
    // Fast Food - Orange theme
    'fast food': { 
      primary: '#EA580C', 
      secondary: '#FFEDD5',
      gradient: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
      light: '#FFF7ED',
      text: '#9A3412',
      icon: '🍔'
    },
    'fastfood': { 
      primary: '#EA580C', 
      secondary: '#FFEDD5',
      gradient: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
      light: '#FFF7ED',
      text: '#9A3412',
      icon: '🍔'
    },
    
    // Italian Food - Green theme
    'italian': { 
      primary: '#059669', 
      secondary: '#D1FAE5',
      gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      light: '#ECFDF5',
      text: '#065F46',
      icon: '🍝'
    },
    'italian food': { 
      primary: '#059669', 
      secondary: '#D1FAE5',
      gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      light: '#ECFDF5',
      text: '#065F46',
      icon: '🍝'
    },
    
    // Sea Food - Blue theme
    'sea food': { 
      primary: '#0284C7', 
      secondary: '#E0F2FE',
      gradient: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
      light: '#F0F9FF',
      text: '#075985',
      icon: '🦐'
    },
    'seafood': { 
      primary: '#0284C7', 
      secondary: '#E0F2FE',
      gradient: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
      light: '#F0F9FF',
      text: '#075985',
      icon: '🦐'
    },
    
    // Japanese Food - Pink theme
    'japanese': { 
      primary:' #DB2777', 
      secondary: '#FCE7F3',
      gradient: 'linear-gradient(135deg, #DB2777 0%, #BE185D 100%)',
      light: '#FDF2F8',
      text: '#9D174D',
      icon: '🍣'
    },
    'japanese food': { 
      primary: '#DB2777', 
      secondary: '#FCE7F3',
      gradient: 'linear-gradient(135deg, #DB2777 0%, #BE185D 100%)',
      light: '#FDF2F8',
      text: '#9D174D',
      icon: '🍣'
    },
    
    // Vegan - Green theme
    'vegan': { 
      primary: '#16A34A', 
      secondary: '#DCFCE7',
      gradient: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
      light: '#F0FDF4',
      text: '#166534',
      icon: '🌱'
    },
    
    // Default - Gray theme
    'default': { 
      primary: '#6B7280', 
      secondary: '#F3F4F6',
      gradient: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
      light: '#F9FAFB',
      text: '#374151',
      icon: '🏪'
    }
  };

  // Check for exact match
  if (colorMap[categoryLower]) {
    return colorMap[categoryLower];
  }
  
  // Check for partial matches
  for (const [key, value] of Object.entries(colorMap)) {
    if (categoryLower.includes(key) || key.includes(categoryLower)) {
      return value;
    }
  }
  
  // Return default
  return colorMap.default;
};

export const getCategoryIcon = (category) => {
  const colors = getCategoryColors(category);
  return colors.icon;
};

export const formatCategoryName = (category) => {
  if (!category) return "Food";
  
  // Capitalize first letter of each word
  return category.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};