"use client";
import { onAuthStateChanged } from "firebase/auth";
import { signInWithGoogle } from "@/lib/server";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import { useEffect } from "react";

export default function Home() {
	const router = useRouter();

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				router.push("/dashboard");
			}
		});
	}, [router]);

	const handleSubmit = async () => {
		const { user, message } = await signInWithGoogle();
		if (user) {
			console.log("User signed in:", user);
			router.push("/dashboard");
		} else {
			console.error("Sign in failed:", message);
		}
	};

	return (
		<section className='min-h-screen text-center w-full py-8 lg:px-[50px] px-4 flex flex-col items-center justify-center'>
			<h1 className='text-4xl lg:text-6xl font-extrabold text-blue-500 mb-5'>
				Collaborative Documents, Made Simple
			</h1>
			<p className='opacity-50 text-lg lg:text-2xl '>
				Create, edit, and share documents with your team in real time &mdash;
				from anywhere.
			</p>
			<p className='opacity-50 text-lg lg:text-2xl '>
				No installs, no hassle. Just open, write, and collaborate instantly.
			</p>

			<div className='flex items-center justify-center mt-8'>
				<button
					className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 w-[200px] rounded-md cursor-pointer'
					onClick={handleSubmit}
				>
					Log in to start
				</button>
			</div>
		</section>
	);
}