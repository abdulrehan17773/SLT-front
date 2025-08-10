import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import store from './store/store.js';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { registerSW } from 'virtual:pwa-register';
import InstallPWAButton from './components/InstallPWAButton';

registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
});

const SplashScreen = () => {
  const text = "Sign Language Translator";
  const letters = text.split('');
  const [visibleLetters, setVisibleLetters] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLetters((prev) => {
        if (prev < letters.length) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <img
        src="/logo.png"
        alt="Logo"
        className="w-24 h-24 mb-4 animate-bounce"
      />
      <h1 className="text-2xl font-bold text-gray-800">
        {letters.slice(0, visibleLetters).map((letter, idx) => (
          <span key={idx} className="inline-block transition-opacity duration-200">
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        ))}
      </h1>
    </div>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const totalSplashDuration = 80 * "Sign Language Translator".length + 500;
    const timer = setTimeout(() => setShowSplash(false), totalSplashDuration);
    return () => clearTimeout(timer);
  }, []);

  return showSplash ? (
    <SplashScreen />
  ) : (
    <div>
      <RouterProvider router={router} />
      <InstallPWAButton />
    </div>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
