import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './context/SoundContext';
import Home from './pages/Home';
import './App.css';

export default function App() {
  return (
    <ThemeProvider>
      <SoundProvider>
        <Home />
        <Analytics />
      </SoundProvider>
    </ThemeProvider>
  );
}
