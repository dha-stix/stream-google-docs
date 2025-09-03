"use client";
import { useCallback, useContext, useEffect, useState } from "react";
import { useGetStreamClient } from "../hooks/useGetStreamClient";
import { getChannelById } from "../../../actions/stream";
import { useParams, useRouter } from "next/navigation";
import { Channel as ChannelType } from "stream-chat";
import AuthContext from "../components/AuthContext";
import { Chat, Channel } from "stream-chat-react";
import { getDocumentById } from "@/lib/server";
import Editor from "../components/Editor";
import Header from "../components/Header";
import { Loader2 } from "lucide-react";
import { User } from "firebase/auth";

const PageComponent = ({ documentData }: { documentData: DocumentState }) => {
	return (
		<div>
			<Header documentData={documentData} />
			<div
				className=' px-4 py-6 flex items-start justify-between space-x-4'
				id='quill-container'
			>
				<Editor dbContent={documentData.content} />

				<div className='w-1/4 sidebar'>
					<div className='w-1/4 fixed z-40 right-2 rounded-md bg-gray-50 border-[1px] shadow p-4 max-h-[50vh]'>
						<div className='space-y-1'>
							<h3 className='text-gray-700 text-sm'>Document History</h3>
							<p className='text-xs text-gray-500'>
								Created by: {documentData?.created_by?.name}
							</p>
							<p className='text-xs text-gray-500'>
								Date Created:{" "}
								{new Date(documentData?.created_by?.date).toLocaleString()}
							</p>
						</div>
						<div className='mt-4 space-y-1'>
							<h3 className='text-gray-700 text-sm'>Activity History</h3>
							{documentData?.last_modified?.name && (
								<p className='text-xs text-gray-500'>
									Modified by: {documentData.last_modified.name}
								</p>
							)}
							{documentData?.last_modified?.date && (
								<p className='text-xs text-gray-500'>
									Date Modified:{" "}
									{new Date(documentData.last_modified.date).toLocaleString()}
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default function Page() {
	const [channel, setChannel] = useState<ChannelType | null>(null);
	const { slug } = useParams<{ slug: string }>();
	const { user } = useContext(AuthContext);
	const [document, setDocument] = useState<DocumentState | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const { client } = useGetStreamClient(user as User);
	const router = useRouter();

	const getChannel = useCallback(async () => {
		if (!slug || !client) return;
		try {
			const { id } = await getChannelById(slug);
			const { document } = await getDocumentById(slug);
			if (id && document) {
				const channels = await client.queryChannels({ id });
				const channel = channels[0];
				if (!channel) return;
				setChannel(channel);
				setDocument(document as DocumentState);
				setLoading(false);
			} else {
				router.replace("/dashboard");
			}
		} catch (error) {
			console.error("Error fetching channel:", error);
		}
	}, [slug, router, client]);

	useEffect(() => {
		getChannel();
	}, [getChannel]);

	if (loading || !client || !channel || !document)
		return (
			<div className=' p-5 bg-gray-50 h-screen flex items-center justify-center'>
				<Loader2 className='animate-spin text-blue-500' size={30} />
			</div>
		);

	return (
		<Chat client={client} theme='messaging light'>
			<Channel channel={channel}>
				<PageComponent documentData={document} />
			</Channel>
		</Chat>
	);
}