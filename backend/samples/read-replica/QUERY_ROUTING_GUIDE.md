# Query Routing Guide (Sample)

## Always Writer
- Any `INSERT/UPDATE/DELETE`
- Login, OTP verification, token/session changes
- Admin changes (register/update/delete admin/user)
- Policy edit updates

## Replica Preferred
- Admin list, user list, policy fetch pages
- Dashboard counters (if small lag is acceptable)
- Read-only reporting queries

## Force Writer Read (`useMaster: true`)
Use this for read-after-write consistency:
- Immediately after profile update, fetching same profile
- Immediately after delete/update action when UI must reflect exact latest state

## Fallback Strategy
- If replica lag is above threshold (for example >2s), temporarily route to writer.
- If replica endpoint is unhealthy, auto-fallback to writer.

## Suggested Environment Variables
- `DB_WRITE_HOST`
- `DB_WRITE_PORT`
- `DB_WRITE_USER`
- `DB_WRITE_PASS`
- `DB_READ_HOST_1`
- `DB_READ_PORT_1`
- `DB_READ_USER_1`
- `DB_READ_PASS_1`
- `DB_READ_HOST_2`
- `DB_READ_PORT_2`
- `DB_READ_USER_2`
- `DB_READ_PASS_2`
- `DB_NAME`
