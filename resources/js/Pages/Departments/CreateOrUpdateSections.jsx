import { useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";

const Section = ({ department }) => {
    const [activeSections, setActiveSections] = useState([]);
    const [labImagePreviews, setLabImagePreviews] = useState([]);
    const appUrl = usePage().props.appUrl;
    const editorRef = useRef(null);

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
        hod_title: department.hod_title || "",
        hod_name: department.hod_name || "",
        hod_designation: department.hod_designation || "",
        hod_messages: department.hod_messages || [""],
        hod_messages_list: department.hod_messages_list || [""],
        hod_image: null,

        // Courses
        courses_title: department.courses_title || "",
        courses_subtitle: department.courses_subtitle || "",
        courses_image: null,

        // Faculty
        faculty_title: department.faculty_title || "",
        faculty_subtitle: department.faculty_subtitle || "",

        // Laboratories
        lab_title: department.lab_title || "",
        lab_subtitle: department.lab_subtitle || "",
        lab_description: department.lab_description || "",
        lab_url: department.lab_url || "",

        // Happening
        happening_title: department.happening_title || "",
        happening_subtitle: department.happening_subtitle || "",

        // Laboratory Page Data
        name_of_laboratory: department.name_of_laboratory || [""],
        name_of_equipment: department.name_of_equipment || [""],
        lab_images: null,

        // Placement Section
        placement_title: department.placement_title || "",
        placement_subtitle: department.placement_subtitle || "",
        hall_of_fame_image: null,
        hall_of_fame_heading: department.hall_of_fame_heading || "",
        hall_of_fame_url: department.hall_of_fame_url || "",

        // Research (stored in Department pages)
        research_title: department.research_title || "",
        research_content: department.research_content || "",

        // Program Count Section
        department_title: department.department_title || "",
        department_desc: department.department_desc || "",
        department_programs_count: department.department_programs_count || "",
        department_programs_text: department.department_programs_text || "",
        department_buttons: department.department_buttons || "",
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
                    name: "mission_points",
                    label: "Paragraph",
                    type: "array",
                    placeholder: "Add paragraph"
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
                    name: "hod_title",
                    label: "HOD Title",
                    type: "text",
                    placeholder: "HOD Message"
                },
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
                    name: "hod_messages_list",
                    label: "HOD Messages List",
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
                    name: "courses_subtitle",
                    label: "Courses SubTitle",
                    type: "text",
                    placeholder: "Courses"
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
                },
                {
                    name: "lab_description",
                    label: "Laboratory Description",
                    type: "text",
                    placeholder: "Our Laboratories is Wide"
                },
                {
                    name: "lab_url",
                    label: "Laboratory Url",
                    type: "text",
                    placeholder: "/chemistry-lab"
                },
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
        },
        {
            id: "lab-page",
            label: "Laboratories Page Data",
            icon: "🔬",
            description: "Laboratory Listing Page and information",
            fields: [
                {
                    name: "name_of_laboratory",
                    label: "Name of Laboratory",
                    type: "array",
                    placeholder: "Enter laboratory name"
                },
                {
                    name: "name_of_equipment",
                    label: "Name of Equipment",
                    type: "array",
                    placeholder: "Enter equipment name"
                },
                {
                    name: "lab_images",
                    label: "Laboratory Images",
                    type: "file-array",
                    accept: "image/*",
                    multiple: true,
                    description: "Upload multiple images for the laboratory"
                }
            ]
        },
        {
            id: "research",
            label: "Research",
            icon: "🧪",
            description: "Department research content (rich text)",
            fields: [
                {
                    name: "research_title",
                    label: "Page Title",
                    type: "text",
                    placeholder: "Research",
                },
                {
                    name: "research_content",
                    label: "Content",
                    type: "tinymce",
                    placeholder: "Write research content here...",
                },
            ],
        },
        {
            id: "programcount",
            label: "Programs Count",
            icon: "📊",
            description: "Number of programs, academic year info, and CTA",
            fields: [
                {
                    name: "department_title",
                    label: "Title",
                    type: "text",
                    placeholder: "Our Programs"
                },
                {
                    name: "department_desc",
                    label: "Description",
                    type: "textarea",
                    placeholder: "Department programs description",
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
                    name: "department_buttons",
                    label: "Academic Year Desc",
                    type: "text",
                    placeholder: "e.g., Academic Year 2024-25"
                },
            ],
        },
    ];

    // Initialize active sections based on existing data
    useEffect(() => {
        const initiallyActive = [];
        sectionConfig.forEach(section => {
            const hasData = section.fields.some(field => {
                const value = data[field.name];
                if (Array.isArray(value)) return value.some(item => item && item !== "");
                if (value === null || value === undefined) return false;
                if (typeof value === 'string') return value !== "";
                return false;
            });

            if (hasData) {
                initiallyActive.push(section.id);
            }
        });
        setActiveSections(initiallyActive);
    }, []);

    // Cleanup preview URLs
    useEffect(() => {
        return () => {
            labImagePreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [labImagePreviews]);

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
                } else if (field.type === 'file' || field.type === 'file-array') {
                    setData(field.name, null);
                    if (field.name === 'lab_images') {
                        setLabImagePreviews([]);
                    }
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

    const handleFileArrayChange = (fieldName, files) => {
        // Convert FileList to array
        const fileArray = Array.from(files);
        setData(fieldName, fileArray);

        // Create preview URLs
        const previews = fileArray.map(file => URL.createObjectURL(file));
        setLabImagePreviews(previews);
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

            case 'html':
                return (
                    <div className="mb-3" key={field.name}>
                        <label className="form-label">{field.label}</label>
                        <textarea
                            className={`form-control ${fieldError ? 'is-invalid' : ''}`}
                            rows={field.rows || 15}
                            placeholder={field.placeholder}
                            value={value || ''}
                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                            disabled={processing}
                            style={{ fontFamily: 'monospace', whiteSpace: 'pre', backgroundColor: '#1e1e1e', color: '#d4d4d4', padding: '15px' }}
                        />
                        {fieldError && <div className="invalid-feedback">{fieldError}</div>}
                        <small className="text-muted mt-1 d-block">This editor accepts raw HTML data.</small>
                    </div>
                );

            case 'tinymce':
                return (
                    <div className="mb-3" key={field.name}>
                        <label className="form-label">{field.label}</label>
                        <div className={fieldError ? 'border border-danger rounded' : ''}>


                            <Editor
                                apiKey="037f6whjbulv6s1zd8oooaxi7te3pdw2va7xjfl1e4slpmoi"
                                onInit={(evt, editor) => (editorRef.current = editor)}
                                value={value}
                                init={{
                                    height: 400,
                                    menubar: true,

                                    plugins: [
                                        "code", "advlist autolink lists link image charmap preview anchor",
                                        "searchreplace visualblocks code fullscreen",
                                        "insertdatetime media table help wordcount",
                                        "codesample", // optional
                                    ],

                                    toolbar:
                                        "undo redo | blocks | bold italic underline | " +
                                        "alignleft aligncenter alignright | bullist numlist | " +
                                        "link image | code preview fullscreen",

                                    menubar: "file edit view insert format tools table help",

                                    // 🔥 Important settings
                                    valid_elements: "*[*]", // allow all HTML
                                    extended_valid_elements: "*[*]",

                                    // optional but useful
                                    forced_root_block: false,

                                    content_style:
                                        "body { font-family:Arial,Helvetica,sans-serif; font-size:14px }",
                                }}
                                onEditorChange={(content) =>
                                    handleFieldChange(field.name, content)
                                }
                            />
                        </div>
                        {fieldError && <div className="text-danger small mt-1">{fieldError}</div>}
                    </div>
                );

            case 'array':
                return (
                    <div className="mb-3" key={field.name}>
                        <label className="form-label">{field.label}</label>
                        {value && value.map((item, index) => (
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
                            <div className="mt-2">
                                <label className="form-label text-muted small">Current Image</label>
                                <div>
                                    <img
                                        src={`${appUrl}/${department[field.name]}`}
                                        alt="Current"
                                        style={{
                                            width: "100px",
                                            height: "60px",
                                            objectFit: "cover",
                                            borderRadius: "4px",
                                            border: "1px solid #ddd"
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'file-array':
                return (
                    <div className="mb-3" key={field.name}>
                        <label className="form-label">{field.label}</label>
                        {field.description && (
                            <small className="text-muted d-block mb-2">{field.description}</small>
                        )}
                        <input
                            type="file"
                            className={`form-control ${fieldError ? 'is-invalid' : ''}`}
                            onChange={(e) => handleFileArrayChange(field.name, e.target.files)}
                            accept={field.accept}
                            multiple={field.multiple}
                            disabled={processing}
                        />
                        {fieldError && <div className="invalid-feedback">{fieldError}</div>}

                        {/* Show preview of selected files */}
                        {labImagePreviews.length > 0 && (
                            <div className="mt-3">
                                <label className="form-label small">Selected Images Preview:</label>
                                <div className="d-flex flex-wrap gap-3">
                                    {labImagePreviews.map((preview, index) => (
                                        <div key={index} className="position-relative">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                style={{
                                                    width: "100px",
                                                    height: "80px",
                                                    objectFit: "cover",
                                                    borderRadius: "4px",
                                                    border: "1px solid #ddd"
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Show existing images if available */}
                        {department[field.name] && Array.isArray(department[field.name]) && department[field.name].length > 0 && (
                            <div className="mt-3">
                                <label className="form-label small">Existing Images:</label>
                                <div className="d-flex flex-wrap gap-3">
                                    {department[field.name].map((image, index) => (
                                        <div key={index}>
                                            <img
                                                src={`${appUrl}/${image}`}
                                                alt={`Existing ${index + 1}`}
                                                style={{
                                                    width: "100px",
                                                    height: "80px",
                                                    objectFit: "cover",
                                                    borderRadius: "4px",
                                                    border: "1px solid #ddd"
                                                }}
                                            />
                                        </div>
                                    ))}
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
                                            (field.type === 'array' || field.type === 'file' || field.type === 'file-array' || field.type === 'textarea' || field.type === 'tinymce' || field.type === 'html') ? (
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
