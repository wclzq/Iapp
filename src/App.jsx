import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { EventProvider } from './context/EventContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import AddEditEvent from './pages/AddEditEvent';
import EventDetail from './pages/EventDetail';
import Settings from './pages/Settings';
import Holidays from './pages/Holidays';
import Memories from './pages/Memories';

function SwipeHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const lastBackTime = useRef(0);

  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX.current;
      const deltaY = Math.abs(touchEndY - touchStartY.current);

      // 右滑检测：横向滑动距离 > 100px，纵向滑动 < 50px
      if (deltaX > 100 && deltaY < 50) {
        const now = Date.now();
        const isRootPath = ['/', '/holidays', '/memories', '/settings'].includes(location.pathname);

        if (isRootPath) {
          // 在根路径，检查是否双击退出
          if (now - lastBackTime.current < 2000) {
            // 2秒内第二次右滑，退出应用
            if (window.navigator && window.navigator.app) {
              window.navigator.app.exitApp();
            }
          } else {
            // 第一次右滑，记录时间
            lastBackTime.current = now;
          }
        } else {
          // 非根路径，返回上一页
          navigate(-1);
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [navigate, location.pathname]);

  return null;
}

function App() {
  return (
    <EventProvider>
      <BrowserRouter>
        <SwipeHandler />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="holidays" element={<Holidays />} />
            <Route path="memories" element={<Memories />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/add" element={<AddEditEvent />} />
        <Route path="/edit/:id" element={<AddEditEvent />} />
        <Route path="/event/:id" element={<EventDetail />} />
      </Routes>
      </BrowserRouter>
    </EventProvider>
  );
}

export default App;
