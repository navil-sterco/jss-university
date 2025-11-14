import { useForm, usePage } from '@inertiajs/react';
import React, { useRef } from 'react';

const Create = () => {
    const fileInputRef = useRef(null);
    const bannerInputRef = useRef(null);
    const pdfInputRef = useRef(null);

    const { data, setData, post, errors, processing } = useForm({
        event_type: "",
        title: "",
        slug: "",
        alt_text: "",
        image: "",
        banner_images: "",
        pdf: "",
        pdf_title: "",
        video: "",
        event_date_from: "",
        event_date_to: "",
        short_description: "",
        description: "",
        display_order: 100,
        show_on_home: 0,
        status: 1,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("happening.store"));
    };

    return (
        <>
            <h1 className="text-muted">Create Happening</h1>
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
                                    placeholder="Enter title"
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
                                    placeholder="auto-generated or enter manually"
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
                                    placeholder="Alt text for image"
                                />
                                <div className="form-text text-danger">{errors.alt_text}</div>
                            </div>

                            {/* Image */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="image" className="form-label">Main Image</label>
                                <input
                                    type="file"
                                    id="image"
                                    ref={fileInputRef}
                                    className="form-control"
                                    onChange={(e) => setData("image", e.target.files[0])}
                                    accept="image/png, image/jpeg, image/webp"
                                />
                                <div className="form-text text-danger">{errors.image}</div>
                            </div>

                            {/* Banner Image */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="banner_images" className="form-label">Banner Image</label>
                                <input
                                    type="file"
                                    id="banner_images"
                                    ref={bannerInputRef}
                                    className="form-control"
                                    onChange={(e) => setData("banner_images", e.target.files[0])}
                                    accept="image/png, image/jpeg, image/webp"
                                />
                                <div className="form-text text-danger">{errors.banner_images}</div>
                            </div>

                            {/* PDF */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="pdf" className="form-label">PDF</label>
                                <input
                                    type="file"
                                    id="pdf"
                                    ref={pdfInputRef}
                                    className="form-control"
                                    onChange={(e) => setData("pdf", e.target.files[0])}
                                    accept="application/pdf"
                                />
                                <div className="form-text text-danger">{errors.pdf}</div>
                            </div>

                            {/* PDF Title */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="pdf_title" className="form-label">PDF Title</label>
                                <input
                                    type="text"
                                    id="pdf_title"
                                    className="form-control"
                                    value={data.pdf_title}
                                    onChange={(e) => setData("pdf_title", e.target.value)}
                                    placeholder="Enter PDF title"
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
                                    placeholder="https://youtube.com/..."
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
                                <div className="form-text text-danger">{errors.show_on_home}</div>
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

                        <div className="mt-2">
                            <button type="submit" className="btn btn-primary me-2" disabled={processing}>
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
