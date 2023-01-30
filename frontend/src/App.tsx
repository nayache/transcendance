import * as React from 'react'
import './App.css';
import Home from './Components/Home'
import Register from './Components/Register'
import GamePage from './Components/GamePage'
import ErrorPage from './Components/ErrorPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store, { AppDispatch, RootState } from './Redux/store';
import ClientApi from './Components/ClientApi.class';
import { useDispatch, useSelector } from 'react-redux';

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
		<Provider store={store}>
			<AppChild/>
		</Provider>
	)
}

const AppChild: React.FC = () => {

	ClientApi.dispatch = useDispatch<AppDispatch>();

	return (
		<React.Fragment>
			<RouterProvider router={router} />
		</React.Fragment>
	)
}

export default App;
