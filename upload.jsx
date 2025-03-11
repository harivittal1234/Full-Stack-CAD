import React, { useState } from 'react';
import ModelViewer from './Modelviewer';

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [modelUrl, setModelUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversionFormat, setConversionFormat] = useState('obj');

  // ... (keep existing handleFileChange and handleUpload)
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }
    
    // Check file type
    if (!file.name.endsWith('.stl') && !file.name.endsWith('.obj')) {
      setError("Only STL and OBJ files are supported");
      return;
    }
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      console.log('Upload success:', data);
      setModelUrl(`http://localhost:5000/models/${file.name}`);
      setError(null);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError("Failed to upload file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add conversion handler
  const handleConvert = async () => {
    if (!file) {
      setError("Please upload a file first");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/convert/${file.name}/${conversionFormat}`
      );
      
      if (!response.ok) throw new Error('Conversion failed');
      
      // Trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted.${conversionFormat}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fixed JSX structure
  return (
    <div className="container">
      <div className="upload-section">
        <input type="file" onChange={handleFileChange} accept=".stl,.obj" />
        <button onClick={handleUpload} disabled={isLoading}>
          {isLoading ? 'Uploading...' : 'Upload Model'}
        </button>
        
        {file && (
          <div className="conversion-controls">
            <select 
              value={conversionFormat} 
              onChange={(e) => setConversionFormat(e.target.value)}
            >
              <option value="stl">STL</option>
              <option value="obj">OBJ</option>
            </select>
            <button onClick={handleConvert} disabled={isLoading}>
              Convert to {conversionFormat.toUpperCase()}
            </button>
          </div>
        )}
      </div>

      {error && <div className="error">{error}</div>}
      
      {modelUrl && (
        <div className="model-container">
          <ModelViewer url={modelUrl} />
        </div>
      )}
    </div>
  );
}
