import { useForm, usePage } from "@inertiajs/react";
import React, { useRef } from "react";

const Edit = ({ banner }) => {
    const fileInputRef = useRef(null);

    const appUrl = usePage().props.appUrl;

    const { data, setData, post, progress, errors, processing } = useForm({
        _method: "PUT",
        heading: banner.heading || "",
        subheading: banner.subheading || "",
        linked_text: banner.linked_text || "",
        link: banner.link || "",
        image: null,
        display_order: banner.display_order || "",
        show_on_home: banner.show_on_home || 0,
    });

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (data[key] !== null) {
                formData.append(key, data[key]);
            }
        });

        post(route("banners.update", banner.id), {
            data: formData,
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <h1 className="text-muted">Edit Banner</h1>
            <div className="card mb-4">
                <form onSubmit={submit} encType="multipart/form-data">
                    <div className="card-body">
                        <div className="row">

                            {/* Heading */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="heading" className="form-label">Heading</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="heading"
                                    value={data.heading}
                                    onChange={(e) => setData("heading", e.target.value)}
                                />
                                {errors.heading && <div className="form-text text-danger">{errors.heading}</div>}
                            </div>

                            {/* Subheading */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="subheading" className="form-label">Subheading</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="subheading"
                                    value={data.subheading}
                                    onChange={(e) => setData("subheading", e.target.value)}
                                />
                                {errors.subheading && <div className="form-text text-danger">{errors.subheading}</div>}
                            </div>

                            {/* Linked Text */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="linked_text" className="form-label">Linked Text</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="linked_text"
                                    value={data.linked_text}
                                    onChange={(e) => setData("linked_text", e.target.value)}
                                />
                                {errors.linked_text && <div className="form-text text-danger">{errors.linked_text}</div>}
                            </div>

                            {/* Link */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="link" className="form-label">Link</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="link"
                                    value={data.link}
                                    onChange={(e) => setData("link", e.target.value)}
                                />
                                {errors.link && <div className="form-text text-danger">{errors.link}</div>}
                            </div>

                            {/* Display Order */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="display_order" className="form-label">Display Order</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    id="display_order"
                                    value={data.display_order}
                                    onChange={(e) => setData("display_order", e.target.value)}
                                />
                                {errors.display_order && <div className="form-text text-danger">{errors.display_order}</div>}
                            </div>

                            
                            {/* Image upload */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label" htmlFor="image">Banner Image</label>
                                
                                <input
                                    type="file"
                                    id="image"
                                    className="form-control"
                                    ref={fileInputRef}
                                    onChange={(e) => setData("image", e.target.files[0])}
                                    accept="image/png, image/jpeg"
                                />
                                {errors.image && <div className="form-text text-danger">{errors.image}</div>}
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
                            <div className="mb-3 col-md-6">
                                <label className="form-label" htmlFor="image">Current Image</label>
                                {banner.image && (
                                    <div className="mb-2">
                                        <img
                                            src={`${appUrl}/${banner.image}`}
                                            alt="Current Banner"
                                            style={{
                                                width: "100px",
                                                height: "60px",
                                                objectFit: "cover",
                                                borderRadius: "4px"
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Progress bar (optional) */}
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
                                aria-label="Click me"
                                type="submit"
                                className="btn btn-primary me-2"
                                disabled={processing}
                            >
                                {processing ? "Updating..." : "Update"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Edit;
