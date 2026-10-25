import { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './context/SoundContext';
import Home from './pages/Home';
import ProjectDetailPage from './pages/ProjectDetailPage';
import { PROJECTS_DATA } from './components/PortfolioSection';
import './App.css';

export default function App() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const syncPath = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', syncPath);
    return () => window.removeEventListener('popstate', syncPath);
  }, []);

  const openProject = (projectId) => {
    window.history.pushState({ fromPortfolio: true }, '', `/project/${projectId}`);
    setPathname(window.location.pathname);
    window.scrollTo(0, 0);
  };

  const backToPortfolio = () => {
    if (window.history.state?.fromPortfolio) {
      window.history.back();
      return;
    }

    window.history.pushState({}, '', '/#Portofolio');
    setPathname('/');
    window.requestAnimationFrame(() => {
      document.getElementById('Portofolio')?.scrollIntoView();
    });
  };

  const projectMatch = pathname.match(/^\/project\/([^/]+)\/?$/);
  const projectId = projectMatch ? decodeURIComponent(projectMatch[1]) : null;
  const project = PROJECTS_DATA.find((item) => item.id === projectId);

  return (
    <ThemeProvider>
      <SoundProvider>
        {project ? (
          <ProjectDetailPage project={project} onBack={backToPortfolio} />
        ) : (
          <Home onOpenProject={openProject} />
        )}
      </SoundProvider>
    </ThemeProvider>
  )
}
