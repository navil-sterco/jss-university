import { useForm, usePage } from "@inertiajs/react";
import React, { useRef } from "react";

const Edit = ({ testimonial }) => {
    const fileInputRef = useRef(null);
    const appUrl = usePage().props.appUrl;

    const { data, setData, post, progress, errors, processing } = useForm({
        _method: "PUT",
        type: testimonial.type || "",
        title: testimonial.title || "",
        slug: testimonial.slug || "",
        alt_text: testimonial.alt_text || "",
        short_description: testimonial.short_description || "",
        name: testimonial.name || "",
        batch: testimonial.batch || "",
        course: testimonial.course || "",
        description: testimonial.description || "",
        designation: testimonial.designation || "",
        location: testimonial.location || "",
        company: testimonial.company || "",
        video_url: testimonial.video_url || "",
        image: null,
        home_image: null,
        placement_image: null,
        status: testimonial.status || 1,
        show_on_home: testimonial.show_on_home || 0,
        display_order: testimonial.display_order || "",
    });

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (data[key] !== null) {
                formData.append(key, data[key]);
            }
        });

        post(route("testimonial.update", testimonial.id), {
            data: formData,
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <h1 className="text-muted">Edit Testimonial</h1>
            <div className="card mb-4">
                <form onSubmit={submit} encType="multipart/form-data">
                    <div className="card-body">
                        <div className="row">
                            {/* Type */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="type" className="form-label">Type <span className="text-danger">*</span></label>
                                <select
                                    id="type"
                                    className="form-select"
                                    value={data.type}
                                    onChange={(e) => setData("type", e.target.value)}
                                >
                                    <option value="">Select Type</option>
                                    <option value="placement">Placement</option>
                                    <option value="alumuni">Alumuni</option>
                                    <option value="student">Student</option>
                                </select>
                                <div className="form-text text-danger">{errors.type}</div>
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

                            {/* Image Upload */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="image" className="form-label">Image</label>
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

                            {/* Image Upload */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="home_image" className="form-label">Home Image</label>
                                <input
                                    type="file"
                                    id="home_image"
                                    ref={fileInputRef}
                                    className="form-control"
                                    onChange={(e) => setData("home_image", e.target.files[0])}
                                    accept="image/png, image/jpeg, image/webp"
                                />
                                <div className="form-text text-danger">{errors.home_image}</div>
                            </div>

                            {/* Image Upload */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="placement_image" className="form-label">Placement Image</label>
                                <input
                                    type="file"
                                    id="placement_image"
                                    ref={fileInputRef}
                                    className="form-control"
                                    onChange={(e) => setData("placement_image", e.target.files[0])}
                                    accept="image/png, image/jpeg, image/webp"
                                />
                                <div className="form-text text-danger">{errors.placement_image}</div>
                            </div>

                            {/* Video URL */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="video_url" className="form-label">Video URL</label>
                                <input
                                    type="text"
                                    id="video_url"
                                    className="form-control"
                                    value={data.video_url}
                                    onChange={(e) => setData("video_url", e.target.value)}
                                    placeholder="https://youtube.com/..."
                                />
                                <div className="form-text text-danger">{errors.video_url}</div>
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

                            {/* Name */}
                            <div className="mb-3 col-md-4">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="form-control"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.name}</div>
                            </div>

                            {/* Batch */}
                            <div className="mb-3 col-md-4">
                                <label htmlFor="batch" className="form-label">Batch</label>
                                <input
                                    type="text"
                                    id="batch"
                                    className="form-control"
                                    value={data.batch}
                                    onChange={(e) => setData("batch", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.location}</div>
                            </div>

                            {/* Course */}
                            <div className="mb-3 col-md-4">
                                <label htmlFor="course" className="form-label">Course</label>
                                <input
                                    type="text"
                                    id="course"
                                    className="form-control"
                                    value={data.course}
                                    onChange={(e) => setData("course", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.course}</div>
                            </div>

                            {/* Designation */}
                            <div className="mb-3 col-md-4">
                                <label htmlFor="designation" className="form-label">Designation</label>
                                <input
                                    type="text"
                                    id="designation"
                                    className="form-control"
                                    value={data.designation}
                                    onChange={(e) => setData("designation", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.designation}</div>
                            </div>

                            {/* Location */}
                            <div className="mb-3 col-md-4">
                                <label htmlFor="location" className="form-label">Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    className="form-control"
                                    value={data.location}
                                    onChange={(e) => setData("location", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.location}</div>
                            </div>

                            {/* Company */}
                            <div className="mb-3 col-md-4">
                                <label htmlFor="company" className="form-label">Company</label>
                                <input
                                    type="text"
                                    id="company"
                                    className="form-control"
                                    value={data.company}
                                    onChange={(e) => setData("company", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.company}</div>
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

                        {/* Submit Button */}
                        <div className="mt-2">
                            <button
                                type="submit"
                                className="btn btn-primary me-2"
                                disabled={processing}
                            >
                                {processing ? "Updating..." : "Update Testimonial"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Edit;
