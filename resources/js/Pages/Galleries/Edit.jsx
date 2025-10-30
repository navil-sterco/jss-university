import { useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

const EditGallery = ({ gallery }) => {
    const appUrl = usePage().props.appUrl;
    
    // State for existing media
    const [existingImages, setExistingImages] = useState(gallery.images || []);
    const [existingVideos, setExistingVideos] = useState(gallery.videos || []);
    const [existingPdf, setExistingPdf] = useState(gallery.pdf || null);

    const { data, setData, post, errors, processing } = useForm({
        title: gallery.title || '',
        event_date: gallery.event_date || '',
        type: gallery.type || '',
        images: [],
        videos: [],
        pdf: null,
        display_order: gallery.display_order || 100,
        removed_images: [],
        removed_videos: [],
        removed_pdf: false,
    });

    // Handle new file selection
    const handleFileChange = (e, field, multiple = false) => {
        if (multiple) {
            const files = Array.from(e.target.files);
            setData(field, files);
        } else {
            const file = e.target.files[0];
            setData(field, file);
        }
    };

    // Remove existing media
    const removeExistingFile = (field, index = null) => {
        if (field === 'images') {
            const removedIndex = existingImages[index];
            setExistingImages(prev => prev.filter((_, i) => i !== index));
            setData('removed_images', [...data.removed_images, removedIndex]);
        }
        if (field === 'videos') {
            const removedIndex = existingVideos[index];
            setExistingVideos(prev => prev.filter((_, i) => i !== index));
            setData('removed_videos', [...data.removed_videos, removedIndex]);
        }
        if (field === 'pdf') {
            setExistingPdf(null);
            setData('removed_pdf', true);
        }
    };

    // Submit form
    const submit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('event_date', data.event_date);
        formData.append('type', data.type);
        formData.append('display_order', data.display_order);
        
        // Append new files
        if (data.images && data.images.length > 0) {
            data.images.forEach((file) => {
                formData.append('images[]', file);
            });
        }
        
        if (data.videos && data.videos.length > 0) {
            data.videos.forEach((file) => {
                formData.append('videos[]', file);
            });
        }
        
        if (data.pdf) {
            formData.append('pdf', data.pdf);
        }
        
        // Append removed files
        if (data.removed_images.length > 0) {
            formData.append('removed_images', JSON.stringify(data.removed_images));
        }
        if (data.removed_videos.length > 0) {
            formData.append('removed_videos', JSON.stringify(data.removed_videos));
        }
        if (data.removed_pdf) {
            formData.append('removed_pdf', data.removed_pdf);
        }
        
        // Add PUT method for Laravel
        formData.append('_method', 'PUT');
        
        post(route("galleries.update", gallery.id), formData);
    };

    return (
        <>
            <h1 className="text-muted">Edit Gallery Item</h1>
            <div className="card mb-4">
                <form onSubmit={submit} encType="multipart/form-data">
                    <div className="card-body">
                        <div className="row">
                            {/* Type */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Type</label>
                                <select
                                    className="form-select"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                >
                                    <option value="">Select Type</option>
                                    <option value="gallery">Gallery</option>
                                    <option value="media_coverage">Media Coverage</option>
                                    <option value="notice_announcement">Notice & Announcement</option>
                                </select>
                                <div className="form-text text-danger">{errors.type}</div>
                            </div>

                            {/* Title */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.title}</div>
                            </div>

                            {/* Event Date */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Event Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={data.event_date}
                                    onChange={(e) => setData('event_date', e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.event_date}</div>
                            </div>

                            {/* Conditional uploads */}
                            {data.type === 'gallery' && (
                                <>
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Upload New Images</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => handleFileChange(e, 'images', true)}
                                        />
                                        <div className="form-text text-danger">{errors.images}</div>
                                    </div>

                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Upload New Videos</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept="video/*"
                                            multiple
                                            onChange={(e) => handleFileChange(e, 'videos', true)}
                                        />
                                        <div className="form-text text-danger">{errors.videos}</div>
                                    </div>
                                </>
                            )}

                            {data.type === 'media_coverage' && (
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Upload New Images</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => handleFileChange(e, 'images', true)}
                                    />
                                    <div className="form-text text-danger">{errors.images}</div>
                                </div>
                            )}

                            {data.type === 'notice_announcement' && (
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Upload New PDF</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="application/pdf"
                                        onChange={(e) => handleFileChange(e, 'pdf')}
                                    />
                                    <div className="form-text text-danger">{errors.pdf}</div>
                                </div>
                            )}

                            {/* Display Order */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Display Order</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={data.display_order}
                                    onChange={(e) => setData('display_order', e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.display_order}</div>
                            </div>

                            {/* Existing Images */}
                            {existingImages.length > 0 && (
                                <div className="mb-3 col-12">
                                    <label className="form-label">Existing Images</label>
                                    <div className="d-flex flex-wrap gap-2">
                                        {existingImages.map((img, idx) => (
                                            <div key={idx} className="position-relative">
                                                <img
                                                    src={`${appUrl}/${img}`}
                                                    alt=""
                                                    style={{ width: 150, height: 80, objectFit: 'cover', borderRadius: 8 }}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                                    onClick={() => removeExistingFile('images', idx)}
                                                >×</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Existing Videos */}
                            {existingVideos.length > 0 && (
                                <div className="mb-3 col-12">
                                    <label className="form-label">Existing Videos</label>
                                    <div className="d-flex flex-wrap gap-2">
                                        {existingVideos.map((vid, idx) => (
                                            <div key={idx} className="position-relative">
                                                <video
                                                    controls
                                                    style={{ width: 150, height: 80, borderRadius: 8 }}
                                                >
                                                    <source src={`${appUrl}/${vid}`} type="video/mp4" />
                                                </video>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                                    onClick={() => removeExistingFile('videos', idx)}
                                                >×</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Existing PDF */}
                            {existingPdf && (
                                <div className="mb-3 col-12">
                                    <label className="form-label">Existing PDF</label>
                                    <div className="d-flex gap-2 align-items-center">
                                        <a href={`${appUrl}/${existingPdf}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary">View PDF</a>
                                        <button type="button" className="btn btn-sm btn-danger" onClick={() => removeExistingFile('pdf')}>Remove</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-2">
                            <button type="submit" className="btn btn-primary" disabled={processing}>
                                {processing ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditGallery;