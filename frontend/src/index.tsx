import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './components/App';

//React.StrictMode render twice every component in development mode but not in production time
const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);
root.render(
	<App />
);