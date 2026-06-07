/* eslint-disable no-console */
import express, { json } from 'express';
const app = express();

app.use(json());

app.use((req, res, next) => {
  console.log('Incoming:', req.method, req.url);
  next();
});

interface User {
  id: number;
  name: string;
  email: string;
}

interface Contact {
  id: number;
  userId: number;
  type: string;
  value: string;
}

interface Profile {
  id: number;
  userId: number;
  bio: string;
  avatarUrl: string;
}

/* -------------------- In-Memory Data -------------------- */
let users: User[] = [];
let contacts: Contact[] = [];
let profiles: Profile[] = [];

/* -------------------- Health Check -------------------- */
app.get('/health', (req: express.Request, res: express.Response): void => {
  res.json({ status: 'OK', message: 'API is running' });
});

// --- Mocked health endpoints for advanced client testing ---
let healthFailCount = 0;
let healthFlapCount = 0;

// Fails first N times, then healthy (for retry test)
app.get('/mock-health-retry', (req: express.Request, res: express.Response) => {
  if (healthFailCount < 2) {
    healthFailCount++;
    res.status(503).json({ status: 'FAIL', message: 'Service Unavailable' });
  } else {
    healthFailCount = 0; // Reset for future calls
    res.json({ status: 'OK', message: 'Recovered' });
  }
});

// Flaps between fail and ok (for polling test)
app.get('/mock-health-poll', (req: express.Request, res: express.Response) => {
  healthFlapCount++;
  if (healthFlapCount % 3 === 0) {
    healthFlapCount = 0; // Reset for future calls
    res.json({ status: 'OK', message: 'Eventually Healthy' });
  } else {
    res.status(503).json({ status: 'FAIL', message: 'Still Unhealthy' });
  }
});

// Always slow (for delay/timeout test)
app.get('/mock-health-delay', async (req: express.Request, res: express.Response) => {
  await new Promise((r) => setTimeout(r, 1200));
  res.json({ status: 'OK', message: 'Slow but Healthy' });
});

/* ======================================================
   USER MANAGEMENT
   ====================================================== */

/**
 * Create User
 */
app.post('/users', (req: express.Request, res: express.Response): void => {
  const user = { id: Date.now(), ...req.body };
  users.push(user);
  res.status(201).json(user);
});

/**
 * Get All Users
 */
app.get('/users', (req: express.Request, res: express.Response): void => {
  res.json(users);
});

/**
 * Get User By ID
 */
app.get('/users/:id', (req: express.Request, res: express.Response): void => {
  const user = users.find((u) => u.id === Number(req.params.id));
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  user ? res.json(user) : res.status(404).json({ message: 'User not found' });
});

/**
 * Delete User
 */
app.delete('/users/:id', (req: express.Request, res: express.Response): void => {
  users = users.filter((u) => u.id !== Number(req.params.id));
  res.json({ message: 'User deleted' });
});

/* ======================================================
   CONTACT MANAGEMENT
   ====================================================== */

/**
 * Create Contact
 */
app.post('/contacts', (req: express.Request, res: express.Response): void => {
  const contact = { id: Date.now(), ...req.body };
  contacts.push(contact);
  res.status(201).json(contact);
});

/**
 * Get Contacts (Optional filter by userId)
 */
app.get('/contacts', (req: express.Request, res: express.Response): void => {
  const { userId } = req.query;
  console.log('Fetching contacts', { userId });
  if (userId) {
    res.json(contacts.filter((c) => c.userId === Number(userId)));
  }
  res.json(contacts);
});

/**
 * Delete Contact
 */
app.delete('/contacts/:id', (req: express.Request, res: express.Response): void => {
  contacts = contacts.filter((c) => c.id !== Number(req.params.id));
  res.json({ message: 'Contact deleted' });
});

/* ======================================================
   PROFILE MANAGEMENT
   ====================================================== */

/**
 * Create / Update Profile
 */
app.post('/profiles', (req: express.Request, res: express.Response): void => {
  const { userId } = req.body;
  profiles = profiles.filter((p) => p.userId != userId);

  const profile = { id: Date.now(), ...req.body };
  profiles.push(profile);
  res.status(201).json(profile);
});

/**
 * Get Profile By User ID
 */
app.get('/profiles/:userId', (req: express.Request, res: express.Response): void => {
  const profile = profiles.find((p) => {
    console.log('Checking profile:', p, 'against userId:', req.params.userId);
    return p.userId === Number(req.params.userId);
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  profile ? res.json(profile) : res.status(404).json({ message: 'Profile not found' });
});

/* -------------------- Server -------------------- */
const PORT = 3000;
app.listen(PORT, (): void => {
  console.log(`Server running on http://localhost:${PORT}`);
});
