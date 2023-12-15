"use client"
import { db, storage } from '@/firebase';
import { useUser } from '@clerk/nextjs';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import Dropzone from 'react-dropzone'


function DropZoneComp() {
  const maxSize = 5242880

  const [loading, setLoading] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser()

  const uploadSingleFile = async ( selectedFile: File ) => {
    if ( loading ) return;
    if ( !user ) return;

    setLoading(true);
    
    const docRef = await addDoc( collection(db, "users", user.id, "files"), {
      userId: user.id,
      filename: selectedFile.name,
      fullName: user.fullName,
      profileImg: user.imageUrl,
      timestamp: serverTimestamp(),
      type: selectedFile.type,
      size: selectedFile.size,
    })
    
    const imageRef = ref(storage, `users/${user.id}/files/${docRef.id}`)

    uploadBytes(imageRef, selectedFile).then( async (snapshot) => {
        
      const downloadURL = await getDownloadURL(imageRef)

      await updateDoc( doc( db, "users", user.id, "files", docRef.id), {
        downloadURL: downloadURL,
      });
    });
    
    
    setLoading(false);
  }

  const onDropActions = ( acceptedFiles: File[] ) => {
    acceptedFiles.forEach( file =>{
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')

      reader.onload = async () =>{
        await uploadSingleFile(file);
      }

      reader.readAsArrayBuffer(file);

    })
  }
  
  return (
    <Dropzone minSize={0} maxSize={maxSize} onDrop={onDropActions}>
    {({getRootProps, getInputProps, isDragActive, isDragReject, fileRejections}) => {
      
    const isFileTooLarge = fileRejections.length > 0 && fileRejections[0].file.size > maxSize;
          
    return (
        <section className='m-4'>
        <div {...getRootProps()} className={`w-full h-52 flex flex-col justify-center items-center p-5 border border-dashed rounded-lg text-center cursor-pointer ${isDragActive ? 'bg-[#035FFE] text-white animate-pulse' : 'bg-slate-100/50 dark:bg-slate-800/80 text-slate-400'       
        }`}>
            <input {...getInputProps()} />
            <div>{!isDragActive && `"Click here or drop a file to upload! (Max: ${Math.floor(maxSize/1000000)}MB)"`}</div>
            <div>{isDragActive && !isDragReject && "Drop to upload this file!"}</div>
            <div>{isDragReject && "File type not accepted, sorry!"}</div>
              {isFileTooLarge && (
                <div className="text-red-500 font-bold mt-2">Attempted file is too large. Please try again.</div>
            )}
        </div>
        </section>
    )}}
    </Dropzone>
  )
}

export default DropZoneComp