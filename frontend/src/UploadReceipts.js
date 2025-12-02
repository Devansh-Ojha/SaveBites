import { useState } from 'react';
import './UploadReceipts.css';
import './buttons.css';

export default function UploadReceipts({pantryItems,setPantryItems}) {
    const [fileName, setFileName] = useState("");
    function handleFile(e) {
        setFileName(e.target.files[0].name);
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
                    <form>
                        <div>
                            <label style={{position: "relative", top: "20px"}} htmlFor="file-upload" className="btn-primary">Upload File{fileName ? ":" : ""} {fileName}</label>
                            <input onChange={(e) => handleFile(e)} id="file-upload" type="file"/>
                        </div>
                        <button style={{position: "relative", top: "60px"}} type="submit" className="btn-primary">Parse Receipt</button>
                    </form>
                </div>
            </div>
        </div>
    );
}