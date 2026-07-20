import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "leaflet/dist/leaflet.css";

import "bootstrap-icons/font/bootstrap-icons.css";

import "./styles/theme.css";
import "./styles/layout.css";
import "./styles/dashboard.css";
import "./styles/crud.css";

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);