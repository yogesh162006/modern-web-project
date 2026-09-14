import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle, RefreshCw } from 'lucide-react';
import { uploadProductImage } from '../services/adminApi';

export default function ImageUploader({ 
  currentImage, 
  onImageUploaded, 
  onError 
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImage || '');

  const handleFile = async (file) => {
    if (!file) return;

    // Format check
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      if (onError) onError('Please upload a JPG, JPEG, PNG, or WebP image.');
      return;
    }

    // Size check (5MB)
    if (file.size > 5 * 1024 * 1024) {
      if (onError) onError('Image size must be less than 5MB.');
      return;
    }

    // Create immediate local preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    setIsUploading(true);
    try {
      const res = await uploadProductImage(file);
      if (res && res.image_url) {
        setPreviewUrl(res.image_url);
        if (onImageUploaded) onImageUploaded(res.image_url);
      }
    } catch (err) {
      if (onError) onError(err.message || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`admin-uploader-box ${isDragging ? 'is-dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={handleInputChange}
      />

      {previewUrl ? (
        <>
          <img 
            src={previewUrl} 
            alt="Product Preview" 
            className="admin-uploader-preview"
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--admin-primary)' }}>
            {isUploading ? (
              <>
                <RefreshCw size={14} className="spin-icon" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <CheckCircle size={14} color="#25d366" />
                <span>Click or drag to replace image</span>
              </>
            )}
          </div>
          <span className="admin-uploader-hint">
            JPG, PNG, WebP up to 5MB • Original packaging preserved
          </span>
        </>
      ) : (
        <>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#edf5f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#188647', marginBottom: 10 }}>
            <UploadCloud size={24} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text-main)' }}>
            Click to upload product image or drag & drop
          </span>
          <span className="admin-uploader-hint">
            Supported formats: JPG, PNG, WebP (Max 5MB)
          </span>
        </>
      )}
    </div>
  );
}
