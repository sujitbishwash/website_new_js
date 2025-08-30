import React from "react";
import { useUser } from "../contexts/UserContext";

/**
 * Example component showing how to use stored user data
 * This component will use data from the UserContext without making API calls
 */
const UserDataExample: React.FC = () => {
  const {
    profile,
    examGoal,
    stats,
    isDataLoaded,
    isBackgroundLoading,
    isBackgroundSyncEnabled,
    startBackgroundSync,
    stopBackgroundSync,
    enableBackgroundSync,
    disableBackgroundSync,
  } = useUser();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">User Data Example</h2>

      {/* Status Indicators */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isDataLoaded ? "bg-green-500" : "bg-gray-400"
            }`}
          ></div>
          <span className="text-sm">
            Data Loaded: {isDataLoaded ? "Yes" : "No"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isBackgroundLoading ? "bg-blue-500" : "bg-gray-400"
            }`}
          ></div>
          <span className="text-sm">
            Background Sync: {isBackgroundLoading ? "Running" : "Idle"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isBackgroundSyncEnabled ? "bg-green-500" : "bg-gray-400"
            }`}
          ></div>
          <span className="text-sm">
            Sync Enabled: {isBackgroundSyncEnabled ? "Yes" : "No"}
          </span>
        </div>
      </div>

      {/* Profile Data */}
      {profile && (
        <div className="mb-4 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">Profile</h3>
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>ID:</strong> {profile.id}
          </p>
        </div>
      )}

      {/* Exam Goal Data */}
      {examGoal && (
        <div className="mb-4 p-4 bg-blue-50 rounded">
          <h3 className="font-semibold mb-2">Exam Goal</h3>
          <p>
            <strong>Exam:</strong> {examGoal.examType}
          </p>
          <p>
            <strong>Target Score:</strong> {examGoal.targetScore}%
          </p>
          <p>
            <strong>Current Score:</strong> {examGoal.currentScore}%
          </p>
          <p>
            <strong>Active:</strong> {examGoal.isActive ? "Yes" : "No"}
          </p>
        </div>
      )}

      {/* Stats Data */}
      {stats && (
        <div className="mb-4 p-4 bg-green-50 rounded">
          <h3 className="font-semibold mb-2">Statistics</h3>
          <p>
            <strong>Total Tests:</strong> {stats.totalTests}
          </p>
          <p>
            <strong>Completed:</strong> {stats.completedTests}
          </p>
          <p>
            <strong>Average Score:</strong> {stats.averageScore}%
          </p>
          <p>
            <strong>Best Score:</strong> {stats.bestScore}%
          </p>
        </div>
      )}

      {/* No Data Message */}
      {!isDataLoaded && !isBackgroundLoading && (
        <div className="p-4 bg-yellow-50 rounded">
          <p className="text-yellow-800">
            No stored data available. Navigate to the home page to start
            background sync.
          </p>
        </div>
      )}

      {/* Manual Controls */}
      <div className="mt-4 space-x-2">
        <button
          onClick={enableBackgroundSync}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Enable Background Sync
        </button>
        <button
          onClick={disableBackgroundSync}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Disable Background Sync
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
        <h4 className="font-semibold mb-2">How it works:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Data is automatically stored when you visit the home page</li>
          <li>Other components can access this data without API calls</li>
          <li>Background sync keeps data fresh every 5 minutes</li>
  
        </ul>
      </div>
    </div>
  );
};

export default UserDataExample;
