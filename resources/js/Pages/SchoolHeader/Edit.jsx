import { useForm, usePage } from '@inertiajs/react';
import React from 'react';

const Edit = (props) => {
    const { schools, departments, pages,header } = usePage().props;
    
    const initialBoxes = Array.isArray(header.boxes)
        ? header.boxes
        : header.boxes
        ? JSON.parse(header.boxes)
        : [];

    const { data, setData, post, processing, errors } = useForm({
        _method:"PUT",
        title: header.title || "",
        type: header.type || "custom",
        reference_id: header.reference_id || "",
        parent_id: header.parent_id || "",
        url: header.url || "",

        // Section fields
        section_title: header.section_title || "",
        section_subtitle: header.section_subtitle || "",
        section_description: header.section_description || "",
        section_button_text: header.section_button_text || "",
        section_button_url: header.section_button_url || "",

        boxes: initialBoxes,

        display_order: header.display_order || 100,
        is_active: header.is_active ?? true,
    });

    // ✅ Handle file change
    const handleFileChange = (boxIndex, files) => {
        if (!files || !files.length) return;
        const updatedBoxes = [...data.boxes];
        updatedBoxes[boxIndex].image = files[0];
        setData("boxes", updatedBoxes);
    };

    // ✅ Add new box
    const addBox = () => {
        if (data.boxes.length < 3) {
            setData("boxes", [
                ...data.boxes,
                { title: "", url: "", image: null },
            ]);
        }
    };

    // ✅ Remove a box
    const removeBox = (index) => {
        setData(
            "boxes",
            data.boxes.filter((_, i) => i !== index)
        );
    };

    // ✅ Update a box field
    const updateBox = (index, field, value) => {
        const newBoxes = data.boxes.map((box, i) =>
            i === index ? { ...box, [field]: value } : box
        );
        setData("boxes", newBoxes);
    };

    const removeImage = (index) => {
        updateBox(index, "image", null);
    };

    // ✅ Handle type change (custom/school/department/page)
    const handleTypeChange = (type) => {
        setData({
            ...data,
            type,
            reference_id: "",
            url: "",
            title: "",
        });
    };

    // ✅ Handle reference change
    const handleReferenceChange = (referenceId) => {
        setData("reference_id", referenceId);

        if (data.type === "school") {
            const school = schools.find((s) => s.id == referenceId);
            if (school) setData("title", school.name);
        } else if (data.type === "department") {
            const department = departments.find((d) => d.id == referenceId);
            if (department) setData("title", department.name);
        } else if (data.type === "page") {
            const page = pages.find((p) => p.id == referenceId);
            if (page) setData("title", page.title);
        }
    };

    // ✅ Submit function
    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        // Append basic fields
        const fields = {
            title: data.title,
            type: data.type,
            reference_id: data.reference_id,
            parent_id: data.parent_id,
            url: data.url,
            section_title: data.section_title,
            section_subtitle: data.section_subtitle,
            section_description: data.section_description,
            section_button_text: data.section_button_text,
            section_button_url: data.section_button_url,
            display_order: data.display_order,
            is_active: data.is_active == 1 ? 1 : 0,
            _method: 'PUT' // Important for update
        };

        Object.entries(fields).forEach(([key, value]) => {
            formData.append(key, value ?? "");
        });

        // ✅ Append boxes
        data.boxes.forEach((box, index) => {
            formData.append(`boxes[${index}][title]`, box.title || "");
            formData.append(`boxes[${index}][url]`, box.url || "");
            
            // Handle image - either new file or existing image path
            if (box.image instanceof File) {
                // New uploaded file
                formData.append(`boxes[${index}][image]`, box.image);
            } else if (box.image && typeof box.image === 'string') {
                // Existing image path - keep it as is
                formData.append(`boxes[${index}][image]`, box.image);
            } else {
                // No image
                formData.append(`boxes[${index}][image]`, "");
            }
        });

        // ✅ Send update request
        post(route("school-header.update", header.id), formData, {
            preserveScroll: true,
        });
    };

    // Function to get image source for display
    const getImageSrc = (box) => {
        if (box.image instanceof File) {
            return URL.createObjectURL(box.image); // New uploaded image
        } else if (box.image && typeof box.image === 'string') {
            return box.image; // Existing image path
        }
        return null;
    };

    return (
        <>
            <h1 className="text-muted">Edit Menu Item</h1>

            <div className="card mb-4">
                <div className="card-body">
                    <form onSubmit={submit} encType="multipart/form-data">
                        <div className="row">
                            {/* --- BASIC INFO --- */}
                            <div className="col-12">
                                <h5 className="mb-3">Basic Information</h5>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Menu Type</label>
                                <select
                                    className="form-select"
                                    value={data.type}
                                    onChange={(e) => handleTypeChange(e.target.value)}
                                >
                                    <option value="custom">Custom Link</option>
                                    <option value="school">School</option>
                                    <option value="department">Department</option>
                                    <option value="page">Page</option>
                                </select>
                                <div className="form-text text-danger">{errors.type}</div>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Parent Menu (Optional)</label>
                                <select
                                    className="form-select"
                                    value={data.parent_id}
                                    onChange={(e) => setData("parent_id", e.target.value)}
                                >
                                    <option value="">No Parent (Main Menu)</option>
                                    {props.menuItems?.filter(i => !i.parent_id && i.id !== header.id).map(i => (
                                        <option key={i.id} value={i.id}>{i.title}</option>
                                    ))}
                                </select>
                                <div className="form-text text-danger">{errors.parent_id}</div>
                            </div>

                            {data.type !== "custom" && (
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">
                                        {data.type === "school" && "Select School"}
                                        {data.type === "department" && "Select Department"}
                                        {data.type === "page" && "Select Page"}
                                    </label>
                                    <select
                                        className="form-select"
                                        value={data.reference_id}
                                        onChange={(e) => handleReferenceChange(e.target.value)}
                                    >
                                        <option value="">Select {data.type}</option>
                                        {data.type === "school" &&
                                            schools.map((s) => (
                                                <option key={s.id} value={s.id}>
                                                    {s.name}
                                                </option>
                                            ))}
                                        {data.type === "department" &&
                                            departments.map((d) => (
                                                <option key={d.id} value={d.id}>
                                                    {d.name}
                                                </option>
                                            ))}
                                        {data.type === "page" &&
                                            pages.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.title}
                                                </option>
                                            ))}
                                    </select>
                                    <div className="form-text text-danger">{errors.reference_id}</div>
                                </div>
                            )}

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Menu Title</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.title}</div>
                            </div>

                            {data.type === "custom" && (
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">URL (Optional)</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={data.url}
                                        onChange={(e) => setData("url", e.target.value)}
                                        placeholder="/example-page or https://example.com"
                                    />
                                    <div className="form-text text-danger">{errors.url}</div>
                                </div>
                            )}

                            <div className="mb-3 col-md-6">
                                <label htmlFor="display_order" className="form-label">Display Order</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    id="display_order"
                                    value={data.display_order}
                                    onChange={(e) => setData('display_order', parseInt(e.target.value) || 0)}
                                    min="0"
                                />
                                <div className="form-text text-danger">{errors.display_order}</div>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label htmlFor="is_active" className="form-label">Status</label>
                                <select
                                    id="is_active"
                                    className="form-select"
                                    value={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.value === 'true')}
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                                <div className="form-text text-danger">{errors.is_active}</div>
                            </div>

                            {/* Section Information */}
                            <div className="col-12 mt-4">
                                <hr />
                                <h5 className="mb-3">Section Information (Optional)</h5>
                                <p className="text-muted">These fields are used for mega menu or dropdown sections.</p>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label htmlFor="section_title" className="form-label">Section Title</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="section_title"
                                    value={data.section_title}
                                    onChange={(e) => setData('section_title', e.target.value)}
                                    placeholder="Enter section title"
                                />
                                <div className="form-text text-danger">{errors.section_title}</div>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label htmlFor="section_subtitle" className="form-label">Section Subtitle</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="section_subtitle"
                                    value={data.section_subtitle}
                                    onChange={(e) => setData('section_subtitle', e.target.value)}
                                    placeholder="Enter section subtitle"
                                />
                                <div className="form-text text-danger">{errors.section_subtitle}</div>
                            </div>

                            <div className="mb-3 col-12">
                                <label htmlFor="section_description" className="form-label">Section Description</label>
                                <textarea
                                    className="form-control"
                                    id="section_description"
                                    rows="3"
                                    value={data.section_description}
                                    onChange={(e) => setData('section_description', e.target.value)}
                                    placeholder="Enter section description"
                                />
                                <div className="form-text text-danger">{errors.section_description}</div>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label htmlFor="section_button_text" className="form-label">Button Text</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="section_button_text"
                                    value={data.section_button_text}
                                    onChange={(e) => setData('section_button_text', e.target.value)}
                                    placeholder="e.g., Learn More, View All"
                                />
                                <div className="form-text text-danger">{errors.section_button_text}</div>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label htmlFor="section_button_url" className="form-label">Button URL</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="section_button_url"
                                    value={data.section_button_url}
                                    onChange={(e) => setData('section_button_url', e.target.value)}
                                    placeholder="/button-link or https://example.com"
                                />
                                <div className="form-text text-danger">{errors.section_button_url}</div>
                            </div>

                            {/* --- BOXES --- */}
                            <div className="col-12 mt-4">
                                <hr />
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="mb-0">Boxes (Max 3)</h5>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={addBox}
                                        disabled={data.boxes.length >= 3}
                                    >
                                        <i className="fas fa-plus me-1"></i>Add Box
                                    </button>
                                </div>
                            </div>

                            {data.boxes.map((box, index) => (
                                <div key={index} className="col-12 mb-4">
                                    <div className="card">
                                        <div className="card-header d-flex justify-content-between align-items-center">
                                            <h6 className="mb-0">Box {index + 1}</h6>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger"
                                                onClick={() => removeBox(index)}
                                            >
                                                <i className="fas fa-trash me-1"></i>Remove
                                            </button>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Box Title</label>
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        value={box.title}
                                                        onChange={(e) =>
                                                            updateBox(index, "title", e.target.value)
                                                        }
                                                    />
                                                    <div className="form-text text-danger">
                                                        {errors[`boxes.${index}.title`]}
                                                    </div>
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Box URL</label>
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        value={box.url}
                                                        onChange={(e) =>
                                                            updateBox(index, "url", e.target.value)
                                                        }
                                                    />
                                                    <div className="form-text text-danger">
                                                        {errors[`boxes.${index}.url`]}
                                                    </div>
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Box Image</label>
                                                    <div className="d-flex align-items-center">
                                                        <input
                                                            className="form-control"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) =>
                                                                handleFileChange(
                                                                    index,
                                                                    e.target.files
                                                                )
                                                            }
                                                        />
                                                        {(box.image instanceof File || (box.image && typeof box.image === 'string')) && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-danger ms-2"
                                                                onClick={() => removeImage(index)}
                                                            >
                                                                <i className='bx bx-x'></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                
                                                    {(box.image instanceof File || (box.image && typeof box.image === 'string')) && (
                                                        <div className="form-text text-success">
                                                            <i className="fas fa-check me-1"></i>
                                                            {box.image instanceof File ? box.image.name : 'Image exists'}
                                                        </div>
                                                    )}
                                                    <div className="form-text text-danger">
                                                        {errors[`boxes.${index}.image`]}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {data.boxes.length === 0 && (
                                <div className="col-12">
                                    <div className="alert alert-info">
                                        <i className="fas fa-info-circle me-2"></i>
                                        No boxes added yet. Click "Add Box" to create promotional boxes for this menu item.
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-4">
                            <button
                                type="submit"
                                className="btn btn-primary me-2"
                                disabled={processing}
                            >
                                {processing ? "Updating..." : "Update Menu Item"}
                            </button>
                            <a href={route("school-header.index")} className="btn btn-secondary">
                                Cancel
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Edit;