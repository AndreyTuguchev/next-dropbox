"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { db, storage } from "@/firebase";
import { useAppStore } from "@/store/store"
import { useUser } from "@clerk/nextjs";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";


export function DeleteModal() {

    const { user } = useUser();

    const [ isDeleteModalOpen, setIsDeleteModalOpen, fileId, setFileId ] = useAppStore( (state) => [
        state.isDeleteModalOpen,
        state.setIsDeleteModalOpen,
        state.fileId,
        state.setFileId
    ])

    async function deleteFile (){
        if (!user || !fileId ) return;

        const fileRef = ref( storage, `users/${user.id}/files/${fileId}`);

        await deleteObject( fileRef ).then( async () => {
      
            deleteDoc( doc( db, "users", user.id, "files", fileId)).then( () => {
                console.log(' file deleted from database ')
            }).then( ()=> {
                setIsDeleteModalOpen(false);
            })

        }).catch( (error) =>{
            console.error( error ); 
            setIsDeleteModalOpen(false);
            // catch this error here
        })

        
    } 


  return (
    <Dialog
        open={isDeleteModalOpen}
        onOpenChange={(isOpen) => {
            setIsDeleteModalOpen(isOpen);
        }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this file?</DialogTitle>
          <DialogDescription>
            This action canot be undone. This will permanetly delete your file from the cloud storage!
          </DialogDescription>
        </DialogHeader>

        <div className="flex space-x-2 py-3">
            <Button
                size="sm"
                className="px-3 flex-1"
                variant={"ghost"}
                onClick={() => setIsDeleteModalOpen(false)}
            >
                <span className="sr-only">Cancel</span>
                <span>Cancel</span>
                
            </Button>

            <Button 
                type="submit"
                size="sm"
                className="px-3 flex-1"
                onClick={() => deleteFile()}
                variant={"destructive"}
            >
                <span className="sr-only">Delete</span>
                <span>Delete</span>
            </Button>
        </div>
      



        {/* <DialogFooter className="flex space-x-2 py-3">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  )
}

