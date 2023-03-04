import React, { useEffect, useRef, useState } from 'react'
import '../styles/App.css';
import Home from './Home'
import Register from './Register'
import GamePage from './GamePage'
import ErrorPage from './ErrorPage';
import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';
import Signin from './Signin';
import Friends from './Friends';
import Profile from './Profile';
import Settings from './Settings';
import { IUser } from '../interface/IUser';
import userEvent from '@testing-library/user-event';
import ClientApi from './ClientApi.class';
import { API_SOCKET_URL, CHAT_EP, FRIENDS_EP, GAMEPAGE_EP, HOME_EP, MESSAGES_EP, MYFRIENDS_EP, MYPROFILE_EP, PROFILE_EP, REGISTER_EP, SETTINGS_EP, SETTINGS_MYPROFILE_EP, SETTINGS_TWOFA_EP, SIGNIN_EP, TWOFA_EP } from '../constants/RoutesApi';
import MyProfile from './MyProfile';
import ChatPage from './ChatPage';
import TwoFA from './TwoFA';
import TwoFASettings from './TwoFASettings';
import MyProfileSettings from './MyProfileSettings';
import { Provider } from 'react-redux';
import store from '../redux/store';
import DM from './DM';


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
		element: <ChatPage />
	},
	{
		path: MESSAGES_EP,
		element: <DM />
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


	return (
		<React.Fragment>
			<Provider store={store}>
				<RouterProvider router={router} />
			</Provider>
		</React.Fragment>
	)
}

export default App;
