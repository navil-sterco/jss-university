import { useForm, usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const Edit = (props) => {
    const { admission } = usePage().props;

    // Parse menus if they exist
    const initialMenus = Array.isArray(admission.menus)
        ? admission.menus
        : admission.menus
        ? JSON.parse(admission.menus)
        : [];

    const { data, setData, post, processing, errors } = useForm({
        _method: "PUT",
        // Basic fields
        title: admission.title || "",
        subtitle: admission.subtitle || "",
        description: admission.description || "",
        email: admission.email || "",
        phone: admission.phone || "",
        apply_now_link: admission.apply_now_link || "",
        
        // Program fields
        program_text: admission.program_text || "",
        program_desc: admission.program_desc || "",
        program_button_text: admission.program_button_text || "",
        program_button_url: admission.program_button_url || "",

        // Files (will handle separately)
        image: admission.image || null,
        brochure: admission.brochure || null,

        // Menus array
        menus: initialMenus,
    });
    const { flash } = usePage().props;
    
    // Toast for flash messages
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash.success]);

    // ✅ Handle file change for image
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
        }
    };

    // ✅ Handle file change for brochure (PDF)
    const handleBrochureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate PDF file
            if (file.type !== 'application/pdf') {
                alert('Please select a PDF file for the brochure.');
                return;
            }
            setData("brochure", file);
        }
    };

    // ✅ Remove image
    const removeImage = () => {
        setData("image", null);
    };

    // ✅ Remove brochure
    const removeBrochure = () => {
        setData("brochure", null);
    };

    // ✅ Add new menu item
    const addMenu = () => {
        setData("menus", [
            ...data.menus,
            { text: "", link: "" },
        ]);
    };

    // ✅ Remove a menu item
    const removeMenu = (index) => {
        setData(
            "menus",
            data.menus.filter((_, i) => i !== index)
        );
    };

    // ✅ Update a menu field
    const updateMenu = (index, field, value) => {
        const newMenus = data.menus.map((menu, i) =>
            i === index ? { ...menu, [field]: value } : menu
        );
        setData("menus", newMenus);
    };

    // ✅ Submit function
    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        // Append basic fields
        const fields = {
            title: data.title,
            subtitle: data.subtitle,
            description: data.description,
            email: data.email,
            phone: data.phone,
            apply_now_link: data.apply_now_link,
            program_text: data.program_text,
            program_desc: data.program_desc,
            program_button_text: data.program_button_text,
            program_button_url: data.program_button_url,
            _method: 'PUT'
        };

        Object.entries(fields).forEach(([key, value]) => {
            formData.append(key, value ?? "");
        });

        // ✅ Append image if it's a new file
        if (data.image instanceof File) {
            formData.append('image', data.image);
        } else if (data.image && typeof data.image === 'string') {
            // Keep existing image path
            formData.append('image', data.image);
        }

        // ✅ Append brochure if it's a new file
        if (data.brochure instanceof File) {
            formData.append('brochure', data.brochure);
        } else if (data.brochure && typeof data.brochure === 'string') {
            // Keep existing brochure path
            formData.append('brochure', data.brochure);
        }

        // ✅ Append menus
        data.menus.forEach((menu, index) => {
            formData.append(`menus[${index}][text]`, menu.text || "");
            formData.append(`menus[${index}][link]`, menu.link || "");
        });

        // ✅ Send update request
        post(route("admission.update", admission.id), formData, {
            preserveScroll: true,
        });
    };

    // Function to get file source for display
    const getFileSrc = (file) => {
        if (file instanceof File) {
            return URL.createObjectURL(file);
        } else if (file && typeof file === 'string') {
            return file;
        }
        return null;
    };

    return (
        <>
            <h1 className="text-muted">Edit Admission</h1>
            <ToastContainer />
            <div className="card mb-4">
                <div className="card-body">
                    <form onSubmit={submit} encType="multipart/form-data">
                        <div className="row">
                            {/* --- BASIC INFORMATION --- */}
                            <div className="col-12">
                                <h5 className="mb-3">Basic Information</h5>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Title *</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.title}</div>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Subtitle</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={data.subtitle}
                                    onChange={(e) => setData("subtitle", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.subtitle}</div>
                            </div>

                            <div className="mb-3 col-12">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.description}</div>
                            </div>

                            {/* --- CONTACT INFORMATION --- */}
                            <div className="col-12 mt-4">
                                <hr />
                                <h5 className="mb-3">Contact Information</h5>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Email</label>
                                <input
                                    className="form-control"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.email}</div>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Phone</label>
                                <input
                                    className="form-control"
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData("phone", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.phone}</div>
                            </div>

                            {/* --- FILES --- */}
                            <div className="col-12 mt-4">
                                <hr />
                                <h5 className="mb-3">Files</h5>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Image</label>
                                <div className="d-flex align-items-center">
                                    <input
                                        className="form-control"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {(data.image instanceof File || (data.image && typeof data.image === 'string')) && (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger ms-2"
                                            onClick={removeImage}
                                        >
                                            <i className='bx bx-x'></i>
                                        </button>
                                    )}
                                </div>
                                {(data.image instanceof File || (data.image && typeof data.image === 'string')) && (
                                    <div className="form-text text-success">
                                        <i className="fas fa-check me-1"></i>
                                        {data.image instanceof File ? data.image.name : 'Image exists'}
                                    </div>
                                )}
                                <div className="form-text text-danger">{errors.image}</div>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Brochure (PDF only)</label>
                                <div className="d-flex align-items-center">
                                    <input
                                        className="form-control"
                                        type="file"
                                        accept=".pdf,application/pdf"
                                        onChange={handleBrochureChange}
                                    />
                                    {(data.brochure instanceof File || (data.brochure && typeof data.brochure === 'string')) && (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger ms-2"
                                            onClick={removeBrochure}
                                        >
                                            <i className='bx bx-x'></i>
                                        </button>
                                    )}
                                </div>
                                {(data.brochure instanceof File || (data.brochure && typeof data.brochure === 'string')) && (
                                    <div className="form-text text-success">
                                        <i className="fas fa-check me-1"></i>
                                        {data.brochure instanceof File ? data.brochure.name : 'Brochure exists'}
                                    </div>
                                )}
                                <div className="form-text text-danger">{errors.brochure}</div>
                            </div>

                            <div className="mb-3 col-12">
                                <label className="form-label">Apply Now Link</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={data.apply_now_link}
                                    onChange={(e) => setData("apply_now_link", e.target.value)}
                                    placeholder="https://example.com/apply"
                                />
                                <div className="form-text text-danger">{errors.apply_now_link}</div>
                            </div>

                            {/* --- PROGRAM INFORMATION --- */}
                            <div className="col-12 mt-4">
                                <hr />
                                <h5 className="mb-3">Program Information</h5>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Program Text</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={data.program_text}
                                    onChange={(e) => setData("program_text", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.program_text}</div>
                            </div>

                            <div className="mb-3 col-12">
                                <label className="form-label">Program Description</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={data.program_desc}
                                    onChange={(e) => setData("program_desc", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.program_desc}</div>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Program Button Text</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={data.program_button_text}
                                    onChange={(e) => setData("program_button_text", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.program_button_text}</div>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Program Button URL</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={data.program_button_url}
                                    onChange={(e) => setData("program_button_url", e.target.value)}
                                    placeholder="https://example.com/programs"
                                />
                                <div className="form-text text-danger">{errors.program_button_url}</div>
                            </div>

                            {/* --- MENUS --- */}
                            <div className="col-12 mt-4">
                                <hr />
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="mb-0">Quick Links Menu</h5>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={addMenu}
                                    >
                                        <i className="fas fa-plus me-1"></i>Add Menu Item
                                    </button>
                                </div>
                            </div>

                            {data.menus.map((menu, index) => (
                                <div key={index} className="col-12 mb-3">
                                    <div className="card">
                                        <div className="card-header d-flex justify-content-between align-items-center">
                                            <h6 className="mb-0">Menu Item {index + 1}</h6>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger"
                                                onClick={() => removeMenu(index)}
                                            >
                                                <i className="fas fa-trash me-1"></i>Remove
                                            </button>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Menu Text</label>
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        value={menu.text}
                                                        onChange={(e) =>
                                                            updateMenu(index, "text", e.target.value)
                                                        }
                                                        placeholder="e.g., Admissions Process"
                                                    />
                                                    <div className="form-text text-danger">
                                                        {errors[`menus.${index}.text`]}
                                                    </div>
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Menu Link</label>
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        value={menu.link}
                                                        onChange={(e) =>
                                                            updateMenu(index, "link", e.target.value)
                                                        }
                                                        placeholder="https://example.com/admissions"
                                                    />
                                                    <div className="form-text text-danger">
                                                        {errors[`menus.${index}.link`]}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {data.menus.length === 0 && (
                                <div className="col-12">
                                    <div className="alert alert-info">
                                        <i className="fas fa-info-circle me-2"></i>
                                        No menu items added yet. Click "Add Menu Item" to create quick links.
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
                                {processing ? "Updating..." : "Update Admission"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Edit;