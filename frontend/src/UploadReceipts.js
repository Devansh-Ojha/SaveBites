import { useState } from 'react';
import './UploadReceipts.css';
import './buttons.css';

export default function UploadReceipts({pantryItems, setPantryItems}) {
    const [fileName, setFileName] = useState("");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    function handleFile(e) {
        setFileName(e.target.files[0].name);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setUploading(true);

        try {
            const fileInput = e.target.querySelector('#file-upload');
            if (!fileInput || !fileInput.files[0]) {
                setError("Please select a file");
                setUploading(false);
                return;
            }

            const formData = new FormData();
            formData.append('file', fileInput.files[0]);

            console.log("form data:", formData);
            const response = await fetch('http://localhost:3001/ocr', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`OCR processing failed: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("OCR Result:", data);
            
            // Handle the extracted ingredients
            let ingredients = [];
            for (let i = 0; i < Object.keys(data).length; i++) {
                ingredients.push(Object.keys(data)[i]);
            }
            if (ingredients && Array.isArray(ingredients)) {
                setPantryItems([...pantryItems, ...ingredients]);
            }
        } catch (err) {
            console.error("Error processing receipt:", err);
            setError(err.message || "Failed to process receipt");
        } finally {
            setUploading(false);
        }
    }
    
    return (
        <div className="upload-receipt-page">
            <div className="upload-receipt-container">
                <div className="pantry-section">
                    <h2>View Pantry</h2>
                    <ul className="pantry-list">
                        {pantryItems.map((item, index) => (
                            <li key={index} className="pantry-item">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="upload-section" style={{minHeight: 0, height: "200px"}}>
                    <h2>Upload Receipts</h2>
                    {error && <div style={{color: "red", marginBottom: "10px"}}>{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label style={{position: "relative", top: "20px"}} htmlFor="file-upload" className="btn-primary">Upload File{fileName ? ":" : ""} {fileName}</label>
                            <input onChange={(e) => handleFile(e)} id="file-upload" type="file" accept="image/*"/>
                        </div>
                        <button 
                            style={{position: "relative", top: "60px"}} 
                            type="submit" 
                            className="btn-primary"
                            disabled={uploading}
                        >
                            {uploading ? "Processing..." : "Parse Receipt"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}