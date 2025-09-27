# PostHog Analytics Setup

This project has been integrated with PostHog for comprehensive analytics tracking.

## Setup Instructions

### 1. Create a PostHog Account
- Go to [PostHog.com](https://posthog.com) and create an account
- Create a new project in your PostHog dashboard

### 2. Get Your Project Key
- In your PostHog dashboard, go to Project Settings
- Copy your Project API Key (starts with `phc_`)

### 3. Configure Environment Variables
Create a `.env` file in the root directory with the following variables:

```bash
# PostHog Analytics Configuration
VITE_POSTHOG_KEY=your_posthog_project_key_here
VITE_POSTHOG_HOST=https://app.posthog.com
```

Replace `your_posthog_project_key_here` with your actual PostHog project key.

### 4. Example Configuration
```bash
VITE_POSTHOG_KEY=phc_1234567890abcdef1234567890abcdef12345678
VITE_POSTHOG_HOST=https://app.posthog.com
```

## Analytics Events Tracked

### User Events
- `user_logged_in` - When a user logs in
- `user_logged_out` - When a user logs out
- `profile_updated` - When user profile is updated

### Page Events
- `page_viewed` - Automatic page view tracking for all routes

### Video Learning Events
- `video_started` - When a video starts playing
- `video_progress` - Video progress updates (throttled)
- `video_completed` - When a video is completed

### Test Events
- `test_started` - When a test begins
- `test_submitted` - When a test is submitted
- `test_completed` - When test results are viewed

### Learning Events
- `flashcard_viewed` - When flashcards are viewed
- `quiz_attempted` - When quiz questions are answered
- `summary_viewed` - When summaries are viewed

### Feature Usage
- `feature_used` - General feature usage tracking
- `search_performed` - Search functionality usage

### Error Tracking
- `error_occurred` - Application errors and exceptions

## Usage in Components

### Basic Analytics Hook
```typescript
import { useAnalytics } from '../hooks/useAnalytics';

const MyComponent = () => {
  const { trackFeatureUsed, trackError } = useAnalytics();
  
  const handleClick = () => {
    trackFeatureUsed('button_clicked', { button_name: 'submit' });
  };
  
  return <button onClick={handleClick}>Click me</button>;
};
```

### Direct PostHog Access
```typescript
import { usePostHog } from '../contexts/PostHogContext';

const MyComponent = () => {
  const { capture, identify } = usePostHog();
  
  const handleCustomEvent = () => {
    capture('custom_event', { custom_property: 'value' });
  };
};
```

## Privacy and GDPR Compliance

PostHog includes built-in privacy features:
- User identification is only done for authenticated users
- Session data is automatically managed
- Users can be identified and their data can be deleted upon request

## Development vs Production

- In development, PostHog will log events to the console for debugging
- In production, events are sent to your PostHog instance
- If no PostHog key is provided, analytics will be disabled gracefully

## Troubleshooting

### Analytics Not Working
1. Check that `VITE_POSTHOG_KEY` is set correctly
2. Verify the key starts with `phc_`
3. Check browser console for PostHog initialization messages
4. Ensure you're using the correct PostHog host URL

### Events Not Appearing
1. Check PostHog dashboard for incoming events
2. Verify network requests are being made to PostHog
3. Check browser developer tools for any blocked requests
4. Ensure ad-blockers aren't blocking PostHog requests

## Custom Events

To add custom analytics events, use the `useAnalytics` hook:

```typescript
const { capture } = useAnalytics();

// Custom event
capture('custom_event_name', {
  property1: 'value1',
  property2: 'value2'
});
```

## PostHog Dashboard

Once configured, you can view analytics in your PostHog dashboard:
- **Events**: View all tracked events
- **Persons**: User profiles and behavior
- **Insights**: Create charts and funnels
- **Feature Flags**: A/B testing capabilities
- **Session Recordings**: User session replays
