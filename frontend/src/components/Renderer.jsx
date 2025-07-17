import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Renderer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const currentPath = location.pathname;
    const quizStarted = sessionStorage.getItem('quizStarted');
    const user = sessionStorage.getItem('user');
    const completed = sessionStorage.getItem('completed');
    const isAdminLoggedIn = sessionStorage.getItem('isAdminLoggedIn') === 'true';
    const navigationType = performance.getEntriesByType('navigation')[0]?.type;
    const isReload = navigationType === 'reload';
    const isBack = navigationType === 'back_forward';

    // ✅ If on admin-login, clear all session data
    if (currentPath === '/admin-login') {
      sessionStorage.clear();
      sessionStorage.setItem('quizStarted', 'false');
      sessionStorage.setItem('completed', 'false');

      // Redirect if not logged in as admin
      if (!isAdminLoggedIn) {
        navigate('/admin-login', { replace: true });
        return;
      }
    }

    // 🔒 Block access to admin-only pages unless admin is logged in
    const adminOnlyRoutes = ['/add', '/SnD','/admin'];
    const isAdminRoute = adminOnlyRoutes.some(route => currentPath.startsWith(route));
    if (isAdminRoute && !isAdminLoggedIn) {
      navigate('/admin-login', { replace: true });
      return;
    }

    // 🚫 Block quiz-related routes if user session is not valid
    const publicRoutes = ['/', '/admin-login'];
    const isPublicRoute = publicRoutes.includes(currentPath);
    if (
      !isPublicRoute &&
      !isAdminRoute &&
      (!quizStarted || quizStarted !== 'true' || !user)
    ) {
      sessionStorage.clear();
      navigate('/', { replace: true });
      return;
    }

    // 🔄 Prevent reload or back navigation to protected routes
    if ((isReload || isBack) && currentPath !== '/') {
      sessionStorage.clear();
      window.location.replace('/');
    }

    // 🛠 Admin "exit" marker for completion
    const previousPath = prevPathRef.current;
    if (previousPath === '/admin-login' && currentPath !== '/admin-login') {
      if (completed !== 'true') {
        sessionStorage.setItem('completed', 'true');
      }
    }

    prevPathRef.current = currentPath;
  }, [location.pathname]);

  return null;
};

export default Renderer;
