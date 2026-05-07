import { MOCK_USERS, MOCK_CONTENTS } from './mockData';

const DELAY = 400;
const STORAGE_KEY = 'edu_contents';

const delay = () => new Promise((r) => setTimeout(r, DELAY));

/* -----------------------------
   LOCAL STORAGE SETUP
------------------------------*/

// load from localStorage OR fallback to mock data
const loadContents = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : MOCK_CONTENTS;
};

// persist helper
const persist = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// single source of truth
let contents = loadContents();

/* -----------------------------
   API
------------------------------*/

export const mockApi = {
  async login({ email, password }) {
    await delay();

    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) throw new Error('Invalid credentials');

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        teacherId: user.teacherId ?? null,
      },
      token: `mock-jwt-${user.id}-${Date.now()}`,
    };
  },

  async getContents() {
    await delay();
    return [...contents];
  },

  async getContentsByTeacher(teacherId) {
    await delay();
    return contents.filter((c) => c.teacherId === teacherId);
  },

  async getLiveContent(teacherId) {
    await delay();

    const now = new Date();

    return contents.filter(
      (c) =>
        c.teacherId === teacherId &&
        c.status === 'approved' &&
        new Date(c.startTime) <= now &&
        new Date(c.endTime) >= now
    );
  },

  async uploadContent(payload) {
    await delay();

    const newItem = {
      id: `c${Date.now()}`,
      ...payload,
      status: 'pending',
      createdAt: new Date().toISOString(),
      rejectionReason: null,
    };

    contents = [newItem, ...contents];

    persist(contents);

    return newItem;
  },

  async approveContent(contentId) {
    await delay();

    const idx = contents.findIndex((c) => c.id === contentId);
    if (idx === -1) throw new Error('Content not found');

    contents[idx] = {
      ...contents[idx],
      status: 'approved',
      rejectionReason: null,
    };

    persist(contents);

    return contents[idx];
  },

  async rejectContent(contentId, reason) {
    await delay();

    const idx = contents.findIndex((c) => c.id === contentId);
    if (idx === -1) throw new Error('Content not found');

    contents[idx] = {
      ...contents[idx],
      status: 'rejected',
      rejectionReason: reason,
    };

    persist(contents); 

    return contents[idx];
  },
};