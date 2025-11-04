import { useForm } from "@inertiajs/react";
import React from "react";

const Edit = ({ contacts }) => {

    const { data, setData, post, processing, errors, progress } = useForm({
        _method: "PUT",
        title: contacts?.title || "",
        address: contacts?.address || "",
        email: contacts?.email || "",
        phone: contacts?.phone || "",
        landline_direct: contacts?.landline_direct || "",
        landline_epbx: contacts?.landline_epbx || "",
        direction_url: contacts?.direction_url || "",
        facebook: contacts?.facebook || "",
        instagram: contacts?.instagram || "",
        x: contacts?.x || "",
        youtube: contacts?.youtube || "",
        copyright: contacts?.copyright || "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("contact.update", contacts.id));
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-muted mb-0">
                    Contact Information
                </h1>
            </div>

            <div className="card mb-4">
                <form onSubmit={submit}>
                    <div className="card-body">
                        <div className="row">
                            {/* Title */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Title <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                    placeholder="Enter title (e.g., Company Name)"
                                    required
                                />
                                <div className="form-text text-danger">{errors.title}</div>
                            </div>

                            {/* Address */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Address <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={data.address}
                                    onChange={(e) => setData("address", e.target.value)}
                                    placeholder="Enter full address"
                                    required
                                />
                                <div className="form-text text-danger">{errors.address}</div>
                            </div>

                            {/* Email */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Email <span className="text-danger">*</span></label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    placeholder="Enter Email"
                                    required
                                />
                                <div className="form-text text-danger">{errors.email}</div>
                            </div>

                            {/* Phone */}
                            <div className="mb-3 col-md-4">
                                <label className="form-label">Phone</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={data.phone}
                                    onChange={(e) => setData("phone", e.target.value)}
                                    placeholder="Enter phone number"
                                />
                                <div className="form-text text-danger">{errors.phone}</div>
                            </div>

                            {/* Landline Direct */}
                            <div className="mb-3 col-md-4">
                                <label className="form-label">Landline Direct</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={data.landline_direct}
                                    onChange={(e) => setData("landline_direct", e.target.value)}
                                    placeholder="Enter direct landline"
                                />
                                <div className="form-text text-danger">{errors.landline_direct}</div>
                            </div>

                            {/* Landline EPBX */}
                            <div className="mb-3 col-md-4">
                                <label className="form-label">Landline EPBX</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={data.landline_epbx}
                                    onChange={(e) => setData("landline_epbx", e.target.value)}
                                    placeholder="Enter EPBX landline"
                                />
                                <div className="form-text text-danger">{errors.landline_epbx}</div>
                            </div>

                            {/* Direction URL */}
                            <div className="mb-3 col-md-12">
                                <label className="form-label">Direction URL</label>
                                <input
                                    type="url"
                                    className="form-control"
                                    value={data.direction_url}
                                    onChange={(e) => setData("direction_url", e.target.value)}
                                    placeholder="https://maps.google.com/..."
                                />
                                <div className="form-text text-danger">{errors.direction_url}</div>
                            </div>

                            {/* Social Media Section */}
                            <div className="col-12">
                                <h5 className="text-muted mb-3 border-bottom pb-2">
                                    <i className="bx bx-share-alt me-2"></i>
                                    Social Media Links
                                </h5>
                            </div>

                            {/* Facebook */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">
                                    <i className="bx bxl-facebook text-primary me-2"></i>
                                    Facebook
                                </label>
                                <input
                                    type="url"
                                    className="form-control"
                                    value={data.facebook}
                                    onChange={(e) => setData("facebook", e.target.value)}
                                    placeholder="https://facebook.com/username"
                                />
                                <div className="form-text text-danger">{errors.facebook}</div>
                            </div>

                            {/* Instagram */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">
                                    <i className="bx bxl-instagram text-danger me-2"></i>
                                    Instagram
                                </label>
                                <input
                                    type="url"
                                    className="form-control"
                                    value={data.instagram}
                                    onChange={(e) => setData("instagram", e.target.value)}
                                    placeholder="https://instagram.com/username"
                                />
                                <div className="form-text text-danger">{errors.instagram}</div>
                            </div>

                            {/* X (Twitter) */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">
                                    <i className="bx bxl-twitter text-info me-2"></i>
                                    X (Twitter)
                                </label>
                                <input
                                    type="url"
                                    className="form-control"
                                    value={data.x}
                                    onChange={(e) => setData("x", e.target.value)}
                                    placeholder="https://x.com/username"
                                />
                                <div className="form-text text-danger">{errors.x}</div>
                            </div>

                            {/* YouTube */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">
                                    <i className="bx bxl-youtube text-danger me-2"></i>
                                    YouTube
                                </label>
                                <input
                                    type="url"
                                    className="form-control"
                                    value={data.youtube}
                                    onChange={(e) => setData("youtube", e.target.value)}
                                    placeholder="https://youtube.com/channel/..."
                                />
                                <div className="form-text text-danger">{errors.youtube}</div>
                            </div>

                            {/* Copyright */}
                            <div className="mb-3 col-md-12">
                                <label className="form-label">Copyright</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={data.copyright}
                                    onChange={(e) => setData("copyright", e.target.value)}
                                    placeholder="© 2024 Company Name. All rights reserved."
                                />
                                <div className="form-text text-danger">{errors.copyright}</div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="mt-4 border-top pt-3">
                            <button 
                                type="submit" 
                                className="btn btn-primary" 
                                disabled={processing}
                            >
                                <i className="bx bx-edit me-2"></i>
                                {processing 
                                    ? "Updating..."
                                    : "Update Contact Information"
                                }
                            </button>

                            {progress && (
                                <div className="progress mt-2">
                                    <div
                                        className="progress-bar progress-bar-striped progress-bar-animated"
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

export default Edit;