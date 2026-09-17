import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GrievanceProvider } from './context/GrievanceContext';
import AppRoutes from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GrievanceProvider>
          <AppRoutes />
        </GrievanceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
