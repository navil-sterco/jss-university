import { useForm, usePage } from "@inertiajs/react";
import React, { useRef, useState, useEffect } from "react";

const SeoEdit = ({ seo }) => {
    const fileInputRef = useRef(null);
    const appUrl = usePage().props.appUrl;
    const [keywordInput, setKeywordInput] = useState("");

    // Parse keywords from string to array (if stored as JSON or comma-separated)
    const parseKeywords = (keywords) => {
        if (!keywords) return [];
        if (Array.isArray(keywords)) return keywords;
        try {
            // Try to parse as JSON
            return JSON.parse(keywords);
        } catch {
            // If not JSON, try comma-separated
            return keywords.split(',').map(k => k.trim()).filter(k => k);
        }
    };

    const { data, setData, post, progress, errors, processing } = useForm({
        _method: "PUT",
        meta_title: seo.meta_title || "",
        meta_description: seo.meta_description || "",
        canonical_url: seo.canonical_url || "",
        slug: seo.slug || "",
        og_title: seo.og_title || "",
        og_description: seo.og_description || "",
        og_image: null,
        og_type: seo.og_type || "website",
        og_url: seo.og_url || "",
        keywords: parseKeywords(seo.keywords), // Initialize with parsed keywords
    });

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

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (data[key] !== null) {
                // Convert keywords array to JSON string for form data
                if (key === 'keywords' && Array.isArray(data[key])) {
                    formData.append(key, JSON.stringify(data[key]));
                } else {
                    formData.append(key, data[key]);
                }
            }
        });

        post(route("seo.update", seo.id), {
            data: formData,
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <h1 className="text-muted">Edit SEO</h1>
            <div className="card mb-4">
                <form onSubmit={submit} encType="multipart/form-data">
                    <div className="card-body">
                        <div className="row">

                            {/* Meta Title */}
                            <div className="mb-3 col-12">
                                <label htmlFor="meta_title" className="form-label">Meta Title <span className="text-danger">*</span></label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="meta_title"
                                    value={data.meta_title}
                                    onChange={(e) => setData("meta_title", e.target.value)}
                                    maxLength={60}
                                />
                                {errors.meta_title && <div className="form-text text-danger">{errors.meta_title}</div>}
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
                                    rows="3"
                                    value={data.meta_description}
                                    onChange={(e) => setData("meta_description", e.target.value)}
                                    maxLength={160}
                                />
                                {errors.meta_description && <div className="form-text text-danger">{errors.meta_description}</div>}
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
                                {errors.keywords && <div className="form-text text-danger">{errors.keywords}</div>}
                                
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
                                    value={data.slug}
                                    onChange={(e) => setData("slug", e.target.value)}
                                />
                                {errors.slug && <div className="form-text text-danger">{errors.slug}</div>}
                            </div>

                            {/* Canonical URL */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="canonical_url" className="form-label">Canonical URL</label>
                                <input
                                    className="form-control"
                                    type="url"
                                    id="canonical_url"
                                    value={data.canonical_url}
                                    onChange={(e) => setData("canonical_url", e.target.value)}
                                />
                                {errors.canonical_url && <div className="form-text text-danger">{errors.canonical_url}</div>}
                            </div>

                            {/* OG Title */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="og_title" className="form-label">Open Graph Title</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="og_title"
                                    value={data.og_title}
                                    onChange={(e) => setData("og_title", e.target.value)}
                                    maxLength={60}
                                />
                                {errors.og_title && <div className="form-text text-danger">{errors.og_title}</div>}
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
                                {errors.og_type && <div className="form-text text-danger">{errors.og_type}</div>}
                            </div>

                            {/* OG Description */}
                            <div className="mb-3 col-12">
                                <label htmlFor="og_description" className="form-label">Open Graph Description</label>
                                <textarea
                                    className="form-control"
                                    id="og_description"
                                    rows="3"
                                    value={data.og_description}
                                    onChange={(e) => setData("og_description", e.target.value)}
                                    maxLength={160}
                                />
                                {errors.og_description && <div className="form-text text-danger">{errors.og_description}</div>}
                            </div>

                            {/* OG Image Upload */}
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
                                {errors.og_image && <div className="form-text text-danger">{errors.og_image}</div>}
                                <div className="form-text">Recommended: 1200x630px for social media sharing</div>
                            </div>

                            {/* OG URL */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="og_url" className="form-label">Open Graph URL</label>
                                <input
                                    className="form-control"
                                    type="url"
                                    id="og_url"
                                    value={data.og_url}
                                    onChange={(e) => setData("og_url", e.target.value)}
                                />
                                {errors.og_url && <div className="form-text text-danger">{errors.og_url}</div>}
                            </div>

                            {/* Current OG Image Preview */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Current Open Graph Image</label>
                                {seo.og_image && (
                                    <div className="mb-2">
                                        <img
                                            src={`${appUrl}/${seo.og_image}`}
                                            alt="Current OG Image"
                                            style={{
                                                width: "150px",
                                                height: "80px",
                                                objectFit: "cover",
                                                borderRadius: "4px"
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Progress bar */}
                        {progress && (
                            <div className="progress mb-3">
                                <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{ width: `${progress.percentage}%` }}
                                >
                                    {progress.percentage}%
                                </div>
                            </div>
                        )}

                        <div className="mt-2">
                            <button
                                aria-label="Update SEO"
                                type="submit"
                                className="btn btn-primary me-2"
                                disabled={processing}
                            >
                                {processing ? "Updating..." : "Update SEO"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default SeoEdit;