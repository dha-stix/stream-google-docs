"use client";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ExternalLink, Trash2 } from "lucide-react";
import { truncateString } from "@/lib/utils";
import DeleteModal from "./DeleteModal";
import { useState } from "react";
import Link from "next/link";

export default function DocBox({
	title,
	author,
	slug,
}: {
	title: string;
	author: string;
	slug: string;
}) {
	const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

	return (
		<div className='lg:w-[300px] w-full h-[150px] border-2 hover:shadow hover:border-blue-500 border-blue-200 rounded-md px-4 py-2 relative'>
			<h3 className='text-gray-500 text-xl font-semibold'>
				{truncateString(title)}
			</h3>

			<p className='text-xs text-gray-400'>By {author}</p>

			<div className='flex items-center mt-6  justify-between '>
				<Link href={`/${slug}`} target='_blank'>
					<ExternalLink size={24} className='text-blue-600 cursor-pointer' />
				</Link>
				<Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
					<DialogTrigger asChild>
						<Trash2 size={24} className='text-red-600 cursor-pointer' />
					</DialogTrigger>
					<DeleteModal id={slug} />
				</Dialog>
			</div>
		</div>
	);
}