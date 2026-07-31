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

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GlobalStyles />
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rotas Protegidas */}
          <Route element={<ProtectedRoute />}>
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