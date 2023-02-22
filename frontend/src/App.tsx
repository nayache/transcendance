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
import { CHAT_EP, FRIENDS_EP, GAMEPAGE_EP, HOME_EP, MYFRIENDS_EP, MYPROFILE_EP, PROFILE_EP, REGISTER_EP, SETTINGS_EP, SETTINGS_MYPROFILE_EP, SETTINGS_TWOFA_EP, SIGNIN_EP, TWOFA_EP } from './constants/RoutesApi';
import MyProfile from './components/MyProfile';
import Chat from './components/Chat';
import TwoFA from './components/TwoFA';
import TwoFASettings from './components/TwoFASettings';
import MyProfileSettings from './components/MyProfileSettings';


const router = createBrowserRouter([
	{
		path: HOME_EP,
		element: <Home />
	},
	{
		path: REGISTER_EP,
		element: <Register />
	},
	{
		path: TWOFA_EP,
		element: <TwoFA />
	},
	{
		path: SIGNIN_EP,
		element: <Signin />
	},
	{
		path: GAMEPAGE_EP,
		element: <GamePage />
	},
	{
		path: MYPROFILE_EP,
		element: <MyProfile />
	},
	{
		path: PROFILE_EP,
		element: <Profile />
	},
	{
		path: MYFRIENDS_EP,
		element: <Friends />
	},
	{
		path: FRIENDS_EP,
		element: <Friends />
	},
	{
		path: CHAT_EP,
		element: <Chat />
	},
	{
		path: SETTINGS_EP,
		element: <Settings />
	},
	{
		path: SETTINGS_MYPROFILE_EP,
		element: <MyProfileSettings />
	},
	{
		path: SETTINGS_TWOFA_EP,
		element: <TwoFASettings />
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
