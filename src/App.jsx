import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import { MainLayout } from './components/Layout/MainLayout.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { TestCasesPage } from './pages/TestCasesPage.jsx';
import { ExecutionPage } from './pages/ExecutionPage.jsx';
import { AnalyticsPage } from './pages/AnalyticsPage.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';
import './styles/globals.css';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<MainLayout><Dashboard /></MainLayout>} path="/" />
          <Route element={<MainLayout><TestCasesPage /></MainLayout>} path="/test-cases" />
          <Route element={<MainLayout><ExecutionPage /></MainLayout>} path="/execution" />
          <Route element={<MainLayout><AnalyticsPage /></MainLayout>} path="/analytics" />
          <Route element={<MainLayout><SettingsPage /></MainLayout>} path="/settings" />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
