import { router, useForm, usePage } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Editor } from "@tinymce/tinymce-react";

const CreateOrUpdateSections = ({ course }) => {
    const [activeSections, setActiveSections] = useState([]);
    const appUrl = usePage().props.appUrl;
    const editorRef = useRef(null);

    // Helper function to safely parse JSON or return default
    const safeParse = (
        value,
        defaultValue = [{ title: "", description: "" }],
    ) => {
        if (!value) return defaultValue;
        if (Array.isArray(value)) return value;
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) && parsed.length > 0
                ? parsed
                : defaultValue;
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
        eligibility_criteria_notices: safeParseSimpleArray(
            course.eligibility_criteria_notices,
        ),

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
        fee_structure_short_description:
            course.fee_structure_short_description || "",
        course_total_fees: course.course_total_fees || "",
        fee_structure_pdf: null,
        fee_structure_image: null,

        // Career Opportunities
        career_title: course.career_title || "",
        career_subtitle: course.career_subtitle || "",
        career_desc: course.career_desc || "",
        career_image: null,

        remove_overview_image: false,
        remove_curriculum_image: false,
        remove_curriculum_pdf: false,
        remove_fee_structure_image: false,
        remove_fee_structure_pdf: false,
        remove_career_image: false,

        // Description (stored in description pages)
        description_title: course.description_title || "",
        description_content: course.description_content || "",

        // Tab Section
        tab_section_info: safeParse(course.tab_section_info, [{ title: "", subtitle: "", image: null }]),
        tab_section_tabs: safeParse(course.tab_section_tabs, [{ name: "", data: "" }]),
    };

    const [submitting, setSubmitting] = useState(false);

    const { data, setData, processing, errors } = useForm(initialData);
    const busy = processing || submitting;

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
                    placeholder: "Title",
                },
                {
                    name: "overview_desc",
                    label: "Description",
                    type: "textarea",
                    placeholder: "Desc",
                },
                {
                    name: "overview_image",
                    label: "Overview Image",
                    type: "file",
                    accept: "image/*",
                },
            ],
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
                    placeholder: "Enter eligibility criteria",
                },
                {
                    name: "eligibility_criteria_desc",
                    label: "Description",
                    type: "textarea",
                    placeholder: "Detailed description of eligibility",
                },
                {
                    name: "eligibility_criteria_notices",
                    label: "Important Notices",
                    type: "simple-array",
                    placeholder: "Add important notice",
                },
            ],
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
                        {
                            name: "title",
                            label: "Title",
                            placeholder: "Enter PEO title",
                        },
                        {
                            name: "description",
                            label: "Description",
                            placeholder: "Enter PEO description",
                        },
                    ],
                },
                {
                    name: "pos",
                    label: "Program Outcomes (POs)",
                    type: "object-array",
                    fields: [
                        {
                            name: "title",
                            label: "Title",
                            placeholder: "Enter PO title",
                        },
                        {
                            name: "description",
                            label: "Description",
                            placeholder: "Enter PO description",
                        },
                    ],
                },
                {
                    name: "pso",
                    label: "Program Specific Outcomes (PSOs)",
                    type: "object-array",
                    fields: [
                        {
                            name: "title",
                            label: "Title",
                            placeholder: "Enter PSO title",
                        },
                        {
                            name: "description",
                            label: "Description",
                            placeholder: "Enter PSO description",
                        },
                    ],
                },
            ],
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
                    placeholder: "Enter curriculum title",
                },
                {
                    name: "curriculum_desc",
                    label: "Curriculum Description",
                    type: "simple-array",
                    placeholder: "Add curriculum point",
                },
                {
                    name: "curriculum_image",
                    label: "Curriculum Image",
                    type: "file",
                    accept: "image/*",
                },
                {
                    name: "curriculum_pdf",
                    label: "Curriculum PDF",
                    type: "file",
                    accept: ".pdf",
                },
            ],
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
                    placeholder: "Enter fee structure title",
                },
                {
                    name: "fee_structure_short_description",
                    label: "Short Description",
                    type: "text",
                    placeholder: "Brief description of fee structure",
                },
                {
                    name: "course_total_fees",
                    label: "Total Course Fees",
                    type: "text",
                    placeholder: "Enter total fees amount",
                },
                {
                    name: "fee_structure_image",
                    label: "Fee Structure Image",
                    type: "file",
                    accept: "image/*",
                },
                {
                    name: "fee_structure_pdf",
                    label: "Fee Structure PDF",
                    type: "file",
                    accept: ".pdf",
                },
            ],
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
                    accept: "image/*",
                },
            ],
        },
        {
            id: "description",
            label: "Description",
            icon: "🎯",
            description: "Description content (rich text)",
            fields: [
                {
                    name: "description_title",
                    label: "Page Title",
                    type: "text",
                    placeholder: "Description",
                },
                {
                    name: "description_content",
                    label: "Content",
                    type: "tinymce",
                    placeholder: "Write description content here...",
                },
            ],
        },
        {
            id: "tab_section",
            label: "Tab Section",
            icon: "🗂️",
            description: "Information blocks and tabs",
            fields: [
                {
                    name: "tab_section_info",
                    label: "Info Blocks",
                    type: "object-array",
                    fields: [
                        {
                            name: "title",
                            label: "Title",
                            type: "text",
                            placeholder: "Enter title",
                        },
                        {
                            name: "subtitle",
                            label: "Subtitle",
                            type: "text",
                            placeholder: "Enter subtitle",
                        },
                        {
                            name: "image",
                            label: "Image",
                            type: "file",
                            accept: "image/*",
                        },
                    ],
                },
                {
                    name: "tab_section_tabs",
                    label: "Tabs",
                    type: "object-array",
                    fields: [
                        {
                            name: "name",
                            label: "Tab Name",
                            type: "text",
                            placeholder: "Enter tab name",
                        },
                        {
                            name: "data",
                            label: "Tab Data",
                            type: "textarea",
                            placeholder: "Enter tab content",
                        },
                    ],
                },
            ],
        },
    ];

    // Initialize active sections based on existing data
    useEffect(() => {
        const initiallyActive = [];
        sectionConfig.forEach((section) => {
            const hasData = section.fields.some((field) => {
                const value = data[field.name];
                if (field.type === "object-array") {
                    return (
                        Array.isArray(value) &&
                        value.some(
                            (item) => item && (item.title || item.description),
                        )
                    );
                }
                if (field.type === "simple-array") {
                    return (
                        Array.isArray(value) &&
                        value.some((item) => item && item !== "")
                    );
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

        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            const value = data[key];

            if (["peos", "pos", "pso", "tab_section_info", "tab_section_tabs"].includes(key)) {
                const filtered = value.filter((item, index) => {
                    if (!item) return false;
                    if (key === "tab_section_info") {
                        const hasData =
                            item.title || item.subtitle || item.image;
                        if (hasData && item.image instanceof File) {
                            formData.append(
                                `${key}_${index}_image`,
                                item.image,
                            );
                        }
                        return hasData;
                    }
                    if (key === "tab_section_tabs")
                        return item.name || item.data;
                    return item.title || item.description;
                });
                if (filtered.length > 0) {
                    formData.append(key, JSON.stringify(filtered));
                }
            } else if (
                ["eligibility_criteria_notices", "curriculum_desc"].includes(
                    key,
                )
            ) {
                if (Array.isArray(value) && value.length > 0) {
                    const filtered = value.filter(
                        (item) => item && item !== "",
                    );
                    if (filtered.length > 0) {
                        formData.append(key, JSON.stringify(filtered));
                    }
                }
            } else if (value instanceof File) {
                if (value) {
                    formData.append(key, value);
                }
            } else if (typeof value === "boolean") {
                formData.append(key, value ? "1" : "0");
            } else if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });

        setSubmitting(true);
        router.post(route("course.section.update", course.id), formData, {
            preserveScroll: true,
            onFinish: () => setSubmitting(false),
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
            setActiveSections((prev) => [...prev, sectionId]);
        }
    };

    const removeSection = (sectionId) => {
        setActiveSections((prev) => prev.filter((id) => id !== sectionId));

        // Reset section data when removed
        const section = sectionConfig.find((s) => s.id === sectionId);
        if (section) {
            section.fields.forEach((field) => {
                if (field.type === "simple-array") {
                    setData(field.name, [""]);
                } else if (field.type === "object-array") {
                    if (field.name === "tab_section_info") {
                        setData(field.name, [{ title: "", subtitle: "", image: null }]);
                    } else if (field.name === "tab_section_tabs") {
                        setData(field.name, [{ name: "", data: "" }]);
                    } else {
                        setData(field.name, [{ title: "", description: "" }]);
                    }
                } else if (field.type === "file") {
                    setData(field.name, null);
                    setData(`remove_${field.name}`, false);
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
            setData(
                fieldName,
                currentArray.filter((_, i) => i !== index),
            );
        } else {
            // If only one item left, just clear it
            setData(fieldName, [""]);
        }
    };

    // Object array handlers for PEOS, POS, PSO
    const handleObjectArrayChange = (fieldName, index, subFieldName, value) => {
        const currentArray = [...(data[fieldName] || [])];
        if (!currentArray[index]) {
            // Determine structure based on fieldName
            if (fieldName === "tab_section_info") {
                currentArray[index] = { title: "", subtitle: "", image: null };
            } else if (fieldName === "tab_section_tabs") {
                currentArray[index] = { name: "", data: "" };
            } else {
                currentArray[index] = { title: "", description: "" };
            }
        }
        currentArray[index] = {
            ...currentArray[index],
            [subFieldName]: value,
        };
        setData(fieldName, currentArray);
    };

    const addObjectArrayItem = (
        fieldName,
        template = { title: "", description: "" },
    ) => {
        const currentArray = [...(data[fieldName] || [])];
        setData(fieldName, [...currentArray, { ...template }]);
    };

    const removeObjectArrayItem = (fieldName, index) => {
        const currentArray = [...(data[fieldName] || [])];
        if (currentArray.length > 1) {
            setData(
                fieldName,
                currentArray.filter((_, i) => i !== index),
            );
        } else {
            // If only one item left, reset to empty object
            if (fieldName === "tab_section_info") {
                setData(fieldName, [{ title: "", subtitle: "", image: null }]);
            } else if (fieldName === "tab_section_tabs") {
                setData(fieldName, [{ name: "", data: "" }]);
            } else {
                setData(fieldName, [{ title: "", description: "" }]);
            }
        }
    };

    // Render field based on type
    const renderField = (field) => {
        const value = data[field.name];
        const fieldError = errors[field.name];

        switch (field.type) {
            case "text":
                return (
                    <div className="mb-3" key={field.name}>
                        <label className="form-label">{field.label}</label>
                        <input
                            type="text"
                            className={`form-control ${fieldError ? "is-invalid" : ""}`}
                            placeholder={field.placeholder}
                            value={value || ""}
                            onChange={(e) =>
                                handleFieldChange(field.name, e.target.value)
                            }
                            disabled={busy}
                        />
                        {fieldError && (
                            <div className="invalid-feedback">{fieldError}</div>
                        )}
                    </div>
                );

            case "textarea":
                return (
                    <div className="mb-3" key={field.name}>
                        <label className="form-label">{field.label}</label>
                        <textarea
                            className={`form-control ${fieldError ? "is-invalid" : ""}`}
                            rows="3"
                            placeholder={field.placeholder}
                            value={value || ""}
                            onChange={(e) =>
                                handleFieldChange(field.name, e.target.value)
                            }
                            disabled={busy}
                        />
                        {fieldError && (
                            <div className="invalid-feedback">{fieldError}</div>
                        )}
                    </div>
                );

            case "tinymce":
                return (
                    <div className="mb-3" key={field.name}>
                        <label className="form-label">{field.label}</label>
                        <div
                            className={
                                fieldError ? "border border-danger rounded" : ""
                            }
                        >
                            <Editor
                                apiKey="037f6whjbulv6s1zd8oooaxi7te3pdw2va7xjfl1e4slpmoi"
                                onInit={(evt, editor) =>
                                    (editorRef.current = editor)
                                }
                                value={value}
                                init={{
                                    height: 400,
                                    menubar: true,

                                    plugins: [
                                        "code",
                                        "advlist autolink lists link image charmap preview anchor",
                                        "searchreplace visualblocks code fullscreen",
                                        "insertdatetime media table help wordcount",
                                        "codesample", // optional
                                    ],

                                    toolbar:
                                        "undo redo | blocks | bold italic underline | " +
                                        "alignleft aligncenter alignright | bullist numlist | " +
                                        "link image | code preview fullscreen",

                                    menubar:
                                        "file edit view insert format tools table help",

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
                        {fieldError && (
                            <div className="text-danger small mt-1">
                                {fieldError}
                            </div>
                        )}
                    </div>
                );

            case "simple-array":
                const simpleArrayValue = Array.isArray(value) ? value : [""];

                return (
                    <div className="mb-3" key={field.name}>
                        <label className="form-label">{field.label}</label>
                        {simpleArrayValue.map((item, index) => (
                            <div key={index} className="d-flex gap-2 mb-2">
                                <input
                                    type="text"
                                    className={`form-control ${fieldError ? "is-invalid" : ""}`}
                                    placeholder={`${field.placeholder} ${index + 1}`}
                                    value={item}
                                    onChange={(e) =>
                                        handleSimpleArrayChange(
                                            field.name,
                                            index,
                                            e.target.value,
                                        )
                                    }
                                    disabled={busy}
                                />
                                {simpleArrayValue.length > 1 && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={() =>
                                            removeSimpleArrayItem(
                                                field.name,
                                                index,
                                            )
                                        }
                                        disabled={busy}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                        {fieldError && (
                            <div className="invalid-feedback d-block">
                                {fieldError}
                            </div>
                        )}
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => addSimpleArrayItem(field.name)}
                            disabled={busy}
                        >
                            + Add {field.label}
                        </button>
                    </div>
                );

            case "object-array":
                const objectArrayValue = Array.isArray(value)
                    ? value
                    : [{ title: "", description: "" }];

                return (
                    <div className="mb-4" key={field.name}>
                        <label className="form-label">{field.label}</label>

                        {objectArrayValue.map((item, index) => (
                            <div key={index} className="card mb-3 border">
                                <div className="card-header bg-light d-flex justify-content-between align-items-center py-2">
                                    <small className="text-muted">
                                        Item {index + 1}
                                    </small>
                                    {objectArrayValue.length > 1 && (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() =>
                                                removeObjectArrayItem(
                                                    field.name,
                                                    index,
                                                )
                                            }
                                            disabled={busy}
                                        >
                                            × Remove
                                        </button>
                                    )}
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        {field.fields.map((subField) => (
                                            <div
                                                className={
                                                    subField.type === "textarea" || subField.name === "description"
                                                        ? "col-12"
                                                        : "col-md-6"
                                                }
                                                key={`${field.name}-${index}-${subField.name}`}
                                            >
                                                <div className="mb-2">
                                                    <label className="form-label small">
                                                        {subField.label}
                                                    </label>
                                                    {subField.type === "textarea" || subField.name === "description" ? (
                                                        <textarea
                                                            className={`form-control ${errors[`${field.name}.${index}.${subField.name}`] ? "is-invalid" : ""}`}
                                                            placeholder={subField.placeholder}
                                                            value={item[subField.name] || ""}
                                                            onChange={(e) =>
                                                                handleObjectArrayChange(
                                                                    field.name,
                                                                    index,
                                                                    subField.name,
                                                                    e.target.value,
                                                                )
                                                            }
                                                            rows="3"
                                                            disabled={busy}
                                                        />
                                                    ) : subField.type === "file" ? (
                                                        <>
                                                            <input
                                                                type="file"
                                                                className={`form-control ${errors[`${field.name}.${index}.${subField.name}`] ? "is-invalid" : ""}`}
                                                                onChange={(e) =>
                                                                    handleObjectArrayChange(
                                                                        field.name,
                                                                        index,
                                                                        subField.name,
                                                                        e.target.files[0],
                                                                    )
                                                                }
                                                                accept={subField.accept}
                                                                disabled={busy}
                                                            />
                                                            {item[subField.name] && (
                                                                <div className="mt-2 d-flex align-items-center gap-2">
                                                                    {typeof item[subField.name] === "string" ? (
                                                                        <img
                                                                            src={`${appUrl}/${item[subField.name]}`}
                                                                            alt="Preview"
                                                                            className="rounded"
                                                                            style={{ width: "50px", height: "40px", objectFit: "cover" }}
                                                                        />
                                                                    ) : (
                                                                        <small className="text-primary italic">New File picked</small>
                                                                    )}
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        onClick={() => handleObjectArrayChange(field.name, index, subField.name, null)}
                                                                        disabled={busy}
                                                                    >
                                                                        <i className="bx bx-trash"></i>
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            className={`form-control ${errors[`${field.name}.${index}.${subField.name}`] ? "is-invalid" : ""}`}
                                                            placeholder={subField.placeholder}
                                                            value={item[subField.name] || ""}
                                                            onChange={(e) =>
                                                                handleObjectArrayChange(
                                                                    field.name,
                                                                    index,
                                                                    subField.name,
                                                                    e.target.value,
                                                                )
                                                            }
                                                            disabled={busy}
                                                        />
                                                    )}
                                                    {errors[`${field.name}.${index}.${subField.name}`] && (
                                                        <div className="invalid-feedback">
                                                            {errors[`${field.name}.${index}.${subField.name}`]}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {fieldError && (
                            <div className="invalid-feedback d-block mb-2">
                                {fieldError}
                            </div>
                        )}

                        <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => {
                                const template = {};
                                field.fields.forEach(f => {
                                    template[f.name] = f.type === 'file' ? null : "";
                                });
                                addObjectArrayItem(field.name, template);
                            }}
                            disabled={busy}
                        >
                            <i className="bx bx-plus me-1"></i>
                            Add New {field.label}
                        </button>
                    </div>
                );

            case "file": {
                const removeKey = `remove_${field.name}`;
                const markedRemove = Boolean(data[removeKey]);
                const showCurrent =
                    course[field.name] &&
                    typeof course[field.name] === "string" &&
                    !markedRemove;

                return (
                    <div className="mb-3" key={field.name}>
                        <label className="form-label">{field.label}</label>
                        <input
                            type="file"
                            className={`form-control ${fieldError ? "is-invalid" : ""}`}
                            onChange={(e) => {
                                const file = e.target.files[0];
                                handleFieldChange(field.name, file);
                                if (file) {
                                    setData(removeKey, false);
                                }
                            }}
                            accept={field.accept}
                            disabled={busy}
                        />
                        {fieldError && (
                            <div className="invalid-feedback">{fieldError}</div>
                        )}

                        {data[field.name] instanceof File && (
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary mt-2"
                                onClick={() => {
                                    setData(field.name, null);
                                    setData(removeKey, false);
                                }}
                                disabled={busy}
                            >
                                Cancel new upload
                            </button>
                        )}

                        {showCurrent && (
                            <div className="mt-2">
                                <label className="form-label small">
                                    Current file
                                </label>
                                <div className="d-flex align-items-center flex-wrap gap-2">
                                    <div className="me-3">
                                        {field.accept === "image/*" ? (
                                            <img
                                                src={`${appUrl}/${course[field.name]}`}
                                                alt="Current"
                                                style={{
                                                    width: "80px",
                                                    height: "60px",
                                                    objectFit: "cover",
                                                    borderRadius: "4px",
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
                                            {course[field.name]
                                                .split("/")
                                                .pop()}
                                        </small>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => {
                                            setData(removeKey, true);
                                            setData(field.name, null);
                                        }}
                                        disabled={busy}
                                    >
                                        <i className="bx bx-trash"></i> Remove
                                        file
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            }

            default:
                return null;
        }
    };

    // Available sections (not yet added)
    const availableSections = sectionConfig.filter(
        (section) => !activeSections.includes(section.id),
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
                    Manage Course Sections —{" "}
                    <span className="text-primary">{course.name}</span>
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
                        <p className="text-muted mb-3">
                            Choose sections to add to your course:
                        </p>
                        <div className="row g-3">
                            {availableSections.map((section) => (
                                <div
                                    key={section.id}
                                    className="col-md-6 col-lg-4"
                                >
                                    <div className="card h-100 border-dashed">
                                        <div className="card-body text-center">
                                            <div className="display-6 mb-2">
                                                {section.icon}
                                            </div>
                                            <h6 className="card-title">
                                                {section.label}
                                            </h6>
                                            <p className="card-text text-muted small">
                                                {section.description}
                                            </p>
                                            <button
                                                type="button"
                                                className="btn btn-primary btn-sm"
                                                onClick={() =>
                                                    addSection(section.id)
                                                }
                                                disabled={busy}
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
                    {activeSections.map((sectionId) => {
                        const section = sectionConfig.find(
                            (s) => s.id === sectionId,
                        );
                        if (!section) return null;

                        return (
                            <div
                                key={section.id}
                                className="card mb-4 shadow-sm"
                            >
                                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <span className="me-3 fs-5">
                                            {section.icon}
                                        </span>
                                        <div>
                                            <h5 className="mb-0">
                                                {section.label}
                                            </h5>
                                            <small className="text-muted">
                                                {section.description}
                                            </small>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() =>
                                            removeSection(section.id)
                                        }
                                        disabled={busy}
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

                {/* Submit Button */}
                <div className="mt-4 p-4 bg-light rounded border">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                disabled={busy}
                            >
                                {busy ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                        ></span>
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
                            No sections are currently active. Saving will clear
                            all section data.
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {activeSections.length === 0 && (
                    <div className="text-center py-5 border rounded bg-light">
                        <div className="display-1 text-muted mb-3">📚</div>
                        <h5 className="text-muted">No sections active</h5>
                        <p className="text-muted mb-4">
                            Add sections above to build your course content, or
                            save to clear all sections.
                        </p>

                        {availableSections.length === 0 ? (
                            <div className="alert alert-info">
                                <i className="bx bx-info-circle me-2"></i>
                                All available sections have been added to your
                                course.
                            </div>
                        ) : null}
                    </div>
                )}
            </form>
        </>
    );
};

export default CreateOrUpdateSections;
