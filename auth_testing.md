# Auth-Gated App Testing Playbook — PureFit Customs

Authentication: Emergent Google OAuth (restricted to `purefit2026@gmail.com` only).

## Quick Test Identity Setup
```bash
mongosh --eval "
use('test_database');
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  user_id: 'admin_test_' + Date.now(),
  email: 'purefit2026@gmail.com',
  name: 'PureFit Admin (Test)',
  picture: 'https://via.placeholder.com/150',
  is_admin: true,
  created_at: new Date()
});
db.user_sessions.insertOne({
  user_id: 'admin_test_' + Date.now(),
  email: 'purefit2026@gmail.com',
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('Session token: ' + sessionToken);
"
```

## Endpoints to Test
- `GET /api/auth/me` — should return current admin user when cookie/Bearer is valid; 401 otherwise.
- `POST /api/auth/logout` — clears session.
- `GET /api/admin/quotes` — admin only.
- `GET /api/admin/messages` — admin only.
- `POST /api/admin/upload` — admin only.
- `POST /api/admin/site-content` — admin only.

## Browser Testing
```python
await page.context.add_cookies([{
    "name": "session_token",
    "value": "YOUR_SESSION_TOKEN",
    "domain": "events-reimagined.preview.emergentagent.com",
    "path": "/",
    "httpOnly": True,
    "secure": True,
    "sameSite": "None",
}])
await page.goto("https://events-reimagined.preview.emergentagent.com/admin")
```

## Allowlist
Only `purefit2026@gmail.com` may sign in. All other Google accounts are rejected with HTTP 403 from `/api/auth/session`.

## Success Indicators
- `/api/auth/me` returns user with `is_admin: true`.
- Public `GET /api/quotes` is no longer allowed (now admin-only via `/api/admin/quotes`).
- POST `/api/quotes` from public still works (lead capture).
- Email notification is sent to `purefit2026@gmail.com` on every public quote submit.

## Failure Indicators
- Non-allowlisted email gets `200` from `/api/auth/session` (should be `403`).
- `/api/admin/*` endpoints accessible without cookie/Bearer.
