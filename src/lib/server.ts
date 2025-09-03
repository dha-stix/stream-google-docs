import {
	// collection,
	// getDocs,
	// query,
	// where,
	deleteDoc,
	doc,
	getDoc,
	setDoc,
} from "firebase/firestore";
import { signInWithPopup } from "firebase/auth";
import db, { provider, auth } from "./firebase";
import { FirebaseError } from "firebase/app";

export const signInWithGoogle = async () => {
	try {
		const { user } = await signInWithPopup(auth, provider);
		if (!user) {
			throw new Error("No user returned");
		}
		return { user, message: "User signed in successfully" };
	} catch (error) {
		const errorMessage =
			error instanceof FirebaseError ? error.message : "Error signing in";
		return { user: null, message: errorMessage };
	}
};

export const logoutUser = async () => {
	try {
		await auth.signOut();
		return { success: true, message: "User logged out successfully" };
	} catch (error) {
		console.error("Error logging out:", error);
		return { success: false, message: "Error logging out" };
	}
};

/** --- Create Document --- */
export const createDocument = async ({
	date_created,
	slug,
	created_by,
}: {
	date_created: string;
	slug: string;
	created_by: { id: string; name: string };
}) => {
	try {
		await setDoc(doc(db, "documents", slug), {
			created_by: {
				date: date_created,
				...created_by,
			},
		});

		return { message: "Document created successfully", success: true };
	} catch (error) {
		console.error("Error creating document:", error);
		return { success: false, message: "Error creating document" };
	}
};

/** --- Update Document --- */
export const updateDocuments = async ({
	last_modified,
	content,
	slug,
	title,
}: {
	last_modified: {
		id: string;
		name: string;
		date: string;
	};
	content: string;
	slug: string;
	title: string;
}) => {
	try {
		await setDoc(
			doc(db, "documents", slug),
			{
				last_modified,
				content,
				title,
			},
			{ merge: true }
		);
		return { message: "Document updated successfully", success: true };
	} catch (error) {
		console.error("Error updating document:", error);
		return { success: false, message: "Error updating document" };
	}
};

export const getDocumentById = async (slug: string) => {
	try {
		const docRef = doc(db, "documents", slug);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			return {
				document: { slug: docSnap.id, ...docSnap.data() },
				success: true,
			};
		} else {
			return { document: null, success: false, message: "Document not found" };
		}
	} catch (err) {
		console.error("Error fetching document:", err);
		return {
			document: null,
			success: false,
			message: "Error fetching document",
		};
	}
};

// export const getAllDocuments = async (userID: string) => {
// 	try {
// 		const q = query(
// 			collection(db, "documents"),
// 			where("created_by.id", "==", userID)
// 		);
// 		const snapshot = await getDocs(q);
// 		const documents = snapshot.docs.map((doc) => ({
// 			slug: doc.id,
// 			...doc.data(),
// 		}));
// 		return { documents, success: true };
// 	} catch (error) {
// 		console.error("Error fetching documents:", error);
// 		return {
// 			documents: [],
// 			success: false,
// 			message: "Error fetching documents",
// 		};
// 	}
// };

export const deleteDocument = async (slug: string) => {
	try {
		await deleteDoc(doc(db, "documents", slug));
		return { success: true };
	} catch (error) {
		console.error("Error deleting document:", error);
		return { success: false, message: "Error deleting document" };
	}
};