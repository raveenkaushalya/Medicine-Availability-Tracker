# Contributing to Medicine Availability Tracker

Thank you for considering contributing to the Medicine Availability Tracker! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect different viewpoints and experiences

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, browser, versions)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear and descriptive title**
- **Detailed description** of the proposed feature
- **Use cases** explaining why this would be useful
- **Possible implementation** approach (if you have ideas)

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the code style** guidelines below
3. **Write clear commit messages** following our format
4. **Add tests** for new functionality
5. **Update documentation** as needed
6. **Ensure all tests pass** before submitting
7. **Submit a pull request** with a clear description

## Development Workflow

### Setting Up Your Development Environment

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/Medicine-Availability-Tracker.git
   cd Medicine-Availability-Tracker
   ```

2. Install dependencies:
   ```bash
   # Instructions will be added based on tech stack
   ```

3. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Making Changes

1. **Keep changes focused**: One feature/fix per pull request
2. **Write meaningful commits**: Follow commit message guidelines
3. **Test your changes**: Ensure nothing breaks
4. **Update docs**: If you change functionality, update relevant documentation

## Code Style Guidelines

### General Principles

- **Readability**: Write code that is easy to read and understand
- **Simplicity**: Keep it simple; avoid over-engineering
- **Consistency**: Follow existing patterns in the codebase
- **Documentation**: Comment complex logic, document public APIs

### Naming Conventions

- **Variables and Functions**: Use camelCase (e.g., `getMedicineAvailability`)
- **Classes and Components**: Use PascalCase (e.g., `MedicineService`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `MAX_RETRY_ATTEMPTS`)
- **Files**: Use kebab-case for files (e.g., `medicine-service.js`)
- **Meaningful Names**: Use descriptive names that reveal intent

### Code Structure

#### Functions

- Keep functions small and focused on a single task
- Maximum 50 lines per function (guideline, not strict rule)
- Function names should be verbs (e.g., `fetchMedicines`, `updateInventory`)
- Avoid deep nesting (max 3-4 levels)

Example:
```javascript
// Good
async function getMedicineById(id) {
  const medicine = await database.medicines.findById(id);
  if (!medicine) {
    throw new Error('Medicine not found');
  }
  return medicine;
}

// Avoid
async function getMedicineById(id) {
  return await database.medicines.findById(id);
}
```

#### File Organization

- Group related functionality together
- One class/component per file (for main exports)
- Organize imports: external libraries first, then internal modules
- Export at the bottom of the file (for Node.js modules)

#### Error Handling

- Always handle errors appropriately
- Use try-catch for async operations
- Provide meaningful error messages
- Log errors with context

```javascript
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  logger.error('Failed to perform operation:', error);
  throw new Error('Operation failed: ' + error.message);
}
```

### Comments and Documentation

- **Comment WHY, not WHAT**: Code should be self-explanatory; comments explain reasoning
- **Document public APIs**: Use JSDoc, docstrings, or similar
- **Keep comments updated**: Outdated comments are worse than no comments
- **Remove commented-out code**: Use version control instead

Good comment:
```javascript
// Retry 3 times because the external API occasionally returns 503
const maxRetries = 3;
```

Bad comment:
```javascript
// Set maxRetries to 3
const maxRetries = 3;
```

### Language-Specific Guidelines

#### JavaScript/TypeScript

- Use `const` by default, `let` when reassignment is needed, avoid `var`
- Use arrow functions for callbacks
- Use template literals for string concatenation
- Prefer async/await over raw promises
- Use TypeScript types/interfaces where applicable

#### Python

- Follow PEP 8 style guide
- Use type hints for function signatures
- Use docstrings for modules, classes, and functions
- Maximum line length: 88 characters (Black formatter)

#### Java

- Follow Oracle Java Code Conventions
- Use meaningful package names
- Implement proper exception handling
- Use dependency injection where appropriate

## Commit Message Format

Follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring without changing functionality
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependency updates

### Examples

```
feat(backend): add medicine search endpoint

Implement REST API endpoint for searching medicines by name
and location. Includes pagination and filtering support.

Closes #123
```

```
fix(frontend): resolve medicine card rendering issue

Fixed issue where medicine cards were not displaying correctly
on mobile devices due to CSS flex layout problem.
```

## Testing Guidelines

- Write tests for new features and bug fixes
- Aim for meaningful test coverage, not just high percentages
- Use descriptive test names that explain what is being tested
- Follow AAA pattern: Arrange, Act, Assert
- Keep tests isolated and independent

Example:
```javascript
describe('MedicineService', () => {
  it('should return medicine when valid ID is provided', async () => {
    // Arrange
    const mockId = '123';
    const expectedMedicine = { id: mockId, name: 'Aspirin' };
    
    // Act
    const result = await medicineService.getMedicineById(mockId);
    
    // Assert
    expect(result).toEqual(expectedMedicine);
  });
});
```

## Project Structure Guidelines

### Backend Structure

```
backend/
├── src/
│   ├── api/           # Route handlers and API endpoints
│   ├── services/      # Business logic
│   ├── models/        # Data models/schemas
│   ├── controllers/   # Request/response handling
│   ├── middleware/    # Custom middleware
│   ├── utils/         # Utility functions
│   └── config/        # Configuration files
├── tests/             # Test files
└── package.json
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/    # Reusable components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── hooks/         # Custom hooks (React)
│   ├── utils/         # Utility functions
│   ├── styles/        # Global styles
│   └── assets/        # Images, fonts, etc.
├── public/            # Static files
└── package.json
```

## Review Process

1. **Self-review**: Review your own code before submitting
2. **Automated checks**: Ensure CI/CD checks pass
3. **Code review**: Address reviewer feedback promptly
4. **Approval**: At least one approval required for merge
5. **Testing**: Changes must be tested before merge

## Questions?

If you have questions about contributing:

- Check existing documentation in the `docs/` folder
- Search through existing issues and pull requests
- Open a new issue with the `question` label
- Contact the project maintainers

## Recognition

Contributors will be recognized in:
- The project README
- Release notes for significant contributions
- Special acknowledgments for major features

Thank you for contributing to make medicine availability more transparent and accessible! 🎉
