import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from './layout/Layout.jsx';
import { Forside } from './pages/Forside.jsx'

function App() {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Define a layout wrapper for consistent page structure */}
            <Route path="/" element={<Layout />}>
            <Route index element={<Forside />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </SupabaseProvider>
  );
}

export default App;
