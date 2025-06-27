/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Luxury Palette
        'midnight-navy': '#0B1426',
        'surface-elevated': '#1C2333',
        'surface-card': '#252B3D',
        'champagne-gold': '#D4AF37',
        'royal-purple': '#6B46C1',
        'forest-emerald': '#065F46',
        'pearl-cream': '#FAF7F0',
        
        // Text Hierarchy
        'text-primary': '#FAFAF9',
        'text-secondary': '#C7CAD1',
        'text-tertiary': '#9CA3AF',
        'text-disabled': '#6B7280',
        
        // Experience Colors
        'discovery-orange': '#FB923C',
        'social-blue': '#3B82F6',
        'luxury-rose': '#EC4899',
        
        // Semantic Colors
        'success-green': '#10B981',
        'warning-amber': '#F59E0B',
        'error-red': '#EF4444',
        'info-blue': '#3B82F6',
      },
      fontFamily: {
        'crimson': ['Crimson Text', 'Libre Baskerville', 'serif'],
        'inter': ['Inter', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif'],
        'lato': ['Lato', 'sans-serif'],
        'libre': ['Libre Baskerville', 'serif'],
        'cormorant': ['Cormorant Garamond', 'serif'],
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'fade-in': 'fade-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.7',
            transform: 'scale(1.05)',
          },
        },
        'slide-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'shimmer': {
          '0%': {
            backgroundPosition: '-1000px 0',
          },
          '100%': {
            backgroundPosition: '1000px 0',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}