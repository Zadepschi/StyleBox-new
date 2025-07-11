import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom"; // ✅ Добавь это
import App from "./App";
import store from "./redux/store";
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Auth0Provider
    domain="dev-24okm8n0usxsx062.us.auth0.com"
    clientId="llaPE6KhZlTkmh1Wf2Han1avjlzEMUyf"
    authorizationParams={{
      redirect_uri: "https://stylebox-shop.vercel.app/login" 
    }}
  >
    <Provider store={store}>
      <BrowserRouter> {/* ✅ Оберни App в BrowserRouter */}
        <App />
      </BrowserRouter>
    </Provider>
    </Auth0Provider>
  </React.StrictMode>
);
