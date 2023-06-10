import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";
import { PageLoader } from "./components/page-loader";
import { AuthenticationGuard } from "./components/authentication-guard";
import { Route, Routes } from "react-router-dom";
import { AdminPage } from "./pages/admin-page";
import { CallbackPage } from "./pages/callback-page";
import { HomePage } from "./pages/home-page";
import { NotFoundPage } from "./pages/not-found-page";
import { ProfilePage } from "./pages/profile-page";
import { ProtectedPage } from "./pages/protected-page";
import { PublicPage } from "./pages/public-page";

export const App: React.FC = () => {
  const { isLoading } = useAuth0();

  useEffect(() => {
    console.log('REACT_APP_AUTH0_DOMAIN:', process.env.REACT_APP_AUTH0_DOMAIN);
    console.log('REACT_APP_AUTH0_CLIENT_ID:', process.env.REACT_APP_AUTH0_CLIENT_ID);
    console.log('REACT_APP_AUTH0_CALLBACK_URL:', process.env.REACT_APP_AUTH0_CALLBACK_URL);
    console.log('REACT_APP_AUTH0_AUDIENCE:', process.env.REACT_APP_AUTH0_AUDIENCE);
    console.log('REACT_APP_API_SERVER_URL:', process.env.REACT_APP_API_SERVER_URL);
  }, []);

  if (isLoading) {
    return (
      <div className="page-layout">
        <PageLoader />
      </div>
    );
  }
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/profile"
        element={<AuthenticationGuard component={ProfilePage} />}
      />
      <Route path="/public" element={<PublicPage />} />
      <Route
        path="/protected"
        element={<AuthenticationGuard component={ProtectedPage} />}
      />
      <Route
        path="/admin"
        element={<AuthenticationGuard component={AdminPage} />}
      />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
