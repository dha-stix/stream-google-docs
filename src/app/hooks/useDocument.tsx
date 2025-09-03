"use client"; // Required in Next.js App Router for client-side hooks
import { createContext, useCallback, useContext, useState } from "react";

type DocumentContextType = {
	state: DocumentState;
	updateDocument: (updates: Partial<DocumentState>) => void;
};

const initialState: DocumentState = {
	created_by: {
		id: "",
		name: "",
		date: "",
	},
	last_modified: {
		id: "",
		name: "",
		date: "",
	},
	content: "",
	title: "",
	slug: "",
};

const DocumentContext = createContext<DocumentContextType | undefined>(
	undefined
);

export function DocumentProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [state, setState] = useState<DocumentState>(initialState);

	const updateDocument = useCallback((updates: Partial<DocumentState>) => {
		setState((prev) => ({ ...prev, ...updates })); // merge partial updates
	}, []);

	return (
		<DocumentContext.Provider value={{ state, updateDocument }}>
			{children}
		</DocumentContext.Provider>
	);
}

export function useDocument() {
	const context = useContext(DocumentContext);
	if (!context) {
		throw new Error("useDocument must be used within a DocumentProvider");
	}
	return context;
}