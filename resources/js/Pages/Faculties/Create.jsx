import { useForm, router } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";

const Create = ({ types: initialTypes, schools }) => {
    const { data, setData, post, processing, errors, progress } = useForm({
        type_id: "",
        school_id: "",
        name: "",
        slug: "",
        email: "",
        profile: "",
        image: null,
        linkedin_url: "",
        education: [""],
        research: [{ title: "", image: null, link: "" }],
        teaching: [""],
        award: [""],
        social_engagement: [""],
        // NEW: Add sections field
        sections: [{ title: "", points: [""] }],
        display_order: 100,
    });

    const modalRef = useRef(null);
    const modalInstance = useRef(null);
    const [itemIdDelete, setItemIdDelete] = useState(null);

    const [newType, setNewType] = useState("");
    const [typeError, setTypeError] = useState("");
    const [editingType, setEditingType] = useState(null);
    const [editTypeName, setEditTypeName] = useState("");
    const [typeLoading, setTypeLoading] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("faculty.store"));
    };

    const addField = (fieldName) => {
        if (fieldName === 'research') {
            setData(fieldName, [...data[fieldName], { title: "", image: null, link: "" }]);
        } else if (fieldName === 'sections') {
            // For sections, add a new section with title and empty points array
            setData(fieldName, [...data[fieldName], { title: "", points: [""] }]);
        } else {
            setData(fieldName, [...data[fieldName], ""]);
        }
    };

    const removeField = (fieldName, index) => {
        const updatedFields = data[fieldName].filter((_, i) => i !== index);
        setData(fieldName, updatedFields);
    };

    const updateField = (fieldName, index, value) => {
        const updatedFields = [...data[fieldName]];
        updatedFields[index] = value;
        setData(fieldName, updatedFields);
    };

    // Research specific functions
    const updateResearchField = (researchIndex, field, value) => {
        const updatedResearch = [...data.research];
        updatedResearch[researchIndex] = {
            ...updatedResearch[researchIndex],
            [field]: value
        };
        setData("research", updatedResearch);
    };

    const handleResearchImageChange = (researchIndex, file) => {
        const updatedResearch = [...data.research];
        updatedResearch[researchIndex] = {
            ...updatedResearch[researchIndex],
            image: file
        };
        setData("research", updatedResearch);
    };

    const removeResearchImage = (researchIndex) => {
        const updatedResearch = [...data.research];
        updatedResearch[researchIndex] = {
            ...updatedResearch[researchIndex],
            image: null
        };
        setData("research", updatedResearch);
    };

    // NEW: Sections specific functions
    const updateSectionField = (sectionIndex, field, value) => {
        const updatedSections = [...data.sections];
        updatedSections[sectionIndex] = {
            ...updatedSections[sectionIndex],
            [field]: value
        };
        setData("sections", updatedSections);
    };

    const addPointToSection = (sectionIndex) => {
        const updatedSections = [...data.sections];
        updatedSections[sectionIndex].points.push("");
        setData("sections", updatedSections);
    };

    const removePointFromSection = (sectionIndex, pointIndex) => {
        const updatedSections = [...data.sections];
        updatedSections[sectionIndex].points = updatedSections[sectionIndex].points.filter((_, i) => i !== pointIndex);
        setData("sections", updatedSections);
    };

    const updatePointInSection = (sectionIndex, pointIndex, value) => {
        const updatedSections = [...data.sections];
        updatedSections[sectionIndex].points[pointIndex] = value;
        setData("sections", updatedSections);
    };

    const addType = (e) => {
        e.preventDefault();
        if (!newType.trim()) return;

        setTypeLoading(true);
        router.post(route('types.store'), {
            name: newType,
            element: "faculty"
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setNewType("");
                setTypeLoading(false);
            },
            onError: (errors) => {
                setTypeLoading(false);
                setTypeError(errors);
            }
        });
    };

    const startEditType = (type) => {
        setEditingType(type.id);
        setEditTypeName(type.name);
    };

    const updateType = (e) => {
        e.preventDefault();
        if (!editTypeName.trim()) return;

        setTypeLoading(true);
        router.put(route('types.update', editingType), {
            name: editTypeName,
            element: "faculty"
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingType(null);
                setEditTypeName("");
                setTypeLoading(false);
            },
            onError: (errors) => {
                setTypeLoading(false);
                setTypeError(errors);
            }
        });
    };

    // Initialize modals
    useEffect(() => {
        if (modalRef.current) {
            modalInstance.current = new bootstrap.Modal(modalRef.current);
        }
    }, []);

    const showDeleteModal = (id) => {
        setItemIdDelete(id);
        modalInstance.current.show();
    };

    const deleteType = () => {
        if (!itemIdDelete) return;

        setTypeLoading(true);
        router.delete(route('types.destroy', itemIdDelete), {
            preserveScroll: true,
            onSuccess: () => {
                setTypeLoading(false);
                modalInstance.current.hide();
                setItemIdDelete(null);
                if (data.type_id == itemIdDelete) {
                    setData("type_id", "");
                }
            },
            onError: (errors) => {
                setTypeLoading(false);
                console.log('Error deleting type:', errors);
            }
        });
    };

    const cancelEdit = () => {
        setEditingType(null);
        setEditTypeName("");
    };

    return (
        <>
            <h1 className="text-muted">Add Faculty/Staff</h1>

            <div className="row">
                <div className="col-md-8 mb-2">
                    <div className="card">
                        <form onSubmit={submit}>
                            <div className="card-body">
                                <div className="row">
                                    {/* Type */}
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Type</label>
                                        <select
                                            className="form-control"
                                            value={data.type_id}
                                            onChange={(e) => setData("type_id", e.target.value)}
                                        >
                                            <option value="">Select Type</option>
                                            {initialTypes.map((type) => (
                                                <option key={type.id} value={type.id}>
                                                    {type.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="form-text text-danger">{errors.type_id}</div>
                                    </div>

                                    {/* School */}
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">School <span className="text-danger">*</span></label>
                                        <select
                                            className="form-control"
                                            value={data.school_id}
                                            onChange={(e) => setData("school_id", e.target.value)}
                                            
                                        >
                                            <option value="">Select Type</option>
                                            {schools.map((school) => (
                                                <option key={school.id} value={school.id}>
                                                    {school.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="form-text text-danger">{errors.school_id}</div>
                                    </div>

                                    {/* Name */}
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Full Name <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            
                                        />
                                        <div className="form-text text-danger">{errors.name}</div>
                                    </div>

                                    {/* Slug */}
                                    <div className="mb-3 col-md-12">
                                        <label className="form-label">Slug</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={data.slug}
                                            onChange={(e) => setData("slug", e.target.value)}
                                        />
                                        <div className="form-text text-danger">{errors.slug}</div>
                                    </div>

                                    {/* Email */}
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Email Address</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={data.email}
                                            onChange={(e) => setData("email", e.target.value)}
                                        />
                                        <div className="form-text text-danger">{errors.email}</div>
                                    </div>

                                    {/* LinkedIn URL */}
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">LinkedIn URL</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={data.linkedin_url}
                                            onChange={(e) => setData("linkedin_url", e.target.value)}
                                            placeholder="https://linkedin.com/in/username"
                                        />
                                        <div className="form-text text-danger">{errors.linkedin_url}</div>
                                    </div>

                                    {/* Image */}
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Profile Image</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={(e) => setData("image", e.target.files[0])}
                                            accept="image/*"
                                        />
                                        <div className="form-text text-danger">{errors.image}</div>
                                        <div className="form-text">Recommended: 300x300px, Max 2MB</div>
                                    </div>

                                    {/* Profile */}
                                    <div className="mb-3 col-md-12">
                                        <label className="form-label">Profile</label>
                                        <textarea
                                            type="text"
                                            rows={3}
                                            className="form-control"
                                            value={data.profile}
                                            onChange={(e) => setData("profile", e.target.value)}
                                            placeholder="Professional profile summary"
                                        />
                                        <div className="form-text text-danger">{errors.profile}</div>
                                    </div>

                                    {/* Education - Dynamic Fields */}
                                    <div className="mb-3 col-12">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <label className="form-label">Education</label>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => addField('education')}
                                            >
                                                <i className="bx bx-plus me-1"></i> Add Education
                                            </button>
                                        </div>
                                        {data.education.map((education, index) => (
                                            <div key={index} className="input-group mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={education}
                                                    onChange={(e) => updateField('education', index, e.target.value)}
                                                    placeholder="Educational background and qualifications"
                                                />
                                                {data.education.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger"
                                                        onClick={() => removeField('education', index)}
                                                    >
                                                        <i className="bx bx-trash"></i>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        {/* Display errors for each education field */}
                                        {data.education.map((_, index) => (
                                            errors[`education.${index}`] && (
                                                <div key={`error-${index}`} className="form-text text-danger mb-1">
                                                    {errors[`education.${index}`]}
                                                </div>
                                            )
                                        ))}
                                    </div>

                                    {/* Research - Enhanced Dynamic Fields */}
                                    <div className="mb-3 col-12">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <label className="form-label">Research</label>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => addField('research')}
                                            >
                                                <i className="bx bx-plus me-1"></i> Add Research
                                            </button>
                                        </div>

                                        {data.research.map((research, researchIndex) => (
                                            <div key={researchIndex} className="card mb-3">
                                                <div className="card-header d-flex justify-content-between align-items-center">
                                                    <h6 className="mb-0">Research {researchIndex + 1}</h6>
                                                    {data.research.length > 1 && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => removeField('research', researchIndex)}
                                                        >
                                                            <i className="bx bx-trash"></i>
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="card-body">
                                                    {/* Research Title */}
                                                    <div className="mb-3">
                                                        <label className="form-label">Research Title</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={research.title}
                                                            onChange={(e) => updateResearchField(researchIndex, 'title', e.target.value)}
                                                            placeholder="Research project title or area"
                                                        />
                                                        <div className="form-text text-danger">
                                                            {errors[`research.${researchIndex}.title`]}
                                                        </div>
                                                    </div>

                                                    {/* Research Image */}
                                                    <div className="mb-3">
                                                        <label className="form-label">Research Image</label>
                                                        <div className="d-flex align-items-center">
                                                            <input
                                                                type="file"
                                                                className="form-control"
                                                                onChange={(e) => handleResearchImageChange(researchIndex, e.target.files[0])}
                                                                accept="image/*"
                                                            />
                                                            {(research.image instanceof File || (research.image && typeof research.image === 'string')) && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-danger ms-2"
                                                                    onClick={() => removeResearchImage(researchIndex)}
                                                                >
                                                                    <i className='bx bx-x'></i>
                                                                </button>
                                                            )}
                                                        </div>
                                                        {(research.image instanceof File || (research.image && typeof research.image === 'string')) && (
                                                            <div className="form-text text-success">
                                                                <i className="fas fa-check me-1"></i>
                                                                {research.image instanceof File ? research.image.name : 'Image exists'}
                                                            </div>
                                                        )}
                                                        <div className="form-text text-danger">
                                                            {errors[`research.${researchIndex}.image`]}
                                                        </div>
                                                    </div>

                                                    {/* Research Link */}
                                                    <div className="mb-3">
                                                        <label className="form-label">Research Link</label>
                                                        <input
                                                            type="url"
                                                            className="form-control"
                                                            value={research.link}
                                                            onChange={(e) => updateResearchField(researchIndex, 'link', e.target.value)}
                                                            placeholder="https://example.com/research"
                                                        />
                                                        <div className="form-text text-danger">
                                                            {errors[`research.${researchIndex}.link`]}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="form-text text-danger">{errors.research}</div>
                                    </div>

                                    {/* Teaching - Dynamic Fields */}
                                    <div className="mb-3 col-12">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <label className="form-label">Teaching</label>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => addField('teaching')}
                                            >
                                                <i className="bx bx-plus me-1"></i> Add Teaching Area
                                            </button>
                                        </div>
                                        {data.teaching.map((teaching, index) => (
                                            <div key={index} className="input-group mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={teaching}
                                                    onChange={(e) => updateField('teaching', index, e.target.value)}
                                                    placeholder="Teaching experience and courses"
                                                />
                                                {data.teaching.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger"
                                                        onClick={() => removeField('teaching', index)}
                                                    >
                                                        <i className="bx bx-trash"></i>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        {/* Display errors for each teaching field */}
                                        {data.teaching.map((_, index) => (
                                            errors[`teaching.${index}`] && (
                                                <div key={`error-${index}`} className="form-text text-danger mb-1">
                                                    {errors[`teaching.${index}`]}
                                                </div>
                                            )
                                        ))}
                                    </div>

                                    {/* Awards - Dynamic Fields */}
                                    <div className="mb-3 col-12">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <label className="form-label">Awards & Honors</label>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => addField('award')}
                                            >
                                                <i className="bx bx-plus me-1"></i> Add Award
                                            </button>
                                        </div>
                                        {data.award.map((award, index) => (
                                            <div key={index} className="input-group mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={award}
                                                    onChange={(e) => updateField('award', index, e.target.value)}
                                                    placeholder="Awards, honors, and recognitions"
                                                />
                                                {data.award.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger"
                                                        onClick={() => removeField('award', index)}
                                                    >
                                                        <i className="bx bx-trash"></i>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        {/* Display errors for each award field */}
                                        {data.award.map((_, index) => (
                                            errors[`award.${index}`] && (
                                                <div key={`error-${index}`} className="form-text text-danger mb-1">
                                                    {errors[`award.${index}`]}
                                                </div>
                                            )
                                        ))}
                                    </div>

                                    {/* Social Engagement - Dynamic Fields */}
                                    <div className="mb-3 col-12">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <label className="form-label">Social Engagement</label>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => addField('social_engagement')}
                                            >
                                                <i className="bx bx-plus me-1"></i> Add Engagement
                                            </button>
                                        </div>
                                        {data.social_engagement.map((engagement, index) => (
                                            <div key={index} className="input-group mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={engagement}
                                                    onChange={(e) => updateField('social_engagement', index, e.target.value)}
                                                    placeholder="Community service and social engagement activities"
                                                />
                                                {data.social_engagement.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger"
                                                        onClick={() => removeField('social_engagement', index)}
                                                    >
                                                        <i className="bx bx-trash"></i>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        {/* Display errors for each social engagement field */}
                                        {data.social_engagement.map((_, index) => (
                                            errors[`social_engagement.${index}`] && (
                                                <div key={`error-${index}`} className="form-text text-danger mb-1">
                                                    {errors[`social_engagement.${index}`]}
                                                </div>
                                            )
                                        ))}
                                    </div>

                                    {/* NEW: Sections with Points - Dynamic Fields */}
                                    <div className="mb-3 col-12">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <label className="form-label">Additional Sections</label>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => addField('sections')}
                                            >
                                                <i className="bx bx-plus me-1"></i> Add Section
                                            </button>
                                        </div>

                                        {data.sections.map((section, sectionIndex) => (
                                            <div key={sectionIndex} className="card mb-3">
                                                <div className="card-header d-flex justify-content-between align-items-center">
                                                    <h6 className="mb-0">Section {sectionIndex + 1}</h6>
                                                    {data.sections.length > 1 && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => removeField('sections', sectionIndex)}
                                                        >
                                                            <i className="bx bx-trash"></i>
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="card-body">
                                                    {/* Section Title */}
                                                    <div className="mb-3">
                                                        <label className="form-label">Section Title</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={section.title}
                                                            onChange={(e) => updateSectionField(sectionIndex, 'title', e.target.value)}
                                                            placeholder="e.g., Professional Experience, Publications, Skills"
                                                        />
                                                        <div className="form-text text-danger">
                                                            {errors[`sections.${sectionIndex}.title`]}
                                                        </div>
                                                    </div>

                                                    {/* Section Points */}
                                                    <div className="mb-3">
                                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                                            <label className="form-label mb-0">Points</label>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-secondary"
                                                                onClick={() => addPointToSection(sectionIndex)}
                                                            >
                                                                <i className="bx bx-plus me-1"></i> Add Point
                                                            </button>
                                                        </div>
                                                        
                                                        {section.points.map((point, pointIndex) => (
                                                            <div key={pointIndex} className="input-group mb-2">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={point}
                                                                    onChange={(e) => updatePointInSection(sectionIndex, pointIndex, e.target.value)}
                                                                    placeholder="Enter point details"
                                                                />
                                                                {section.points.length > 1 && (
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-danger"
                                                                        onClick={() => removePointFromSection(sectionIndex, pointIndex)}
                                                                    >
                                                                        <i className="bx bx-trash"></i>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                        
                                                        {/* Display errors for each point */}
                                                        {section.points.map((_, pointIndex) => (
                                                            errors[`sections.${sectionIndex}.points.${pointIndex}`] && (
                                                                <div key={`error-${pointIndex}`} className="form-text text-danger mb-1">
                                                                    {errors[`sections.${sectionIndex}.points.${pointIndex}`]}
                                                                </div>
                                                            )
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="form-text text-danger">{errors.sections}</div>
                                    </div>

                                    {/* Display Order */}
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Display Order</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={data.display_order}
                                            onChange={(e) => setData("display_order", parseInt(e.target.value) || 0)}
                                            min="0"
                                        />
                                        <div className="form-text text-danger">{errors.display_order}</div>
                                        <div className="form-text">Lower numbers display first</div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={processing}
                                    >
                                        {processing ? "Creating..." : "Create Faculty/Staff"}
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
                </div>

                <div className="col-md-4">
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">
                                <i className="bx bx-tag me-2 mb-1"></i>
                                Manage Types
                            </h5>
                        </div>
                        <div className="card-body">
                            {/* Add Type Form */}
                            <form onSubmit={addType} className="mb-4">
                                <label className="form-label fw-semibold">Add New Type</label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter type name"
                                        value={newType}
                                        onChange={(e) => setNewType(e.target.value)}
                                        disabled={typeLoading}
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={!newType.trim() || typeLoading}
                                    >
                                        {typeLoading ? (
                                            <i className="bx bx-loader bx-spin"></i>
                                        ) : (
                                            <i className="bx bx-plus"></i>
                                        )}
                                    </button>
                                </div>
                                <div className="form-text text-danger">{typeError.name}</div>
                            </form>

                            {/* Types List */}
                            <div>
                                <h6 className="fw-semibold text-dark mb-3">Existing Types</h6>
                                <div className="list-group">
                                    {initialTypes.map((type) => (
                                        <div key={type.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            {editingType === type.id ? (
                                                <form onSubmit={updateType} className="d-flex w-100">
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm me-2"
                                                        value={editTypeName}
                                                        onChange={(e) => setEditTypeName(e.target.value)}
                                                        disabled={typeLoading}
                                                    />

                                                    <button
                                                        type="submit"
                                                        className="btn btn-success btn-sm me-1"
                                                        disabled={!editTypeName.trim() || typeLoading}
                                                    >
                                                        {typeLoading ? (
                                                            <i className="bx bx-loader bx-spin"></i>
                                                        ) : (
                                                            <i className="bx bx-check"></i>
                                                        )}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={cancelEdit}
                                                        disabled={typeLoading}
                                                    >
                                                        <i className="bx bx-x"></i>
                                                    </button>
                                                </form>
                                            ) : (
                                                <>
                                                    <span>{type.name}</span>
                                                    <div className="btn-group btn-group-sm">
                                                        <button
                                                            className="btn btn-outline-primary"
                                                            onClick={() => startEditType(type)}
                                                            disabled={typeLoading}
                                                        >
                                                            <i className="bx bx-edit"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger"
                                                            onClick={() => showDeleteModal(type.id)}
                                                            disabled={typeLoading}
                                                        >
                                                            <i className="bx bx-trash"></i>
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Delete Modal */}
                            <div className="modal fade" ref={modalRef} tabIndex="-1" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Confirm Deletion</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                        </div>
                                        <div className="modal-body">
                                            Are you sure you want to delete this type? This action cannot be undone.
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                data-bs-dismiss="modal"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={deleteType}
                                                disabled={typeLoading}
                                            >
                                                {typeLoading ? (
                                                    <>
                                                        <i className="bx bx-loader bx-spin me-2"></i>
                                                        Deleting...
                                                    </>
                                                ) : (
                                                    'Yes, Delete'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Create;