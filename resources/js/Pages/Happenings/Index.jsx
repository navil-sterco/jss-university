import React, { useEffect, useRef, useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import { router, usePage } from "@inertiajs/react";
import { ToastContainer, toast } from "react-toastify";
import _ from "lodash";

const Index = (props) => {
    const { searchTerm, happenings } = props;
    const [query, setQuery] = useState(searchTerm || "");
    const { flash } = usePage().props;
    const modalRef = useRef(null);
    const modalInstance = useRef(null);
    const [idDelete, setIdDelete] = useState(null);

    // View modal
    const [selectedHappening, setSelectedHappening] = useState(null);
    const viewModalRef = useRef(null);
    const viewModalInstance = useRef(null);

    // Image modal
    const [selectedImage, setSelectedImage] = useState(null);
    const imageModalRef = useRef(null);
    const imageModalInstance = useRef(null);

    const { get, processing } = useForm();

    // Toast for flash messages
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash.success]);

    // Search debounce
    useEffect(() => {
        const delaySearch = _.debounce(() => {
            router.get("happening", { search: query }, { preserveState: true, replace: true });
        }, 300);

        delaySearch();
        return () => delaySearch.cancel();
    }, [query]);

    // Initialize modals
    useEffect(() => {
        if (modalRef.current) {
            modalInstance.current = new bootstrap.Modal(modalRef.current);
        }
        if (viewModalRef.current) {
            viewModalInstance.current = new bootstrap.Modal(viewModalRef.current);
        }
        if (imageModalRef.current) {
            imageModalInstance.current = new bootstrap.Modal(imageModalRef.current);
        }
    }, []);

    // Delete modal
    const showDeleteModal = (id) => {
        setIdDelete(id);
        modalInstance.current.show();
    };

    const handleConfirmDelete = () => {
        get(route("happening.destroy", idDelete), {
            onSuccess: () => {
                modalInstance.current.hide();
                setIdDelete(null);
            },
        });
    };

    // Toggle status
    const toggleStatus = (id) => {
        router.post(route("happening.toggleStatus", id), {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    // Image preview modal
    const showImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        imageModalInstance.current.show();
    };

    // Show view sidebar modal
    const showViewModal = (happening) => {
        setSelectedHappening(happening);
        viewModalInstance.current.show();
    };

    // Close view sidebar modal and remove backdrop
    const closeViewModal = () => {
        viewModalInstance.current.hide();
        setSelectedHappening(null);
        
        // Remove modal backdrop manually
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => {
            backdrop.remove();
        });
        
        // Remove modal-open class from body and reset styles
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    };

    // Handle edit navigation from modal
    const handleEditFromModal = (id) => {
        closeViewModal();
        // Use setTimeout to ensure modal is fully closed before navigation
        setTimeout(() => {
            router.get(route("happening.edit", id));
        }, 150);
    };

    // Handle mapping navigation from modal
    const handleMappingFromModal = (id) => {
        closeViewModal();
        // Use setTimeout to ensure modal is fully closed before navigation
        setTimeout(() => {
            router.get(route("happening.mapping", id));
        }, 150);
    };

    return (
        <>
            <h1 className="text-muted">Happenings List</h1>
            <ToastContainer />

            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-6 col-8">
                            <div className="input-group input-group-merge">
                                <span className="input-group-text">
                                    <i className="bx bx-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by Happening Title..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 col-3">
                            <Link
                                href={route("happening.create")}
                                className="btn btn-primary float-end"
                            >
                                <i className="bx bx-plus"></i>
                                <span className="d-none d-sm-inline-block">Add Happening</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="table-responsive text-nowrap">
                    <table className="table table-hover my-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Upcoming Event</th>
                                <th>Title</th>
                                <th>Slug</th>
                                <th>Image</th>
                                <th>Display Order</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {happenings.data.map((happening) => (
                                <tr key={happening.id}>
                                    <td><i className="bx bx-party bx-sm me-3"></i>{happening.event_type}</td>
                                    <td>
                                        <span
                                            className={`badge ${
                                                happening.upcoming_event ? "bg-label-warning" : "bg-label-secondary"
                                            }`}
                                        >
                                            {happening.upcoming_event ? "Yes" : "No"}
                                        </span>
                                    </td>
                                    <td><i className="bx bx-heading bx-sm me-3"></i>{happening.title}</td>
                                    <td><i className="bx bx-link bx-sm me-3"></i>{happening.slug}</td>
                                    <td>
                                        {happening.image ? (
                                            <img
                                                src={happening.image}
                                                alt="happening"
                                                className="img-thumbnail"
                                                style={{
                                                    width: "80px",
                                                    height: "50px",
                                                    objectFit: "cover",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => showImageModal(happening.image)}
                                            />
                                        ) : (
                                            <span className="text-muted">No image</span>
                                        )}
                                    </td>
                                    <td><i className="bx bx-category bx-sm me-3"></i>{happening.display_order}</td>
                                    <td>
                                        <span
                                            className={`badge cursor-pointer ${
                                                happening.status ? "bg-label-success" : "bg-label-danger"
                                            }`}
                                            onClick={() => toggleStatus(happening.id)}
                                        >
                                            {happening.status ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-1">
                                            <Link
                                                className="btn btn-sm btn-outline-primary p-1"
                                                href={route("happening.mapping", happening.id)}
                                            >
                                                <span className="tf-icons bx bx-right-arrow-circle bx-18px me-1"></span>
                                                Mapping
                                            </Link>

                                            <div className="dropdown">
                                                <button
                                                    className="btn btn-outline-secondary p-1 dropdown-toggle hide-arrow"
                                                    data-bs-toggle="dropdown"
                                                >
                                                    <i className="bx bx-dots-vertical-rounded"></i>
                                                </button>
                                                <div className="dropdown-menu">
                                                    <a
                                                        href="#viewDetailsModal"
                                                        data-bs-toggle="modal"
                                                        onClick={() => showViewModal(happening)}
                                                        className="dropdown-item"
                                                    >
                                                        <i className="bx bx-show me-1"></i> View
                                                    </a>
                                                    <Link
                                                        className="dropdown-item"
                                                        href={route("happening.edit", happening.id)}
                                                    >
                                                        <i className="bx bx-edit-alt me-1"></i> Edit
                                                    </Link>
                                                    <a
                                                        onClick={() => showDeleteModal(happening.id)}
                                                        className="dropdown-item"
                                                        href="#"
                                                    >
                                                        <i className="bx bx-trash me-1"></i> Delete
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Sidebar Modal */}
            <div
                className="modal fade modal-right"
                id="viewDetailsModal"
                tabIndex="-1"
                aria-hidden="true"
                ref={viewModalRef}
            >
                <div className="modal-dialog modal-dialog-scrollable modal-xl">
                    <div className="modal-content h-100">
                        {/* Header */}
                        <div className="modal-header bg-light">
                            <div className="d-flex align-items-center w-100">
                                <div className="flex-grow-1">
                                    <h5 className="modal-title fw-semibold text-primary">
                                        <i className="bx bx-detail me-2"></i>
                                        Happening Details
                                    </h5>
                                    {selectedHappening && (
                                        <p className="text-muted mb-0 small">
                                            ID: {selectedHappening.id} • Created: {selectedHappening.created_at}
                                        </p>
                                    )}
                                </div>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={closeViewModal}
                                ></button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="modal-body p-0">
                            {selectedHappening ? (
                                <div className="row g-0">
                                    {/* Main Content - Left Side */}
                                    <div className="col-md-8 p-4 border-end">
                                        {/* Basic Information */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-info-circle me-2"></i>
                                                Basic Information
                                            </h6>
                                            <div className="row g-3">
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-muted small">Event Type</label>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-party text-primary me-2"></i>
                                                        <span className="fw-medium">{selectedHappening.event_type}</span>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-muted small">Upcoming Event</label>
                                                    <div>
                                                        <span className={`badge ${selectedHappening.upcoming_event ? "bg-warning" : "bg-secondary"}`}>
                                                            {selectedHappening.upcoming_event ? "Yes" : "No"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Title</label>
                                                    <p className="fw-semibold text-dark mb-0">{selectedHappening.title}</p>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Slug</label>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-link text-muted me-2"></i>
                                                        <code className="text-primary">{selectedHappening.slug}</code>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Alt Image Text</label>
                                                    <p className="mb-0">{selectedHappening.alt_text || <span className="text-muted">—</span>}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Event Dates */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-calendar me-2"></i>
                                                Event Dates
                                            </h6>
                                            <div className="row g-3">
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-muted small">From</label>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-calendar-check text-success me-2"></i>
                                                        <span>{selectedHappening.event_date_from || <span className="text-muted">—</span>}</span>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-muted small">To</label>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-calendar-x text-danger me-2"></i>
                                                        <span>{selectedHappening.event_date_to || <span className="text-muted">—</span>}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-text me-2"></i>
                                                Content
                                            </h6>
                                            <div className="row g-3">
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Short Description</label>
                                                    <div className="border rounded p-3 bg-light">
                                                        <p className="mb-0 small">{selectedHappening.short_description || <span className="text-muted">—</span>}</p>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Description</label>
                                                    <div 
                                                        className="border rounded p-3 bg-light"
                                                        style={{ maxHeight: "200px", overflowY: "auto" }}
                                                    >
                                                        <div className="small">
                                                            {selectedHappening.description || <span className="text-muted">—</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Media Links */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-link-alt me-2"></i>
                                                Media & Links
                                            </h6>
                                            <div className="row g-3">
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Video URL</label>
                                                    {selectedHappening.video ? (
                                                        <a 
                                                            href={selectedHappening.video} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="d-flex align-items-center text-primary text-decoration-none"
                                                        >
                                                            <i className="bx bx-play-circle me-2"></i>
                                                            <span className="text-truncate">{selectedHappening.video}</span>
                                                        </a>
                                                    ) : (
                                                        <span className="text-muted">—</span>
                                                    )}
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">PDF Title</label>
                                                    <p className="mb-0">{selectedHappening.pdf_title || <span className="text-muted">—</span>}</p>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">PDF URL</label>
                                                    {selectedHappening.pdf ? (
                                                        <a 
                                                            href={selectedHappening.pdf} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="d-flex align-items-center text-primary text-decoration-none"
                                                        >
                                                            <i className="bx bx-file me-2"></i>
                                                            <span className="text-truncate">{selectedHappening.pdf}</span>
                                                        </a>
                                                    ) : (
                                                        <span className="text-muted">—</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sidebar - Right Side */}
                                    <div className="col-md-4 p-4 bg-light">
                                        {/* Status & Settings */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-cog me-2"></i>
                                                Settings
                                            </h6>
                                            <div className="space-y-3">
                                                <div className="d-flex justify-content-between align-items-center p-3 bg-white rounded border">
                                                    <span className="fw-semibold">Status</span>
                                                    <span className={`badge ${selectedHappening.status ? "bg-success" : "bg-danger"}`}>
                                                        {selectedHappening.status ? "Active" : "Inactive"}
                                                    </span>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center p-3 bg-white rounded border">
                                                    <span className="fw-semibold">Show on Home</span>
                                                    <span className={`badge ${selectedHappening.show_on_home ? "bg-primary" : "bg-secondary"}`}>
                                                        {selectedHappening.show_on_home ? "Yes" : "No"}
                                                    </span>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center p-3 bg-white rounded border">
                                                    <span className="fw-semibold">Display Order</span>
                                                    <span className="badge bg-info">{selectedHappening.display_order}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Media Preview */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-image me-2"></i>
                                                Media Preview
                                            </h6>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="form-label fw-semibold text-muted small mb-2">Main Image</label>
                                                    {selectedHappening.image ? (
                                                        <div 
                                                            className="border rounded p-2 bg-white cursor-pointer"
                                                            onClick={() => showImageModal(selectedHappening.image)}
                                                        >
                                                            <img
                                                                src={selectedHappening.image}
                                                                alt="Happening"
                                                                className="img-fluid rounded"
                                                                style={{ height: "120px", width: "100%", objectFit: "cover" }}
                                                            />
                                                            <div className="text-center mt-2">
                                                                <small className="text-primary">
                                                                    <i className="bx bx-zoom-in me-1"></i>
                                                                    Click to enlarge
                                                                </small>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="border rounded p-4 text-center bg-white">
                                                            <i className="bx bx-image text-muted mb-2" style={{ fontSize: "2rem" }}></i>
                                                            <p className="text-muted small mb-0">No image</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="form-label fw-semibold text-muted small mb-2">Banner Image</label>
                                                    {selectedHappening.banner_images ? (
                                                        <div 
                                                            className="border rounded p-2 bg-white cursor-pointer"
                                                            onClick={() => showImageModal(selectedHappening.banner_images)}
                                                        >
                                                            <img
                                                                src={selectedHappening.banner_images}
                                                                alt="Happening Banner"
                                                                className="img-fluid rounded"
                                                                style={{ height: "120px", width: "100%", objectFit: "cover" }}
                                                            />
                                                            <div className="text-center mt-2">
                                                                <small className="text-primary">
                                                                    <i className="bx bx-zoom-in me-1"></i>
                                                                    Click to enlarge
                                                                </small>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="border rounded p-4 text-center bg-white">
                                                            <i className="bx bx-image text-muted mb-2" style={{ fontSize: "2rem" }}></i>
                                                            <p className="text-muted small mb-0">No banner image</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <div>
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-rocket me-2"></i>
                                                Quick Actions
                                            </h6>
                                            <div className="d-grid gap-2">
                                                <button
                                                    onClick={() => handleEditFromModal(selectedHappening.id)}
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    <i className="bx bx-edit me-1"></i>
                                                    Edit Happening
                                                </button>
                                                <button
                                                    onClick={() => handleMappingFromModal(selectedHappening.id)}
                                                    className="btn btn-outline-primary btn-sm"
                                                >
                                                    <i className="bx bx-right-arrow-circle me-1"></i>
                                                    Manage Mapping
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        closeViewModal();
                                                        showDeleteModal(selectedHappening.id);
                                                    }}
                                                    className="btn btn-outline-danger btn-sm"
                                                >
                                                    <i className="bx bx-trash me-1"></i>
                                                    Delete Happening
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="bx bx-error-circle text-muted mb-3" style={{ fontSize: "3rem" }}></i>
                                    <p className="text-muted">No details available.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="modal-footer bg-light">
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={closeViewModal}
                            >
                                <i className="bx bx-x me-1"></i>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            <div
                className="modal fade"
                id="deleteConfirmModal"
                tabIndex="-1"
                aria-hidden="true"
                ref={modalRef}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm Deletion</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete this Happening?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleConfirmDelete}
                                disabled={processing}
                            >
                                {processing ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Preview Modal */}
            <div
                className="modal fade"
                id="imagePreviewModal"
                tabIndex="-1"
                aria-hidden="true"
                ref={imageModalRef}
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Happening Image</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body text-center">
                            {selectedImage ? (
                                <img
                                    src={selectedImage}
                                    alt="Happening Preview"
                                    style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: "8px" }}
                                />
                            ) : (
                                <p>No image available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            {happenings.links.length > 3 && (
                <div className="row m-2">
                    <div className="col-md-4">
                        <p className="text-dark mb-0 mt-2">
                            Showing {happenings.from ?? 0} to {happenings.to ?? 0} of {happenings.total} entries
                        </p>
                    </div>
                    <div className="col-md-8">
                        <div className="float-end">
                            <Pagination links={happenings.links} query={query} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Index;