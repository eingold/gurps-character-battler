import React from 'react'
import { useState } from 'react';
import Sheet from '../utils/sheet';

export const FileUploadForm = ({ setCharacter }) => {

    const [file, setFile] = useState("");

    const fileChange = (event) => {
        setFile(event.target.files[0])
    }

    const uploadCharacter = (event) => {
        event.preventDefault();
        const fileReader = new FileReader();
        fileReader.readAsText(file, "UTF-8");
        fileReader.onload = e => {
            setCharacter(new Sheet(JSON.parse(e.target.result)));
        };
    }

    return (
        <form onSubmit={uploadCharacter}>
            <input type="file" name="characterSheet" id="characterSheet" accept=".gcs" onChange={fileChange} />
            <input type="submit" value="Submit" />
        </form>
    )
}
