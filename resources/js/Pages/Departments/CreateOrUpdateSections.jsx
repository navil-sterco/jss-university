import { useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const Section = ({ department }) => {
    const [activeSections, setActiveSections] = useState([]);

    const { data, setData, post, progress, errors, processing } = useForm({
        // About Department
        title: department.title || "",
        subtitle: department.subtitle || "",
        description: department.description || "",
        vision_title: department.vision_title || "",
        vision_description: department.vision_description || "",
        mission_title: department.mission_title || "",
        mission_points: department.mission_points || [""],
        image: null,
        status: 1,

        // Dean/HOD Message
        hod_name: department.hod_name || "",
        hod_designation: department.hod_designation || "",
        hod_messages: department.hod_messages || [""],
        hod_image: null,

        // Courses
        courses_title: department.courses_title || "",
        courses_image: null,

        // Faculty
        faculty_title: department.faculty_title || "",
        faculty_subtitle: department.faculty_subtitle || "",

        // Laboratories
        lab_title: department.lab_title || "",
        lab_subtitle: department.lab_subtitle || "",

        // Happening
        happening_title: department.happening_title || "",
        happening_subtitle: department.happening_subtitle || "",
    });

    // Section configuration
    const sectionConfig = [
        {
            id: "about",
            label: "About Department",
            icon: "🏢",
            description: "Department overview, vision, and mission",
            fields: [
                {
                    name: "title",
                    label: "Department Title",
                    type: "text",
                    placeholder: "COMPUTER SCIENCE & ENGINEERING",
                    required: true
                },
                {
                    name: "subtitle",
                    label: "Subtitle",
                    type: "text",
                    placeholder: "ABOUT DEPARTMENT OF"
                },
                {
                    name: "description",
                    label: "Description",
                    type: "textarea",
                    placeholder: "Department description",
                    rows: 4
                },
                {
                    name: "image",
                    label: "Department Image",
                    type: "file",
                    accept: "image/*"
                },
                {
                    name: "vision_title",
                    label: "Vision Title",
                    type: "text",
                    placeholder: "Vision"
                },
                {
                    name: "vision_description",
                    label: "Vision Description",
                    type: "textarea",
                    placeholder: "Vision description",
                    rows: 3
                },
                {
                    name: "mission_title",
                    label: "Mission Title",
                    type: "text",
                    placeholder: "Mission"
                },
                {
                    name: "mission_points",
                    label: "Mission Points",
                    type: "array",
                    placeholder: "Add mission point"
                }
            ]
        },
        {
            id: "dean",
            label: "Dean/HOD Message",
            icon: "👨‍🏫",
            description: "Head of Department message and information",
            fields: [
                {
                    name: "hod_name",
                    label: "HOD Name",
                    type: "text",
                    placeholder: "Dr. Dhiraj Pandey"
                },
                {
                    name: "hod_designation",
                    label: "Designation",
                    type: "text",
                    placeholder: "Head of the Department"
                },
                {
                    name: "hod_messages",
                    label: "HOD Messages",
                    type: "array",
                    placeholder: "Add HOD message"
                },
                {
                    name: "hod_image",
                    label: "HOD Image",
                    type: "file",
                    accept: "image/*"
                }
            ]
        },
        {
            id: "courses",
            label: "Courses",
            icon: "📚",
            description: "Courses offered by the department",
            fields: [
                {
                    name: "courses_title",
                    label: "Courses Title",
                    type: "text",
                    placeholder: "Courses Offered"
                },
                {
                    name: "courses_image",
                    label: "Courses Image",
                    type: "file",
                    accept: "image/*"
                }
            ]
        },
        {
            id: "faculty",
            label: "Faculty",
            icon: "👥",
            description: "Faculty information and details",
            fields: [
                {
                    name: "faculty_title",
                    label: "Faculty Title",
                    type: "text",
                    placeholder: "Our Faculty"
                },
                {
                    name: "faculty_subtitle",
                    label: "Faculty Subtitle",
                    type: "text",
                    placeholder: "Meet Our Expert Faculty"
                }
            ]
        },
        {
            id: "lab",
            label: "Laboratories",
            icon: "🔬",
            description: "Laboratory facilities and information",
            fields: [
                {
                    name: "lab_title",
                    label: "Laboratory Title",
                    type: "text",
                    placeholder: "Our Laboratories"
                },
                {
                    name: "lab_subtitle",
                    label: "Laboratory Subtitle",
                    type: "text",
                    placeholder: "Explore Our Advanced Labs"
                }
            ]
        },
        {
            id: "happening",
            label: "What's Happening",
            icon: "📢",
            description: "Latest events and news",
            fields: [
                {
                    name: "happening_title",
                    label: "Happening Title",
                    type: "text",
                    placeholder: "What's Happening"
                },
                {
                    name: "happening_subtitle",
                    label: "Happening Subtitle",
                    type: "text",
                    placeholder: "Latest Events & News"
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
                if (Array.isArray(value)) return value.some(item => item && item !== "");
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
        post(route("department.section.update", department.id), {
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
                if (field.type === 'array') {
                    setData(field.name, [""]);
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

    const handleArrayChange = (fieldName, index, value) => {
        const currentArray = [...data[fieldName]];
        currentArray[index] = value;
        setData(fieldName, currentArray);
    };

    const addArrayItem = (fieldName) => {
        const currentArray = [...data[fieldName]];
        setData(fieldName, [...currentArray, ""]);
    };

    const removeArrayItem = (fieldName, index) => {
        const currentArray = [...data[fieldName]];
        if (currentArray.length > 1) {
            setData(fieldName, currentArray.filter((_, i) => i !== index));
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
                        <label className="form-label">
                            {field.label}
                            {field.required && <span className="text-danger">*</span>}
                        </label>
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
                            rows={field.rows || 3}
                            placeholder={field.placeholder}
                            value={value || ''}
                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                            disabled={processing}
                        />
                        {fieldError && <div className="invalid-feedback">{fieldError}</div>}
                    </div>
                );

            case 'array':
                return (
                    <div className="mb-3" key={field.name}>
                        <label className="form-label">{field.label}</label>
                        {value.map((item, index) => (
                            <div key={index} className="d-flex gap-2 mb-2">
                                <input
                                    type="text"
                                    className={`form-control ${fieldError ? 'is-invalid' : ''}`}
                                    placeholder={`${field.placeholder} ${index + 1}`}
                                    value={item}
                                    onChange={(e) => handleArrayChange(field.name, index, e.target.value)}
                                    disabled={processing}
                                />
                                {value.length > 1 && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={() => removeArrayItem(field.name, index)}
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
                            onClick={() => addArrayItem(field.name)}
                            disabled={processing}
                        >
                            + Add {field.label}
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
                        
                        {/* Show current file if exists in department data */}
                        {department[field.name] && typeof department[field.name] === 'string' && (
                            <div className="form-text text-success">
                                Current file: {department[field.name]}
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
                    Manage Department Sections —{" "}
                    <span className="text-primary">{department.name}</span>
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
                        <p className="text-muted mb-3">Choose sections to add to your department:</p>
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
                                        {section.fields.map(field => 
                                            (field.type === 'array' || field.type === 'file' || field.type === 'textarea') ? (
                                                <div className="col-12" key={field.name}>
                                                    {renderField(field)}
                                                </div>
                                            ) : (
                                                <div className="col-md-6" key={field.name}>
                                                    {renderField(field)}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Progress Bar for File Uploads */}
                {progress && (
                    <div className="mb-3">
                        <div className="progress">
                            <div
                                className="progress-bar progress-bar-striped progress-bar-animated"
                                role="progressbar"
                                style={{ width: `${progress.percentage}%` }}
                            >
                                {progress.percentage}%
                            </div>
                        </div>
                        <div className="form-text">Uploading... {progress.percentage}%</div>
                    </div>
                )}

                {/* ALWAYS SHOW SUBMIT BUTTON - Even when no sections are active */}
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
                                        Save Department Sections
                                    </>
                                )}
                            </button>
                            <span className="text-muted ms-3">
                                <i className="bx bx-layer-group me-1"></i>
                                {activeSections.length} section(s) active
                            </span>
                        </div>
                    </div>
                    
                    {/* Show message when no sections are active */}
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
                        <div className="display-1 text-muted mb-3">🏢</div>
                        <h5 className="text-muted">No sections active</h5>
                        <p className="text-muted mb-4">
                            Add sections above to build your department content, or save to clear all sections.
                        </p>
                        
                        {availableSections.length === 0 ? (
                            <div className="alert alert-info">
                                <i className="bx bx-info-circle me-2"></i>
                                All available sections have been added to your department.
                            </div>
                        ) : null}
                    </div>
                )}
            </form>
        </>
    );
};

export default Section;