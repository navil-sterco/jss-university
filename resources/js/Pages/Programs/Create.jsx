import { useForm } from "@inertiajs/react";
import React, { useRef } from "react";

const Create = () => {
    const { data, setData, post, errors, processing } = useForm({
        name: "",
        menu_name: "",
        name_short: "",
        slug: "",
        display_order: 100,
        status: 1,
        title: "",
        description: "",
        image: "",
    });

    const fileInputRef = useRef(null);

    const submit = (e) => {
        e.preventDefault();
        post(route("program.store"));
    };

    return (
        <>
            <h1 className="text-muted">Create Program</h1>
            <div className="card mb-4">
                <form onSubmit={submit} encType="multipart/form-data">
                    <div className="card-body">
                        <div className="row">
                            {/* Image */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label" htmlFor="image">Program Image</label>
                                <input
                                    type="file"
                                    id="image"
                                    className="form-control"
                                    ref={fileInputRef}
                                    onChange={(e) => setData("image", e.target.files[0])}
                                    accept="image/png, image/jpeg"
                                />
                                <div className="form-text text-danger">{errors.image}</div>
                            </div>

                            {/* Name */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="name" className="form-label">Program Name</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="name"
                                    placeholder="Program Name"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.name}</div>
                            </div>

                            {/* Menu Name */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="menu_name" className="form-label">Menu Name</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="menu_name"
                                    placeholder="Menu Name"
                                    value={data.menu_name}
                                    onChange={(e) => setData("menu_name", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.menu_name}</div>
                            </div>

                            {/* Short Name */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="name_short" className="form-label">Short Name</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="name_short"
                                    placeholder="Short Name"
                                    value={data.name_short}
                                    onChange={(e) => setData("name_short", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.name_short}</div>
                            </div>

                            {/* Slug */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="slug" className="form-label">Slug</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="slug"
                                    placeholder="example-slug"
                                    value={data.slug}
                                    onChange={(e) => setData("slug", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.slug}</div>
                            </div>

                            {/* Title */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="title"
                                    placeholder="Program Title"
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.title}</div>
                            </div>

                            {/* Description */}
                            <div className="mb-3 col-md-12">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea
                                    id="description"
                                    className="form-control"
                                    rows="4"
                                    placeholder="Enter program description..."
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                ></textarea>
                                <div className="form-text text-danger">{errors.description}</div>
                            </div>

                            {/* Display Order */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="display_order" className="form-label">Display Order</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    id="display_order"
                                    placeholder="Order number"
                                    value={data.display_order}
                                    onChange={(e) => setData("display_order", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.display_order}</div>
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
                                <div className="form-text text-danger">{errors.status}</div>
                            </div>
                        </div>

                        <div className="mt-2">
                            <button
                                aria-label="Submit form"
                                type="submit"
                                className="btn btn-primary me-2"
                                disabled={processing}
                            >
                                {processing ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Create;
