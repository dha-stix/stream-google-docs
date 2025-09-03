"use client";
import { createContext, useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

const AuthContext = createContext<{
	user: User | null;
	loading: boolean;
}>({
	user: null,
	loading: true,
});

export function AuthProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user?.uid) {
				setUser(user);
				setLoading(false);
			} else {
				return router.push("/");
			}
		});

		return () => unsubscribe();
	}, [router]);

	return (
		<>
			{user ? (
				<AuthContext.Provider value={{ loading, user }}>
					{children}
				</AuthContext.Provider>
			) : (
				<main className='flex items-center justify-center h-screen'>
					<Loader2 className='animate-spin text-4xl font-bold text-blue-500 text-center' />
				</main>
			)}
		</>
	);
}

export default AuthContext;