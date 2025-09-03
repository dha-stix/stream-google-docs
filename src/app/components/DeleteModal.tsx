import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { deleteDocument } from "@/lib/server";
import { deleteChannel } from "../../../actions/stream";

export default function DeleteModal({ id }: { id: string }) {

    const handleDelete = async () => {
        const [{success}, {success: deleteSuccess}] = await Promise.all([
            deleteDocument(id),
            deleteChannel(id)
		]);
		
		if (success && deleteSuccess) {
			alert("Document deleted successfully");
		} else {
			alert("Error deleting document");
		}
    }

	return (
		<DialogContent className='sm:max-w-4xl'>
			<DialogHeader>
				<DialogTitle className='text-2xl text-blue-700'>
					Delete Document
				</DialogTitle>
				<DialogDescription>
					Are you sure you want to delete this document?
				</DialogDescription>
			</DialogHeader>

			<div className='flex justify-end'>
				<button className='bg-red-600 text-white px-4 py-2 rounded-md' onClick={handleDelete}>
					Delete
				</button>
			</div>
		</DialogContent>
	);
}