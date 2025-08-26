import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import BeatForm from '../components/BeatForm/BeatForm.jsx';
import AuthPage from '../pages/AuthPage/AuthPage.jsx';
import HistoryPage from '../pages/HistoryPage/HistoryPage.jsx';
import ResultPage from '../pages/ResultPage/ResultPage.jsx';
import AppLayout from '../layouts/AppLayout.jsx';

import { getToken, getUser } from '../utilities/users-service.js';

export default function AppRouter() {
  const [user, setUser] = useState(getUser());
  const token = getToken();

  // helper to pass {user, setUser} into pages
  const withProps = (el) => React.cloneElement(el, { user, setUser });

  return (
    <BrowserRouter>
      <Routes>
        {/* 👉 If already logged in, /auth should immediately go to "/" */}
        <Route
          path="/auth"
          element={token ? <Navigate to="/" replace /> : withProps(<AuthPage />)}
        />

        {/* Protected shell with sidebar for authed routes */}
        <Route
          element={token ? withProps(<AppLayout />) : <Navigate to="/auth" replace />}
        >
          <Route index element={<BeatForm />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/results/:id" element={<ResultPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={token ? '/' : '/auth'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}