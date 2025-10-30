import { useForm } from "@inertiajs/react";
import React, { useRef } from "react";

const Create = () => {
    const { data, setData, post, progress, errors, processing } = useForm({
        name: "",
        menu_name: "",
        name_short: "",
        short_description: "",
        slug: "",
        image: "",
        prospectus: "",
        display_order: 100,
        academic_years: "",
        mobile_contact: "",
        virtual_tour: "",
        virtual_display_order: 0,
    });

    const imageRefs = {
        image: useRef(null),
        prospectus: useRef(null),
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("schools.store"));
    };

    return (
        <>
            <h1 className="text-muted">Create School</h1>
            <div className="card mb-4">
                <form onSubmit={submit} encType="multipart/form-data">
                    <div className="card-body">
                        <div className="row">
                            {/* ================== BASIC INFO ================== */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">School Name</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.name}</div>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Menu Name</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={data.menu_name}
                                    onChange={(e) => setData("menu_name", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.menu_name}</div>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Short Name</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={data.name_short}
                                    onChange={(e) => setData("name_short", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.name_short}</div>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Slug</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) => setData("slug", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.slug}</div>
                            </div>

                            {/* ================== TEXT FIELDS ================== */}
                            <div className="mb-3 col-md-12">
                                <label className="form-label">Short Description</label>
                                <textarea
                                    className="form-control"
                                    rows="2"
                                    value={data.short_description}
                                    onChange={(e) => setData("short_description", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.short_description}</div>
                            </div>

                            {/* ================== IMAGE & PDF UPLOAD ================== */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">School Image</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    ref={imageRefs.image}
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={(e) => setData("image", e.target.files[0])}
                                />
                                <div className="form-text text-danger">{errors.image}</div>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Prospectus (PDF Only)</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    ref={imageRefs.prospectus}
                                    accept="application/pdf"
                                    onChange={(e) => setData("prospectus", e.target.files[0])}
                                />
                                <div className="form-text text-danger">{errors.prospectus}</div>
                            </div>


                            {/* ================== OTHER FIELDS ================== */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Academic Years</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={data.academic_years}
                                    onChange={(e) => setData("academic_years", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.academic_years}</div>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Mobile Contact</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    rows="2"
                                    value={data.mobile_contact}
                                    onChange={(e) => setData("mobile_contact", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.mobile_contact}</div>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Virtual Tour (iframe/link)</label>
                                <textarea
                                    className="form-control"
                                    rows="2"
                                    value={data.virtual_tour}
                                    onChange={(e) => setData("virtual_tour", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.virtual_tour}</div>
                            </div>

                            <div className="mb-3 col-md-3">
                                <label className="form-label">Virtual Display Order</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={data.virtual_display_order}
                                    onChange={(e) => setData("virtual_display_order", e.target.value)}
                                />
                            </div>

                            <div className="mb-3 col-md-3">
                                <label className="form-label">Display Order</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={data.display_order}
                                    onChange={(e) => setData("display_order", e.target.value)}
                                />
                            </div>
                        </div>

                        {/* ================== SUBMIT ================== */}
                        <div className="mt-4">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={processing}
                            >
                                {processing ? "Saving..." : "Submit"}
                            </button>

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
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Create;
