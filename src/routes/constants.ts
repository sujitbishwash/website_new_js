// Route constants for consistent usage across the application
export const ROUTES = {
    // Main routes
    HOME: "/",
    DASHBOARD: "/home",

    // Test related routes
    TEST_SERIES: "/test-series",
    EXAM_INFO: "/exam-info",
    EXAM_RECONFIRM: "/exam-reconfirm",
    TEST_MAIN_PAGE: "/test-main-page",
    ANALYSIS: "/analysis",

    // Learning routes
    HISTORY: "/history",
    BOOKS: "/books",
    VIDEO_LEARNING: "/video-learning",

    // User routes
    REFER_AND_EARN: "/refer-and-earn",
    PREMIUM: "/premium",

    // Tool routes
    CHAT: "/chat",
    FLASHCARDS: "/flashcards",

    // Coming soon routes
    PREVIOUS_YEAR_PAPERS: "/previous-year-papers",
    ATTEMPTED_TESTS: "/attempted-tests",
    EXAMS: "/exams",

    // Auth routes
    LOGIN: "/login",
    PERSONAL_DETAILS: "/personal-details",
    EXAM_GOAL: "/exam-goal",

    // policy routes
    PRIVACY_POLICY: "/privacy-policy",
    TERMS_AND_CONDITIONS: "/terms-and-conditions",
    AUTH_CALLBACK: "/auth/callback",

    // policy routes
    PRIVACY_POLICY: "/privacy-policy",
    TERMS_AND_CONDITIONS: "/terms-and-conditions",
} as const;

// Route names for navigation
export const ROUTE_NAMES = {
    [ROUTES.HOME]: "Home",
    [ROUTES.DASHBOARD]: "Home",
    [ROUTES.TEST_SERIES]: "Test Series",
    [ROUTES.EXAM_INFO]: "Exam Information",
    [ROUTES.EXAM_RECONFIRM]: "Exam Reconfirmation",
    [ROUTES.TEST_MAIN_PAGE]: "Test Main Page",
    [ROUTES.ANALYSIS]: "Detailed Analysis",
    [ROUTES.HISTORY]: "History",
    [ROUTES.BOOKS]: "Books",
    [ROUTES.VIDEO_LEARNING]: "Video Learning",
    [ROUTES.REFER_AND_EARN]: "Refer and Earn",
    [ROUTES.PREMIUM]: "Premium",
    [ROUTES.CHAT]: "Chat",
    [ROUTES.FLASHCARDS]: "Flashcards",
    [ROUTES.PREVIOUS_YEAR_PAPERS]: "Previous Year Papers",
    [ROUTES.ATTEMPTED_TESTS]: "Attempted Tests",
    [ROUTES.EXAMS]: "Exams",
    [ROUTES.LOGIN]: "Login",
    [ROUTES.PERSONAL_DETAILS]: "Personal Details",
    [ROUTES.EXAM_GOAL]: "Exam Goal",
    [ROUTES.PRIVACY_POLICY]: "Privacy Policy",
    [ROUTES.TERMS_AND_CONDITIONS]: "Terms and Conditions",
    [ROUTES.AUTH_CALLBACK]: "Auth Callback",
    [ROUTES.PRIVACY_POLICY]: "Privacy Policy",
    [ROUTES.TERMS_AND_CONDITIONS]: "Terms and Conditions",
} as const;

// Helper function to build video learning route with ID
export const buildVideoLearningRoute = (videoId: string) => `${ROUTES.VIDEO_LEARNING}/${videoId}`;

// Type for route values
export type RouteValue = typeof ROUTES[keyof typeof ROUTES];
