import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import './homepage-polish.css';
import './about-refinements.css';

const root=document.getElementById('root');
const app=<React.StrictMode><App initialPath={document.documentElement.dataset.page || undefined}/></React.StrictMode>;
if(root.hasChildNodes())hydrateRoot(root,app);
else createRoot(root).render(app);
