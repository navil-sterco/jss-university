import { useForm, router } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";

const Create = ({ types: initialTypes }) => {
    const { data, setData, post, processing, errors, progress } = useForm({
        type_id: "",
        name: "",
        slug: "",
        short_description: "",
        description: [""],
        biography: "",
        banner_image: null,
        image: null,
        video: null,
        message: [""],
        status: true,
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
        post(route("leadership.store"));
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
            element: "leadership"
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
            element: "leadership"
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
            <h1 className="text-muted">Add New Item</h1> {/* Replace with your title */}
            
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
                                            onChange={(e) => setData("banner_image", e.target.files[0])}
                                            accept="image/*"
                                        />
                                        <div className="form-text text-danger">{errors.banner_image}</div>
                                        <div className="form-text">Recommended banner image size</div>
                                    </div>

                                    {/* Profile Image */}
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

                                    {/* Video */}
                                    <div className="mb-3 col-12">
                                        <label className="form-label">Video</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={(e) => setData("video", e.target.files[0])}
                                            accept="video/*"
                                        />
                                        <div className="form-text text-danger">{errors.video}</div>
                                        <div className="form-text">Upload video file</div>
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
                                        {processing ? "Creating..." : "Create Item"} {/* Replace with your button text */}
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