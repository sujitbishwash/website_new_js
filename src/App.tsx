import React from "react";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import { createAppRouter } from "./routes/config";

const App: React.FC = () => {
  const router = createAppRouter();

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
