# Admin Panel

## What Changed

This admin frontend is improved for developer productivity and maintainability.

- Feature-first hooks (`features/auth`, `features/admin`, `features/user`, `features/policy`)
- React Query added for API caching/mutations
- Centralized env validation
- Request interceptor adds `x-request-id`
- Global 401 interceptor handles auth expiry
- Backend encrypted payloads are decrypted in service layer

## Structure Additions

```txt
src/
  features/
    auth/hooks.js
    admin/hooks.js
    user/hooks.js
    policy/hooks.js
  providers/
    ReactQueryProvider.jsx
  services/
    axiosInstance.js
    apiService.js
    responseCrypto.js
```

## Environment

```env
NEXT_PUBLIC_APP_NAME=NutriScan
NEXT_PUBLIC_APP_COOKIE_NAME=nutriscan
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_RESPONSE_ENCRYPTION_ENABLED=true
NEXT_PUBLIC_RESPONSE_ENCRYPTION_KEY=use_same_secret_as_backend
```

## Notes

- `NEXT_PUBLIC_RESPONSE_ENCRYPTION_ENABLED` must match backend `RESPONSE_ENCRYPTION_ENABLED`.
- `NEXT_PUBLIC_RESPONSE_ENCRYPTION_KEY` must match backend `RESPONSE_ENCRYPTION_KEY`.
- If encryption is enabled and key mismatches, all API parsing will fail.

## Setup

```bash
npm install
npm run dev
```
