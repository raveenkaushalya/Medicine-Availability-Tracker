# Frontend

This directory contains the client-side application for the Medicine Availability Tracker.

## Structure

```
frontend/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page-level components
│   ├── services/      # API communication services
│   ├── hooks/         # Custom React hooks (if using React)
│   ├── utils/         # Utility functions
│   ├── styles/        # Global styles and themes
│   └── assets/        # Images, fonts, icons
├── public/            # Static files
└── README.md          # This file
```

## Folder Descriptions

### `/src/components`
Reusable UI components organized by feature or type.

**Example:**
```
components/
├── common/           # Common components (Button, Input, Card)
├── medicine/         # Medicine-related components
├── pharmacy/         # Pharmacy-related components
└── layout/           # Layout components (Header, Footer, Sidebar)
```

### `/src/pages`
Page components that represent different routes/views in the application.

**Example:**
- `HomePage.jsx` - Landing page
- `SearchPage.jsx` - Medicine search page
- `PharmacyDetailPage.jsx` - Individual pharmacy details
- `DashboardPage.jsx` - Admin/pharmacy dashboard

### `/src/services`
Services for communicating with the backend API.

**Example:**
- `api.service.js` - Base API configuration
- `medicine.service.js` - Medicine-related API calls
- `pharmacy.service.js` - Pharmacy-related API calls
- `auth.service.js` - Authentication API calls

### `/src/hooks`
Custom hooks for reusable stateful logic (React).

**Example:**
- `useMedicineSearch.js` - Hook for medicine search functionality
- `useAuth.js` - Hook for authentication state
- `useGeolocation.js` - Hook for location services

### `/src/utils`
Utility functions and helpers.

**Example:**
- `formatters.js` - Data formatting functions
- `validators.js` - Form validation helpers
- `constants.js` - Application constants

### `/src/styles`
Global styles, theme configuration, and CSS/SCSS files.

**Example:**
- `global.css` - Global styles
- `theme.js` - Theme configuration
- `variables.css` - CSS variables

### `/src/assets`
Static assets like images, fonts, and icons.

**Example:**
```
assets/
├── images/
├── fonts/
└── icons/
```

### `/public`
Static files served directly (index.html, favicon, manifest).

## Component Structure Guidelines

### Component Organization

Each component should follow this structure:

```javascript
// Imports
import React from 'react';
import PropTypes from 'prop-types';
import './ComponentName.css';

// Component definition
const ComponentName = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => {
    // effect logic
  }, []);
  
  // Handlers
  const handleClick = () => {
    // handler logic
  };
  
  // Render
  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
};

// PropTypes
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
};

// Default props
ComponentName.defaultProps = {
  prop2: 0,
};

export default ComponentName;
```

### File Naming

- **Components**: PascalCase (e.g., `MedicineCard.jsx`)
- **Services**: camelCase with .service suffix (e.g., `medicine.service.js`)
- **Hooks**: camelCase starting with 'use' (e.g., `useMedicineSearch.js`)
- **Utilities**: camelCase (e.g., `formatters.js`)

### Component Best Practices

1. **Keep components small and focused** - Single responsibility principle
2. **Use functional components** - Prefer hooks over class components
3. **Destructure props** - For better readability
4. **Use PropTypes** - For type checking (or TypeScript)
5. **Extract logic to hooks** - Keep components focused on rendering
6. **Memoize when needed** - Use React.memo, useMemo, useCallback appropriately

## State Management

*To be determined based on project complexity*

Options:
- **Context API** - For simple global state
- **Redux** - For complex state management
- **Zustand/Jotai** - For lightweight state management
- **React Query** - For server state management

## Styling Approach

*To be determined*

Options:
- **CSS Modules** - Scoped CSS
- **Styled Components** - CSS-in-JS
- **Tailwind CSS** - Utility-first CSS
- **Material-UI / Ant Design** - Component library

## Getting Started

*Instructions will be added once the tech stack is finalized.*

## Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run linter
npm run lint
```

## Testing

- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user flows

## Accessibility

- Use semantic HTML elements
- Include ARIA labels where needed
- Ensure keyboard navigation
- Maintain color contrast ratios
- Test with screen readers

## Performance

- Code splitting for large bundles
- Lazy loading for routes and components
- Image optimization
- Minimize re-renders with memoization
- Monitor bundle size

## Code Style

Follow the guidelines in [CONTRIBUTING.md](../CONTRIBUTING.md) for code style and structure.
