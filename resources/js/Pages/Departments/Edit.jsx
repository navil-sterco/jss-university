import { useForm, usePage } from "@inertiajs/react";
import React from "react";

const Edit = ({ department, schools }) => {
    const appUrl = usePage().props.appUrl;
    const { data, setData, post, progress, errors, processing } = useForm({
        _method: "PUT",
        name: department.name || "",
        school_id: department.school_id || "",
        menu_name: department.menu_name || "",
        name_short: department.name_short || "",
        slug: department.slug || "",
        display_order: department.display_order || 100,
        academic_year: department.academic_year || "",
        apply_now_link: department.apply_now_link || "",
        brochure: null,
        useful_links: department.useful_links || [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("department.update", department.id));
    };

    // Add a new useful link
    const addUsefulLink = () => {
        setData("useful_links", [
            ...data.useful_links,
            { text: "", url: "" }
        ]);
    };

    // Remove a useful link
    const removeUsefulLink = (index) => {
        const updatedLinks = data.useful_links.filter((_, i) => i !== index);
        setData("useful_links", updatedLinks);
    };

    // Update a useful link
    const updateUsefulLink = (index, field, value) => {
        const updatedLinks = data.useful_links.map((link, i) => 
            i === index ? { ...link, [field]: value } : link
        );
        setData("useful_links", updatedLinks);
    };

    return (
        <>
            <h1 className="text-muted">Edit Department</h1>
            <div className="card mb-4">
                <form onSubmit={submit} encType="multipart/form-data">
                    <div className="card-body">
                        <div className="row">
                            {/* ================== BASIC INFO ================== */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Department Name <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.name}</div>
                            </div>

                            {/* School */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="school_id" className="form-label">School <span className="text-danger">*</span></label>
                                <select
                                    id="school_id"
                                    className="form-select"
                                    value={data.school_id}
                                    onChange={(e) => setData("school_id", e.target.value)}
                                >
                                    <option value="">Select School</option>
                                    {schools.map((school) => (
                                        <option key={school.id} value={school.id}>
                                            {school.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="form-text text-danger">{errors.school_id}</div>
                            </div>

                            {/* Menu Name */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Menu Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={data.menu_name}
                                    onChange={(e) => setData("menu_name", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.menu_name}</div>
                            </div>

                            {/* Short Name */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Short Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={data.name_short}
                                    onChange={(e) => setData("name_short", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.name_short}</div>
                            </div>

                            {/* Slug */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Slug</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={data.slug}
                                    onChange={(e) => setData("slug", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.slug}</div>
                            </div>

                            {/* Display Order */}
                            <div className="mb-3 col-md-3">
                                <label className="form-label">Display Order</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={data.display_order}
                                    onChange={(e) => setData("display_order", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.display_order}</div>
                            </div>

                            {/* ================== NEW FIELDS ================== */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Academic Year</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="e.g., 2024-2025"
                                    value={data.academic_year}
                                    onChange={(e) => setData("academic_year", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.academic_year}</div>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Apply Now Link</label>
                                <input
                                    className="form-control"
                                    type="url"
                                    placeholder="https://example.com/apply"
                                    value={data.apply_now_link}
                                    onChange={(e) => setData("apply_now_link", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.apply_now_link}</div>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Brochure (PDF)</label>
                                <input
                                    className="form-control"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setData("brochure", e.target.files[0])}
                                />
                                <div className="form-text">
                                    Accepted formats: PDF, DOC, DOCX
                                    {department.brochure && (
                                        <div className="mt-1">
                                            <strong>Current brochure:</strong> 
                                            <a 
                                                href={`${appUrl}${department.brochure}`}
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="ms-2"
                                            >
                                                View Current Brochure
                                            </a>
                                        </div>
                                    )}
                                </div>
                                <div className="form-text text-danger">{errors.brochure}</div>
                            </div>

                            {/* ================== USEFUL LINKS ================== */}
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0">Useful Links</h5>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-primary"
                                            onClick={addUsefulLink}
                                        >
                                            <i className="bx bx-plus"></i> Add Link
                                        </button>
                                    </div>
                                    <div className="card-body">
                                        {data.useful_links.length === 0 ? (
                                            <div className="text-center py-3 text-muted">
                                                No useful links added yet. Click "Add Link" to add one.
                                            </div>
                                        ) : (
                                            data.useful_links.map((link, index) => (
                                                <div key={index} className="row mb-3 border-bottom pb-3">
                                                    <div className="col-md-6">
                                                        <label className="form-label">Link Text</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="e.g., Course Curriculum"
                                                            value={link.text}
                                                            onChange={(e) => updateUsefulLink(index, "text", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-md-5">
                                                        <label className="form-label">Link URL</label>
                                                        <input
                                                            type="url"
                                                            className="form-control"
                                                            placeholder="https://example.com/curriculum"
                                                            value={link.url}
                                                            onChange={(e) => updateUsefulLink(index, "url", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-md-1 d-flex align-items-end mb-1 mt-1">
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => removeUsefulLink(index)}
                                                        >
                                                            <i className="bx bx-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        <div className="form-text text-danger">{errors.useful_links}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ================== SUBMIT ================== */}
                        <div className="mt-4">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Updating...
                                    </>
                                ) : (
                                    "Update Department"
                                )}
                            </button>

                            {progress && (
                                <div className="mt-3">
                                    <div className="progress">
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
                                    <div className="form-text text-center mt-1">
                                        Uploading... {progress.percentage}%
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