import LoginPage from '@/components/LoginPage';
import './App.css'; // Keep App.css for any App-specific global styles if needed

function App() {
  return (
    // Ensure this div takes full height and centers its content
    // The background color is now handled by body styles in index.css
    <div className="flex flex-col items-center justify-center min-h-full p-4">
      <LoginPage />
    </div>
  );
}

export default App;
