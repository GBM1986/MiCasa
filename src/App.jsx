import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from './layout/Layout.jsx';
import { Forside } from './pages/Forside.jsx'
import { SupabaseProvider } from './providers/SupabaseProvider.jsx';
import { AuthProvider } from './providers/AuthProvider.jsx';
import { Login } from './pages/Login.jsx';
import { Boliger } from './pages/Boliger.jsx';
import { Kontakt } from './pages/Kontakt.jsx';


function App() {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Define a layout wrapper for consistent page structure */}
            <Route path="/" element={<Layout />}>
            <Route index element={<Forside />} />
            <Route path='/boliger' element={<Boliger />} />
            <Route path='/kontakt' element={<Kontakt />} />
            <Route path="/login" element={<Login />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </SupabaseProvider>
  );
}

export default App;
