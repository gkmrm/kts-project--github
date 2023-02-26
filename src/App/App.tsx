import React from 'react';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { RepoPage } from './pages/RepoPage';
import { Repositories } from './pages/Repositories';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Repositories />} />
        <Route path="/repo/:owner" element={<Repositories />} />
        <Route path="/repo/:owner/:name" element={<RepoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
