import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Protected({ children, authentication = true, dashboard = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    // Handle dashboard access control
    if (dashboard) {
      if (!userData?.user?.role?.includes("Admin")) {
        navigate('/');
        setLoader(false);
        return;
      }
    }

    // Redirect Admin to dashboard after login
    if (
      authStatus === true &&
      userData?.user?.role?.includes("Admin") &&
      location.pathname == '/login'
    ) {
      navigate('/dashboard');
      setLoader(false);
      return;
    }

    if (authentication && authStatus !== authentication) {
      navigate('/login');
    } else if (!authentication && authStatus !== authentication) {
      navigate('/');
    }
    setLoader(false);
  }, [authStatus, navigate, authentication, dashboard, userData, location.pathname]);

  if (loader) {
    return <div>Loading...</div>;
  }

  if (authentication === authStatus) {
    return children;
  }
  return null;
}
