import { useForm, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const CreateOrUpdateSections = ({ course }) => {
    const [activeSections, setActiveSections] = useState([]);
    const appUrl = usePage().props.appUrl;
    
    // Helper function to safely parse JSON or return default
    const safeParse = (value, defaultValue = [{ title: "", description: "" }]) => {
        if (!value) return defaultValue;
        if (Array.isArray(value)) return value;
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultValue;
        } catch (error) {
            console.error("Failed to parse JSON:", error);
            return defaultValue;
        }
    };

    // Helper function for simple arrays
    const safeParseSimpleArray = (value) => {
        if (!value) return [""];
        if (Array.isArray(value)) return value;
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [""];
        } catch (error) {
            console.error("Failed to parse JSON:", error);
            return [""];
        }
    };

    // Initialize data structure
    const initialData = {
        // Overview
        overview_title: course.overview_title || "",
        overview_desc: course.overview_desc || "",
        overview_image: null,

        // Eligibility
        eligibility_criteria: course.eligibility_criteria || "",
        eligibility_criteria_desc: course.eligibility_criteria_desc || "",
        eligibility_criteria_notices: safeParseSimpleArray(course.eligibility_criteria_notices),

        // Program Outcomes
        peos: safeParse(course.peos),
        pos: safeParse(course.pos),
        pso: safeParse(course.pso),

        // Curriculum
        curriculum_title: course.curriculum_title || "",
        curriculum_desc: safeParseSimpleArray(course.curriculum_desc),
        curriculum_image: null,
        curriculum_pdf: null,

        // Fee Structure
        fee_structure_title: course.fee_structure_title || "",
        fee_structure_short_description: course.fee_structure_short_description || "",
        course_total_fees: course.course_total_fees || "",
        fee_structure_pdf: null,
        fee_structure_image: null,
        
        // Career Opportunities
        career_title: course.career_title || "",
        career_subtitle: course.career_subtitle || "",
        career_desc: course.career_desc || "",
        career_image: null,
    };

    const { data, setData, post, processing, errors } = useForm(initialData);

    // Section configuration
    const sectionConfig = [
        {
            id: "Overview",
            label: "Overview Info",
            icon: "⏳",
            description: "Overview Image And Title",
            fields: [
                {
                    name: "overview_title",
                    label: "Title",
                    type: "text",
                    placeholder: "Title"
                },
                {
                    name: "overview_desc",
                    label: "Description",
                    type: "textarea",
                    placeholder: "Desc"
                },
                {
                    name: "overview_image",
                    label: "Overview Image",
                    type: "file",
                    accept: "image/*"
                }
            ]
        },
        {
            id: "eligibility",
            label: "Eligibility Criteria",
            icon: "📋",
            description: "Eligibility requirements and criteria",
            fields: [
                {
                    name: "eligibility_criteria",
                    label: "Eligibility Criteria",
                    type: "text",
                    placeholder: "Enter eligibility criteria"
                },
                {
                    name: "eligibility_criteria_desc",
                    label: "Description",
                    type: "textarea",
                    placeholder: "Detailed description of eligibility"
                },
                {
                    name: "eligibility_criteria_notices",
                    label: "Important Notices",
                    type: "simple-array",
                    placeholder: "Add important notice"
                }
            ]
        },
        {
            id: "outcomes",
            label: "Program Outcomes",
            icon: "🎯",
            description: "Program educational objectives and outcomes",
            fields: [
                {
                    name: "peos",
                    label: "Program Educational Objectives (PEOs)",
                    type: "object-array",
                    fields: [
                        { name: "title", label: "Title", placeholder: "Enter PEO title" },
                        { name: "description", label: "Description", placeholder: "Enter PEO description" }
                    ]
                },
                {
                    name: "pos",
                    label: "Program Outcomes (POs)",
                    type: "object-array",
                    fields: [
                        { name: "title", label: "Title", placeholder: "Enter PO title" },
                        { name: "description", label: "Description", placeholder: "Enter PO description" }
                    ]
                },
                {
                    name: "pso",
                    label: "Program Specific Outcomes (PSOs)",
                    type: "object-array",
                    fields: [
                        { name: "title", label: "Title", placeholder: "Enter PSO title" },
                        { name: "description", label: "Description", placeholder: "Enter PSO description" }
                    ]
                }
            ]
        },
        {
            id: "curriculum",
            label: "Curriculum",
            icon: "📚",
            description: "Curriculum details and documents",
            fields: [
                {
                    name: "curriculum_title",
                    label: "Curriculum Title",
                    type: "text",
                    placeholder: "Enter curriculum title"
                },
                {
                    name: "curriculum_desc",
                    label: "Curriculum Description",
                    type: "simple-array",
                    placeholder: "Add curriculum point"
                },
                {
                    name: "curriculum_image",
                    label: "Curriculum Image",
                    type: "file",
                    accept: "image/*"
                },
                {
                    name: "curriculum_pdf",
                    label: "Curriculum PDF",
                    type: "file",
                    accept: ".pdf"
                }
            ]
        },
        {
            id: "fees",
            label: "Fee Structure",
            icon: "💰",
            description: "Fee details and structure documents",
            fields: [
                {
                    name: "fee_structure_title",
                    label: "Fee Structure Title",
                    type: "text",
                    placeholder: "Enter fee structure title"
                },
                {
                    name: "fee_structure_short_description",
                    label: "Short Description",
                    type: "text",
                    placeholder: "Brief description of fee structure"
                },
                {
                    name: "course_total_fees",
                    label: "Total Course Fees",
                    type: "text",
                    placeholder: "Enter total fees amount"
                },
                {
                    name: "fee_structure_image",
                    label: "Fee Structure Image",
                    type: "file",
                    accept: "image/*"
                },
                {
                    name: "fee_structure_pdf",
                    label: "Fee Structure PDF",
                    type: "file",
                    accept: ".pdf"
                }
            ]
        },
        {
            id: "career",
            label: "Career Opportunities",
            icon: "💼",
            description: "Career prospects and opportunities",
            fields: [
                {
                    name: "career_title",
                    label: "Career Title",
                    type: "text",
                },
                {
                    name: "career_subtitle",
                    label: "Career SubTitle",
                    type: "text",
                },
                {
                    name: "career_desc",
                    label: "Career Desc",
                    type: "textarea",
                },
                {
                    name: "career_image",
                    label: "Career Image",
                    type: "file",
                    accept: "image/*"
                }
            ]
        }
    ];

    // Initialize active sections based on existing data
    useEffect(() => {
        const initiallyActive = [];
        sectionConfig.forEach(section => {
            const hasData = section.fields.some(field => {
                const value = data[field.name];
                if (field.type === 'object-array') {
                    return Array.isArray(value) && value.some(item => 
                        item && (item.title || item.description)
                    );
                }
                if (field.type === 'simple-array') {
                    return Array.isArray(value) && value.some(item => item && item !== "");
                }
                if (value === null || value === undefined) return false;
                return value !== "";
            });
            
            if (hasData) {
                initiallyActive.push(section.id);
            }
        });
        setActiveSections(initiallyActive);
    }, []);

    const submit = (e) => {
        e.preventDefault();
        
        // Convert arrays to JSON strings before sending
        const formData = new FormData();
        
        // Add all data to FormData
        Object.keys(data).forEach(key => {
            const value = data[key];
            
            if (['peos', 'pos', 'pso'].includes(key)) {
                // Convert object arrays to JSON
                if (Array.isArray(value) && value.length > 0) {
                    // Filter out empty objects
                    const filtered = value.filter(item => 
                        item && (item.title || item.description)
                    );
                    if (filtered.length > 0) {
                        formData.append(key, JSON.stringify(filtered));
                    }
                }
            } else if (['eligibility_criteria_notices', 'curriculum_desc'].includes(key)) {
                // Convert simple arrays to JSON
                if (Array.isArray(value) && value.length > 0) {
                    const filtered = value.filter(item => item && item !== "");
                    if (filtered.length > 0) {
                        formData.append(key, JSON.stringify(filtered));
                    }
                }
            } else if (value instanceof File) {
                // Handle files
                if (value) {
                    formData.append(key, value);
                }
            } else if (value !== null && value !== undefined) {
                // Handle regular values
                formData.append(key, value);
            }
        });

        // Submit the form
        post(route("course.section.update", course.id), {
            data: formData,
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const { flash } = usePage().props;
    
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Section management
    const addSection = (sectionId) => {
        if (!activeSections.includes(sectionId)) {
            setActiveSections(prev => [...prev, sectionId]);
        }
    };

    const removeSection = (sectionId) => {
        setActiveSections(prev => prev.filter(id => id !== sectionId));
        
        // Reset section data when removed
        const section = sectionConfig.find(s => s.id === sectionId);
        if (section) {
            section.fields.forEach(field => {
                if (field.type === 'simple-array') {
                    setData(field.name, [""]);
                } else if (field.type === 'object-array') {
                    setData(field.name, [{ title: "", description: "" }]);
                } else if (field.type === 'file') {
                    setData(field.name, null);
                } else {
                    setData(field.name, "");
                }
            });
        }
    };

    // Field handlers
    const handleFieldChange = (fieldName, value) => {
        setData(fieldName, value);
    };

    const handleSimpleArrayChange = (fieldName, index, value) => {
        const currentArray = [...(data[fieldName] || [])];
        currentArray[index] = value;
        setData(fieldName, currentArray);
    };

    const addSimpleArrayItem = (fieldName) => {
        const currentArray = [...(data[fieldName] || [])];
        setData(fieldName, [...currentArray, ""]);
    };

    const removeSimpleArrayItem = (fieldName, index) => {
        const currentArray = [...(data[fieldName] || [])];
        if (currentArray.length > 1) {
            setData(fieldName, currentArray.filter((_, i) => i !== index));
        } else {
            // If only one item left, just clear it
            setData(fieldName, [""]);
        }
    };

    // Object array handlers for PEOS, POS, PSO
    const handleObjectArrayChange = (fieldName, index, subFieldName, value) => {
        const currentArray = [...(data[fieldName] || [])];
        if (!currentArray[index]) {
            currentArray[index] = { title: "", description: "" };
        }
        currentArray[index] = {
            ...currentArray[index],
            [subFieldName]: value
        };
        setData(fieldName, currentArray);
    };

    const addObjectArrayItem = (fieldName, template = { title: "", description: "" }) => {
        const currentArray = [...(data[fieldName] || [])];
        setData(fieldName, [...currentArray, { ...template }]);
    };

    const removeObjectArrayItem = (fieldName, index) => {
        const currentArray = [...(data[fieldName] || [])];
        if (currentArray.length > 1) {
            setData(fieldName, currentArray.filter((_, i) => i !== index));
        } else {
            // If only one item left, reset to empty object
            setData(fieldName, [{ title: "", description: "" }]);
        }
    };

    // Render field based on type
    const renderField = (field) => {
        const value = data[field.name];
        const fieldError = errors[field.name];

        switch (field.type) {
            case 'text':
                return (
                    <div className="mb-3" key={field.name}>
                        <label className="form-label">{field.label}</label>
                        <input
                            type="text"
                            className={`form-control ${fieldError ? 'is-invalid' : ''}`}
                            placeholder={field.placeholder}
                            value={value || ''}
                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                            disabled={processing}
                        />
                        {fieldError && <div className="invalid-feedback">{fieldError}</div>}
                    </div>
                );

            case 'textarea':
                return (
                    <div className="mb-3" key={field.name}>
                        <label className="form-label">{field.label}</label>
                        <textarea
                            className={`form-control ${fieldError ? 'is-invalid' : ''}`}
                            rows="3"
                            placeholder={field.placeholder}
                            value={value || ''}
                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                            disabled={processing}
                        />
                        {fieldError && <div className="invalid-feedback">{fieldError}</div>}
                    </div>
                );

            case 'simple-array':
                const simpleArrayValue = Array.isArray(value) ? value : [""];
                
                return (
                    <div className="mb-3" key={field.name}>
                        <label className="form-label">{field.label}</label>
                        {simpleArrayValue.map((item, index) => (
                            <div key={index} className="d-flex gap-2 mb-2">
                                <input
                                    type="text"
                                    className={`form-control ${fieldError ? 'is-invalid' : ''}`}
                                    placeholder={`${field.placeholder} ${index + 1}`}
                                    value={item}
                                    onChange={(e) => handleSimpleArrayChange(field.name, index, e.target.value)}
                                    disabled={processing}
                                />
                                {simpleArrayValue.length > 1 && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={() => removeSimpleArrayItem(field.name, index)}
                                        disabled={processing}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                        {fieldError && <div className="invalid-feedback d-block">{fieldError}</div>}
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => addSimpleArrayItem(field.name)}
                            disabled={processing}
                        >
                            + Add {field.label}
                        </button>
                    </div>
                );

            case 'object-array':
                const objectArrayValue = Array.isArray(value) ? value : [{ title: "", description: "" }];
                
                return (
                    <div className="mb-4" key={field.name}>
                        <label className="form-label">{field.label}</label>
                        
                        {objectArrayValue.map((item, index) => (
                            <div key={index} className="card mb-3 border">
                                <div className="card-header bg-light d-flex justify-content-between align-items-center py-2">
                                    <small className="text-muted">Item {index + 1}</small>
                                    {objectArrayValue.length > 1 && (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => removeObjectArrayItem(field.name, index)}
                                            disabled={processing}
                                        >
                                            × Remove
                                        </button>
                                    )}
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        {field.fields.map((subField) => (
                                            <div 
                                                className={subField.name === 'description' ? 'col-12' : 'col-md-6'} 
                                                key={`${field.name}-${index}-${subField.name}`}
                                            >
                                                {subField.name === 'description' ? (
                                                    <div className="mb-2">
                                                        <label className="form-label small">{subField.label}</label>
                                                        <textarea
                                                            className={`form-control ${errors[`${field.name}.${index}.${subField.name}`] ? 'is-invalid' : ''}`}
                                                            placeholder={subField.placeholder}
                                                            value={item[subField.name] || ''}
                                                            onChange={(e) => handleObjectArrayChange(field.name, index, subField.name, e.target.value)}
                                                            rows="3"
                                                            disabled={processing}
                                                        />
                                                        {errors[`${field.name}.${index}.${subField.name}`] && (
                                                            <div className="invalid-feedback">
                                                                {errors[`${field.name}.${index}.${subField.name}`]}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="mb-2">
                                                        <label className="form-label small">{subField.label}</label>
                                                        <input
                                                            type="text"
                                                            className={`form-control ${errors[`${field.name}.${index}.${subField.name}`] ? 'is-invalid' : ''}`}
                                                            placeholder={subField.placeholder}
                                                            value={item[subField.name] || ''}
                                                            onChange={(e) => handleObjectArrayChange(field.name, index, subField.name, e.target.value)}
                                                            disabled={processing}
                                                        />
                                                        {errors[`${field.name}.${index}.${subField.name}`] && (
                                                            <div className="invalid-feedback">
                                                                {errors[`${field.name}.${index}.${subField.name}`]}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {fieldError && <div className="invalid-feedback d-block mb-2">{fieldError}</div>}
                        
                        <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => addObjectArrayItem(field.name)}
                            disabled={processing}
                        >
                            <i className="bx bx-plus me-1"></i>
                            Add New {field.label}
                        </button>
                    </div>
                );

            case 'file':
                return (
                    <div className="mb-3" key={field.name}>
                        <label className="form-label">{field.label}</label>
                        <input
                            type="file"
                            className={`form-control ${fieldError ? 'is-invalid' : ''}`}
                            onChange={(e) => handleFieldChange(field.name, e.target.files[0])}
                            accept={field.accept}
                            disabled={processing}
                        />
                        {fieldError && <div className="invalid-feedback">{fieldError}</div>}
                        
                        {/* Show current file if exists in course data */}
                        {course[field.name] && typeof course[field.name] === 'string' && (
                            <div className="mt-2">
                                <label className="form-label small">Current File:</label>
                                <div className="d-flex align-items-center">
                                    <div className="me-3">
                                        {field.accept === 'image/*' ? (
                                            <img
                                                src={`${appUrl}/${course[field.name]}`}
                                                alt="Current"
                                                style={{
                                                    width: "80px",
                                                    height: "60px",
                                                    objectFit: "cover",
                                                    borderRadius: "4px"
                                                }}
                                            />
                                        ) : (
                                            <div className="border p-2 rounded bg-light">
                                                <i className="bx bx-file"></i>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow-1">
                                        <small className="text-muted d-block">
                                            Current file: {course[field.name].split('/').pop()}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    // Available sections (not yet added)
    const availableSections = sectionConfig.filter(
        section => !activeSections.includes(section.id)
    );

    return (
        <>
            <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h4 className="mb-0">
                    Manage Course Sections — <span className="text-primary">{course.name}</span>
                </h4>
            </div>

            {/* Add Section Panel */}
            {availableSections.length > 0 && (
                <div className="card mb-4">
                    <div className="card-header bg-light">
                        <h5 className="card-title mb-0">
                            <i className="bx bx-plus-circle bx-sm mb-1 me-1"></i>
                            Add New Section
                        </h5>
                    </div>
                    <div className="card-body">
                        <p className="text-muted mb-3">Choose sections to add to your course:</p>
                        <div className="row g-3">
                            {availableSections.map(section => (
                                <div key={section.id} className="col-md-6 col-lg-4">
                                    <div className="card h-100 border-dashed">
                                        <div className="card-body text-center">
                                            <div className="display-6 mb-2">{section.icon}</div>
                                            <h6 className="card-title">{section.label}</h6>
                                            <p className="card-text text-muted small">{section.description}</p>
                                            <button
                                                type="button"
                                                className="btn btn-primary btn-sm"
                                                onClick={() => addSection(section.id)}
                                                disabled={processing}
                                            >
                                                <i className="bx bx-plus me-1"></i>
                                                Add Section
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={submit} encType="multipart/form-data">
                {/* Active Sections */}
                <div className="sections-container">
                    {activeSections.map(sectionId => {
                        const section = sectionConfig.find(s => s.id === sectionId);
                        if (!section) return null;

                        return (
                            <div key={section.id} className="card mb-4 shadow-sm">
                                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <span className="me-3 fs-5">{section.icon}</span>
                                        <div>
                                            <h5 className="mb-0">{section.label}</h5>
                                            <small className="text-muted">{section.description}</small>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => removeSection(section.id)}
                                        disabled={processing}
                                    >
                                        <i className="bx bx-x me-1"></i>
                                        Remove Section
                                    </button>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        {section.fields.map(field => (
                                            <div 
                                                className={
                                                    field.type === 'object-array' || 
                                                    field.type === 'simple-array' || 
                                                    field.type === 'textarea' || 
                                                    field.type === 'file' 
                                                    ? "col-12" 
                                                    : "col-md-6"
                                                } 
                                                key={field.name}
                                            >
                                                {renderField(field)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Submit Button */}
                <div className="mt-4 p-4 bg-light rounded border">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <button 
                                type="submit" 
                                className="btn btn-primary btn-lg" 
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <i className="bx bx-save me-2"></i>
                                        Save Course Sections
                                    </>
                                )}
                            </button>
                            <span className="text-muted ms-3">
                                <i className="bx bx-layer me-1"></i>
                                {activeSections.length} section(s) active
                            </span>
                        </div>
                    </div>
                    
                    {activeSections.length === 0 && (
                        <div className="mt-3 alert alert-warning">
                            <i className="bx bx-alarm-exclamation bx-sm me-3"></i>
                            No sections are currently active. Saving will clear all section data.
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {activeSections.length === 0 && (
                    <div className="text-center py-5 border rounded bg-light">
                        <div className="display-1 text-muted mb-3">📚</div>
                        <h5 className="text-muted">No sections active</h5>
                        <p className="text-muted mb-4">
                            Add sections above to build your course content, or save to clear all sections.
                        </p>
                        
                        {availableSections.length === 0 ? (
                            <div className="alert alert-info">
                                <i className="bx bx-info-circle me-2"></i>
                                All available sections have been added to your course.
                            </div>
                        ) : null}
                    </div>
                )}
            </form>
        </>
    );
};

export default CreateOrUpdateSections;