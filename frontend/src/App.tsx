import * as React from 'react'
import './App.css';
import Home from './components/Home'
import Register from './components/Register'
import GamePage from './components/GamePage'
import ErrorPage from './components/ErrorPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store, { AppDispatch, RootState } from './redux/store';
import ClientApi from './components/ClientApi.class';
import { useDispatch, useSelector } from 'react-redux';
import SignIn from './components/SignIn';

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
		element: <SignIn />
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
