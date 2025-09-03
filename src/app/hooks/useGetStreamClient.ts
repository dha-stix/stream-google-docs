import { useCreateChatClient } from "stream-chat-react";
import { createToken } from "../../../actions/stream";
import { User } from "firebase/auth";
import { useCallback } from "react";

export const useGetStreamClient = (
	user: User
) => {
	const tokenProvider = useCallback(async () => {
		return await createToken(user.uid);
	}, [user]);

	const client = useCreateChatClient({
		apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
		tokenOrProvider: tokenProvider,
        userData: {
            id: user.uid, name: user.displayName || "Unknown",
            image: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.displayName}`
        },
	});

	if (!client) return { client: null };

	return { client };
};