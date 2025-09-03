"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ExternalLink, Save } from "lucide-react";
import { useDocument } from "../hooks/useDocument";
import { updateDocuments } from "@/lib/server";
import { useParams } from "next/navigation";
import AuthContext from "./AuthContext";
import ShareModal from "./ShareModal";

export default function Header({
	documentData,
}: {
	documentData: DocumentState;
}) {
	const [docTitle, setDocTitle] = useState<string>(
		documentData.title || "Untitled Document"
	);
	const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
	const [locked, setLocked] = useState<boolean>(false);
	const { slug } = useParams<{ slug: string }>();
	const inputRef = useRef<HTMLInputElement>(null);
	const { user } = useContext(AuthContext);
	const { state } = useDocument();

	const handleSaveDoc = async () => {
		if (!user || !slug) return;

		const { message, success } = await updateDocuments({
			last_modified: {
				id: user.uid,
				name: user.displayName!,
				date: new Date().toISOString(),
			},
			content: state.content,
			slug,
			title: docTitle,
		});

		if (success) {
			alert(message);
		} else {
			alert(message);
		}
	};

	useEffect(() => {
		document.title = docTitle;
	}, [docTitle, documentData]);

	const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLocked(true);
		inputRef.current?.blur();
	};

	return (
		<header className='header p-5 bg-gray-200 h-[10vh] flex items-center justify-between'>
			<form className='w-1/2' onSubmit={handleFormSubmit}>
				<input
					type='text'
					ref={inputRef}
					placeholder={docTitle}
					className='rounded font-semibold text-blue-600 w-4/5 px-4 py-2 text-2xl outline-none focus:ring-0'
					readOnly={locked}
					value={docTitle}
					onChange={(e) => setDocTitle(e.target.value)}
					onDoubleClick={() => setLocked(false)}
				/>
			</form>

			<div className='flex items-center space-x-4'>
				<button
					className='bg-blue-400 hover:bg-blue-600 px-4 py-2 text-white rounded cursor-pointer flex items-center '
					onClick={handleSaveDoc}
				>
					<Save size={22} className='mr-2' />
					Save
				</button>

				<Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
					<DialogTrigger asChild>
						<button className='bg-gray-700 text-white p-2 rounded-full cursor-pointer'>
							<ExternalLink size={22} />
						</button>
					</DialogTrigger>
					<ShareModal slug={documentData.slug} />
				</Dialog>
			</div>
		</header>
	);
}