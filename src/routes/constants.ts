// Route paths
export const ROUTES = {
    // Public routes
    LOGIN: '/login',
    NOT_FOUND: '*',

    // Protected routes
    DASHBOARD: '/dashboard',
    EXAM_GOAL: '/exam-goal',
    LINK_INPUT: '/link-input',
    TEST_SERIES: '/test-series',
    EXAM_INSTRUCTIONS: '/exam-instructions',
    EXAM_INSTRUCTIONS_SECOND: '/exam-instructions-second',
    QUIZ: '/quiz',
    HISTORY: '/history',
    CHAT: '/chat',
    FLASHCARDS: '/flashcards',
    QUIZZES: '/quizzes',
} as const;

// Route groups
export const ROUTE_GROUPS = {
    AUTH: 'authentication',
    DASHBOARD: 'dashboard',
    EXAM: 'exam',
    TEST: 'test',
    QUIZ: 'quiz',
} as const;

// Default redirects
export const DEFAULT_REDIRECTS = {
    AUTHENTICATED: '/exam-goal',
    UNAUTHENTICATED: '/login',
} as const;

// Route metadata
export const ROUTE_METADATA = {
    [ROUTES.LOGIN]: {
        title: 'Login',
        description: 'Sign in to your account',
        requiresAuth: false,
    },
    [ROUTES.DASHBOARD]: {
        title: 'Dashboard',
        description: 'Your learning dashboard',
        requiresAuth: true,
    },
    [ROUTES.EXAM_GOAL]: {
        title: 'Exam Goal',
        description: 'Set your exam goals',
        requiresAuth: true,
    },
    [ROUTES.LINK_INPUT]: {
        title: 'Link Input',
        description: 'Input learning links',
        requiresAuth: true,
    },
    [ROUTES.TEST_SERIES]: {
        title: 'Test Series',
        description: 'Practice with test series',
        requiresAuth: true,
    },
    [ROUTES.EXAM_INSTRUCTIONS]: {
        title: 'Exam Instructions',
        description: 'Read exam instructions',
        requiresAuth: true,
    },
    [ROUTES.EXAM_INSTRUCTIONS_SECOND]: {
        title: 'Exam Instructions (Second)',
        description: 'Additional exam instructions',
        requiresAuth: true,
    },
    [ROUTES.QUIZ]: {
        title: 'Quiz',
        description: 'Take a quiz',
        requiresAuth: true,
    },
    [ROUTES.HISTORY]: {
        title: 'History',
        description: 'View your history',
        requiresAuth: true,
    },
    [ROUTES.CHAT]: {
        title: 'Chat',
        description: 'Chat with our AI',
        requiresAuth: true,
    },
    [ROUTES.FLASHCARDS]: {
        title: 'Flashcards',
        description: 'View your flashcards',
        requiresAuth: true,
    },
    [ROUTES.QUIZZES]: {
        title: 'Quizzes',
        description: 'View your quizzes',
        requiresAuth: true,
    },
} as const; 