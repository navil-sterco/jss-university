import React, { useEffect, useRef, useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import { router, usePage } from "@inertiajs/react";
import { ToastContainer, toast } from "react-toastify";
import _ from "lodash";

const Index = (props) => {
    const { leadership, searchTerm } = props;
    const [query, setQuery] = useState(searchTerm || "");
    const { flash } = usePage().props;
    const modalRef = useRef(null);
    const modalInstance = useRef(null);
    const [idDelete, setIdDelete] = useState(null);

    // View modal
    const [selectedLeadership, setSelectedLeadership] = useState(null);
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
            router.get("leadership", { search: query }, { preserveState: true, replace: true });
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
        get(route("leadership.destroy", idDelete), {
            onSuccess: () => {
                modalInstance.current.hide();
                setIdDelete(null);
            },
        });
    };

    // Toggle status
    const toggleStatus = (id) => {
        router.post(route("leadership.toggleStatus", id), {}, {
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
    const showViewModal = (leadership) => {
        setSelectedLeadership(leadership);
        viewModalInstance.current.show();
    };

    // Close view sidebar modal and remove backdrop
    const closeViewModal = () => {
        viewModalInstance.current.hide();
        setSelectedLeadership(null);
        
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
        setTimeout(() => {
            router.get(route("leadership.edit", id));
        }, 150);
    };

    return (
        <>
            <h1 className="text-muted">Leadership List</h1>
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
                                    placeholder="Search by name"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 col-3">
                            <Link
                                href={route("leadership.create")}
                                className="btn btn-primary float-end"
                            >
                                <i className="bx bx-plus"></i>
                                <span className="d-none d-sm-inline-block">Add Leadership</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="table-responsive text-nowrap">
                    <table className="table table-hover my-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Image</th>
                                <th>Display Order</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leadership.data.map((leader) => (
                                <tr key={leader.id}>
                                    <td>
                                        <i className="bx bx-user bx-sm me-3"></i>
                                        {leader.name}
                                    </td>
                                    <td>
                                        <i className="bx bx-category bx-sm me-3"></i>
                                        {leader.type}
                                    </td>
                                    <td>
                                        {leader.image ? (
                                            <img
                                                src={leader.image}
                                                alt={leader.name}
                                                className="img-thumbnail"
                                                style={{
                                                    width: "80px",
                                                    height: "50px",
                                                    objectFit: "cover",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => showImageModal(leader.image)}
                                            />
                                        ) : (
                                            <span className="text-muted">No image</span>
                                        )}
                                    </td>
                                    <td>
                                        <i className="bx bx-sort bx-sm me-3"></i>
                                        {leader.display_order}
                                    </td>
                                    <td>
                                        <span
                                            className={`badge cursor-pointer ${
                                                leader.status ? "bg-label-success" : "bg-label-danger"
                                            }`}
                                            onClick={() => toggleStatus(leader.id)}
                                        >
                                            {leader.status ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-1">
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
                                                        onClick={() => showViewModal(leader)}
                                                        className="dropdown-item"
                                                    >
                                                        <i className="bx bx-show me-1"></i> View
                                                    </a>
                                                    <Link
                                                        className="dropdown-item"
                                                        href={route("leadership.edit", leader.id)}
                                                    >
                                                        <i className="bx bx-edit-alt me-1"></i> Edit
                                                    </Link>
                                                    <a
                                                        onClick={() => showDeleteModal(leader.id)}
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
                                        <i className="bx bx-user-circle me-2"></i>
                                        Leadership Details
                                    </h5>
                                    {selectedLeadership && (
                                        <p className="text-muted mb-0 small">
                                            ID: {selectedLeadership.id} • Created: {selectedLeadership.created_at}
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
                            {selectedLeadership ? (
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
                                                    <label className="form-label fw-semibold text-muted small">Full Name</label>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-user text-primary me-2"></i>
                                                        <span className="fw-medium">{selectedLeadership.name}</span>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-muted small">Type</label>
                                                    <div>
                                                        <span className="badge bg-primary">
                                                            <i className="bx bx-tag me-1"></i>
                                                            {selectedLeadership.type}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Short Description</label>
                                                    <p className="mb-0">{selectedLeadership.short_description || <span className="text-muted">—</span>}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-detail me-2"></i>
                                                Description
                                            </h6>
                                            {selectedLeadership.description && selectedLeadership.description.length > 0 ? (
                                                <div className="space-y-2">
                                                    {selectedLeadership.description.map((desc, index) => (
                                                        <div key={index} className="border rounded p-3 bg-light mb-1">
                                                            <div className="d-flex align-items-start">
                                                                <i className="bx bx-check-circle text-success me-2"></i>
                                                                <span className="small">{desc}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-3 border rounded bg-light">
                                                    <i className="bx bx-text text-muted mb-2" style={{ fontSize: "2rem" }}></i>
                                                    <p className="text-muted small mb-0">No description available</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Biography */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-book-open me-2"></i>
                                                Biography
                                            </h6>
                                            {selectedLeadership.biography ? (
                                                <div className="border rounded p-3 bg-light">
                                                    <p className="mb-0 small">{selectedLeadership.biography}</p>
                                                </div>
                                            ) : (
                                                <div className="text-center py-3 border rounded bg-light">
                                                    <i className="bx bx-book text-muted mb-2" style={{ fontSize: "2rem" }}></i>
                                                    <p className="text-muted small mb-0">No biography available</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Messages */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-message-dots me-2"></i>
                                                Messages
                                            </h6>
                                            {selectedLeadership.message && selectedLeadership.message.length > 0 ? (
                                                <div className="space-y-2">
                                                    {selectedLeadership.message.map((msg, index) => (
                                                        <div key={index} className="border rounded p-3 bg-light mb-1">
                                                            <div className="d-flex align-items-start">
                                                                <i className="bx bx-message text-info me-2"></i>
                                                                <span className="small">{msg}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-3 border rounded bg-light">
                                                    <i className="bx bx-message text-muted mb-2" style={{ fontSize: "2rem" }}></i>
                                                    <p className="text-muted small mb-0">No messages available</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Sidebar - Right Side */}
                                    <div className="col-md-4 p-4 bg-light">
                                        {/* Profile Image */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-image me-2"></i>
                                                Profile Image
                                            </h6>
                                            {selectedLeadership.image ? (
                                                <div 
                                                    className="border rounded p-3 bg-white cursor-pointer text-center"
                                                    onClick={() => showImageModal(selectedLeadership.image)}
                                                >
                                                    <img
                                                        src={selectedLeadership.image}
                                                        alt={selectedLeadership.name}
                                                        className="img-fluid mb-2"
                                                        style={{ width: "200px", height: "150px", objectFit: "cover" }}
                                                    />
                                                    <div className="text-center">
                                                        <small className="text-primary">
                                                            <i className="bx bx-zoom-in me-1"></i>
                                                            Click to enlarge
                                                        </small>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="border rounded p-4 text-center bg-white">
                                                    <i className="bx bx-user text-muted mb-2" style={{ fontSize: "3rem" }}></i>
                                                    <p className="text-muted small mb-0">No profile image</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Banner Image */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-photo-album me-2"></i>
                                                Banner Image
                                            </h6>
                                            {selectedLeadership.banner_image ? (
                                                <div 
                                                    className="border rounded p-3 bg-white cursor-pointer text-center"
                                                    onClick={() => showImageModal(selectedLeadership.banner_image)}
                                                >
                                                    <img
                                                        src={selectedLeadership.banner_image}
                                                        alt="Banner"
                                                        className="img-fluid mb-2"
                                                        style={{ width: "200px", height: "100px", objectFit: "cover" }}
                                                    />
                                                    <div className="text-center">
                                                        <small className="text-primary">
                                                            <i className="bx bx-zoom-in me-1"></i>
                                                            Click to enlarge
                                                        </small>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="border rounded p-4 text-center bg-white">
                                                    <i className="bx bx-image text-muted mb-2"></i>
                                                    <p className="text-muted small mb-0">No banner image</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Video */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-video me-2"></i>
                                                Video
                                            </h6>
                                            {selectedLeadership.video ? (
                                                <div className="border rounded p-3 bg-white text-center">
                                                    <i className="bx bx-video text-primary mb-2" style={{ fontSize: "2rem" }}></i>
                                                    <p className="small mb-1">Video file available</p>
                                                    <a 
                                                        href={selectedLeadership.video} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="btn btn-sm btn-outline-primary"
                                                    >
                                                        <i className="bx bx-download me-1"></i>
                                                        Download
                                                    </a>
                                                </div>
                                            ) : (
                                                <div className="border rounded p-4 text-center bg-white">
                                                    <i className="bx bx-video text-muted mb-2"></i>
                                                    <p className="text-muted small mb-0">No video available</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Status & Quick Actions */}
                                        <div>
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-cog me-2"></i>
                                                Status & Actions
                                            </h6>
                                            <div className="space-y-3">
                                                <div className="d-flex justify-content-between align-items-center p-3 bg-white rounded border">
                                                    <span className="fw-semibold">Status</span>
                                                    <span className={`badge ${selectedLeadership.status ? "bg-success" : "bg-danger"}`}>
                                                        {selectedLeadership.status ? "Active" : "Inactive"}
                                                    </span>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center p-3 bg-white rounded border">
                                                    <span className="fw-semibold">Display Order</span>
                                                    <span className="badge bg-info">{selectedLeadership.display_order}</span>
                                                </div>
                                                
                                                <div className="d-grid gap-2">
                                                    <button
                                                        onClick={() => handleEditFromModal(selectedLeadership.id)}
                                                        className="btn btn-primary btn-sm"
                                                    >
                                                        <i className="bx bx-edit me-1"></i>
                                                        Edit Leadership
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            closeViewModal();
                                                            showDeleteModal(selectedLeadership.id);
                                                        }}
                                                        className="btn btn-outline-danger btn-sm"
                                                    >
                                                        <i className="bx bx-trash me-1"></i>
                                                        Delete Leadership
                                                    </button>
                                                </div>
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
                            Are you sure you want to delete this leadership member? This action cannot be undone.
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
                            <h5 className="modal-title">Image Preview</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body text-center">
                            {selectedImage ? (
                                <img
                                    src={selectedImage}
                                    alt="Preview"
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
            {leadership.links.length > 3 && (
                <div className="row m-2">
                    <div className="col-md-4">
                        <p className="text-dark mb-0 mt-2">
                            Showing {leadership.from ?? 0} to {leadership.to ?? 0} of {leadership.total} entries
                        </p>
                    </div>
                    <div className="col-md-8">
                        <div className="float-end">
                            <Pagination links={leadership.links} query={query} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Index;