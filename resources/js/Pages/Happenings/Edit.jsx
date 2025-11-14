import { useForm, usePage } from "@inertiajs/react";
import React, { useRef } from "react";

const Edit = ({ happening }) => {
    const fileInputRef = useRef(null);
    const bannerInputRef = useRef(null);
    const pdfInputRef = useRef(null);
    const { appUrl } = usePage().props;

    const { data, setData, post, errors, processing, progress } = useForm({
        _method: "PUT",
        event_type: happening.event_type || "",
        title: happening.title || "",
        slug: happening.slug || "",
        alt_text: happening.alt_text || "",
        short_description: happening.short_description || "",
        description: happening.description || "",
        image: null,
        banner_images: null,
        pdf: null,
        pdf_title: happening.pdf_title || "",
        video: happening.video || "",
        event_date_from: happening.event_date_from || "",
        event_date_to: happening.event_date_to || "",
        show_on_home: happening.show_on_home || 0,
        display_order: happening.display_order || 100,
        status: happening.status || 1,
        remove_image: false,
        remove_banner: false,
        remove_pdf: false,
    });

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null) formData.append(key, value);
        });
        post(route("happening.update", happening.id), {
            data: formData,
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <h1 className="text-muted">Edit Happening</h1>
            <div className="card mb-4">
                <form onSubmit={submit} encType="multipart/form-data">
                    <div className="card-body">
                        <div className="row">
                            {/* Event Type */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="event_type" className="form-label">Event Type <span className="text-danger">*</span></label>
                                <select
                                    id="event_type"
                                    className="form-select"
                                    value={data.event_type}
                                    onChange={(e) => setData("event_type", e.target.value)}
                                >
                                    <option value="">Select Type</option>
                                    <option value="News-Event">News & Event</option>
                                    <option value="Gallery">Gallery</option>
                                    <option value="Media-Coverage">Media Coverage</option>
                                    <option value="Press-Release">Press-Release</option>
                                </select>
                                <div className="form-text text-danger">{errors.event_type}</div>
                            </div>

                            {/* Title */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="title" className="form-label">Title <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    id="title"
                                    className="form-control"
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.title}</div>
                            </div>

                            {/* Slug */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="slug" className="form-label">Slug</label>
                                <input
                                    type="text"
                                    id="slug"
                                    className="form-control"
                                    value={data.slug}
                                    onChange={(e) => setData("slug", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.slug}</div>
                            </div>

                            {/* Alt Text */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="alt_text" className="form-label">Alt Text</label>
                                <input
                                    type="text"
                                    id="alt_text"
                                    className="form-control"
                                    value={data.alt_text}
                                    onChange={(e) => setData("alt_text", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.alt_text}</div>
                            </div>

                            {/* Image Upload */}
                            <div className={`mb-3 ${happening.image && !data.remove_image ? "col-md-4" : "col-md-6"}`}>
                                <label htmlFor="image" className="form-label">Main Image </label><small className="text-light fw-medium fs-9"> (On Update Old Image Will Be Replaced)</small>
                                <input
                                    type="file"
                                    id="image"
                                    ref={fileInputRef}
                                    className="form-control"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={(e) => setData("image", e.target.files[0])}
                                />
                                <div className="form-text text-danger">{errors.image}</div>
                            </div>

                            {!data.remove_image && happening.image && (
                                <div className="mb-3 col-md-2">
                                    <label htmlFor="image" className="form-label">Current Image</label>
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={`${appUrl}/${happening.image}`}
                                            alt="Current"
                                            style={{
                                                width: "115px",
                                                height: "38px",
                                                borderRadius: "4px",
                                                objectFit: "cover",
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger ms-3"
                                            onClick={() => setData("remove_image", true)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Banner Image */}
                            <div className={`mb-3 ${!data.remove_banner && happening.banner_images ? "col-md-4" : "col-md-6"}`}>
                                <label htmlFor="banner_images" className="form-label">Banner Image</label><small className="text-light fw-medium fs-9"> (On Update Old Banner Image Will Be Replaced)</small>
                                <input
                                    type="file"
                                    id="banner_images"
                                    ref={bannerInputRef}
                                    className="form-control"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={(e) => setData("banner_images", e.target.files[0])}
                                />
                                <div className="form-text text-danger">{errors.banner_images}</div>
                            </div>
                            {!data.remove_banner && happening.banner_images && (
                                <div className="mb-3 col-md-2">
                                    <label htmlFor="image" className="form-label">Current Banner Image</label>
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={`${appUrl}/${happening.banner_images}`}
                                            alt="Current Banner"
                                            style={{
                                                width: "115px",
                                                height: "38px",
                                                borderRadius: "4px",
                                                objectFit: "cover",
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger ms-3"
                                            onClick={() => setData("remove_banner", true)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {/* PDF */}
                            <div className={`mb-3 ${!data.remove_pdf && happening.pdf ? "col-md-4" : "col-md-6"}`}>
                                <label htmlFor="pdf" className="form-label">Upload PDF</label><small className="text-light fw-medium fs-9"> (On Update Old PDF Will Be Replaced)</small>
                                <input
                                    type="file"
                                    id="pdf"
                                    ref={pdfInputRef}
                                    className="form-control"
                                    accept="application/pdf"
                                    onChange={(e) => setData("pdf", e.target.files[0])}
                                />
                                <div className="form-text text-danger">{errors.pdf}</div>
                            </div>
                            {!data.remove_pdf && happening.pdf && (
                                <div className="mb-3 col-md-2">
                                    <label htmlFor="image" className="form-label">Click To View PDF</label>
                                    <div className="mt-1 d-flex align-items-center">
                                        <a className="btn btn-sm btn-outline-warning" href={`${appUrl}/${happening.pdf}`} target="_blank" rel="noopener noreferrer" style={{
                                                width: "115px",
                                            }}>
                                            View PDF
                                        </a>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger ms-3"
                                            onClick={() => setData("remove_pdf", true)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {/* PDF Title */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="pdf_title" className="form-label">PDF Title</label>
                                <input
                                    type="text"
                                    id="pdf_title"
                                    className="form-control"
                                    value={data.pdf_title}
                                    onChange={(e) => setData("pdf_title", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.pdf_title}</div>
                            </div>

                            {/* Video */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="video" className="form-label">Video Link</label>
                                <input
                                    type="text"
                                    id="video"
                                    className="form-control"
                                    value={data.video}
                                    onChange={(e) => setData("video", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.video}</div>
                            </div>

                            {/* Event Dates */}
                            <div className="mb-3 col-md-3">
                                <label htmlFor="event_date_from" className="form-label">Event Start Date <span className="text-danger">*</span></label>
                                <input
                                    type="date"
                                    id="event_date_from"
                                    className="form-control"
                                    value={data.event_date_from}
                                    onChange={(e) => setData("event_date_from", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.event_date_from}</div>
                            </div>

                            <div className="mb-3 col-md-3">
                                <label htmlFor="event_date_to" className="form-label">Event End Date <span className="text-danger">*</span></label>
                                <input
                                    type="date"
                                    id="event_date_to"
                                    className="form-control"
                                    value={data.event_date_to}
                                    onChange={(e) => setData("event_date_to", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.event_date_to}</div>
                            </div>

                            {/* Short Description */}
                            <div className="mb-3 col-md-12">
                                <label htmlFor="short_description" className="form-label">Short Description</label>
                                <textarea
                                    id="short_description"
                                    className="form-control"
                                    rows="2"
                                    value={data.short_description}
                                    onChange={(e) => setData("short_description", e.target.value)}
                                ></textarea>
                                <div className="form-text text-danger">{errors.short_description}</div>
                            </div>

                            {/* Description */}
                            <div className="mb-3 col-md-12">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea
                                    id="description"
                                    className="form-control"
                                    rows="4"
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                ></textarea>
                                <div className="form-text text-danger">{errors.description}</div>
                            </div>

                            {/* Show on Home */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="show_on_home" className="form-label">Show on Home</label>
                                <select
                                    id="show_on_home"
                                    className="form-select"
                                    value={data.show_on_home}
                                    onChange={(e) => setData("show_on_home", e.target.value)}
                                >
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                            </div>

                            {/* Display Order */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="display_order" className="form-label">Display Order</label>
                                <input
                                    type="number"
                                    id="display_order"
                                    className="form-control"
                                    value={data.display_order}
                                    onChange={(e) => setData("display_order", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.display_order}</div>
                            </div>
                        </div>

                        {/* Progress Bar */}
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

                        {/* Submit */}
                        <div className="mt-2">
                            <button type="submit" className="btn btn-primary me-2" disabled={processing}>
                                {processing ? "Updating..." : "Update Happening"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Edit;
