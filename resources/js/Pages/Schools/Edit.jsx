import { useForm, usePage } from "@inertiajs/react";
import React, { useRef } from "react";

const Edit = ({ school }) => {
    const imageRef = useRef(null);
    const prospectusRef = useRef(null);
    
    const { data, setData, post, errors, processing, progress } = useForm({
        _method: "PUT",
        name: school.name || "",
        menu_name: school.menu_name || "",
        name_short: school.name_short || "",
        slug: school.slug || "",
        short_description: school.short_description || "",
        display_order: school.display_order || 100,
        academic_years: school.academic_years || "",
        mobile_contact: school.mobile_contact || "",
        virtual_tour: school.virtual_tour || "",
        virtual_display_order: school.virtual_display_order || 0,
        image: null,
        prospectus: null,
        remove_image: false,
        remove_prospectus: false,
        apply_now_link: school.apply_now_link || "",
        useful_links: school.useful_links || [],
    });
    
    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Append all fields except files
        Object.entries(data).forEach(([key, value]) => {
            if (key !== "image" && key !== "prospectus") {
                if (value === null) formData.append(key, "");
                else if (typeof value === "boolean") formData.append(key, value ? 1 : 0);
                else formData.append(key, value);
            }
        });

        // Append files only if selected
        if (data.image instanceof File) formData.append("image", data.image);
        if (data.prospectus instanceof File) formData.append("prospectus", data.prospectus);

        post(route("schools.update", school.id), {
            data: formData,
            forceFormData: true,
            preserveScroll: true,
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

    return (
        <>
            <h1 className="text-muted">Edit School</h1>
            <div className="card mb-4">
                <form onSubmit={submit} encType="multipart/form-data">
                    <div className="card-body">
                        <div className="row">
                            {/* Name */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label">School Name <span className="text-danger">*</span></label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.name}</div>
                            </div>

                            {/* Menu Name */}
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

                            {/* Short Name */}
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

                            {/* Slug */}
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

                            {/* Short Description */}
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

                            {/* Main Image */}
                            <div className={`mb-3 ${school.image && !data.remove_image ? "col-md-4" : "col-md-6"}`}>
                                <label className="form-label">Main Image</label>
                                <input
                                    type="file"
                                    ref={imageRef}
                                    className="form-control"
                                    accept="image/*"
                                    onChange={(e) => {
                                        setData("image", e.target.files[0]);
                                    }}
                                />
                                <div className="form-text text-danger">{errors.image}</div>
                            </div>

                            {!data.remove_image && school.image && (
                                <div className="mb-3 col-md-2">
                                    <label className="form-label">Current Image</label>
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={school.image}
                                            alt="Current"
                                            style={{
                                                width: "115px",
                                                height: "38px",
                                                borderRadius: "4px",
                                                objectFit: "cover",
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger ms-3"
                                            onClick={() => setData("remove_image", true)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Prospectus */}
                            <div className={`mb-3 ${!data.remove_prospectus && school.prospectus ? "col-md-4" : "col-md-6"}`}>
                                <label className="form-label">Prospectus</label>
                                <input
                                    type="file"
                                    ref={prospectusRef}
                                    className="form-control"
                                    accept="application/pdf"
                                    onChange={(e) => {
                                        setData("prospectus", e.target.files[0]);
                                        setData("remove_prospectus", false);
                                    }}
                                />
                                <div className="form-text text-danger">{errors.prospectus}</div>
                            </div>

                            {!data.remove_prospectus && school.prospectus && (
                                <div className="mb-3 col-md-2">
                                    <label className="form-label">Current Prospectus</label>
                                    <div className="mt-1 d-flex align-items-center">
                                        <a
                                            href={school.prospectus}
                                            target="_blank"
                                            className="btn btn-sm btn-outline-warning"
                                            style={{ width: "115px" }}
                                        >
                                            View PDF
                                        </a>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger ms-3"
                                            onClick={() => setData("remove_prospectus", true)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Other Fields */}
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
                                <textarea
                                    className="form-control"
                                    rows="2"
                                    value={data.mobile_contact}
                                    onChange={(e) => setData("mobile_contact", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.mobile_contact}</div>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Virtual Tour</label>
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

                        {/* Progress */}
                        {progress && (
                            <div className="progress mb-3">
                                <div className="progress-bar" role="progressbar" style={{ width: `${progress.percentage}%` }}>
                                    {progress.percentage}%
                                </div>
                            </div>
                        )}

                        {/* Submit */}
                        <div className="mt-2">
                            <button type="submit" className="btn btn-primary" disabled={processing}>
                                {processing ? "Updating..." : "Update School"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Edit;
