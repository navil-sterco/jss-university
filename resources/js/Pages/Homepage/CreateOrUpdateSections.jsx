import { useForm, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';

const CreateOrUpdateHomepageSections = ({ homepage }) => {
    const [activeSections, setActiveSections] = useState([]);

    // Initialize form data with proper JSON parsing
    const { data, setData, post, progress, processing, errors } = useForm({
        // About Section
        about_title: homepage.about_title || "",
        about_subtitle: homepage.about_subtitle || "",
        about_description: homepage.about_description || "",
        about_url: homepage.about_url || "",
        about_chancellor_img: null,
        about_chancellor_message: homepage.about_chancellor_message || "",
        highlights: Array.isArray(homepage.highlights) ? homepage.highlights : [],
        buttons: Array.isArray(homepage.buttons) ? homepage.buttons : [],
        logo_content: Array.isArray(homepage.logo_content) ? homepage.logo_content : [],

        // Facilities Section
        facilities_heading: homepage.facilities_heading || "",
        facilities_subheading: homepage.facilities_subheading || "",
        facilities: Array.isArray(homepage.facilities) ? homepage.facilities : [],

        // Department Section
        department_title: homepage.department_title || "",
        department_desc: homepage.department_desc || "",
        department_programs_count: homepage.department_programs_count || "",
        department_programs_text: homepage.department_programs_text || "",
        department_button_1_text: homepage.department_button_1_text || "",
        department_button_1_url: homepage.department_button_1_url || "",
        department_academic_year: homepage.department_academic_year || "",
        department_academic_year_desc: homepage.department_academic_year_desc || "",

        // Placement Section
        placement_title: homepage.placement_title || "",
        placement_subtitle: homepage.placement_subtitle || "",
        hall_of_fame_image: null,
        hall_of_fame_heading: homepage.hall_of_fame_heading || "",
        hall_of_fame_url: homepage.hall_of_fame_url || "",

        // Testimonial Section
        testimonial_title: homepage.testimonial_title || "",
        testimonial_subtitle: homepage.testimonial_subtitle || "",

        // Happening Section
        happening_title: homepage.happening_title || "",
        happening_subtitle: homepage.happening_subtitle || "",
    });

    // Section configuration
    const sectionConfig = [
        {
            id: "about",
            label: "About Section",
            icon: "🏫",
            description: "About overview, highlights, and statistics",
            fields: [
                {
                    name: "about_title",
                    label: "Title",
                    type: "text",
                    placeholder: "About Title"
                },
                {
                    name: "about_subtitle",
                    label: "Subtitle",
                    type: "text",
                    placeholder: "About Subtitle"
                },
                {
                    name: "about_description",
                    label: "Description",
                    type: "textarea",
                    placeholder: "About description",
                    rows: 4
                },
                {
                    name: "about_url",
                    label: "About URL",
                    type: "url",
                    placeholder: "https://example.com/about"
                },
                {
                    name: "about_chancellor_img",
                    label: "Chancellor Image",
                    type: "file",
                    accept: "image/*"
                },
                {
                    name: "about_chancellor_message",
                    label: "Chancellor Message",
                    type: "textarea",
                    placeholder: "Chancellor's message",
                    rows: 3
                }
            ],
            dynamicFields: [
                {
                    name: "highlights",
                    label: "Highlights",
                    fields: [
                        { name: "rank", label: "Rank", type: "text", placeholder: "e.g., #1" },
                        { name: "text", label: "Text", type: "text", placeholder: "e.g., Best Engineering College" },
                        { name: "source", label: "Source", type: "text", placeholder: "e.g., Times Ranking 2024" }
                    ]
                },
                {
                    name: "buttons",
                    label: "Buttons",
                    fields: [
                        { name: "text", label: "Button Text", type: "text", placeholder: "e.g., Learn More" },
                        { name: "url", label: "Button URL", type: "url", placeholder: "https://example.com" }
                    ]
                },
                {
                    name: "logo_content",
                    label: "Logo Content",
                    fields: [
                        { name: "image", label: "Logo Image", type: "file", accept: "image/*" },
                        { name: "description", label: "Logo Description", type: "textarea", placeholder: "Logo description", rows: 2 }
                    ]
                }
            ]
        },
        {
            id: "facilities",
            label: "Facilities",
            icon: "🏛️",
            description: "Campus facilities and amenities",
            fields: [
                {
                    name: "facilities_heading",
                    label: "Heading",
                    type: "text",
                    placeholder: "Facilities Heading"
                },
                {
                    name: "facilities_subheading",
                    label: "Subheading",
                    type: "text",
                    placeholder: "Facilities Subheading"
                }
            ],
            dynamicFields: [
                {
                    name: "facilities",
                    label: "Facilities",
                    fields: [
                        { name: "title", label: "Facility Title", type: "text", placeholder: "e.g., Library" },
                        { name: "description", label: "Facility Description", type: "textarea", placeholder: "Facility description", rows: 3 },
                        { name: "main_link", label: "Main Link", type: "url", placeholder: "https://example.com/facility" },
                        { name: "image", label: "Facility Image", type: "file", accept: "image/*" }
                    ],
                    nestedDynamicFields: [
                        {
                            name: "links",
                            label: "Facility Links",
                            fields: [
                                { name: "text", label: "Link Text", type: "text", placeholder: "e.g., Virtual Tour" },
                                { name: "url", label: "Link URL", type: "url", placeholder: "https://example.com/tour" }
                            ]
                        }
                    ]
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
                    rows: 3
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
                    name: "department_academic_year",
                    label: "Academic Year",
                    type: "text",
                    placeholder: "e.g., 2024-2025"
                },
                {
                    name: "department_academic_year_desc",
                    label: "Academic Year Description",
                    type: "text",
                    placeholder: "e.g., Current Academic Year"
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
        
        // Create FormData to handle file uploads properly
        const formData = new FormData();
        
        // Append all regular fields
        Object.keys(data).forEach(key => {
            if (key === 'about_chancellor_img' || key === 'hall_of_fame_image') {
                // Handle main file fields
                if (data[key] instanceof File) {
                    formData.append(key, data[key]);
                }
            } else if (key === 'facilities' || key === 'logo_content' || key === 'highlights' || key === 'buttons') {
                // Skip these for now, we'll handle them separately
                return;
            } else if (data[key] !== null && data[key] !== undefined) {
                // Append other fields
                formData.append(key, data[key]);
            }
        });

        // Append facilities with proper structure
        if (data.facilities && Array.isArray(data.facilities)) {
            data.facilities.forEach((facility, facilityIndex) => {
                // Append facility basic fields
                formData.append(`facilities[${facilityIndex}][title]`, facility.title || '');
                formData.append(`facilities[${facilityIndex}][description]`, facility.description || '');
                formData.append(`facilities[${facilityIndex}][main_link]`, facility.main_link || '');
                
                // Handle facility image
                if (facility.image instanceof File) {
                    formData.append(`facilities[${facilityIndex}][image]`, facility.image);
                }

                // Append facility links
                if (facility.links && Array.isArray(facility.links)) {
                    facility.links.forEach((link, linkIndex) => {
                        formData.append(`facilities[${facilityIndex}][links][${linkIndex}][text]`, link.text || '');
                        formData.append(`facilities[${facilityIndex}][links][${linkIndex}][url]`, link.url || '');
                    });
                }
            });
        }

        // Append logo content
        if (data.logo_content && Array.isArray(data.logo_content)) {
            data.logo_content.forEach((logo, logoIndex) => {
                formData.append(`logo_content[${logoIndex}][description]`, logo.description || '');
                
                // Handle logo image
                if (logo.image instanceof File) {
                    formData.append(`logo_content[${logoIndex}][image]`, logo.image);
                }
            });
        }

        // Append highlights and buttons as JSON
        formData.append('highlights', JSON.stringify(data.highlights || []));
        formData.append('buttons', JSON.stringify(data.buttons || []));

        console.log('Submitting form data...');
        console.log('Facilities data:', data.facilities);

        post(route("home.section.update"), {
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
                if (field.type === 'file') {
                    setData(field.name, null);
                } else {
                    setData(field.name, "");
                }
            });
            
            // Reset dynamic fields
            if (section.dynamicFields) {
                section.dynamicFields.forEach(dynamicField => {
                    setData(dynamicField.name, []);
                });
            }
        }
    };

    // Field handlers
    const handleFieldChange = (fieldName, value) => {
        setData(fieldName, value);
    };

    // Dynamic field handlers
    const addDynamicField = (fieldName, template = {}) => {
        const currentFields = data[fieldName] || [];
        setData(fieldName, [...currentFields, template]);
    };

    const removeDynamicField = (fieldName, index) => {
        const currentFields = data[fieldName] || [];
        const updatedFields = currentFields.filter((_, i) => i !== index);
        setData(fieldName, updatedFields);
    };

    const updateDynamicField = (fieldName, index, fieldKey, value) => {
        const currentFields = data[fieldName] || [];
        const updatedFields = [...currentFields];
        updatedFields[index] = {
            ...updatedFields[index],
            [fieldKey]: value
        };
        setData(fieldName, updatedFields);
    };

    // Nested dynamic field handlers for facilities
    const addNestedDynamicField = (parentFieldName, parentIndex, nestedFieldName, template = {}) => {
        const currentFields = data[parentFieldName] || [];
        const updatedFields = [...currentFields];
        
        if (!updatedFields[parentIndex][nestedFieldName]) {
            updatedFields[parentIndex][nestedFieldName] = [];
        }
        
        updatedFields[parentIndex][nestedFieldName] = [
            ...updatedFields[parentIndex][nestedFieldName],
            template
        ];
        
        setData(parentFieldName, updatedFields);
    };

    const removeNestedDynamicField = (parentFieldName, parentIndex, nestedFieldName, nestedIndex) => {
        const currentFields = data[parentFieldName] || [];
        const updatedFields = [...currentFields];
        
        if (updatedFields[parentIndex][nestedFieldName]) {
            updatedFields[parentIndex][nestedFieldName] = updatedFields[parentIndex][nestedFieldName].filter((_, i) => i !== nestedIndex);
        }
        
        setData(parentFieldName, updatedFields);
    };

    const updateNestedDynamicField = (parentFieldName, parentIndex, nestedFieldName, nestedIndex, fieldKey, value) => {
        const currentFields = data[parentFieldName] || [];
        const updatedFields = [...currentFields];
        
        if (updatedFields[parentIndex][nestedFieldName]) {
            updatedFields[parentIndex][nestedFieldName][nestedIndex] = {
                ...updatedFields[parentIndex][nestedFieldName][nestedIndex],
                [fieldKey]: value
            };
        }
        
        setData(parentFieldName, updatedFields);
    };

    // Handle file input for dynamic fields
    const handleDynamicFileChange = (fieldName, index, fileKey, file) => {
        const currentFields = data[fieldName] || [];
        const updatedFields = [...currentFields];
        updatedFields[index] = {
            ...updatedFields[index],
            [fileKey]: file
        };
        setData(fieldName, updatedFields);
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
                        
                        {/* Show current file if exists in homepage data */}
                        {homepage[field.name] && typeof homepage[field.name] === 'string' && (
                            <div className="form-text text-success">
                                Current file: {homepage[field.name]}
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    // Render dynamic fields
    const renderDynamicFields = (dynamicFieldConfig) => {
        const fieldName = dynamicFieldConfig.name;
        const fields = data[fieldName] || [];
        const fieldError = errors[fieldName];

        return (
            <div className="mb-4" key={fieldName}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">{dynamicFieldConfig.label}</h6>
                    <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => addDynamicField(fieldName, dynamicFieldConfig.fields.reduce((acc, field) => {
                            acc[field.name] = field.type === 'file' ? null : '';
                            if (dynamicFieldConfig.nestedDynamicFields) {
                                dynamicFieldConfig.nestedDynamicFields.forEach(nested => {
                                    acc[nested.name] = [];
                                });
                            }
                            return acc;
                        }, {}))}
                        disabled={processing}
                    >
                        <i className="bx bx-plus"></i>
                        Add {dynamicFieldConfig.label}
                    </button>
                </div>

                {fieldError && <div className="alert alert-danger">{fieldError}</div>}

                {fields.length === 0 ? (
                    <div className="text-center py-3 border rounded bg-light">
                        <p className="text-muted mb-0">No {dynamicFieldConfig.label.toLowerCase()} added yet.</p>
                    </div>
                ) : (
                    <div className="dynamic-fields-container">
                        {fields.map((fieldData, index) => (
                            <div key={index} className="card mb-4 border-primary">
                                <div className="card-header d-flex justify-content-between align-items-center" style={{background:"#F8F8FE"}}>
                                    <span>{dynamicFieldConfig.label} #{index + 1}</span>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => removeDynamicField(fieldName, index)}
                                        disabled={processing}
                                    >
                                        <i className="bx bx-x"></i>
                                    </button>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        {dynamicFieldConfig.fields.map(subField => (
                                            <div className={subField.type === 'textarea' ? 'col-12' : 'col-md-6'} key={subField.name}>
                                                <div className="mb-3">
                                                    <label className="form-label">{subField.label}</label>
                                                    {subField.type === 'url' ? (
                                                        <input
                                                            type="url"
                                                            className="form-control"
                                                            placeholder={subField.placeholder}
                                                            value={fieldData[subField.name] || ''}
                                                            onChange={(e) => updateDynamicField(fieldName, index, subField.name, e.target.value)}
                                                            disabled={processing}
                                                        />
                                                    ) : subField.type === 'textarea' ? (
                                                        <textarea
                                                            className="form-control"
                                                            rows={subField.rows || 3}
                                                            placeholder={subField.placeholder}
                                                            value={fieldData[subField.name] || ''}
                                                            onChange={(e) => updateDynamicField(fieldName, index, subField.name, e.target.value)}
                                                            disabled={processing}
                                                        />
                                                    ) : subField.type === 'file' ? (
                                                        <input
                                                            type="file"
                                                            className="form-control"
                                                            onChange={(e) => handleDynamicFileChange(fieldName, index, subField.name, e.target.files[0])}
                                                            accept={subField.accept}
                                                            disabled={processing}
                                                        />
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder={subField.placeholder}
                                                            value={fieldData[subField.name] || ''}
                                                            onChange={(e) => updateDynamicField(fieldName, index, subField.name, e.target.value)}
                                                            disabled={processing}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Render nested dynamic fields for facilities */}
                                    {dynamicFieldConfig.nestedDynamicFields && dynamicFieldConfig.nestedDynamicFields.map(nestedField => (
                                        <div key={nestedField.name} className="mt-4 pt-3 border-top">
                                            {renderNestedDynamicFields(fieldName, index, nestedField)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Render nested dynamic fields (for facility links)
    const renderNestedDynamicFields = (parentFieldName, parentIndex, nestedFieldConfig) => {
        const parentFields = data[parentFieldName] || [];
        const nestedFields = parentFields[parentIndex]?.[nestedFieldConfig.name] || [];

        return (
            <div className="nested-dynamic-fields">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0 text-muted">{nestedFieldConfig.label}</h6>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => addNestedDynamicField(parentFieldName, parentIndex, nestedFieldConfig.name, nestedFieldConfig.fields.reduce((acc, field) => {
                            acc[field.name] = '';
                            return acc;
                        }, {}))}
                        disabled={processing}
                    >
                        <i className="bx bx-plus"></i>
                        Add {nestedFieldConfig.label}
                    </button>
                </div>

                {nestedFields.length === 0 ? (
                    <div className="text-center py-2 border rounded bg-light">
                        <p className="text-muted mb-0 small">No {nestedFieldConfig.label.toLowerCase()} added yet.</p>
                    </div>
                ) : (
                    <div className="nested-fields-container">
                        {nestedFields.map((nestedFieldData, nestedIndex) => (
                            <div key={nestedIndex} className="card mb-2">
                                <div className="card-header bg-light d-flex justify-content-between align-items-center py-2">
                                    <span className="small">{nestedFieldConfig.label} #{nestedIndex + 1}</span>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => removeNestedDynamicField(parentFieldName, parentIndex, nestedFieldConfig.name, nestedIndex)}
                                        disabled={processing}
                                    >
                                        <i className="bx bx-x"></i>
                                    </button>
                                </div>
                                <div className="card-body py-2">
                                    <div className="row">
                                        {nestedFieldConfig.fields.map(subField => (
                                            <div className="col-md-6" key={subField.name}>
                                                <div className="mb-2">
                                                    <label className="form-label small">{subField.label}</label>
                                                    {subField.type === 'url' ? (
                                                        <input
                                                            type="url"
                                                            className="form-control form-control-sm"
                                                            placeholder={subField.placeholder}
                                                            value={nestedFieldData[subField.name] || ''}
                                                            onChange={(e) => updateNestedDynamicField(parentFieldName, parentIndex, nestedFieldConfig.name, nestedIndex, subField.name, e.target.value)}
                                                            disabled={processing}
                                                        />
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm"
                                                            placeholder={subField.placeholder}
                                                            value={nestedFieldData[subField.name] || ''}
                                                            onChange={(e) => updateNestedDynamicField(parentFieldName, parentIndex, nestedFieldConfig.name, nestedIndex, subField.name, e.target.value)}
                                                            disabled={processing}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
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
                    Manage Homepage Sections —{" "}
                    <span className="text-primary">{homepage.name}</span>
                </h4>
            </div>

            {/* Add Section Panel */}
            {availableSections.length > 0 && (
                <div className="card mb-4">
                    <div className="card-header bg-light">
                        <h5 className="card-title mb-0">
                            <i className="bx bx-plus bx-sm"></i>
                            Add New Section
                        </h5>
                    </div>
                    <div className="card-body">
                        <p className="text-muted mb-3">Choose sections to add to your homepage:</p>
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
                                                <i className="bx bx-plus"></i>
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
                                        <i className="bx bx-x"></i>
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

                                    {/* Render dynamic fields */}
                                    {section.dynamicFields && section.dynamicFields.map(dynamicField => 
                                        <div className="col-12" key={dynamicField.name}>
                                            {renderDynamicFields(dynamicField)}
                                        </div>
                                    )}
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
                                        <i className="bx bx-save bx-sm me-1"></i>
                                        Save Homepage Sections
                                    </>
                                )}
                            </button>
                            <span className="text-muted ms-3">
                                <i className="bx bx-layer bx-sm me-1"></i>
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
                        <div className="display-1 text-muted mb-3">🏠</div>
                        <h5 className="text-muted">No sections active</h5>
                        <p className="text-muted mb-4">
                            Add sections above to build your homepage content, or save to clear all sections.
                        </p>
                    </div>
                )}
            </form>
        </>
    );
};

export default CreateOrUpdateHomepageSections;