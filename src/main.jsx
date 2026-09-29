import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import SiteEntrance from './SiteEntrance.jsx';
import './styles.css';
import './home-sections.css';
import './site-entrance.css';

createRoot(document.getElementById('root')).render(<React.StrictMode><SiteEntrance><App /></SiteEntrance></React.StrictMode>);
