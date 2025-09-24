// Route constants for consistent usage across the application
export const ROUTES = {
    // Main routes
    HOME: "/",
    SPLASH: "/splash",

    // Test related routes
    TEST_SERIES: "/test-series",
    EXAM_INFO: "/exam-info",
    EXAM_RECONFIRM: "/exam-reconfirm",
    TEST_MAIN_PAGE: "/test-main-page/:id",
    TEST_SOLUTION: "/test-main-page/:id/solutions",
    ANALYSIS_ARCHIVE: "/analysis_archive",
    ANALYSIS: "/analysis",

    // Learning routes
    HISTORY: "/history",
    BOOKS: "/books",
    VIDEO_LEARNING: "/video-learning",
    OUT_OF_SYLLABUS: "/out-of-syllabus",

    // User routes
    REFER_AND_EARN: "/refer-and-earn",
    PREMIUM: "/premium",

    // Payment routes
    PAYMENT: "/payment",
    PAYMENT_SUCCESS: "/payment-success",

    // Tool routes
    CHAT: "/chat",
    FLASHCARDS: "/flashcards",

    // Coming soon routes
    PREVIOUS_YEAR_PAPERS: "/previous-year-papers",
    ATTEMPTED_TESTS_ARCHIVE: "/attempted-tests_archive",
    ATTEMPTED_TESTS: "/attempted-tests",

    // Auth routes
    LOGIN: "/login",
    PERSONAL_DETAILS: "/personal-details",
    EXAM_GOAL: "/exam-goal",

    // policy routes
    PRIVACY_POLICY: "/privacy-policy",
    TERMS_AND_CONDITIONS: "/terms-and-conditions",
    AUTH_CALLBACK: "/auth/callback",

    STATS: "/stats"
} as const;

// Route names for navigation
export const ROUTE_NAMES = {
    [ROUTES.HOME]: "Home",
    [ROUTES.SPLASH]: "Welcome",
    [ROUTES.TEST_SERIES]: "Test Series",
    [ROUTES.EXAM_INFO]: "Exam Information",
    [ROUTES.EXAM_RECONFIRM]: "Exam Reconfirmation",
    [ROUTES.TEST_MAIN_PAGE]: "Test Main Page",
    [ROUTES.ANALYSIS_ARCHIVE]: "Detailed Analysis",
    [ROUTES.ANALYSIS]: "Detailed Analysis2",
    [ROUTES.HISTORY]: "History",
    [ROUTES.BOOKS]: "Books",
    [ROUTES.VIDEO_LEARNING]: "Video Learning",
    [ROUTES.OUT_OF_SYLLABUS]: "Out of Syllabus",
    [ROUTES.REFER_AND_EARN]: "Refer and Earn",
    [ROUTES.PREMIUM]: "Premium",
    [ROUTES.PAYMENT]: "Payment",
    [ROUTES.PAYMENT_SUCCESS]: "Payment Success",
    [ROUTES.CHAT]: "Chat",
    [ROUTES.FLASHCARDS]: "Flashcards",
    [ROUTES.PREVIOUS_YEAR_PAPERS]: "Previous Year Papers",
    [ROUTES.ATTEMPTED_TESTS_ARCHIVE]: "Attempted Tests",
    [ROUTES.ATTEMPTED_TESTS]: "Attempted Tests2",
    [ROUTES.LOGIN]: "Login",
    [ROUTES.PERSONAL_DETAILS]: "Personal Details",
    [ROUTES.EXAM_GOAL]: "Exam Goal",
    [ROUTES.PRIVACY_POLICY]: "Privacy Policy",
    [ROUTES.TERMS_AND_CONDITIONS]: "Terms and Conditions",
    [ROUTES.AUTH_CALLBACK]: "Auth Callback",
    [ROUTES.STATS]: "Stats",
    [ROUTES.TEST_SOLUTION]: "Test Solution",
} as const;

// Helper function to build video learning route with ID
export const buildVideoLearningRoute = (videoId: string) => `${ROUTES.VIDEO_LEARNING}/${videoId}`;

// Helper function to build auth callback route with token
export const buildAuthCallbackRoute = (token: string) => `${ROUTES.AUTH_CALLBACK}?token=${encodeURIComponent(token)}`;

// Type for route values
export type RouteValue = typeof ROUTES[keyof typeof ROUTES];
