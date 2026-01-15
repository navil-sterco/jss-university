import { useForm, usePage } from "@inertiajs/react";
import React from "react";

const Edit = ({ course, departments, degree }) => {
    const appUrl = usePage().props.appUrl;
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
        eligibility_marks: course.eligibility_marks || "",
        eligibility_desc: course.eligibility_desc || "",
        program_structure: null,
        scholarship: null,
        remove_banner: false,
        remove_image: false,
        remove_program_structure: false,
        remove_scholarship: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("course.update", course.id), {
            forceFormData: true, // Important for file uploads
        });
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

    // Handle file input changes
    const handleFileChange = (field, file) => {
        setData(field, file);
        // Reset removal flag if new file is selected
        setData(`remove_${field}`, false);
    };

    // Handle file removal
    const handleRemoveFile = (field) => {
        setData(field, null);
        setData(`remove_${field}`, true);
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
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange("banner", e.target.files[0])}
                                />
                                <div className="form-text">
                                    Upload a new banner image (Recommended: 1200x400px)
                                </div>
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
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange("image", e.target.files[0])}
                                />
                                <div className="form-text">
                                    Upload a new image (Recommended: 400x300px)
                                </div>
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

                            {/* Eligibility Marks */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Eligibility Marks</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g., 60% in 12th standard"
                                    value={data.eligibility_marks}
                                    onChange={(e) => setData("eligibility_marks", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.eligibility_marks}</div>
                            </div>

                            {/* Eligibility Description */}
                            <div className="mb-3 col-12">
                                <label className="form-label">Eligibility Description</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    placeholder="Detailed eligibility criteria and requirements..."
                                    value={data.eligibility_desc}
                                    onChange={(e) => setData("eligibility_desc", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.eligibility_desc}</div>
                            </div>

                            {/* Program Structure PDF */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Program Structure (PDF)</label>                                
                                <input
                                    type="file"
                                    className="form-control"
                                    accept=".pdf,application/pdf"
                                    onChange={(e) => handleFileChange("program_structure", e.target.files[0])}
                                />
                                <div className="form-text">
                                    Upload new program structure document in PDF format
                                </div>
                                <div className="form-text text-danger">{errors.program_structure}</div>
                                
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

                            {/* Scholarship PDF */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Scholarship Details (PDF)</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept=".pdf,application/pdf"
                                    onChange={(e) => handleFileChange("scholarship", e.target.files[0])}
                                />
                                <div className="form-text">
                                    Upload new scholarship information in PDF format
                                </div>
                                <div className="form-text text-danger">{errors.scholarship}</div>
                                
                                {/* Current Scholarship Preview */}
                                {course.scholarship && !data.remove_scholarship && (
                                    <div className="mt-2">
                                        <p className="text-muted mb-1">Current File:</p>
                                        <div className="d-flex align-items-center">
                                            <a 
                                                href={`${appUrl}/${course.scholarship}`}
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
                                                onClick={() => handleRemoveFile('scholarship')}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                )}
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
                                                            type="url"
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