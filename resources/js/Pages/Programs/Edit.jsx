import { useForm, usePage } from "@inertiajs/react";
import React, { useRef } from "react";

const Edit = ({ program }) => {
    const fileInputRef = useRef(null);
    const appUrl = usePage().props.appUrl;

    const { data, setData, post, progress, errors, processing } = useForm({
        _method: "PUT",
        name: program.name || "",
        menu_name: program.menu_name || "",
        name_short: program.name_short || "",
        slug: program.slug || "",
        display_order: program.display_order || 100,
        status: program.status || 1,
        title: program.title || "",
        description: program.description || "",
        image: null,
        alternate_image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (data[key] !== null) {
                formData.append(key, data[key]);
            }
        });

        post(route("program.update", program.id), {
            data: formData,
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <h1 className="text-muted">Edit Program</h1>
            <div className="card mb-4">
                <form onSubmit={submit} encType="multipart/form-data">
                    <div className="card-body">
                        <div className="row">
                            {/* Program Image */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label" htmlFor="image">Program Image</label>
                                <input
                                    type="file"
                                    id="image"
                                    className="form-control"
                                    ref={fileInputRef}
                                    onChange={(e) => setData("image", e.target.files[0])}
                                    accept="image/png, image/jpeg, image/webp"
                                />
                                {errors.image && <div className="form-text text-danger">{errors.image}</div>}
                            </div>

                            {/* Current Image Preview */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Current Image</label>
                                <div className="mb-2">
                                    {program.image ? (
                                        <img
                                            src={`${appUrl}/${program.image}`}
                                            alt="Current Program"
                                            style={{
                                                width: "100px",
                                                height: "60px",
                                                objectFit: "cover",
                                                borderRadius: "4px",
                                            }}
                                        />
                                    ): (
                                        <span className="text-muted">No image</span>
                                    )}
                                </div>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label" htmlFor="alternate_image">Alternate Program Image</label>
                                <input
                                    type="file"
                                    id="alternate_image"
                                    className="form-control"
                                    ref={fileInputRef}
                                    onChange={(e) => setData("alternate_image", e.target.files[0])}
                                    accept="image/png, image/jpeg, image/webp"
                                />
                                <div className="form-text text-danger">{errors.alternate_image}</div>
                            </div>

                            {/* Name */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="name" className="form-label">Program Name <span className="text-danger">*</span></label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                />
                                {errors.name && <div className="form-text text-danger">{errors.name}</div>}
                            </div>

                            {/* Menu Name */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="menu_name" className="form-label">Menu Name</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="menu_name"
                                    value={data.menu_name}
                                    onChange={(e) => setData("menu_name", e.target.value)}
                                />
                                {errors.menu_name && <div className="form-text text-danger">{errors.menu_name}</div>}
                            </div>

                            {/* Short Name */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="name_short" className="form-label">Short Name</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="name_short"
                                    value={data.name_short}
                                    onChange={(e) => setData("name_short", e.target.value)}
                                />
                                {errors.name_short && <div className="form-text text-danger">{errors.name_short}</div>}
                            </div>

                            {/* Slug */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="slug" className="form-label">Slug</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData("slug", e.target.value)}
                                />
                                {errors.slug && <div className="form-text text-danger">{errors.slug}</div>}
                            </div>

                            {/* Title */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                />
                                {errors.title && <div className="form-text text-danger">{errors.title}</div>}
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
                                {errors.description && <div className="form-text text-danger">{errors.description}</div>}
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

                            {/* Status */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="status" className="form-label">Status</label>
                                <select
                                    id="status"
                                    className="form-select"
                                    value={data.status}
                                    onChange={(e) => setData("status", e.target.value)}
                                >
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                                {errors.status && <div className="form-text text-danger">{errors.status}</div>}
                            </div>
                        </div>

                        {/* Upload progress */}
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
                                aria-label="Update program"
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
