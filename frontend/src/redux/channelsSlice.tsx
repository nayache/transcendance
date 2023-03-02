import { createSlice } from '@reduxjs/toolkit'
import { IChannel, IChannelUser } from '../interface/IChannelUser'

interface DraftMessageProps {
	draftMessage?: string,
}

export type ChannelProps = IChannel & DraftMessageProps

export interface ChannelsProps {
	currentChannel: ChannelProps | null,
	channels: ChannelProps[],
}

const initialState: ChannelsProps = {
	currentChannel: null,
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
			console.log("removeChannel: state.channels (avant) = ", state.channels);
			state.channels = state.channels.filter((channel) => channel.name != action.payload)
			console.log("removeChannel: state.channels (apres) = ", state.channels);
		},
		setCurrentChannel: (state, action) => {
			state.currentChannel = (state.channels.filter((channel => channel.name === action.payload)).length > 0) ?
			state.channels.filter((channel => channel.name === action.payload))[0] : null
		},
	},
})

export const {
	addChannel,
	updateChannel,
	resetAllChannels,
	removeChannel,
	setCurrentChannel,
} = channelsSlice.actions

const roomReducer = channelsSlice.reducer
export default roomReducer;