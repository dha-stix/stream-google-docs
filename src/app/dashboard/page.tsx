"use client";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { createDocument, logoutUser } from "@/lib/server";
import { useContext, useEffect, useState } from "react";
import { createChannel } from "../../../actions/stream";
import AuthContext from "../components/AuthContext";
import { useRouter } from "next/navigation";
import DocBox from "../components/DocBox";
import db from "@/lib/firebase";

export default function DashboardPage() {
	const [documents, setDocuments] = useState<DocumentState[]>([]);
	const { user } = useContext(AuthContext);
	const router = useRouter();

	// const fetchDocuments = useCallback(async () => {
	// 	if (!user) return;
	// 	const { documents } = await getAllDocuments(user.uid);
	// 	setDocuments(documents as DocumentState[]);
	// }, [user]);

	// useEffect(() => {
	// 	fetchDocuments();
	// }, [fetchDocuments]);

	useEffect(() => {
		if (!user) return; // wait until you know the user

		// query only docs where created_by.id == userID
		const q = query(
			collection(db, "documents"),
			where("created_by.id", "==", user.uid)
		);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const docs = snapshot.docs.map((doc) => ({
				slug: doc.id,
				...doc.data(),
			})) as DocumentState[];
			setDocuments(docs);
		});

		return () => unsubscribe();
	}, [user]);

	const handleLogout = async () => {
		const { success } = await logoutUser();
		if (success) {
			router.push("/");
		}
	};

	const handleCreateDocument = async () => {
		if (!user?.displayName) return;
		const { id, success } = await createChannel({
			name: user.displayName,
			uid: user.uid,
		});
		const { success: docSuccess } = await createDocument({
			date_created: new Date().toISOString(),
			slug: id as string,
			created_by: { id: user?.uid, name: user?.displayName as string },
		});
		if (success && docSuccess) {
			router.push(`/${id}`);
		}
	};

	return (
		<main>
			<nav className='w-full h-[10vh] px-8 bg-gray-200 py-2 flex items-center justify-between top-0 sticky'>
				<h1 className='font-bold text-2xl'>Dashboard</h1>

				<div className='flex items-center space-x-4'>
					<button
						className='bg-blue-500 text-white px-4 py-2 rounded cursor-pointer'
						onClick={handleCreateDocument}
					>
						New Document
					</button>
					<button
						onClick={handleLogout}
						className='bg-red-500 text-white px-4 py-2 rounded cursor-pointer'
					>
						Log Out
					</button>
				</div>
			</nav>
			<section className='w-full flex flex-wrap  gap-3 px-8 py-4'>
				{documents.map((doc) => (
					<DocBox
						key={doc.created_by.date}
						title={doc.title || "Untitled Document"}
						author={doc.created_by.name}
						slug={doc.slug}
					/>
				))}

				{documents.length === 0 && (
					<p className='text-gray-500'>No existing documents found</p>
				)}
			</section>
		</main>
	);
}