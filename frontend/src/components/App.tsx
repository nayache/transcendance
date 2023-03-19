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
import { CHAT_EP, GAMEPAGE_EP, VIEWERGAMEPAGE_EP, HOME_EP, MESSAGES_EP, MYFRIENDS_EP, MYPROFILE_EP, PROFILE_EP, REGISTER_EP, SETTINGS_BLOCKED_EP, SETTINGS_EP, SETTINGS_HELP_EP, SETTINGS_MYPROFILE_EP, SETTINGS_TWOFA_EP, SIGNIN_EP, TWOFA_EP } from '../constants/RoutesApi';
import MyProfile from './MyProfile';
import ChatPage from './ChatPage';
import TwoFA from './TwoFA';
import TwoFASettings from './TwoFASettings';
import MyProfileSettings from './MyProfileSettings';
import { Provider } from 'react-redux';
import store from '../redux/store';
import DM from './DM';
import HelpSettings from './HelpSettings';
import BlockedSettings from './BlockedSettings';
import GoPlay from './GoPlay';
import ViewerPlayground from './ViewerPlayground';
import ViewerGamePage from './ViewerGamePage';


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
		path: GAMEPAGE_EP + '/:mode',
		element: <GamePage />
	},
	{
		path: GAMEPAGE_EP + '/:mode/:fromInvite/:invited',
		element: <GamePage />
	},
	{
		path: GAMEPAGE_EP + '/:mode/:fromAccept/:author',
		element: <GamePage />
	},
	{
		path: VIEWERGAMEPAGE_EP,
		element: <ViewerGamePage />
	},
	{
		path: MYPROFILE_EP,
		element: <MyProfile />
	},
	{
		path: PROFILE_EP + '/:pseudo',
		element: <Profile />
	},
	{
		path: MYFRIENDS_EP,
		element: <Friends />
	},
	{
		path: CHAT_EP,
		element: <ChatPage />
	},
	{
		path: MESSAGES_EP + '/:pseudo',
		element: <DM />
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
		path: SETTINGS_HELP_EP,
		element: <HelpSettings />
	},
	{
		path: SETTINGS_BLOCKED_EP,
		element: <BlockedSettings />
	},
	{
		path: '*',
		element: <ErrorPage />
	},
])


const App = () => {


	return (
		<React.Fragment>
			<RouterProvider router={router} />
		</React.Fragment>
	)
}

export default App;
