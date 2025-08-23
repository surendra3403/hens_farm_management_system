import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

console.log('main.jsx: Starting application...');
console.log('main.jsx: Base URL:', import.meta.env.BASE_URL);
console.log('main.jsx: Mode:', import.meta.env.MODE);

const rootElement = document.getElementById("root");
console.log('main.jsx: Root element found:', !!rootElement);

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter basename="/hens_farm_management_system">
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
  console.log('main.jsx: App rendered successfully');
} else {
  console.error('main.jsx: Root element not found!');
}
