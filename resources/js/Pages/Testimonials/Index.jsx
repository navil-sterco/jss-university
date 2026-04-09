import React, { useEffect, useRef, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import { router, usePage } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';
import { debounce } from "lodash";

const Index = (props) => {
    const { searchTerm, testimonials } = props;
    const [query, setQuery] = useState(searchTerm || "");
    const { flash } = usePage().props;
    const modalRef = useRef(null);
    const modalInstance = useRef(null);
    const [idDelete, setIdDelete] = useState(null);

    const [selectedTestimonial, setSelectedTestimonial] = useState(null);
    const viewModalRef = useRef(null);
    const viewModalInstance = useRef(null);

    const [selectedImage, setSelectedImage] = useState(null);
    const imageModalRef = useRef(null);
    const imageModalInstance = useRef(null);

    const { get, processing } = useForm();

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash.success]);

    useEffect(() => {
        const delaySearch = debounce(() => {
            router.get("testimonial", { search: query }, { preserveState: true, replace: true });
        }, 300);

        delaySearch();
        return () => delaySearch.cancel();
    }, [query]);

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

    const showDeleteModal = (id) => {
        setIdDelete(id);
        modalInstance.current.show();
    };

    const handleConfirmDelete = () => {
        get(route('testimonial.destroy', idDelete), {
            onSuccess: () => {
                modalInstance.current.hide();
                setIdDelete(null);
            }
        });
    };

    const toggleStatus = (id) => {
        router.post(route('testimonial.toggleStatus', id), {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const showImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        imageModalInstance.current.show();
    };

    const showViewModal = (testimonial) => {
        setSelectedTestimonial(testimonial);
        viewModalInstance.current.show();
    };

    const closeViewModal = () => {
        viewModalInstance.current.hide();
        setSelectedTestimonial(null);
        
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => {
            backdrop.remove();
        });
        
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    };

    const handleEditFromModal = (id) => {
        closeViewModal();
        setTimeout(() => {
            router.get(route('testimonial.edit', id));
        }, 150);
    };

    const handleMappingFromModal = (id) => {
        closeViewModal();
        setTimeout(() => {
            router.get(route('testimonial.mapping', id));
        }, 150);
    };

    return (
        <>
            <h1 className="text-muted">Testimonials List</h1>
            <ToastContainer />
            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-6 col-8">
                            <div className="input-group input-group-merge">
                                <span className="input-group-text" id="basic-addon-search31">
                                    <i className="bx bx-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search By Testimonial Title..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    aria-label="Search..."
                                    aria-describedby="basic-addon-search31"
                                />
                            </div>
                        </div>
                        <div className="col-md-6 col-3">
                            <Link
                                href={route('testimonial.create')}
                                className="btn btn-primary float-end"
                                aria-label="Click me"
                            >
                                <i className='bx bx-plus'></i>
                                <span className='d-none d-sm-inline-block'>Add Testimonials</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="table-responsive text-nowrap">
                    <table className="table table-hover my-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Title</th>
                                <th>Slug</th>
                                <th>Image</th>
                                <th>Display Order</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                            {testimonials.data.map((testimonial) => (
                                <tr key={testimonial.id}>
                                    <td className='description-cell'><i className="bx bx-category bx-sm me-3"></i>{testimonial.type}</td>
                                    <td className='description-cell'><i className="bx bx-heading bx-sm me-3"></i>{testimonial.title}</td>
                                    <td className='description-cell'><i className="bx bx-link bx-sm me-3"></i>{testimonial.slug}</td>
                                    <td>
                                        {testimonial.image ? (
                                            <img
                                                src={testimonial.image}
                                                alt="testimonial"
                                                className="img-thumbnail"
                                                style={{
                                                    width: "80px",
                                                    height: "50px",
                                                    objectFit: "cover",
                                                    cursor: "pointer"
                                                }}
                                                onClick={() => showImageModal(testimonial.image)}
                                            />
                                        ) : (
                                            <span className="text-muted">No image</span>
                                        )}
                                    </td>
                                    <td><i className="bx bx-category bx-sm me-3"></i>{testimonial.display_order}</td>
                                    <td>
                                        <span
                                            className={`badge cursor-pointer ${testimonial.status == 1 ? "bg-label-success" : "bg-label-danger"}`}
                                            onClick={() => toggleStatus(testimonial.id)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {testimonial.status == 1 ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <Link
                                                className="btn btn-sm btn-outline-primary p-1 m-1"
                                                href={route("testimonial.mapping", testimonial.id)}
                                            >
                                                <span className="tf-icons bx bx-right-arrow-circle bx-18px me-2"></span>Mapping
                                            </Link>
                                            <div className="dropdown">
                                                <button
                                                    aria-label='Click me'
                                                    type="button"
                                                    className="btn btn-outline-secondary p-1 m-1 dropdown-toggle hide-arrow"
                                                    data-bs-toggle="dropdown"
                                                >
                                                    <i className="bx bx-dots-vertical-rounded"></i>
                                                </button>
                                                <div className="dropdown-menu">
                                                    <a
                                                        href="#viewDetailsModal"
                                                        data-bs-toggle="modal"
                                                        onClick={() => showViewModal(testimonial)}
                                                        className="dropdown-item"
                                                    >
                                                        <i className="bx bx-show me-1"></i> View
                                                    </a>
                                                    <Link
                                                        aria-label="dropdown action option"
                                                        className="dropdown-item"
                                                        href={route("testimonial.edit", testimonial.id)}
                                                    >
                                                        <i className="bx bx-edit-alt me-1"></i> Edit
                                                    </Link>
                                                    <a
                                                        onClick={() => showDeleteModal(testimonial.id)}
                                                        aria-label="dropdown action option"
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
                                        Testimonial Details
                                    </h5>
                                    {selectedTestimonial && (
                                        <p className="text-muted mb-0 small">
                                            ID: {selectedTestimonial.id} • Created: {selectedTestimonial.created_at}
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
                            {selectedTestimonial ? (
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
                                                    <label className="form-label fw-semibold text-muted small">Type</label>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-category text-primary me-2"></i>
                                                        <span className="fw-medium">{selectedTestimonial.type}</span>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-muted small">Display Order</label>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-sort text-info me-2"></i>
                                                        <span className="badge bg-info">{selectedTestimonial.display_order}</span>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Title</label>
                                                    <p className="fw-semibold text-dark mb-0">{selectedTestimonial.title}</p>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Slug</label>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-link text-muted me-2"></i>
                                                        <code className="text-primary">{selectedTestimonial.slug}</code>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Alt Text</label>
                                                    <p className="mb-0">{selectedTestimonial.alt_text || <span className="text-muted">—</span>}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Author Details */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-user me-2"></i>
                                                Author Details
                                            </h6>
                                            <div className="row g-3">
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-muted small">Name</label>
                                                    <p className="mb-0">{selectedTestimonial.name || <span className="text-muted">—</span>}</p>
                                                </div>
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-muted small">Batch</label>
                                                    <p className="mb-0">{selectedTestimonial.batch || <span className="text-muted">—</span>}</p>
                                                </div>
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-muted small">Course</label>
                                                    <p className="mb-0">{selectedTestimonial.course || <span className="text-muted">—</span>}</p>
                                                </div>
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-muted small">Designation</label>
                                                    <p className="mb-0">{selectedTestimonial.designation || <span className="text-muted">—</span>}</p>
                                                </div>
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-muted small">Company</label>
                                                    <p className="mb-0">{selectedTestimonial.company || <span className="text-muted">—</span>}</p>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Location</label>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-map text-muted me-2"></i>
                                                        <span>{selectedTestimonial.location || <span className="text-muted">—</span>}</span>
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
                                                        <p className="mb-0 small">{selectedTestimonial.short_description || <span className="text-muted">—</span>}</p>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Description</label>
                                                    <div 
                                                        className="border rounded p-3 bg-light"
                                                        style={{ maxHeight: "200px", overflowY: "auto" }}
                                                    >
                                                        <div className="small">
                                                            {selectedTestimonial.description || <span className="text-muted">—</span>}
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
                                                    {selectedTestimonial.video_url ? (
                                                        <a 
                                                            href={selectedTestimonial.video_url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="d-flex align-items-center text-primary text-decoration-none"
                                                        >
                                                            <i className="bx bx-play-circle me-2"></i>
                                                            <span className="text-truncate">{selectedTestimonial.video_url}</span>
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
                                                    <span className={`badge ${selectedTestimonial.status == 1 ? "bg-success" : "bg-danger"}`}>
                                                        {selectedTestimonial.status == 1 ? "Active" : "Inactive"}
                                                    </span>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center p-3 bg-white rounded border">
                                                    <span className="fw-semibold">Show on Home</span>
                                                    <span className={`badge ${selectedTestimonial.show_on_home == 1 ? "bg-primary" : "bg-secondary"}`}>
                                                        {selectedTestimonial.show_on_home == 1 ? "Yes" : "No"}
                                                    </span>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center p-3 bg-white rounded border">
                                                    <span className="fw-semibold">Display Order</span>
                                                    <span className="badge bg-info">{selectedTestimonial.display_order}</span>
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
                                                    <label className="form-label fw-semibold text-muted small mb-2">Profile Image</label>
                                                    {selectedTestimonial.image ? (
                                                        <div 
                                                            className="border rounded p-2 bg-white cursor-pointer"
                                                            onClick={() => showImageModal(selectedTestimonial.image)}
                                                        >
                                                            <img
                                                                src={selectedTestimonial.image}
                                                                alt={selectedTestimonial.alt_text || 'Testimonial Image'}
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
                                                    onClick={() => handleEditFromModal(selectedTestimonial.id)}
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    <i className="bx bx-edit me-1"></i>
                                                    Edit Testimonial
                                                </button>
                                                <button
                                                    onClick={() => handleMappingFromModal(selectedTestimonial.id)}
                                                    className="btn btn-outline-primary btn-sm"
                                                >
                                                    <i className="bx bx-right-arrow-circle me-1"></i>
                                                    Manage Mapping
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        closeViewModal();
                                                        showDeleteModal(selectedTestimonial.id);
                                                    }}
                                                    className="btn btn-outline-danger btn-sm"
                                                >
                                                    <i className="bx bx-trash me-1"></i>
                                                    Delete Testimonial
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
                aria-labelledby="deleteConfirmLabel"
                tabIndex="-1"
                aria-hidden="true"
                ref={modalRef}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteConfirmLabel">Confirm Deletion</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete this Testimonial?
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
                                onClick={handleConfirmDelete}
                                disabled={processing}
                            >
                                {processing ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Preview Modal */}
            <div
                className="modal fade"
                id="imagePreviewModal"
                aria-labelledby="imagePreviewLabel"
                tabIndex="-1"
                aria-hidden="true"
                ref={imageModalRef}
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="imagePreviewLabel">Testimonial Image</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body text-center">
                            {selectedImage ? (
                                <img
                                    src={selectedImage}
                                    alt="testimonial Preview"
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "80vh",
                                        borderRadius: "8px"
                                    }}
                                />
                            ) : (
                                <p>No image available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            {testimonials.links.length > 3 && (
                <div className="row m-2">
                    <div className="col-md-4">
                        <p className="text-dark mb-0 mt-2">
                            Showing {testimonials.from ?? 0} to {testimonials.to ?? 0} of {testimonials.total} entries
                        </p>
                    </div>
                    <div className="col-md-8">
                        <div className="float-end">
                            <Pagination links={testimonials.links} query={query} />
                        </div>
                    </div>
                </div>
            )}

            {/* Custom CSS for Right Sidebar Modal */}
            <style jsx>{`
                .modal-right .modal-dialog {
                    position: fixed;
                    right: 0;
                    margin: 0;
                    width: 90%;
                    max-width: 1200px;
                    height: 100%;
                    transform: translateX(100%);
                    transition: transform 0.3s ease-out;
                }
                
                .modal-right.show .modal-dialog {
                    transform: translateX(0);
                }
                
                .modal-right .modal-content {
                    height: 100%;
                    border-radius: 0;
                    border: none;
                }
                
                .section-title {
                    font-size: 0.75rem;
                    letter-spacing: 0.5px;
                }
                
                .space-y-3 > * + * {
                    margin-top: 0.75rem;
                }
                
                .cursor-pointer {
                    cursor: pointer;
                }
                
                @media (max-width: 768px) {
                    .modal-right .modal-dialog {
                        width: 100%;
                    }
                    .border-end {
                        border-right: none !important;
                        border-bottom: 1px solid #dee2e6;
                    }
                }
            `}</style>
        </>
    );
};

export default Index;
