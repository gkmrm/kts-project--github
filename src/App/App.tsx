import RepoPage from '@pages/RepoPage';
import Repositories from '@pages/Repositories';
import { Routes, Route, Navigate } from 'react-router-dom';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Repositories />} />
      <Route path="/repo/:owner/:name" element={<RepoPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
