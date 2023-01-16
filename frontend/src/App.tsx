import * as React from 'react'
import './App.css';
import Home from './Components/Home'
import Register from './Components/Register'
import GamePage from './Components/GamePage'
import ErrorPage from './Components/ErrorPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Home />
	},
	{
		path: '/register',
		element: <Register />
	},
	{
		path: '/gamepage',
		element: <GamePage />
	},
	{
		path: '*',
		element: <ErrorPage />
	},
])

const App: React.FC = () => {

	return (
		<React.Fragment>
			<RouterProvider router={router} />
		</React.Fragment>
	)
}

export default App;
