import { useRef } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import { useScrollRestoration } from './hooks/useScrollRestoration.js';
import Home from './pages/Home.jsx';
import Skills from './pages/Skills.jsx';
import Projects from './pages/Projects.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  useScrollRestoration();
  const mainRef = useRef(null);

  return (
    <>
      <button
        type="button"
        className="skip-link"
        onClick={() => mainRef.current?.focus()}
      >
        Skip to content
      </button>

      <Navbar />

      <main ref={mainRef} tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}
