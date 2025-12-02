import { useForm } from '@inertiajs/react';
import React, { useRef, useState } from 'react'

const SeoCreate = (props) => {
    const [keywordInput, setKeywordInput] = useState("");
    const { data, setData, post, progress, errors, processing } = useForm({
        meta_title: "",
        meta_description: "",
        canonical_url: "",
        slug: "",
        og_title: "",
        og_description: "",
        og_image: null,
        og_type: "website",
        og_url: "",
        keywords: [], // Changed to array
    });
    
    const fileInputRef = useRef(null);
    
    const submit = (e) => {
        e.preventDefault(); 
        post(route("seo.store"));
    };

    // Add keyword to array
    const addKeyword = () => {
        if (keywordInput.trim() && !data.keywords.includes(keywordInput.trim())) {
            setData("keywords", [...data.keywords, keywordInput.trim()]);
            setKeywordInput("");
        }
    };

    // Remove keyword from array
    const removeKeyword = (index) => {
        const updatedKeywords = data.keywords.filter((_, i) => i !== index);
        setData("keywords", updatedKeywords);
    };

    // Handle Enter key press in keyword input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addKeyword();
        }
    };

    return (
        <>
            <h1 className="text-muted">Create SEO</h1>
            <div className="card mb-4">
                <form onSubmit={submit} encType='multipart/form-data'>
                    <div className="card-body">
                        <div className="row">
                            {/* Meta Title */}
                            <div className="mb-3 col-12">
                                <label htmlFor="meta_title" className="form-label">Meta Title <span className="text-danger">*</span></label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="meta_title"
                                    name="meta_title"
                                    placeholder='Page Title for SEO (50-60 characters)'
                                    value={data.meta_title}
                                    onChange={(e) => setData("meta_title", e.target.value)}
                                    maxLength={60}
                                />
                                <div className="form-text text-danger">{errors.meta_title}</div>
                                <div className="form-text text-muted">
                                    {data.meta_title.length}/60 characters recommended
                                </div>
                            </div>

                            {/* Meta Description */}
                            <div className="mb-3 col-12">
                                <label htmlFor="meta_description" className="form-label">Meta Description</label>
                                <textarea
                                    className="form-control"
                                    id="meta_description"
                                    name="meta_description"
                                    rows="3"
                                    placeholder='Page description for search engines (150-160 characters)'
                                    value={data.meta_description}
                                    onChange={(e) => setData("meta_description", e.target.value)}
                                    maxLength={160}
                                />
                                <div className="form-text text-danger">{errors.meta_description}</div>
                                <div className="form-text text-muted">
                                    {data.meta_description.length}/160 characters recommended
                                </div>
                            </div>

                            {/* Keywords */}
                            <div className="mb-3 col-12">
                                <label className="form-label">Keywords</label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Add keyword and press Enter or click Add"
                                        value={keywordInput}
                                        onChange={(e) => setKeywordInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={addKeyword}
                                        disabled={!keywordInput.trim()}
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="form-text text-danger">{errors.keywords}</div>
                                
                                {/* Display selected keywords */}
                                {data.keywords.length > 0 && (
                                    <div className="mt-2">
                                        <div className="d-flex flex-wrap gap-2">
                                            {data.keywords.map((keyword, index) => (
                                                <span key={index} className="badge bg-primary d-flex align-items-center">
                                                    {keyword}
                                                    <button
                                                        type="button"
                                                        className="btn-close btn-close-white ms-2"
                                                        style={{ fontSize: '0.7rem' }}
                                                        onClick={() => removeKeyword(index)}
                                                        aria-label={`Remove ${keyword}`}
                                                    />
                                                </span>
                                            ))}
                                        </div>
                                        <div className="form-text text-muted mt-1">
                                            {data.keywords.length} keyword(s) added
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Slug */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="slug" className="form-label">Slug <span className="text-danger">*</span></label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="slug"
                                    name="slug"
                                    placeholder='url-friendly-version'
                                    value={data.slug}
                                    onChange={(e) => setData("slug", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.slug}</div>
                            </div>

                            {/* Canonical URL */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="canonical_url" className="form-label">Canonical URL</label>
                                <input
                                    className="form-control"
                                    type="url"
                                    id="canonical_url"
                                    name="canonical_url"
                                    placeholder='https://example.com/canonical-page'
                                    value={data.canonical_url}
                                    onChange={(e) => setData("canonical_url", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.canonical_url}</div>
                            </div>

                            {/* OG Title */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="og_title" className="form-label">Open Graph Title</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="og_title"
                                    name="og_title"
                                    placeholder='Title for social media sharing'
                                    value={data.og_title}
                                    onChange={(e) => setData("og_title", e.target.value)}
                                    maxLength={60}
                                />
                                <div className="form-text text-danger">{errors.og_title}</div>
                            </div>

                            {/* OG Type */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="og_type" className="form-label">Open Graph Type</label>
                                <select
                                    id="og_type"
                                    className="form-select"
                                    value={data.og_type}
                                    onChange={(e) => setData("og_type", e.target.value)}
                                >
                                    <option value="website">Website</option>
                                    <option value="article">Article</option>
                                    <option value="product">Product</option>
                                    <option value="profile">Profile</option>
                                    <option value="video">Video</option>
                                </select>
                                <div className="form-text text-danger">{errors.og_type}</div>
                            </div>

                            {/* OG Description */}
                            <div className="mb-3 col-12">
                                <label htmlFor="og_description" className="form-label">Open Graph Description</label>
                                <textarea
                                    className="form-control"
                                    id="og_description"
                                    name="og_description"
                                    rows="3"
                                    placeholder='Description for social media sharing'
                                    value={data.og_description}
                                    onChange={(e) => setData("og_description", e.target.value)}
                                    maxLength={160}
                                />
                                <div className="form-text text-danger">{errors.og_description}</div>
                            </div>

                            {/* OG Image */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label" htmlFor="og_image">Open Graph Image</label>
                                <input
                                    type="file"
                                    id="og_image"
                                    className="form-control"
                                    ref={fileInputRef}
                                    onChange={(e) => setData("og_image", e.target.files[0])}
                                    accept="image/png, image/jpeg, image/webp"
                                />
                                <div className="form-text text-danger">{errors.og_image}</div>
                                <div className="form-text">Recommended: 1200x630px for social media sharing</div>
                            </div>

                            {/* OG URL */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="og_url" className="form-label">Open Graph URL</label>
                                <input
                                    className="form-control"
                                    type="url"
                                    id="og_url"
                                    name="og_url"
                                    placeholder='https://example.com/social-sharing-url'
                                    value={data.og_url}
                                    onChange={(e) => setData("og_url", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.og_url}</div>
                            </div>

                        </div>
                        
                        {/* Progress Bar */}
                        {progress && (
                            <div className="progress mt-2">
                                <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{ width: `${progress.percentage}%` }}
                                    aria-valuenow={progress.percentage}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                >
                                    {progress.percentage}%
                                </div>
                            </div>
                        )}

                        <div className="mt-2">
                            <button 
                                aria-label='Submit SEO form' 
                                type="submit" 
                                className="btn btn-primary me-2" 
                                disabled={processing}
                            >
                                {processing ? "Creating..." : "Create SEO"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default SeoCreate;