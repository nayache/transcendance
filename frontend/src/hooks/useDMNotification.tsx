// import React, { useEffect } from "react"
// import Notification from "../components/Notification";


// export const useDMNotification = () => {

	
// 	return (
// 		<React.Fragment>
// 			{ (() => { console.log("(getPage) infos.current = ", infos.current, "  et  notificationType = ", notificationType); return true })() && notificationType !== null && infos.current !== undefined &&
// 					<Notification active={notificationType !== null ? true : false} type={notificationType}
// 					infos={infos.current}
// 					callback={({type, infos}) => {
// 						if (type === NotificationType.DM)
// 							ClientApi.redirect = new URL(MESSAGES_ROUTE + '/' + infos.author)
// 						if (type === NotificationType.NEWFRIEND || type === NotificationType.ACCEPTEDFRIEND)
// 							ClientApi.redirect = new URL(MYFRIENDS_EP)
// 					}}
// 					callbackFail={() => {
// 						infos.current = undefined
// 						setNotificationType(null)
// 					}} />
// 				}
// 		</React.Fragment>
// 	)
// }

export const useDMNotification = () => {}
