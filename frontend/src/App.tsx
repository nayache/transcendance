import React, { useEffect, useState } from 'react'
import './App.css';
import Home from './components/Home'
import Register from './components/Register'
import GamePage from './components/GamePage'
import ErrorPage from './components/ErrorPage';
import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';
import Signin from './components/Signin';
import Friends from './components/Friends';
import Profile from './components/Profile';
import Settings from './components/Settings';
import { IUser } from './interface/User';
import userEvent from '@testing-library/user-event';
import ClientApi from './components/ClientApi.class';
import { API_BASE_USER } from './constants/RoutesApi';
import MyProfile from './components/MyProfile';


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
		path: '/profile/:pseudo',
		element: <Profile />
	},
	{
		path: '/me/profile',
		element: <MyProfile />
	},
	{
		path: '/me/friends',
		element: <Friends />
	},
	{
		path: '/:pseudo/friends',
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

const App = () => {

	const [user, setUser] = useState<IUser>()
	
	return (
		<React.Fragment>
			<RouterProvider router={router} />
		</React.Fragment>
	)
}

export default App;
