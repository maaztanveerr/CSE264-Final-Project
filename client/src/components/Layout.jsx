// Layout.jsx for global styling/themes/etc
import { useLocation } from "react-router-dom";

function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="layout-container">
      {/* key forces this wrapper to remount when the path changes */}
      <div key={location.pathname} className="page-transition">
        {children}
      </div>
    </div>
  );
}

export default Layout;