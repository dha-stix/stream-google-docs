"use server";
import { StreamChat } from "stream-chat";

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY!;

// 👇🏻 -- For Stream Chat  --
const serverClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);

export const createToken = async (id: string) => {
	if (!id) throw new Error("User is not authenticated");
	return serverClient.createToken(id);
};

export const createChannel = async ({
	name,
	uid,
}: {
	name: string;
	uid: string;
}) => {
	try {
		//👇🏻 declare channel type
		const channel = serverClient.channel(
			"messaging",
			`${crypto.randomUUID()}`,
			{
				name: name || "Unknown",
				image: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${name}`,
				members: [uid],
				created_by_id: uid,
			}
		);
		//👇🏻 create a channel
		await channel.create();
		return { success: true, error: null, id: channel.id };
	} catch (err) {
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to create channel",
			id: null,
		};
	}
};

export const deleteChannel = async (id: string) => {
	try {
		const channel = serverClient.channel("messaging", id);
		await channel.delete();
		return { success: true, error: null };
	} catch (err) {
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to delete channel",
		};
	}
};

export const getChannelById = async (id: string) => {
	try {
		const channels = await serverClient.queryChannels({ id });
		const channel = channels[0];

		if (!channel) {
			return { success: false, error: "Channel not found", id: null };
		}

		return { success: true, error: null, id: channel.id };
	} catch (err) {
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to get channel",
			id: null,
		};
	}
};