import type { Metadata } from "next";
import { AuthProvider } from "../components/AuthContext";
import { DocumentProvider } from "../hooks/useDocument";

export const metadata: Metadata = {
	title: "New Document | Google Docs Clone",
	description: "Manage your documents with Google Docs Clone",
};

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<AuthProvider>
			<DocumentProvider>{children}</DocumentProvider>
		</AuthProvider>
	);
}