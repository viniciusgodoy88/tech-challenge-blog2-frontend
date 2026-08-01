import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { GlobalStyles } from './styles/GlobalStyles';

import { Home } from './pages/Home';
import { PostDetail } from './pages/PostDetail';
import { CreatePost } from './pages/CreatePost';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import Register from './pages/Register';

// Import da logo da FIAP para o favicon
import fiapLogo from './assets/fiap-logo.png';

export function App() {
  // Alteração dinâmica do favicon via hook do React para não causar tela branca
  useEffect(() => {
    const setFavicon = (iconUrl: string) => {
      let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.type = 'image/png';
      link.href = iconUrl;
    };

    setFavicon(fiapLogo);
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <GlobalStyles />
        <Routes>
          {/* ==============================================================================
              ROTAS PÚBLICAS
             ============================================================================== */}
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ==============================================================================
              ROTAS PROTEGIDAS (Acesso exclusivo para TEACHER ou SUPERADMIN)
             ============================================================================== */}
          <Route element={<ProtectedRoute allowedRoles={['SUPERADMIN', 'TEACHER']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/posts/new" element={<CreatePost />} />
            <Route path="/posts/edit/:id" element={<CreatePost />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;