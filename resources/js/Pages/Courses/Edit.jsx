import { useForm, usePage } from "@inertiajs/react";
import React, { useState } from "react";

const Edit = ({ course, departments, degree }) => {
    const appUrl = usePage().props.appUrl;
    const [fileInputRevision, setFileInputRevision] = useState({});

    const { data, setData, post, processing, errors, progress } = useForm({
        _method: "PUT",
        department_id: course.department_id || "",
        degree_id: course.degree_id || "",
        name: course.name || "",
        menu_name: course.menu_name || "",
        name_short: course.name_short || "",
        slug: course.slug || "",
        display_order: course.display_order || 100,
        status: course.status || 1,
        course_duration: course.course_duration || "",
        annual_fees: course.annual_fees || "",
        academic_year: course.academic_year || "",
        apply_now_link: course.apply_now_link || "",
        useful_links: course.useful_links || [],
        banner: null,
        image: null,
        school_listing_image: null,
        eligibility_marks: course.eligibility_marks || "",
        fee_structure_pdf: course.fee_structure_pdf || "",
        eligibility_desc: course.eligibility_desc || "",
        program_structure: null,
        brouchure: null,
        scholarship: course.scholarship || "",
        remove_banner: false,
        remove_image: false,
        remove_school_listing_image: false,
        remove_program_structure: false,
        remove_brouchure: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("course.update", course.id), {
            forceFormData: true,
            transform: (form) => ({
                ...form,
                useful_links: JSON.stringify(form.useful_links ?? []),
            }),
        });
    };

    // Add a new useful link
    const addUsefulLink = () => {
        setData((prev) => ({
            ...prev,
            useful_links: [...(prev.useful_links || []), { text: "", url: "" }],
        }));
    };

    // Remove a useful link
    const removeUsefulLink = (index) => {
        setData((prev) => ({
            ...prev,
            useful_links: (prev.useful_links || []).filter((_, i) => i !== index),
        }));
    };

    // Update a useful link
    const updateUsefulLink = (index, field, value) => {
        setData((prev) => ({
            ...prev,
            useful_links: (prev.useful_links || []).map((link, i) =>
                i === index ? { ...link, [field]: value } : link
            ),
        }));
    };

    // Handle file input changes
    const handleFileChange = (field, file) => {
        setData((prev) => ({
            ...prev,
            [field]: file,
            [`remove_${field}`]: false,
        }));
    };

    // Remove existing server file (mark for deletion on save)
    const handleRemoveFile = (field) => {
        setData((prev) => ({
            ...prev,
            [field]: null,
            [`remove_${field}`]: true,
        }));
        setFileInputRevision((r) => ({
            ...r,
            [field]: (r[field] || 0) + 1,
        }));
    };

    // Clear a newly chosen file without removing the saved one
    const clearStagedFile = (field) => {
        setData((prev) => ({
            ...prev,
            [field]: null,
            [`remove_${field}`]: false,
        }));
        setFileInputRevision((r) => ({
            ...r,
            [field]: (r[field] || 0) + 1,
        }));
    };

    return (
        <>
            <h1 className="text-muted">Edit Course</h1>
            <div className="card mb-4">
                <form onSubmit={submit}>
                    <div className="card-body">
                        <div className="row">
                            {/* Department */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Department <span className="text-danger">*</span></label>
                                <select
                                    className="form-control"
                                    value={data.department_id}
                                    onChange={(e) => setData("department_id", e.target.value)}
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                                <div className="form-text text-danger">{errors.department_id}</div>
                            </div>

                            {/* Degree */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Degree <span className="text-danger">*</span></label>
                                <select
                                    className="form-control"
                                    value={data.degree_id}
                                    onChange={(e) => setData("degree_id", e.target.value)}
                                >
                                    <option value="">Select Degree</option>
                                    {degree.map((deg) => (
                                        <option key={deg.id} value={deg.id}>
                                            {deg.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="form-text text-danger">{errors.degree_id}</div>
                            </div>

                            {/* Course Name */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Course Name <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.name}</div>
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

                            {/* Status */}
                            <div className="mb-3 col-md-3">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-control"
                                    value={data.status}
                                    onChange={(e) => setData("status", e.target.value)}
                                >
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </select>
                                <div className="form-text text-danger">{errors.status}</div>
                            </div>

                            {/* Course Duration */}
                            <div className="mb-3 col-md-3">
                                <label className="form-label">Course Duration</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={data.course_duration}
                                    onChange={(e) => setData("course_duration", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.course_duration}</div>
                            </div>

                            {/* Annual Fees */}
                            <div className="mb-3 col-md-3">
                                <label className="form-label">Annual Fees</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={data.annual_fees}
                                    onChange={(e) => setData("annual_fees", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.annual_fees}</div>
                            </div>

                            {/* Academic Year */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Academic Year</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={data.academic_year}
                                    onChange={(e) => setData("academic_year", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.academic_year}</div>
                            </div>

                            {/* Apply Now Link */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Apply Now Link</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={data.apply_now_link}
                                    onChange={(e) => setData("apply_now_link", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.apply_now_link}</div>
                            </div>

                            {/* Banner Image */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Banner Image <span className="text-muted">(For course detail page)</span></label>
                                <input
                                    key={`banner-${fileInputRevision.banner ?? 0}`}
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange("banner", e.target.files[0])}
                                />
                                <div className="form-text">
                                    Upload a new banner image (Recommended: 1200x400px)
                                </div>
                                {data.banner instanceof File && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary mt-2"
                                        onClick={() => clearStagedFile("banner")}
                                    >
                                        Cancel new upload
                                    </button>
                                )}
                                <div className="form-text text-danger">{errors.banner}</div>
                            </div>

                            {/* Current Banner Preview */}
                            {course.banner && !data.remove_banner && (
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Current Banner</label>
                                    <div className="border rounded p-2">
                                        <img
                                            src={`${appUrl}/${course.banner}`}
                                            alt="Current banner"
                                            className="img-fluid rounded mb-2"
                                            style={{ maxHeight: '150px' }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger w-100"
                                            onClick={() => handleRemoveFile('banner')}
                                        >
                                            <i className="bx bx-trash"></i> Remove Banner
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Featured Image */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Image <span className="text-muted">(For course listing)</span></label>
                                <input
                                    key={`image-${fileInputRevision.image ?? 0}`}
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange("image", e.target.files[0])}
                                />
                                <div className="form-text">
                                    Upload a new image (Recommended: 400x300px)
                                </div>
                                {data.image instanceof File && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary mt-2"
                                        onClick={() => clearStagedFile("image")}
                                    >
                                        Cancel new upload
                                    </button>
                                )}
                                <div className="form-text text-danger">{errors.image}</div>
                            </div>

                            {course.image && !data.remove_image && (
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Current Course Image</label>
                                    <div className="border rounded p-2">
                                        <img
                                            src={`${appUrl}/${course.image}`}
                                            alt="Current course image"
                                            className="img-fluid rounded mb-2"
                                            style={{ maxHeight: '150px', objectFit: 'cover' }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger w-100"
                                            onClick={() => handleRemoveFile('image')}
                                        >
                                            <i className="bx bx-trash"></i> Remove Course Image
                                        </button>
                                    </div>
                                </div>
                            )}
                            {/* Featured Image */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">School Listing Image <span className="text-muted">(For course listing)</span></label>
                                <input
                                    key={`school_listing_image-${fileInputRevision.school_listing_image ?? 0}`}
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange("school_listing_image", e.target.files[0])}
                                />
                                {data.school_listing_image instanceof File && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary mt-2"
                                        onClick={() => clearStagedFile("school_listing_image")}
                                    >
                                        Cancel new upload
                                    </button>
                                )}
                                <div className="form-text text-danger">{errors.school_listing_image}</div>
                            </div>

                            {course.school_listing_image && !data.remove_school_listing_image && (
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Current School Listing Image</label>
                                    <div className="border rounded p-2">
                                        <img
                                            src={`${appUrl}/${course.school_listing_image}`}
                                            alt="Current school listing image"
                                            className="img-fluid rounded mb-2"
                                            style={{ maxHeight: '150px', objectFit: 'cover' }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger w-100"
                                            onClick={() => handleRemoveFile('school_listing_image')}
                                        >
                                            <i className="bx bx-trash"></i> Remove School Listing Image
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Eligibility Marks */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Eligibility Link</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Eligibility"
                                    value={data.eligibility_marks}
                                    onChange={(e) => setData("eligibility_marks", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.eligibility_marks}</div>
                            </div>
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Fee Structure Link</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Fee Structure"
                                    value={data.fee_structure_pdf}
                                    onChange={(e) => setData("fee_structure_pdf", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.fee_structure_pdf}</div>
                            </div>

                            {/* Eligibility Description */}
                            <div className="mb-3 col-12">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    placeholder="Description"
                                    value={data.eligibility_desc}
                                    onChange={(e) => setData("eligibility_desc", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.eligibility_desc}</div>
                            </div>

                            {/* Program Structure PDF */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Program Structure (PDF)</label>
                                <input
                                    key={`program_structure-${fileInputRevision.program_structure ?? 0}`}
                                    type="file"
                                    className="form-control"
                                    accept=".pdf,application/pdf"
                                    onChange={(e) => handleFileChange("program_structure", e.target.files[0])}
                                />
                                <div className="form-text">
                                    Upload new program structure document in PDF format
                                </div>
                                <div className="form-text text-danger">{errors.program_structure}</div>
                                {data.program_structure instanceof File && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary mt-2"
                                        onClick={() => clearStagedFile("program_structure")}
                                    >
                                        Cancel new upload
                                    </button>
                                )}

                                {/* Current Program Structure Preview */}
                                {course.program_structure && !data.remove_program_structure && (
                                    <div className="mt-2">
                                        <p className="text-muted mb-1">Current File:</p>
                                        <div className="d-flex align-items-center">
                                            <a
                                                href={`${appUrl}/${course.program_structure}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-decoration-none"
                                            >
                                                <i className="bx bx-file me-1"></i>
                                                View Current PDF
                                            </a>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger ms-3"
                                                onClick={() => handleRemoveFile('program_structure')}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* brouchure Structure PDF */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Brouchure (PDF)</label>
                                <input
                                    key={`brouchure-${fileInputRevision.brouchure ?? 0}`}
                                    type="file"
                                    className="form-control"
                                    accept=".pdf,application/pdf"
                                    onChange={(e) => handleFileChange("brouchure", e.target.files[0])}
                                />
                                <div className="form-text">
                                    Upload new brouchure document in PDF format
                                </div>
                                <div className="form-text text-danger">{errors.brouchure}</div>
                                {data.brouchure instanceof File && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary mt-2"
                                        onClick={() => clearStagedFile("brouchure")}
                                    >
                                        Cancel new upload
                                    </button>
                                )}

                                {/* Current Program Structure Preview */}
                                {course.brouchure && !data.remove_brouchure && (
                                    <div className="mt-2">
                                        <p className="text-muted mb-1">Current File:</p>
                                        <div className="d-flex align-items-center">
                                            <a
                                                href={`${appUrl}/${course.brouchure}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-decoration-none"
                                            >
                                                <i className="bx bx-file me-1"></i>
                                                View Current PDF
                                            </a>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger ms-3"
                                                onClick={() => handleRemoveFile('brouchure')}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Scholarship PDF */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Scholarship Url</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Scholarship"
                                    value={data.scholarship}
                                    onChange={(e) => setData("scholarship", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.scholarship}</div>
                            </div>

                            {/* Useful Links Section */}
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
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="https://example.com/curriculum"
                                                            value={link.url}
                                                            onChange={(e) => updateUsefulLink(index, "url", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-md-1 d-flex align-items-end mb-1">
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

                        {/* Submit */}
                        <div className="mt-4">
                            <button type="submit" className="btn btn-primary" disabled={processing}>
                                {processing ? "Updating..." : "Update Course"}
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

export default Edit;
