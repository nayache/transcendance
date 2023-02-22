export const FTAPI_CODE_ROUTE_TO_REGISTER: string = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-dc852d2afb56aff8aa2574e48b6bbcb54cd473a02b1d6cfb62bb6c8b65a22701&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fregister&response_type=code'
export const FTAPI_CODE_ROUTE_TO_TWOFA: string = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-dc852d2afb56aff8aa2574e48b6bbcb54cd473a02b1d6cfb62bb6c8b65a22701&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Ftwofa&response_type=code'




export const API_BASE_URL = 'http://localhost:3042'


export const API_BASE_AUTH = API_BASE_URL + '/auth'
export const API_BASE_USER = API_BASE_URL + '/user'
export const API_BASE_CHAT = API_BASE_URL + '/chat'


export const API_TWOFA_ROUTE = API_BASE_AUTH + '/2fa'
export const API_TOKEN_ROUTE = API_BASE_AUTH + '/token'
export const API_VERIFY_TOKEN_ROUTE = API_BASE_AUTH + '/verify'
export const API_PSEUDO_ROUTE = API_BASE_USER + '/pseudo'
export const API_AVATAR_ROUTE = API_BASE_USER + '/avatar'
export const API_CHAT_MESSAGES_ROUTE = API_BASE_CHAT + '/message'




export const BASE_URL = 'http://localhost:3000'


export const HOME_EP = '/'
export const HOME_ROUTE = BASE_URL + HOME_EP

export const REGISTER_EP = '/register';
export const REGISTER_ROUTE = BASE_URL + REGISTER_EP

export const GAMEPAGE_EP = '/gamepage';
export const GAMEPAGE_ROUTE = BASE_URL + GAMEPAGE_EP

export const TWOFA_EP = '/twofa'
export const TWOFA_ROUTE = BASE_URL + TWOFA_EP

export const SIGNIN_EP = '/signin'
export const SIGNIN_ROUTE = BASE_URL + SIGNIN_EP

export const CHAT_EP = '/chat'
export const CHAT_ROUTE = BASE_URL + CHAT_EP

export const MYPROFILE_EP = '/me/profile'
export const MYPROFILE_ROUTE = BASE_URL + MYPROFILE_EP

export const PROFILE_EP = '/profile/:pseudo'
export const PROFILE_ROUTE = BASE_URL + PROFILE_EP

export const MYFRIENDS_EP = '/me/friends'
export const MYFRIENDS_ROUTE = BASE_URL + MYFRIENDS_EP

export const FRIENDS_EP = '/:pseudo/friends'
export const FRIENDS_ROUTE = BASE_URL + FRIENDS_EP


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