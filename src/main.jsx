import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './adri.css';
import AdminDashboard from './components/AdminDashboard.jsx';
import { PortfolioContentProvider } from './content-context.jsx';

const isAdminPage = /\/admin\/?$/.test(window.location.pathname) || window.location.hash === '#admin';

ReactDOM.createRoot(document.getElementById('root')).render(
 <React.StrictMode>
  {isAdminPage ? <AdminDashboard /> : <PortfolioContentProvider><App /></PortfolioContentProvider>}
 </React.StrictMode>
);
