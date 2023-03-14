import { BrowserRouter } from 'react-router-dom';
import { AppStateProvider } from './state/appState';
import AppLayout from './layout/AppLayout';
import AppRouter from './router/AppRouter';
import './App.css';

export default function App() {
  const urlPathSegments = window.location.pathname.split('/');
  const rootPath = `${urlPathSegments[1]}`;
  const initialState = { user: null };

  return (
    <div className="App">
      <BrowserRouter basename={rootPath}>
        <AppStateProvider initialState={initialState}>
          <AppLayout>
            <AppRouter />
          </AppLayout>
        </AppStateProvider>
      </BrowserRouter>
    </div>
  );
}
