import { MAX_CARAC_CHAT } from "../components/Chat";
import ClientApi from "../components/ClientApi.class";
import { API_CHAT_MESSAGES_CHANNEL_ROUTE } from "../constants/RoutesApi";
import { IChannel, IChannelUser } from "../interface/IChannel";

export const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>,
	textAreaRef: React.RefObject<HTMLTextAreaElement>, msg: React.MutableRefObject<string>) => {
	msg.current = e.target.value;

	if (textAreaRef.current) // ca a pas trop de sens mais bon..
	{
		  textAreaRef.current.style.height = "";
		textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"
	}
	if (textAreaRef.current &&
		textAreaRef.current.value.length >= MAX_CARAC_CHAT)
		console.log("max length reached")
	else
		console.log("okay good")
}

const click = async (chanUser: IChannelUser | undefined, currentChannelId: number,
	channels: IChannel[], msg: React.MutableRefObject<string>) => {
	if (chanUser?.pseudo)
	{
		console.log("msg.current = ", msg.current)
		try {
			if (!(currentChannelId <= -1 || currentChannelId >= channels.length)
			&& msg.current.trimEnd().length > 0) {
				await ClientApi.post(API_CHAT_MESSAGES_CHANNEL_ROUTE,
				JSON.stringify({
					target: channels[currentChannelId].name,
					msg: msg.current.trimEnd()
				}), 'application/json')
				msg.current = ""
			}
		} catch (err) {
			console.log("err = ", err);
		}
	}
}

export const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>,
	textAreaRef: React.RefObject<HTMLTextAreaElement>, msg: React.MutableRefObject<string>,
	chanUser: IChannelUser | undefined, currentChannelId: number, channels: IChannel[]) => {
	if (e.key === 'Enter' && !e.shiftKey)
	{
		e.preventDefault()
		try {
			await click(chanUser, currentChannelId, channels, msg);
			msg.current = '';
		} catch (err) {
			console.log("err = ", err);
		}
		if (textAreaRef.current)
		{
			textAreaRef.current.value = "";
			textAreaRef.current.style.height = "";
			textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"
		}
	}
}
