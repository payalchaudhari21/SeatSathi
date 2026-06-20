import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { LogProvider } from './context/LogContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { RiskCheck } from './pages/RiskCheck';
import { Stretches } from './pages/Stretches';
import { FindHelp } from './pages/FindHelp';
import { DailyLog } from './pages/DailyLog';

function App() {
  return (
    <LanguageProvider>
      <LogProvider>
        <AuthProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                {/* Public Route */}
                <Route path="/" element={<Home />} />
                
                {/* Protected Routes */}
                <Route path="/risk-check" element={
                  <ProtectedRoute>
                    <RiskCheck />
                  </ProtectedRoute>
                } />
                <Route path="/stretches" element={
                  <ProtectedRoute>
                    <Stretches />
                  </ProtectedRoute>
                } />
                <Route path="/find-help" element={
                  <ProtectedRoute>
                    <FindHelp />
                  </ProtectedRoute>
                } />
                <Route path="/daily-log" element={
                  <ProtectedRoute>
                    <DailyLog />
                  </ProtectedRoute>
                } />
              </Routes>
            </Layout>
          </BrowserRouter>
        </AuthProvider>
      </LogProvider>
    </LanguageProvider>
  );
}

export default App;
