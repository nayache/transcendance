const { 
	REACT_APP_FRONT_PROTOCOL,
	REACT_APP_FRONT_HOSTNAME,
	REACT_APP_FRONT_PORT,
	REACT_APP_BACK_PROTOCOL,
	REACT_APP_BACK_HOSTNAME,
	REACT_APP_BACK_PORT,
} = process.env


export const FTAPI_CODE_ROUTE_TO_REGISTER: string = `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-97d5bee0e878a3f6b1f1559dbe8751b12c31facea51937a459ea2e8a22c04dc5&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fregister&response_type=code`
export const FTAPI_CODE_ROUTE_TO_TWOFA: string = `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-97d5bee0e878a3f6b1f1559dbe8751b12c31facea51937a459ea2e8a22c04dc5&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Ftwofa&response_type=code`


console.log("REACT_APP_BACK_PROTOCOL = ", REACT_APP_BACK_PROTOCOL)
export const API_BASE_URL = `${REACT_APP_BACK_PROTOCOL}://${REACT_APP_BACK_HOSTNAME}:${REACT_APP_BACK_PORT}`


export const API_BASE_AUTH = API_BASE_URL + '/auth'
export const API_BASE_USER = API_BASE_URL + '/users'
export const API_BASE_CHAT = API_BASE_URL + '/chat'
export const API_BASE_GAME = API_BASE_URL + '/game'


export const API_TWOFA_ROUTE = API_BASE_AUTH + '/2fa'
export const API_TOKEN_ROUTE = API_BASE_AUTH + '/token'
export const API_VERIFY_TOKEN_ROUTE = API_BASE_AUTH + '/verify'

export const API_PSEUDO_ROUTE = API_BASE_USER + '/pseudo'
export const API_AVATAR_ROUTE = API_BASE_USER + '/avatar'

export const API_USER_BLOCK = API_BASE_USER + '/block' /* + /:pseudo */
export const API_USER_FRIENDS_LIST = API_BASE_USER + '/friends/list' /* + /:pseudo */
export const API_USER_ADD_FRIEND = API_BASE_USER + '/friends/add' /* + /:pseudo */
export const API_USER_DEL_FRIEND = API_BASE_USER + '/friends/del' /* + /:pseudo */
export const API_USER_FRIEND_RELATION = API_BASE_USER + '/friends/relation' /* + /:pseudo */
export const API_USER_ALL_NAMES = API_BASE_USER + '/all/names'
export const API_USER_ALL = API_BASE_USER + '/all'

export const API_CHAT_DISCUSSIONS_RELATION = API_BASE_CHAT + '/discussions'
export const API_CHAT_DM = API_BASE_CHAT + '/message' /* + '/:pseudo' */
export const API_CHAT_MARK_READ = API_BASE_CHAT + '/message/read' /* + /:pseudo */
export const API_CHAT_MESSAGES_CHANNEL_ROUTE = API_BASE_CHAT + '/channel/message'
export const API_CHAT_USER_CHANNELS_ROUTE = API_BASE_CHAT + '/channels'
export const API_CHAT_ALL_CHANNELS_ROUTE = API_BASE_CHAT + '/channels/all'
export const API_CHAT_ALL_CHANNELNAMES_ROUTE = API_BASE_CHAT + '/channels/all/names'
export const API_CHAT_ALL_CHANNELPRVW_ROUTE = API_BASE_CHAT + '/channels/all/preview'
export const API_CHAT_CHANNEL_ROUTE = API_BASE_CHAT + '/channel' /* + '/:channelName' */
export const API_CHAT_CHANNEL_PWDACCESS_ROUTE = API_BASE_CHAT + '/channel/access/password'
export const API_CHAT_CHANNEL_PRVACCESS_ROUTE = API_BASE_CHAT + '/channel/access'
export const API_CHAT_CHANNEL_JOIN_ROUTE = API_BASE_CHAT + '/channel/join'
export const API_CHAT_CHANNEL_LEAVE_ROUTE = API_BASE_CHAT + '/channel/leave'
export const API_CHAT_CHANNEL_KICK_ROUTE = API_BASE_CHAT + '/channel/kick'
export const API_CHAT_CHANNEL_BAN_ROUTE = API_BASE_CHAT + '/channel/ban'
export const API_CHAT_CHANNEL_MUTE_ROUTE = API_BASE_CHAT + '/channel/mute'
export const API_CHAT_CHANNEL_SETADMIN_ROUTE = API_BASE_CHAT + '/channel/setAdmin'

export const API_GAME_SEARCH = API_BASE_GAME + '/search' /* + /:difficulty */
export const API_GAME_VIEW = API_BASE_GAME + '/view' /* + /:pseudo */
export const API_GAME_INFOS = API_BASE_GAME + '/infos' /* + /:pseudo */


export const API_SOCKET_URL = 'ws://localhost:3042'




export const BASE_URL = `${REACT_APP_FRONT_PROTOCOL}://${REACT_APP_FRONT_HOSTNAME}:${REACT_APP_FRONT_PORT}`


export const HOME_EP = '/'
export const HOME_ROUTE = BASE_URL + HOME_EP

export const GOPLAY_EP = '/go-play'
export const GOPLAY_ROUTE = BASE_URL + GOPLAY_EP

export const REGISTER_EP = '/register';
export const REGISTER_ROUTE = BASE_URL + REGISTER_EP

export const GAMEPAGE_EP = '/gamepage';
export const GAMEPAGE_ROUTE = BASE_URL + GAMEPAGE_EP

export const VIEWERGAMEPAGE_EP = '/view-gamepage';
export const VIEWERGAMEPAGE_ROUTE = BASE_URL + VIEWERGAMEPAGE_EP

export const TWOFA_EP = '/twofa'
export const TWOFA_ROUTE = BASE_URL + TWOFA_EP

export const SIGNIN_EP = '/signin'
export const SIGNIN_ROUTE = BASE_URL + SIGNIN_EP

export const MESSAGES_EP = '/messages'
export const MESSAGES_ROUTE = BASE_URL + MESSAGES_EP

export const CHAT_EP = '/chat'
export const CHAT_ROUTE = BASE_URL + CHAT_EP

export const MYPROFILE_EP = '/me/profile'
export const MYPROFILE_ROUTE = BASE_URL + MYPROFILE_EP

//'/profile' /* + /:pseudo */
export const PROFILE_EP = '/profile' /* + /:pseudo */
export const PROFILE_ROUTE = BASE_URL + PROFILE_EP /* + '/:pseudo' */

export const MYFRIENDS_EP = '/me/friends'
export const MYFRIENDS_ROUTE = BASE_URL + MYFRIENDS_EP

// export const FRIENDS_EP = /* /:pseudo + */ '/friends'
// export const FRIENDS_ROUTE = BASE_URL + '/:pseudo' + FRIENDS_EP


export const SETTINGS_EP = '/settings'
export const SETTINGS_ROUTE = BASE_URL + SETTINGS_EP

export const SETTINGS_MYPROFILE_EP = SETTINGS_EP + '/profile'
export const SETTINGS_MYPROFILE_ROUTE = BASE_URL + SETTINGS_MYPROFILE_EP

export const SETTINGS_TWOFA_EP = SETTINGS_EP + '/two-factor-authentication'
export const SETTINGS_TWOFA_ROUTE = BASE_URL + SETTINGS_TWOFA_EP

export const SETTINGS_HELP_EP = SETTINGS_EP + '/help'
export const SETTINGS_HELP_ROUTE = BASE_URL + SETTINGS_HELP_EP

export const SETTINGS_BLOCKED_EP = SETTINGS_EP + '/blocked'
export const SETTINGS_BLOCKED_ROUTE = BASE_URL + SETTINGS_BLOCKED_EP
