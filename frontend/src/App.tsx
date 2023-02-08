import * as React from 'react'
import './App.css';
import Home from './components/Home'
import Register from './components/Register'
import GamePage from './components/GamePage'
import ErrorPage from './components/ErrorPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signin from './components/Signin';
import Friends from './components/Friends';
import Profil from './components/Profil';
import Settings from './components/Settings';

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
		path: '/signin',
		element: <Signin />
	},
	{
		path: '/gamepage',
		element: <GamePage />
	},
	{
		path: '/profil',
		element: <Profil />
	},
	{
		path: '/friends',
		element: <Friends />
	},
	{
		path: '/settings',
		element: <Settings />
	},
	{
		path: '*',
		element: <ErrorPage />
	},
])

const App: React.FC = () => {

	return (
		// <Provider store={store}>
			<AppChild/>
		// </Provider>
	)
}

const AppChild: React.FC = () => {

	// ClientApi.dispatch = useDispatch<AppDispatch>();

	return (
		<React.Fragment>
			<RouterProvider router={router} />
		</React.Fragment>
	)
}

export default App;
