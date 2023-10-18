'use client'

import React, { useState } from 'react';
import axios from 'axios';
import styles from './index.module.css';
import { BeatLoader } from 'react-spinners';


export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [responseData, setResponseData] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState<boolean>(false);
  const [imageURL, setImageURL] = useState<string | null>(null);


  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setImageURL(URL.createObjectURL(e.target.files[0])); // Add this line

    }
  };

  
  
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    // Set the waiting for response state
    setIsWaitingForResponse(true);

    try {
      const res = await axios.post('https://maziwa.spaceai.io/webhook/a13d9e7f-73f0-4370-9244-361b4ea7b4fc', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
          setUploadProgress(percentCompleted);
        }
      });

      setResponseData(res.data);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      // Reset the waiting for response state
      setIsWaitingForResponse(false);
    }
};


  return (
    <div className={styles.container}>
        
      <h1>IDENTINTY CHECK ITUNZA-V0.1</h1>
      <div className={styles.space}></div>
  
      <h2>Upload an image to Space AI</h2>
      <div className={styles.space}></div>
      
      <form onSubmit={onSubmit}>
        <div className={styles.fileinputWrapper}>
          <label htmlFor="file">File</label>
          <input type="file" onChange={onFileChange} />
        </div>
        <div className={styles.buttonWrapper}>
          <button type="submit">Submit</button>
        </div>
      </form>
        
      {uploadProgress && uploadProgress < 100 && (
        <div className={styles.progressBar}>
          <BeatLoader color="#4A90E2" />
          <p>Uploading... {uploadProgress}%</p>
        </div>
      )}
  
      {uploadProgress && uploadProgress === 100 && (
        <div className={styles.progressBar}>
          <progress value={uploadProgress} max="100"></progress>
          <p>Uploaded! {uploadProgress}%</p>
        </div>
      )}
  
      {/* {responseData && (
        <div>
          <h2>Response:</h2>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )} */}

      {isWaitingForResponse && (
          <div className={styles.progressBar}>
            <BeatLoader color="#4A90E2" />
            <p>ID CONFIRMATION IN PROGRESS...</p>
          </div>
        )}

      {/* {responseData && (
        <div>
          <h2>Response:</h2>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )} */}

      {responseData && (
          <div className={styles.responseContainer}>
            <h2>Response:</h2>

            {/* Display the uploaded image */}
            {imageURL && <img src={imageURL} alt="Uploaded" className={styles.uploadedImage} />}
          
            <div className={styles.details}>
              <h3>Details:</h3>
              <ul>
                <li><strong>Serial Number:</strong> {responseData.data.attributes.serial_number}</li>
                <li><strong>ID Number:</strong> {responseData.data.attributes.id_number}</li>
                <li><strong>Full Names:</strong> {responseData.data.attributes.full_names}</li>
                <li><strong>Date of Birth:</strong> {responseData.data.attributes.date_of_birth}</li>
                <li><strong>Distric of birth:</strong> {responseData.data.attributes.district_of_birth}</li>
                <li><strong>Sex:</strong> {responseData.data.attributes.sex}</li>
                <li><strong>Place of Issue:</strong> {responseData.data.attributes.place_of_issue}</li>
                <li><strong>Date of Issue:</strong> {responseData.data.attributes.date_of_issue}</li>  
                {/* ... repeat for other attributes */}
              </ul>
            </div>
          </div>
        )}
    </div>
    
  );
}



// "id": 34,
// "attributes": {
//   "serial_number": "231647102",
//   "id_number": "31030810",
//   "full_names": "DIETHER ROLF KOEHLER",
//   "date_of_birth": "07.01.1954",
//   "sex": "MALE",
//   "district_of_birth": "GERMANY",
//   "place_of_issue": "ISLAND",
//   "date_of_issue": "20.11.2012",
//   "createdAt": "2023-10-17T19:00:10.032Z",
//   "updatedAt": "2023-10-17T19:00:10.032Z",
//   "publishedAt": "2023-10-17T19:00:10.028Z",
//   "isValidated": false