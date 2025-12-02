import { useState } from 'react';
import './UploadReceipts.css';
import './buttons.css';

export default function UploadReceipts({pantryItems,setPantryItems}) {

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
                <div className="upload-section">
                    <h2>Upload Receipts</h2>
                    <button className="btn-primary">
                        Upload Receipt
                    </button>
                </div>
            </div>
        </div>
    );
}