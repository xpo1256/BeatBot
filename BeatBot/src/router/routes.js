// src/router/routes.js
import BeatForm from '../components/BeatForm/BeatForm';
import AuthPage from '../pages/AuthPage/AuthPage';
import HistoryPage from '../pages/HistoryPage/HistoryPage';
import ResultPage from '../pages/ResultPage/ResultPage';

const routes = [
  { key: 'Home', path: '/', element: <BeatForm />, isPrivate: true },
  { key: 'Auth', path: '/auth', element: <AuthPage />, isPrivate: false },
  { key: 'History', path: '/history', element: <HistoryPage />, isPrivate: true },
  { key: 'Result', path: '/results/:id', element: <ResultPage />, isPrivate: true },
];

export default routes;