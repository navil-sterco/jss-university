import { useForm, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';

const CreateOrUpdateSections = ({ school }) => {
    const [activeSections, setActiveSections] = useState([]);

    const { data, setData, post, progress, processing, errors } = useForm({
        // About School Section
        about_school_title: school.about_school_title || "",
        about_school_subtitle: school.about_school_subtitle || "",
        about_school_description: school.about_school_description || "",
        about_school_url: school.about_school_url || "",
        about_school_chancellor_img: null,
        about_school_chancellor_logo: null,
        about_school_logo_content: school.about_school_logo_content || "",
        about_school_stats_number: school.about_school_stats_number || "",
        about_school_stats_content: school.about_school_stats_content || "",
        highlight_1_rank: school.highlight_1_rank || "",
        highlight_1_text: school.highlight_1_text || "",
        highlight_1_source: school.highlight_1_source || "",
        button_1_text: school.button_1_text || "",
        button_1_url: school.button_1_url || "",
        button_2_text: school.button_2_text || "",
        button_2_url: school.button_2_url || "",
        button_3_text: school.button_3_text || "",
        button_3_url: school.button_3_url || "",

        // School Department Section
        department_title: school.department_title || "",
        department_desc: school.department_desc || "",
        department_programs_count: school.department_programs_count || "",
        department_programs_text: school.department_programs_text || "",
        department_button_1_text: school.department_button_1_text || "",
        department_button_1_url: school.department_button_1_url || "",
        department_button_2_text: school.department_button_2_text || "",
        department_button_2_url: school.department_button_2_url || "",

        // Placement Section
        placement_title: school.placement_title || "",
        placement_subtitle: school.placement_subtitle || "",
        hall_of_fame_image: null,
        hall_of_fame_heading: school.hall_of_fame_heading || "",
        hall_of_fame_url: school.hall_of_fame_url || "",

        // Testimonial Section
        testimonial_title: school.testimonial_title || "",
        testimonial_subtitle: school.testimonial_subtitle || "",

        // Happening Section
        happening_title: school.happening_title || "",
        happening_subtitle: school.happening_subtitle || "",
    });

    // Section configuration
    const sectionConfig = [
        {
            id: "about",
            label: "About School",
            icon: "🏫",
            description: "School overview, highlights, and statistics",
            fields: [
                {
                    name: "about_school_title",
                    label: "Title",
                    type: "text",
                    placeholder: "About School Title"
                },
                {
                    name: "about_school_subtitle",
                    label: "Subtitle",
                    type: "text",
                    placeholder: "About School Subtitle"
                },
                {
                    name: "about_school_description",
                    label: "Description",
                    type: "textarea",
                    placeholder: "School description",
                    rows: 3
                },
                {
                    name: "about_school_chancellor_img",
                    label: "Chancellor Image",
                    type: "file",
                    accept: "image/*"
                },
                {
                    name: "about_school_chancellor_logo",
                    label: "Chancellor Logo",
                    type: "file",
                    accept: "image/*"
                },
                {
                    name: "about_school_logo_content",
                    label: "Logo Content",
                    type: "text",
                    placeholder: "Logo content text"
                },
                {
                    name: "about_school_stats_number",
                    label: "Stats Number",
                    type: "text",
                    placeholder: "e.g., 100+"
                },
                {
                    name: "about_school_stats_content",
                    label: "Stats Content",
                    type: "text",
                    placeholder: "e.g., Programs Offered"
                },
                {
                    name: "highlight_1_rank",
                    label: "Highlight Rank",
                    type: "text",
                    placeholder: "e.g., #1"
                },
                {
                    name: "highlight_1_text",
                    label: "Highlight Text",
                    type: "text",
                    placeholder: "e.g., Best Engineering College"
                },
                {
                    name: "highlight_1_source",
                    label: "Highlight Source",
                    type: "text",
                    placeholder: "e.g., Times Ranking 2024"
                },
                {
                    name: "button_1_text",
                    label: "Button 1 Text",
                    type: "text",
                    placeholder: "e.g., Learn More"
                },
                {
                    name: "button_1_url",
                    label: "Button 1 URL",
                    type: "url",
                    placeholder: "https://example.com"
                },
                {
                    name: "button_2_text",
                    label: "Button 2 Text",
                    type: "text",
                    placeholder: "e.g., Apply Now"
                },
                {
                    name: "button_2_url",
                    label: "Button 2 URL",
                    type: "url",
                    placeholder: "https://example.com"
                },
                {
                    name: "button_3_text",
                    label: "Button 3 Text",
                    type: "text",
                    placeholder: "e.g., Contact Us"
                },
                {
                    name: "button_3_url",
                    label: "Button 3 URL",
                    type: "url",
                    placeholder: "https://example.com"
                }
            ]
        },
        {
            id: "department",
            label: "Departments",
            icon: "🏢",
            description: "Department information and programs",
            fields: [
                {
                    name: "department_title",
                    label: "Title",
                    type: "text",
                    placeholder: "Our Departments"
                },
                {
                    name: "department_desc",
                    label: "Description",
                    type: "textarea",
                    placeholder: "Department description",
                    rows: 2
                },
                {
                    name: "department_programs_count",
                    label: "Programs Count",
                    type: "text",
                    placeholder: "e.g., 50+"
                },
                {
                    name: "department_programs_text",
                    label: "Programs Text",
                    type: "text",
                    placeholder: "e.g., Programs Available"
                },
                {
                    name: "department_button_1_text",
                    label: "Button 1 Text",
                    type: "text",
                    placeholder: "e.g., View Departments"
                },
                {
                    name: "department_button_1_url",
                    label: "Button 1 URL",
                    type: "url",
                    placeholder: "https://example.com"
                },
                {
                    name: "department_button_2_text",
                    label: "Button 2 Text",
                    type: "text",
                    placeholder: "e.g., Explore Programs"
                },
                {
                    name: "department_button_2_url",
                    label: "Button 2 URL",
                    type: "url",
                    placeholder: "https://example.com"
                }
            ]
        },
        {
            id: "placement",
            label: "Placement",
            icon: "💼",
            description: "Placement information and hall of fame",
            fields: [
                {
                    name: "placement_title",
                    label: "Title",
                    type: "text",
                    placeholder: "Placement & Careers"
                },
                {
                    name: "placement_subtitle",
                    label: "Subtitle",
                    type: "text",
                    placeholder: "Our Placement Success"
                },
                {
                    name: "hall_of_fame_image",
                    label: "Hall of Fame Image",
                    type: "file",
                    accept: "image/*"
                },
                {
                    name: "hall_of_fame_heading",
                    label: "Hall of Fame Heading",
                    type: "text",
                    placeholder: "Hall of Fame"
                },
                {
                    name: "hall_of_fame_url",
                    label: "Hall of Fame URL",
                    type: "url",
                    placeholder: "https://example.com"
                }
            ]
        },
        {
            id: "testimonial",
            label: "Testimonials",
            icon: "⭐",
            description: "Student and alumni testimonials",
            fields: [
                {
                    name: "testimonial_title",
                    label: "Title",
                    type: "text",
                    placeholder: "Testimonials"
                },
                {
                    name: "testimonial_subtitle",
                    label: "Subtitle",
                    type: "text",
                    placeholder: "What Our Students Say"
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
                    label: "Title",
                    type: "text",
                    placeholder: "What's Happening"
                },
                {
                    name: "happening_subtitle",
                    label: "Subtitle",
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
        post(route("school.section.update", school.id), {
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
                if (field.type === 'file') {
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

            case 'url':
                return (
                    <div className="mb-3" key={field.name}>
                        <label className="form-label">{field.label}</label>
                        <input
                            type="url"
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
                        
                        {/* Show current file if exists in school data */}
                        {school[field.name] && typeof school[field.name] === 'string' && (
                            <div className="form-text text-success">
                                Current file: {school[field.name]}
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
                    Manage School Sections —{" "}
                    <span className="text-primary">{school.name}</span>
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
                        <p className="text-muted mb-3">Choose sections to add to your school:</p>
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
                                    {/* Always show remove button, even for the last section */}
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
                                            (field.type === 'file' || field.type === 'textarea') ? (
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
                                        Save School Sections
                                    </>
                                )}
                            </button>
                            <span className="text-muted ms-3">
                                <i className="bx bx-layer me-1"></i>
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
                        <div className="display-1 text-muted mb-3">🏫</div>
                        <h5 className="text-muted">No sections active</h5>
                        <p className="text-muted mb-4">
                            Add sections above to build your school content, or save to clear all sections.
                        </p>
                    </div>
                )}
            </form>
        </>
    );
};

export default CreateOrUpdateSections;