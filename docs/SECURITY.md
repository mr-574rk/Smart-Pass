# Security Practices

## Password Generation
- Uses `window.crypto.getRandomValues()` for cryptographically secure randomness
- Ensures uniform distribution across selected character sets
- No biases or predictable patterns in generation

## Data Handling
- No passwords are stored or transmitted
- All processing happens client-side
- No tracking or analytics implemented

## Browser Security
- Requires HTTPS for clipboard API
- Implements Content Security Policy
- Validates all user inputs