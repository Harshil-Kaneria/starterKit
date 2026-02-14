# Admin Structure (Implemented)

Frontend now uses:

- Feature hooks per domain (`features/auth`, `features/admin`, `features/user`, `features/policy`)
- React Query provider for query/mutation lifecycle
- Central axios instance with request ID + global 401 handling
- Encrypted response decryption in API layer

## Migration direction

Continue moving any remaining raw API calls from views into feature hooks.

Recommended pattern:

- Feature hook handles data fetching/mutation
- View only handles UI rendering + user interactions
- Common errors and retries handled by React Query defaults
