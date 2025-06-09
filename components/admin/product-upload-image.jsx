'use client';

import React, {useRef} from 'react'
import { useState} from "react";
import { TrashIcon,PlusIcon} from "@heroicons/react/24/outline";
import Compressor from "compressorjs";
import {  redirect, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useSession } from "next-auth/react";
import heic2any from "heic2any";
import Loading from '@/components/loading';
import {Input} from '@/components/ui/input';
import { Button } from '@/components/ui/button';


const ProductImageUploader = ({product}) => {

    const { data: session } = useSession();
    const user_email =   session?.user?.email;
    const router = useRouter();
    const inputFile = useRef(null);

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setOpen] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const toggleMenu = () => setOpen(!isOpen);

    const handleFileChange = async (event) => {
        const files = Array.from(event.target.files);
        setLoading(true);
        const convertedFilesArray = await Promise.all(
            files.map(async (file) => {
              const filename = file.name.toLowerCase();
              const ext = filename.split(".").pop();
                if (ext === "heic" || ext === "heif") {
                    const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg" });
                    return new File([convertedBlob], filename.replace("." + ext, ".jpg"), { type: "image/jpeg" });
                }
                return file;
            })
        );
        setSelectedFiles((previousImages) => previousImages.concat(convertedFilesArray));
        setLoading(false);
        setIsActive(true);
    };


    const handleRemoveImage = (index) => {
        const newSelectedFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newSelectedFiles);
        if(newSelectedFiles.length == 0)
            {
                setIsActive(false);
                setSelectedFiles([]);
            }
    };
  

    const uploadImages = async (e) => {
        const API_PATH = "/api/product/images/";
        e.preventDefault();
        if (selectedFiles != null) {
            selectedFiles && selectedFiles?.map(async (image, index) => {

                const extension = image.name.substr(image.name.lastIndexOf(".") + 1);    
                new Compressor(image, {
                  quality: 0.9, // 0.6 can also be used, but its not recommended to go below.
                  maxWidth: 1920,
                  maxHeight: 1080,
                  success: (result) => {
                    const formdata = new FormData();
                    formdata.append("image", result);
                    formdata.append("extension", extension);
                    formdata.append("product_id", product.id);
                    formdata.append("slug", product.slug);
                    fetch(API_PATH, {
                      method: "POST",
                      body: formdata,
                    });
                  },
                });
                  
              });
            } 
            else {
              setErrorMessage(true);
            }
        
        setTimeout(() => {
          router.refresh();
        }, 1000)
    
        setSelectedFiles([]);
        setIsActive(false);
    
        if (inputFile.current) {
          inputFile.current.value = "";
          inputFile.current.type = "file";   
          };
    
        redirect(`/admin/products/${product.id}`)
      }

    return (
        <>
        <div className="rounded-sm mt-4 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke dark:border-strokedark ">
            <Input
              id="image-upload"
              multiple
              type="file"
              onChange={handleFileChange}
              className="hidden"
                      />
            <Button
                  type="button"
                    className="text-sm text-white bg-blue-600 hover:bg-blue-700 m-2"
                    onClick={() => document.getElementById('image-upload').click()}
                  >
                    Upload Images
            </Button>
                
            </div>
            { selectedFiles.length > 0 ? (
            <div className="p-4">
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
  
            <div className="w-full xl:w-1/5">
            <input type="hidden" name="product_id" defaultValue={product.product_id}/>
            <input type="hidden" name="slug" defaultValue={product.slug}/>
            </div>
    
            <div className="w-full xl:w-4/5">
                <div className="flex gap-4">  
                {selectedFiles.map((image, index) => (
                    <div key={index} className="relative m-1">
                        <img 
                        src={URL.createObjectURL(image)} 
                        width="200"
                        alt={`preview ${index}`} 
                        className=" border border-gray-300 rounded" />
                       <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-sm p-1">
                            <TrashIcon className="w-5 h-5 text-white"/>
                        </button>
                    </div>
                ))}
                </div>
            </div>
            </div>
            { loading ? <Loading/> : ""}
                   
            <div className="mt-6 flex justify-center gap-4">
                <button type="submit"
                    disabled={!isActive}
                    onClick={uploadImages}
                    className={ `flex h-10 items-center rounded-lg 
                                        ${isActive ? 'bg-blue-600 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600' 
                                        : 'bg-blue-200'} 
                                        px-4 text-sm font-medium text-white transition-colors `}>
                                           <span className="hidden md:block">Save Images</span>
                    <PlusIcon className="h-6 md:ml-4" />
                </button>
            
            </div>
            </div>
       ) : "" }
        </div>
    </>
  )
}
 

export default ProductImageUploader;