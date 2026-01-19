# Code Style Guide

This document outlines the code style and structure guidelines for the Medicine Availability Tracker project.

## General Principles

### SOLID Principles

1. **Single Responsibility Principle**: Each module/class should have one reason to change
2. **Open/Closed Principle**: Open for extension, closed for modification
3. **Liskov Substitution Principle**: Subtypes must be substitutable for their base types
4. **Interface Segregation Principle**: Many client-specific interfaces are better than one general-purpose interface
5. **Dependency Inversion Principle**: Depend on abstractions, not concretions

### DRY (Don't Repeat Yourself)

- Avoid code duplication
- Extract common functionality into reusable functions/components
- Use inheritance and composition appropriately

### KISS (Keep It Simple, Stupid)

- Simple solutions are better than complex ones
- Avoid over-engineering
- Write code that's easy to understand

### YAGNI (You Aren't Gonna Need It)

- Don't add functionality until it's necessary
- Focus on current requirements
- Avoid speculative generality

## File Structure and Organization

### Project Layout

Follow the established folder structure:

```
Medicine-Availability-Tracker/
├── backend/
│   ├── src/
│   │   ├── api/           # One file per resource/feature
│   │   ├── services/      # Business logic
│   │   ├── models/        # Data models
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Middleware functions
│   │   ├── utils/         # Utility functions
│   │   └── config/        # Configuration
│   └── tests/             # Mirror src structure
├── frontend/
│   └── src/
│       ├── components/    # UI components
│       ├── pages/         # Page components
│       ├── services/      # API services
│       └── ...
└── database/
    ├── migrations/
    ├── seeds/
    └── schemas/
```

### File Naming

- **JavaScript/TypeScript**: camelCase for files, PascalCase for components
  - Services: `medicineService.js`, `pharmacyService.js`
  - Components: `MedicineCard.jsx`, `SearchBar.jsx`
  - Utilities: `validators.js`, `formatters.js`

- **Python**: snake_case for all files
  - Services: `medicine_service.py`
  - Models: `medicine_model.py`
  - Utilities: `validators.py`

- **SQL**: snake_case with timestamp prefix for migrations
  - `20260119000001_create_medicines_table.sql`

## Code Structure

### Module Structure

Every file should follow this structure:

```javascript
// 1. Imports - External libraries first, then internal modules
import express from 'express';
import { validateMedicine } from '../utils/validators';

// 2. Constants and configuration
const ITEMS_PER_PAGE = 10;

// 3. Main functionality
class MedicineService {
  // ...
}

// 4. Helper functions (if any)
function formatMedicineName(name) {
  // ...
}

// 5. Exports
export default MedicineService;
export { formatMedicineName };
```

### Function Structure

Keep functions focused and well-organized:

```javascript
/**
 * Searches for medicines based on query parameters
 * @param {string} searchTerm - The search term
 * @param {Object} filters - Additional filters
 * @param {number} page - Page number for pagination
 * @returns {Promise<Object>} Search results with pagination
 */
async function searchMedicines(searchTerm, filters = {}, page = 1) {
  // 1. Input validation
  if (!searchTerm || searchTerm.trim().length === 0) {
    throw new Error('Search term is required');
  }

  // 2. Prepare parameters
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const sanitizedTerm = sanitize(searchTerm);

  // 3. Execute main logic
  const results = await database.medicines.search({
    term: sanitizedTerm,
    filters,
    limit: ITEMS_PER_PAGE,
    offset,
  });

  // 4. Process and return results
  return {
    data: results.items,
    pagination: {
      page,
      totalPages: Math.ceil(results.total / ITEMS_PER_PAGE),
      totalItems: results.total,
    },
  };
}
```

### Class Structure

```javascript
class MedicineService {
  // 1. Constructor
  constructor(database, cache) {
    this.database = database;
    this.cache = cache;
  }

  // 2. Public methods
  async getMedicineById(id) {
    // Check cache first
    const cached = await this.cache.get(`medicine:${id}`);
    if (cached) return cached;

    // Fetch from database
    const medicine = await this.database.medicines.findById(id);
    
    // Update cache
    await this.cache.set(`medicine:${id}`, medicine);
    
    return medicine;
  }

  async searchMedicines(query) {
    // ...
  }

  // 3. Private methods (prefixed with _ or using # for truly private)
  _validateMedicineData(data) {
    // ...
  }
}
```

## Naming Conventions

### Variables

```javascript
// Use descriptive names
const medicineList = [];           // Good
const ml = [];                     // Bad

// Use camelCase
const searchResults = [];          // Good
const SearchResults = [];          // Bad (reserved for classes)

// Boolean variables should be questions
const isAvailable = true;          // Good
const available = true;            // Acceptable
const medicine = true;             // Bad

// Use plural for arrays/collections
const medicines = [];              // Good
const medicine = [];               // Bad
```

### Functions

```javascript
// Use verbs for function names
function getMedicines() {}         // Good
function medicines() {}            // Bad

// Be specific about what the function does
function calculateTotalPrice() {}  // Good
function calculate() {}            // Too vague

// Async functions should indicate asynchrony (optional but helpful)
async function fetchMedicineData() {}  // Good
async function medicine() {}           // Bad
```

### Classes

```javascript
// Use PascalCase for classes
class MedicineService {}           // Good
class medicineService {}           // Bad

// Use nouns for class names
class Medicine {}                  // Good
class HandleMedicine {}            // Bad
```

### Constants

```javascript
// Use UPPER_SNAKE_CASE for constants
const MAX_SEARCH_RESULTS = 100;    // Good
const maxSearchResults = 100;      // Bad

// Group related constants
const API_CONFIG = {
  BASE_URL: 'https://api.example.com',
  TIMEOUT: 5000,
  RETRY_ATTEMPTS: 3,
};
```

## Comments and Documentation

### When to Comment

✅ **Do comment:**
- Complex algorithms or business logic
- Non-obvious decisions or workarounds
- Public APIs and interfaces
- TODO items for future work
- Important assumptions or constraints

❌ **Don't comment:**
- Obvious code that's self-explanatory
- Redundant information
- Commented-out code (delete it; use version control)

### Comment Style

```javascript
// Single-line comments for brief explanations
const result = calculatePrice(); // Apply 10% discount

/**
 * Multi-line JSDoc comments for functions and classes
 * 
 * Searches for medicines by name or generic name
 * 
 * @param {string} searchTerm - The term to search for
 * @param {Object} options - Search options
 * @param {number} options.limit - Maximum results to return
 * @param {boolean} options.exactMatch - Whether to match exactly
 * @returns {Promise<Medicine[]>} Array of matching medicines
 * @throws {ValidationError} If searchTerm is invalid
 * 
 * @example
 * const medicines = await searchMedicines('aspirin', { limit: 10 });
 */
async function searchMedicines(searchTerm, options = {}) {
  // Implementation
}
```

## Error Handling

### Use Proper Error Types

```javascript
// Custom error classes
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class NotFoundError extends Error {
  constructor(resource) {
    super(`${resource} not found`);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

// Usage
throw new ValidationError('Invalid medicine ID format');
throw new NotFoundError('Medicine');
```

### Always Handle Errors

```javascript
// Good - Explicit error handling
try {
  const medicine = await getMedicineById(id);
  return medicine;
} catch (error) {
  logger.error('Failed to fetch medicine:', error);
  throw new NotFoundError('Medicine');
}

// Bad - Ignoring errors
try {
  const medicine = await getMedicineById(id);
  return medicine;
} catch (error) {
  // Silent failure
}
```

## Code Quality

### Avoid Deep Nesting

```javascript
// Bad - Deep nesting
function processMedicine(medicine) {
  if (medicine) {
    if (medicine.isValid) {
      if (medicine.isAvailable) {
        if (medicine.quantity > 0) {
          return 'Available';
        }
      }
    }
  }
  return 'Not available';
}

// Good - Early returns
function processMedicine(medicine) {
  if (!medicine) return 'Not available';
  if (!medicine.isValid) return 'Not available';
  if (!medicine.isAvailable) return 'Not available';
  if (medicine.quantity <= 0) return 'Not available';
  
  return 'Available';
}
```

### Use Modern JavaScript Features

```javascript
// Use const/let instead of var
const medicines = [];              // Immutable reference
let searchTerm = 'aspirin';        // Mutable

// Use arrow functions for callbacks
medicines.filter(m => m.isAvailable);

// Use template literals
const message = `Found ${count} medicines`;

// Use destructuring
const { name, price } = medicine;
const [first, ...rest] = medicines;

// Use default parameters
function search(term, limit = 10) {}

// Use async/await instead of callbacks
async function fetchData() {
  const data = await apiCall();
  return data;
}
```

### Keep Functions Small

- Aim for functions under 50 lines
- If a function is too long, break it into smaller functions
- Each function should do one thing well

```javascript
// Bad - Doing too much
async function processOrder(orderId) {
  // Fetch order
  const order = await getOrder(orderId);
  // Validate
  if (!order) throw new Error('Not found');
  if (!order.items.length) throw new Error('Empty');
  // Calculate total
  let total = 0;
  for (const item of order.items) {
    total += item.price * item.quantity;
  }
  // Apply discount
  if (order.customer.isPremium) {
    total *= 0.9;
  }
  // Update database
  await updateOrderTotal(orderId, total);
  return total;
}

// Good - Separated concerns
async function processOrder(orderId) {
  const order = await fetchAndValidateOrder(orderId);
  const total = calculateOrderTotal(order);
  const finalTotal = applyDiscount(total, order.customer);
  await updateOrderTotal(orderId, finalTotal);
  return finalTotal;
}
```

## Testing Guidelines

### Test Structure

```javascript
describe('MedicineService', () => {
  describe('searchMedicines', () => {
    it('should return medicines matching the search term', async () => {
      // Arrange
      const searchTerm = 'aspirin';
      const expectedResults = [
        { id: 1, name: 'Aspirin 100mg' },
        { id: 2, name: 'Aspirin 500mg' },
      ];

      // Act
      const results = await medicineService.searchMedicines(searchTerm);

      // Assert
      expect(results).toHaveLength(2);
      expect(results).toEqual(expectedResults);
    });

    it('should throw error for empty search term', async () => {
      // Arrange
      const searchTerm = '';

      // Act & Assert
      await expect(
        medicineService.searchMedicines(searchTerm)
      ).rejects.toThrow('Search term is required');
    });
  });
});
```

## Security Best Practices

### Input Validation

```javascript
// Always validate and sanitize user input
function validateMedicineId(id) {
  if (!id || typeof id !== 'string') {
    throw new ValidationError('Invalid medicine ID');
  }
  
  // Remove any non-alphanumeric characters
  const sanitized = id.replace(/[^a-zA-Z0-9]/g, '');
  
  if (sanitized.length === 0) {
    throw new ValidationError('Invalid medicine ID format');
  }
  
  return sanitized;
}
```

### Avoid SQL Injection

```javascript
// Bad - String concatenation
const query = `SELECT * FROM medicines WHERE name = '${name}'`;

// Good - Parameterized queries
const query = 'SELECT * FROM medicines WHERE name = $1';
const result = await database.query(query, [name]);
```

### Secure Password Handling

```javascript
import bcrypt from 'bcrypt';

// Hash passwords
const hashedPassword = await bcrypt.hash(password, 10);

// Verify passwords
const isValid = await bcrypt.compare(password, hashedPassword);
```

## Performance Best Practices

### Database Queries

```javascript
// Bad - N+1 query problem
for (const pharmacy of pharmacies) {
  pharmacy.medicines = await getMedicines(pharmacy.id);
}

// Good - Batch loading
const pharmacyIds = pharmacies.map(p => p.id);
const medicines = await getMedicinesByPharmacyIds(pharmacyIds);
pharmacies.forEach(pharmacy => {
  pharmacy.medicines = medicines.filter(m => m.pharmacyId === pharmacy.id);
});
```

### Caching

```javascript
async function getMedicine(id) {
  // Check cache first
  const cacheKey = `medicine:${id}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  // Fetch from database
  const medicine = await database.medicines.findById(id);

  // Cache for future requests
  await cache.set(cacheKey, medicine, { ttl: 3600 });

  return medicine;
}
```

## Version Control

### Commit Messages

Follow the Conventional Commits format:

```
feat(medicine): add search by generic name

- Implement generic name search in MedicineService
- Add index on generic_name column
- Update API documentation

Closes #123
```

### Branch Naming

- `feature/medicine-search` - New features
- `fix/pharmacy-location-bug` - Bug fixes
- `docs/api-documentation` - Documentation updates
- `refactor/database-queries` - Code refactoring
- `test/medicine-service` - Test additions

---

**Remember**: Code is read more often than it's written. Write code that's easy for others (and future you) to understand!
