import { useForm } from '@inertiajs/react';
import React, { useRef, useState } from 'react';

const Create = () => {
    const fileInputRef = useRef(null);

    const { data, setData, post, errors, processing } = useForm({
        title: '',
        event_date: '',
        type: '',
        images: [],
        videos: [],
        pdf: null,
        display_order: 100,
    });
    
    const handleFileChange = (e, field, multiple = false) => {
        const files = multiple ? Array.from(e.target.files) : e.target.files[0];
        setData(field, files);
    };

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            if (data[key] !== null) {
                if (Array.isArray(data[key])) {
                    data[key].forEach((file) => formData.append(key + '[]', file));
                } else {
                    formData.append(key, data[key]);
                }
            }
        });

        post(route('galleries.store'), { data: formData, forceFormData: true });
    };

    return (
        <>
            <h1 className="text-muted">Create Gallery Item</h1>
            <div className="card mb-4">
                <form onSubmit={submit} encType="multipart/form-data">
                    <div className="card-body">
                        <div className="row">

                            {/* Type */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="type" className="form-label">Type</label>
                                <select
                                    id="type"
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
                                <label htmlFor="title" className="form-label">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    className="form-control"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.title}</div>
                            </div>

                            {/* Event Date */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="event_date" className="form-label">Event Date</label>
                                <input
                                    type="date"
                                    id="event_date"
                                    className="form-control"
                                    value={data.event_date}
                                    onChange={(e) => setData('event_date', e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.event_date}</div>
                            </div>

                            {/* Conditional Inputs */}
                            {data.type === 'gallery' && (
                                <>
                                    {/* Multiple Images */}
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Images (Max 6MB All)</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => handleFileChange(e, 'images', true)}
                                        />
                                        <div className="form-text text-danger">{errors.images}</div>
                                    </div>

                                    {/* Multiple Videos */}
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Videos (Max 6MB All)</label>
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
                                    <label className="form-label">Images (Max 6MB All)</label>
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
                                    <label className="form-label">PDF (Max 2MB)</label>
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
                                <label htmlFor="display_order" className="form-label">Display Order</label>
                                <input
                                    type="number"
                                    id="display_order"
                                    className="form-control"
                                    value={data.display_order}
                                    onChange={(e) => setData('display_order', e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.display_order}</div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="mt-2">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={processing}
                            >
                                {processing ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Create;
