
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import App from "./App";
import store from "./app/store/store";
import CartPersistence from "./features/cart-persistence/model/CartPersistence";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
   <Auth0Provider
  domain="dev-dnlqg6d4ea85rsco.us.auth0.com"
  clientId="GrVE5zMKpSceLZ0ewqHAQDacXNHUeYtu"

authorizationParams={{
  redirect_uri: `${window.location.origin}/login`,
  audience: "https://stylebox-api",
}}

  cacheLocation="localstorage"
>
      <Provider store={store}>
        <BrowserRouter>
          <CartPersistence />
          <App />
        </BrowserRouter>
      </Provider>
    </Auth0Provider>
  </React.StrictMode>
);
