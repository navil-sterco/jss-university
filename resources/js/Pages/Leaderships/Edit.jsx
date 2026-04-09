import { useForm, router, usePage } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";

const Edit = ({ leadership, types: initialTypes, categories: initialCategories }) => {
    const { data, setData, post, processing, errors, progress } = useForm({
        _method: "PUT",
        type_id: leadership.type_id || "",
        page_type: leadership.page_type || "",
        category_id: leadership.category_id || "",
        name: leadership.name || "",
        slug: leadership.slug || "",
        short_description: leadership.short_description || "",
        description: leadership.description?.length ? leadership.description : [""],
        biography: leadership.biography || "",
        banner_image: null,
        image: null,
        video: null,
        message: leadership.message?.length ? leadership.message : [""],
        message_image: null,
        status: leadership.status ?? true,
        display_order: leadership.display_order || 100,
    });

    const imageRef = useRef(null);
    const bannerImageRef = useRef(null);
    const videoRef = useRef(null);
    const messageImageRef = useRef(null);

    const { appUrl } = usePage().props;

    const modalRef = useRef(null);
    const modalInstance = useRef(null);
    const [itemIdDelete, setItemIdDelete] = useState(null);

    const [newType, setNewType] = useState("");
    const [newTypeDisplayOrder, setNewTypeDisplayOrder] = useState("");
    const [typeError, setTypeError] = useState("");
    const [editingType, setEditingType] = useState(null);
    const [editTypeName, setEditTypeName] = useState("");
    const [editTypeDisplayOrder, setEditTypeDisplayOrder] = useState("");
    const [typeLoading, setTypeLoading] = useState(false);

    const [newCategory, setNewCategory] = useState("");
    const [categoryError, setCategoryError] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState("");
    const [categoryLoading, setCategoryLoading] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("leadership.update", leadership.id));
    };

    const addField = (fieldName) => {
        setData(fieldName, [...data[fieldName], ""]);
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

    const addType = (e) => {
        e.preventDefault();
        if (!newType.trim()) return;

        setTypeLoading(true);
        router.post(route('types.store'), {
            name: newType,
            element: "leadership",
            display_order: newTypeDisplayOrder
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setNewType("");
                setNewTypeDisplayOrder("");
                setTypeLoading(false);
            },
            onError: (errors) => {
                setTypeLoading(false);
                setTypeError(errors);
            }
        });
    };

    const addCategory = (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        setCategoryLoading(true);
        router.post(route('leadership-categories.store'), {
            name: newCategory,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setNewCategory("");
                setCategoryLoading(false);
            },
            onError: (errors) => {
                setCategoryLoading(false);
                setCategoryError(errors);
            }
        });
    };

    const startEditType = (type) => {
        setEditingType(type.id);
        setEditTypeName(type.name);
        setEditTypeDisplayOrder(type.display_order ?? "");
    };

    const updateType = (e) => {
        e.preventDefault();
        if (!editTypeName.trim()) return;

        setTypeLoading(true);
        router.put(route('types.update', editingType), {
            name: editTypeName,
            element: "leadership",
            display_order: editTypeDisplayOrder
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingType(null);
                setEditTypeName("");
                setEditTypeDisplayOrder("");
                setTypeLoading(false);
            },
            onError: (errors) => {
                setTypeLoading(false);
                setTypeError(errors);
            }
        });
    };

    const startEditCategory = (category) => {
        setEditingCategory(category.id);
        setEditCategoryName(category.name);
    };

    const updateCategory = (e) => {
        e.preventDefault();
        if (!editCategoryName.trim()) return;

        setCategoryLoading(true);
        router.put(route('leadership-categories.update', editingCategory), {
            name: editCategoryName,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingCategory(null);
                setEditCategoryName("");
                setCategoryLoading(false);
            },
            onError: (errors) => {
                setCategoryLoading(false);
                setCategoryError(errors);
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

    const deleteCategory = () => {
        if (!itemIdDelete) return;

        setCategoryLoading(true);
        router.delete(route('leadership-categories.destroy', itemIdDelete), {
            preserveScroll: true,
            onSuccess: () => {
                setCategoryLoading(false);
                modalInstance.current.hide();
                setItemIdDelete(null);
                if (data.category_id == itemIdDelete) {
                    setData("category_id", "");
                }
            },
            onError: (errors) => {
                setCategoryLoading(false);
                console.log('Error deleting category:', errors);
            }
        });
    };

    const cancelEdit = () => {
        setEditingType(null);
        setEditTypeName("");
        setEditTypeDisplayOrder("");
    };

    const cancelEditCategory = () => {
        setEditingCategory(null);
        setEditCategoryName("");
    };

    return (
        <>
            <h1 className="text-muted">Edit Leadership</h1>

            <div className="row">
                <div className="col-md-8 mb-2">
                    <div className="card">
                        <form onSubmit={submit}>
                            <div className="card-body">
                                <div className="row">
                                    {/* Type */}
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Type <span className="text-danger">*</span></label>
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

                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Page Type <span className="text-danger">*</span></label>
                                        <select
                                            className="form-control"
                                            value={data.page_type}
                                            onChange={(e) => setData("page_type", e.target.value)}
                                        >
                                            <option value="">Select Type</option>
                                            <option value="leadership">Leadership</option>
                                            <option value="academic">Academic Council</option>
                                            <option value="alumuni">Alumuni</option>
                                        </select>
                                        <div className="form-text text-danger">{errors.page_type}</div>
                                    </div>

                                    {/* Category */}
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Category <span className="text-danger">*</span></label>
                                        <select
                                            className="form-control"
                                            value={data.category_id}
                                            onChange={(e) => setData("category_id", e.target.value)}
                                        >
                                            <option value="">Select Category</option>
                                            {initialCategories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="form-text text-danger">{errors.category_id}</div>
                                    </div>

                                    {/* Name */}
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Name <span className="text-danger">*</span></label>
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

                                    {/* Short Description */}
                                    <div className="mb-3 col-12">
                                        <label className="form-label">Short Description <span className="text-danger">*</span></label>
                                        <textarea
                                            className="form-control"
                                            rows={3}
                                            value={data.short_description}
                                            onChange={(e) => setData("short_description", e.target.value)}
                                            placeholder="Brief description"
                                        />
                                        <div className="form-text text-danger">{errors.short_description}</div>
                                    </div>

                                    {/* Description - Dynamic Fields (JSON) */}
                                    <div className="mb-3 col-12">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <label className="form-label">Description</label>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => addField('description')}
                                            >
                                                <i className="bx bx-plus me-1"></i> Add Description
                                            </button>
                                        </div>
                                        {data.description.map((desc, index) => (
                                            <div key={index} className="input-group mb-2">
                                                <textarea
                                                    className="form-control"
                                                    rows={2}
                                                    value={desc}
                                                    onChange={(e) => updateField('description', index, e.target.value)}
                                                    placeholder="Detailed description"
                                                />
                                                {data.description.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger"
                                                        onClick={() => removeField('description', index)}
                                                    >
                                                        <i className="bx bx-trash"></i>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <div className="form-text text-danger">{errors.description}</div>
                                    </div>

                                    {/* Biography */}
                                    <div className="mb-3 col-12">
                                        <label className="form-label">Biography</label>
                                        <textarea
                                            className="form-control"
                                            rows={4}
                                            value={data.biography}
                                            onChange={(e) => setData("biography", e.target.value)}
                                            placeholder="Detailed biography"
                                        />
                                        <div className="form-text text-danger">{errors.biography}</div>
                                    </div>

                                    {/* Banner Image */}
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Banner Image</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            ref={bannerImageRef}
                                            onChange={(e) => setData("banner_image", e.target.files[0])}
                                            accept="image/*"
                                        />
                                        {leadership.banner_image && (
                                            <div className="mt-2">
                                                <p className="text-muted mb-1">Current Banner Image:</p>
                                                <img
                                                    src={`${appUrl}/${leadership.banner_image}`}
                                                    alt="Banner"
                                                    className="img-thumbnail"
                                                    style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'cover' }}
                                                />
                                            </div>
                                        )}
                                        <div className="form-text text-danger">{errors.banner_image}</div>
                                        <div className="form-text">Recommended banner image size</div>
                                    </div>

                                    {/* Profile Image */}
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Profile Image</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            ref={imageRef}
                                            onChange={(e) => setData("image", e.target.files[0])}
                                            accept="image/*"
                                        />
                                        {leadership.image && (
                                            <div className="mt-2">
                                                <p className="text-muted mb-1">Current Profile Image:</p>
                                                <img
                                                    src={`${appUrl}/${leadership.image}`}
                                                    alt={leadership.name}
                                                    className="img-thumbnail"
                                                    style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
                                                />
                                            </div>
                                        )}
                                        <div className="form-text text-danger">{errors.image}</div>
                                        <div className="form-text">Recommended: 300x300px, Max 2MB</div>
                                    </div>

                                    {/* Video */}
                                    <div className="mb-3 col-6">
                                        <label className="form-label">Video</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            ref={videoRef}
                                            onChange={(e) => setData("video", e.target.files[0])}
                                            accept="video/*"
                                        />
                                        {leadership.video && (
                                            <div className="mt-2">
                                                <p className="text-muted mb-1">Current Video:</p>
                                                <div className="d-flex align-items-center gap-2 p-2 border rounded bg-light">
                                                    <i className="bx bx-video text-primary"></i>
                                                    <span className="small">{leadership.video.split('/').pop()}</span>
                                                    <a
                                                        href={`${appUrl}/${leadership.video}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-sm btn-outline-primary ms-auto"
                                                    >
                                                        <i className="bx bx-download"></i>
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                        <div className="form-text text-danger">{errors.video}</div>
                                        <div className="form-text">Upload video file (MP4, AVI, MOV, Max 10MB)</div>
                                    </div>

                                    {/* Message Image */}
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Message Image</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            ref={messageImageRef}
                                            onChange={(e) => setData("message_image", e.target.files[0])}
                                            accept="image/*"
                                        />
                                        {leadership.message_image && (
                                            <div className="mt-2">
                                                <p className="text-muted mb-1">Current Message Image:</p>
                                                <img
                                                    src={`${appUrl}/${leadership.message_image}`}
                                                    alt="Message"
                                                    className="img-thumbnail"
                                                    style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
                                                />
                                            </div>
                                        )}
                                        <div className="form-text text-danger">{errors.message_image}</div>
                                        <div className="form-text">Recommended: 300x300px, Max 2MB</div>
                                    </div>

                                    {/* Message - Dynamic Fields (JSON) */}
                                    <div className="mb-3 col-12">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <label className="form-label">Messages</label>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => addField('message')}
                                            >
                                                <i className="bx bx-plus me-1"></i> Add Message
                                            </button>
                                        </div>
                                        {data.message.map((msg, index) => (
                                            <div key={index} className="input-group mb-2">
                                                <textarea
                                                    className="form-control"
                                                    rows={2}
                                                    value={msg}
                                                    onChange={(e) => updateField('message', index, e.target.value)}
                                                    placeholder="Message content"
                                                />
                                                {data.message.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger"
                                                        onClick={() => removeField('message', index)}
                                                    >
                                                        <i className="bx bx-trash"></i>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <div className="form-text text-danger">{errors.message}</div>
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
                                        {processing ? "Updating..." : "Update Leadership"}
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
                                Manage Types & Categories
                            </h5>
                        </div>
                        <div className="card-body">
                            {/* Add Type Form */}
                            <form onSubmit={addType} className="mb-4">
                                <label className="form-label fw-semibold">Add New Type</label>
                                <div className="input-group mb-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter type name"
                                        value={newType}
                                        onChange={(e) => setNewType(e.target.value)}
                                        disabled={typeLoading}
                                    />
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Order"
                                        value={newTypeDisplayOrder}
                                        onChange={(e) => setNewTypeDisplayOrder(e.target.value)}
                                        disabled={typeLoading}
                                        style={{ maxWidth: '80px' }}
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

                            {/* Add Category Form */}
                            <form onSubmit={addCategory} className="mb-4">
                                <label className="form-label fw-semibold">Add New Category</label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter category name"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        disabled={categoryLoading}
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={!newCategory.trim() || categoryLoading}
                                    >
                                        {categoryLoading ? (
                                            <i className="bx bx-loader bx-spin"></i>
                                        ) : (
                                            <i className="bx bx-plus"></i>
                                        )}
                                    </button>
                                </div>
                                <div className="form-text text-danger">{categoryError.name}</div>
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
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm me-2"
                                                        placeholder="Order"
                                                        value={editTypeDisplayOrder}
                                                        onChange={(e) => setEditTypeDisplayOrder(e.target.value)}
                                                        disabled={typeLoading}
                                                        style={{ maxWidth: '60px' }}
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
                                                    <span>{type.name} {type.display_order !== null && type.display_order !== undefined && <small className="text-muted">(Order: {type.display_order})</small>}</span>
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

                            {/* Categories List */}
                            <div className="mt-4">
                                <h6 className="fw-semibold text-dark mb-3">Existing Categories</h6>
                                <div className="list-group">
                                    {initialCategories.map((cat) => (
                                        <div key={cat.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            {editingCategory === cat.id ? (
                                                <form onSubmit={updateCategory} className="d-flex w-100">
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm me-2"
                                                        value={editCategoryName}
                                                        onChange={(e) => setEditCategoryName(e.target.value)}
                                                        disabled={categoryLoading}
                                                    />

                                                    <button
                                                        type="submit"
                                                        className="btn btn-success btn-sm me-1"
                                                        disabled={!editCategoryName.trim() || categoryLoading}
                                                    >
                                                        {categoryLoading ? (
                                                            <i className="bx bx-loader bx-spin"></i>
                                                        ) : (
                                                            <i className="bx bx-check"></i>
                                                        )}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={cancelEditCategory}
                                                        disabled={categoryLoading}
                                                    >
                                                        <i className="bx bx-x"></i>
                                                    </button>
                                                </form>
                                            ) : (
                                                <>
                                                    <span>{cat.name}</span>
                                                    <div className="btn-group btn-group-sm">
                                                        <button
                                                            className="btn btn-outline-primary"
                                                            onClick={() => startEditCategory(cat)}
                                                            disabled={categoryLoading}
                                                        >
                                                            <i className="bx bx-edit"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger"
                                                            onClick={() => showDeleteModal(cat.id)}
                                                            disabled={categoryLoading}
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

export default Edit;
