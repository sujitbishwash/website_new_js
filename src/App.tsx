import React from "react";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { PostHogProvider } from "./contexts/PostHogContext";
import { router } from "./routes";

const App: React.FC = () => {
  return (
    <PostHogProvider>
      <AuthProvider>
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      </AuthProvider>
    </PostHogProvider>
  );
};

export default App;
