# LoadingScreen Component Usage Guide

The `LoadingScreen` component has been updated to support different skeleton types based on the component being loaded.

## 🎯 **Available Skeleton Types**

### 1. **Video Player Skeleton** (`video-player`)
- Shows video player aspect ratio
- Includes video controls (play, pause, volume, etc.)
- Perfect for YouTube player loading states

### 2. **Content Tabs Skeleton** (`content-tabs`)
- Shows tab navigation
- Displays content area with text lines
- Ideal for chapters, transcript, or content sections

### 3. **AI Tutor Panel Skeleton** (`ai-tutor-panel`)
- Shows AI tutor interface layout
- Includes tabs, content area, and input field
- Perfect for chat, flashcards, quiz, summary panels

### 4. **Full Page Skeleton** (`full-page`)
- Complete page layout with left and right columns
- Shows video player, controls, and sidebar
- Best for initial page loading

## 📝 **Usage Examples**

### Basic Usage
```tsx
import LoadingScreen from '@/components/ui/LoadingScreen';

<LoadingScreen
  isLoading={true}
  progress={75}
  message="Loading video content..."
  showSkeleton={true}
  skeletonType="video-player"
>
  {/* Your actual content goes here */}
</LoadingScreen>
```

### Video Player Loading
```tsx
import VideoPlayerSkeleton from '@/components/VideoPlayerSkeleton';

<VideoPlayerSkeleton
  isLoading={isVideoLoading}
  progress={videoProgress}
  message="Loading video player..."
>
  <YouTube videoId={videoId} />
</VideoPlayerSkeleton>
```

### Content Tabs Loading
```tsx
import ContentTabsSkeleton from '@/components/ContentTabsSkeleton';

<ContentTabsSkeleton
  isLoading={isChaptersLoading}
  progress={chaptersProgress}
  message="Loading chapters..."
>
  <ContentTabs chapters={chapters} />
</ContentTabsSkeleton>
```

### AI Tutor Panel Loading
```tsx
import AITutorPanelSkeleton from '@/components/AITutorPanelSkeleton';

<AITutorPanelSkeleton
  isLoading={isChatLoading}
  progress={chatProgress}
  message="Initializing AI tutor..."
>
  <AITutorPanel />
</AITutorPanelSkeleton>
```

## 🔧 **Props Interface**

```tsx
interface LoadingScreenProps {
  isLoading: boolean;           // Whether to show loading state
  progress: number;             // Progress percentage (0-100)
  message: string;             // Loading message
  showSkeleton?: boolean;      // Whether to show skeleton (default: false)
  skeletonType?: SkeletonType; // Type of skeleton to show
  children?: React.ReactNode;  // Content to show when not loading
}

type SkeletonType = 'video-player' | 'content-tabs' | 'ai-tutor-panel' | 'full-page';
```

## 🎨 **Features**

### **Progress Indicator**
- Shows percentage progress
- Animated progress bar
- Custom loading message

### **Skeleton Animations**
- Smooth pulse animations
- Realistic component shapes
- Responsive design

### **Type Safety**
- Full TypeScript support
- Proper prop validation
- IntelliSense autocomplete

## 🚀 **Integration Examples**

### In VideoPage Component
```tsx
// Full page loading
if (isLoadingVideo || (isApiLoading && apiProgress < 90)) {
  return (
    <LoadingScreen
      isLoading={true}
      progress={apiProgress}
      message={apiMessage}
      showSkeleton={true}
      skeletonType="full-page"
    />
  );
}

// Individual component loading
<LoadingScreen
  isLoading={isLoadingChapters}
  progress={chaptersProgress}
  message="Loading chapters..."
  showSkeleton={true}
  skeletonType="content-tabs"
>
  <ContentTabs chapters={chapters} />
</LoadingScreen>
```

### In AITutorPanel Component
```tsx
<LoadingScreen
  isLoading={isChatLoading}
  progress={chatProgress}
  message="Initializing chat..."
  showSkeleton={true}
  skeletonType="ai-tutor-panel"
>
  <Chat messages={messages} />
</LoadingScreen>
```

## 🎯 **Best Practices**

1. **Use appropriate skeleton types** for each component
2. **Show progress indicators** for better UX
3. **Provide meaningful messages** to users
4. **Keep loading states brief** when possible
5. **Use skeleton animations** for better perceived performance

## 🧪 **Testing**

Use the `SkeletonDemo` component to test different skeleton types:

```tsx
import SkeletonDemo from '@/components/SkeletonDemo';

// Add to your routes for testing
<SkeletonDemo />
```

This will show interactive buttons to test each skeleton type with realistic loading animations.

## 📱 **Responsive Design**

All skeleton types are responsive and will adapt to:
- Mobile screens
- Tablet screens  
- Desktop screens
- Different aspect ratios

The skeletons maintain proper proportions and spacing across all device sizes.
