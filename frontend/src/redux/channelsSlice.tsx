import { createSlice } from '@reduxjs/toolkit'
import { IChannel, IChannelUser } from '../interface/IChannel'

interface DraftMessageProps {
	draftMessage?: string,
}

export type ChannelProps = IChannel & DraftMessageProps

export interface ChannelsProps {
	currentChannelId: number,
	channels: ChannelProps[],
}

const initialState: ChannelsProps = {
	currentChannelId: -1,
	channels: []
}

const channelsSlice = createSlice({
	name: "room",
	initialState,
	reducers: {
		addChannel: (state, action) => {
			state.channels.push(action.payload)
		},
		updateChannel: (state, action) => {
			const index: number = state.channels.findIndex(channel => channel.name === action.payload.name)
			state.channels[index] = action.payload
		},
		resetAllChannels: (state, action) => {
			state.channels = action.payload
		},
		removeChannel: (state, action) => {
			// console.log("removeChannel: state.channels (avant) = ", state.channels);
			state.channels = state.channels.filter((channel) => channel.name != action.payload)
			// console.log("removeChannel: state.channels (apres) = ", state.channels);
		},
		setCurrentChannel: (state, action) => {
			state.currentChannelId = state.channels
				.findIndex(channel => channel.name === action.payload)
		},
	},
})

const roomReducer = channelsSlice.reducer
export default roomReducer;
