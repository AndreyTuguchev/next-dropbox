"use client"
import Dropzone from 'react-dropzone'


function DropZoneComp() {
  const maxSize = 20971520

  
  return (
    <Dropzone minSize={0} maxSize={maxSize} onDrop={acceptedFiles => console.log(acceptedFiles)}>
    {({getRootProps, getInputProps, isDragActive, isDragReject, fileRejections}) => {
      
    const isFileTooLarge = fileRejections.length > 0 && fileRejections[0].file.size > maxSize;
          
    return (
        <section className='m-4'>
        <div {...getRootProps()} className={`w-full h-52 flex flex-col justify-center items-center p-5 border border-dashed rounded-lg text-center cursor-pointer ${isDragActive ? 'bg-[#035FFE] text-white animate-pulse' : 'bg-slate-100/50 dark:bg-slate-800/80 text-slate-400'       
        }`}>
            <input {...getInputProps()} />
            {!isDragActive && <div>"Click here or drop a file to upload!"</div>}
              {isDragActive && !isDragReject && "Drop to upload this file!"}
              {isDragReject && "File type not accepted, sorry!"}
              {isFileTooLarge && (
                <div className="text-danger mt-2">File is too large.</div>
            )}
        </div>
        </section>
    )}}
    </Dropzone>
  )
}

export default DropZoneComp