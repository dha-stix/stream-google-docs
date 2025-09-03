import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export default function ShareModal({ slug }: { slug: string }) {
	return (
		<DialogContent className='sm:max-w-4xl'>
			<DialogHeader>
				<DialogTitle className='text-2xl text-blue-700'>
					Share Document
				</DialogTitle>
				<DialogDescription>
					Copy and share this link with people you want to collaborate with.
				</DialogDescription>
			</DialogHeader>

			<p className='text-gray-100 px-4 py-3 rounded-lg overflow-x-scroll bg-gray-900 border border-gray-700 mt-2'>
				{`${process.env.NEXT_PUBLIC_HOST}/${slug}`}
			</p>
		</DialogContent>
	);
}