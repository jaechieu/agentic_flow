export const theme = {
  colors: {
    background: 'var(--background)',
    foreground: 'var(--foreground)',
    neutral: {
      50: '#f8f9fa',
      100: '#f1f3f5',
      // ... other shades
      900: '#212529'
    }
  },
  spacing: {
    1: '0.25rem',
    2: '0.5rem',
    // ... other spacing values
  },
  borderRadius: {
    sm: 'calc(var(--radius) - 4px)',
    md: 'calc(var(--radius) - 2px)',
    lg: 'var(--radius)'
  }
} 