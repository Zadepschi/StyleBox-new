
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import "./styles/index.css";
import App from "./App";
import store from "./app/store/store";
import CartPersistence from "./features/cart-persistence/model/CartPersistence";

function Auth0ProviderWithNavigate({ children }) {
  const navigate = useNavigate();

  return (
    <Auth0Provider
      domain="dev-dnlqg6d4ea85rsco.us.auth0.com"
      clientId="GrVE5zMKpSceLZ0ewqHAQDacXNHUeYtu"
     authorizationParams={{
      redirect_uri: `${window.location.origin}/account`,
       audience: "https://stylebox-api",
       }}
      cacheLocation="localstorage"
      onRedirectCallback={(appState) => {
        navigate(appState?.returnTo || "/");
      }}
    >
      {children}
    </Auth0Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <Provider store={store}>
          <CartPersistence />
          <App />
        </Provider>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>
);
