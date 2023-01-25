import * as React from 'react'
import './App.css';
import Home from './Components/Home'
import Register from './Components/Register'
import GamePage from './Components/GamePage'
import ErrorPage from './Components/ErrorPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import User from './Components/User';
import { Provider } from 'react-redux';
import store from './Redux/store';

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
			<Provider store={store}>
				<RouterProvider router={router} />
			</Provider>
		</React.Fragment>
	)
}

export default App;
