export const SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'History',
  'Geography',
  'Art',
  'Music',
  'Physical Education',
  'Computer Science',
  'Biology',
];

export const MOCK_USERS = [
  {
    id: 'u1',
    name: 'Principal Adams',
    email: 'principal@school.com',
    password: 'password123',
    role: 'principal',
  },
  {
    id: 't1',
    name: 'Teacher Smith',
    email: 'teacher1@school.com',
    password: 'password123',
    role: 'teacher',
    teacherId: 't1',
  },
  {
    id: 't2',
    name: 'Teacher Johnson',
    email: 'teacher2@school.com',
    password: 'password123',
    role: 'teacher',
    teacherId: 't2',
  },
];

// Helper to create ISO dates relative to now
const daysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

const hoursFromNow = (hours) => {
  const d = new Date();
  d.setHours(d.getHours() + hours);
  return d.toISOString();
};

const addHours = (isoString, hours) => {
  const d = new Date(isoString);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
};

// Build the 20 content items: ~7 pending, ~9 approved, ~4 rejected
const buildContent = (
  id,
  title,
  subject,
  teacherId,
  teacherName,
  status,
  rejectionReason,
  createdDaysAgo,
  startOffsetHours,
  rotationDuration,
  description
) => {
  const startTime = hoursFromNow(startOffsetHours);
  return {
    id,
    title,
    subject,
    fileUrl: `https://picsum.photos/seed/${id}/800/600`,
    teacherId,
    teacherName,
    status,
    rejectionReason,
    createdAt: daysAgo(createdDaysAgo),
    startTime,
    endTime: addHours(startTime, 2),
    rotationDuration,
    description,
  };
};

export const MOCK_CONTENTS = [
  // ===== APPROVED (9) =====
  buildContent(
    'c1',
    'Introduction to Algebra',
    'Mathematics',
    't1',
    'Teacher Smith',
    'approved',
    null,
    2,
    -1, // started 1 hour ago — currently LIVE
    30,
    'Foundational concepts of algebraic expressions, variables, and equations for beginners.'
  ),
  buildContent(
    'c2',
    'Photosynthesis Explained',
    'Biology',
    't2',
    'Teacher Johnson',
    'approved',
    null,
    3,
    -0.5, // currently LIVE
    20,
    'A visual breakdown of how plants convert sunlight into energy.'
  ),
  buildContent(
    'c3',
    'World War II Timeline',
    'History',
    't1',
    'Teacher Smith',
    'approved',
    null,
    5,
    24, // upcoming tomorrow
    45,
    'A chronological journey through the major events of World War II.'
  ),
  buildContent(
    'c4',
    'Shakespeare: Romeo & Juliet',
    'English',
    't2',
    'Teacher Johnson',
    'approved',
    null,
    7,
    48,
    null,
    'Analysis of themes, characters, and language in Shakespeare\'s timeless tragedy.'
  ),
  buildContent(
    'c5',
    'Volcanoes of the World',
    'Geography',
    't1',
    'Teacher Smith',
    'approved',
    null,
    10,
    72,
    25,
    'Explore the most active volcanoes and the science behind volcanic eruptions.'
  ),
  buildContent(
    'c6',
    'Renaissance Art Movement',
    'Art',
    't2',
    'Teacher Johnson',
    'approved',
    null,
    12,
    -50, // ended (past)
    null,
    'Discover the masters of the Renaissance and their revolutionary techniques.'
  ),
  buildContent(
    'c7',
    'Python Programming Basics',
    'Computer Science',
    't1',
    'Teacher Smith',
    'approved',
    null,
    15,
    96,
    40,
    'Get started with Python — variables, loops, functions, and your first program.'
  ),
  buildContent(
    'c8',
    'The Solar System',
    'Science',
    't2',
    'Teacher Johnson',
    'approved',
    null,
    18,
    120,
    35,
    'A tour of the planets, moons, and celestial bodies in our cosmic neighborhood.'
  ),
  buildContent(
    'c9',
    'Classical Music Appreciation',
    'Music',
    't1',
    'Teacher Smith',
    'approved',
    null,
    20,
    -100, // past
    null,
    'Listen to and analyze masterpieces from Mozart, Beethoven, and Bach.'
  ),

  // ===== PENDING (7) =====
  buildContent(
    'c10',
    'Geometry: Triangles & Polygons',
    'Mathematics',
    't1',
    'Teacher Smith',
    'pending',
    null,
    1,
    36,
    30,
    'Master the properties of triangles, quadrilaterals, and other polygons.'
  ),
  buildContent(
    'c11',
    'Cell Biology Fundamentals',
    'Biology',
    't2',
    'Teacher Johnson',
    'pending',
    null,
    1,
    50,
    25,
    'Discover the building blocks of life: cells, organelles, and their functions.'
  ),
  buildContent(
    'c12',
    'Track & Field Techniques',
    'Physical Education',
    't1',
    'Teacher Smith',
    'pending',
    null,
    2,
    18,
    15,
    'Improve sprinting form, long jump approach, and shot put technique.'
  ),
  buildContent(
    'c13',
    'Chemistry: Acids and Bases',
    'Science',
    't2',
    'Teacher Johnson',
    'pending',
    null,
    3,
    60,
    20,
    'Understanding pH, neutralization reactions, and everyday chemistry.'
  ),
  buildContent(
    'c14',
    'Creative Writing Workshop',
    'English',
    't1',
    'Teacher Smith',
    'pending',
    null,
    4,
    80,
    null,
    'Develop your unique voice through prompts, exercises, and peer feedback.'
  ),
  buildContent(
    'c15',
    'Maps & Cartography',
    'Geography',
    't2',
    'Teacher Johnson',
    'pending',
    null,
    6,
    100,
    30,
    'Learn to read, interpret, and create maps using modern and classical tools.'
  ),
  buildContent(
    'c16',
    'Watercolor Painting Basics',
    'Art',
    't1',
    'Teacher Smith',
    'pending',
    null,
    8,
    144,
    null,
    'A gentle introduction to watercolor techniques, color mixing, and composition.'
  ),

  // ===== REJECTED (4) =====
  buildContent(
    'c17',
    'Advanced Calculus Concepts',
    'Mathematics',
    't2',
    'Teacher Johnson',
    'rejected',
    'Content level is too advanced for the target audience. Please simplify and resubmit.',
    9,
    -200,
    null,
    'Limits, derivatives, and integrals at the university level.'
  ),
  buildContent(
    'c18',
    'Modern History Debates',
    'History',
    't1',
    'Teacher Smith',
    'rejected',
    'Some referenced sources are not verified. Please review citations.',
    14,
    -300,
    20,
    'Examining controversial events of the 20th and 21st centuries.'
  ),
  buildContent(
    'c19',
    'Music Theory Advanced',
    'Music',
    't2',
    'Teacher Johnson',
    'rejected',
    null,
    16,
    -400,
    null,
    'Counterpoint, harmony, and advanced compositional techniques.'
  ),
  buildContent(
    'c20',
    'Machine Learning Intro',
    'Computer Science',
    't1',
    'Teacher Smith',
    'rejected',
    'Topic requires prerequisite knowledge not yet covered in curriculum.',
    25,
    -500,
    null,
    'A high-level overview of machine learning algorithms and applications.'
  ),
];
