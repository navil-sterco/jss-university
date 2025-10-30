import React, { useEffect, useRef, useState } from 'react';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import { ToastContainer, toast } from 'react-toastify';
import _ from 'lodash';

const Index = (props) => {
    const { searchTerm, schools } = props;
    const { flash } = usePage().props;

    const [query, setQuery] = useState(searchTerm || "");
    const modalRef = useRef(null);
    const modalInstance = useRef(null);
    const [schoolIdDelete, setSchoolIdDelete] = useState(null);

    const [selectedImage, setSelectedImage] = useState(null);
    const imageModalRef = useRef(null);
    const imageModalInstance = useRef(null);

    const [selectedSchool, setSelectedSchool] = useState(null);
    const viewModalRef = useRef(null);
    const viewModalInstance = useRef(null);

    const { get, processing } = useForm();

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
    }, [flash.success]);

    useEffect(() => {
        const delaySearch = _.debounce(() => {
            router.get("schools", { search: query }, { preserveState: true, replace: true });
        }, 300);
        delaySearch();
        return () => delaySearch.cancel();
    }, [query]);

    useEffect(() => {
        if (modalRef.current) modalInstance.current = new bootstrap.Modal(modalRef.current);
        if (imageModalRef.current) imageModalInstance.current = new bootstrap.Modal(imageModalRef.current);
        if (viewModalRef.current) viewModalInstance.current = new bootstrap.Modal(viewModalRef.current);
    }, []);

    const showDeleteModal = (id) => {
        setSchoolIdDelete(id);
        modalInstance.current.show();
    };

    const handleConfirmDelete = () => {
        get(route('schools.destroy', schoolIdDelete), {
            onSuccess: () => {
                modalInstance.current.hide();
                setSchoolIdDelete(null);
            },
        });
    };

    const toggleStatus = (id) => {
        router.post(route('schools.toggleStatus', id), {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };
    
    const showImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        // Show image modal directly without closing view modal
        imageModalInstance.current.show();
    };

    const closeImageModal = () => {
        imageModalInstance.current.hide();
    };

    const showViewModal = (school) => {
        setSelectedSchool(school);
        viewModalInstance.current.show();
    };

    const closeViewModal = () => {
        viewModalInstance.current.hide();
        setSelectedSchool(null);
    };

    const handleEditFromModal = (id) => {
        closeViewModal();
        router.get(route('schools.edit', id));
    };

    const handleManageSections = (id) => {
        closeViewModal();
        router.get(route('school.section.create', id));
    };

    return (
        <>
            <h1 className="text-muted">Schools List</h1>
            <ToastContainer />
            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-6 col-8">
                            <div className="input-group input-group-merge">
                                <span className="input-group-text"><i className="bx bx-search"></i></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by School Name..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 col-3">
                            <Link
                                href={route('schools.create')}
                                className="btn btn-primary float-end"
                                aria-label="Click me"
                            >
                                <i className='bx bx-plus'></i>
                                <span className='d-none d-sm-inline-block'>Add School</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="table-responsive text-nowrap">
                    <table className="table table-hover my-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Slug</th>
                                <th>Menu Name</th>
                                <th>Short Name</th>
                                <th>Image</th>
                                <th>Status</th>
                                <th>Display Order</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schools.data.map((school) => (
                                <tr key={school.id}>
                                    <td className='description-cell'><i className="bx bx-heading bx-sm me-3"></i>{school.name}</td>
                                    <td className='description-cell'><i className="bx bx-link bx-sm me-3"></i>{school.slug}</td>
                                    <td><i className="bx bx-navigation bx-sm me-3"></i>{school.menu_name || '-'}</td>
                                    <td><i className="bx bx-abacus bx-sm me-3"></i>{school.name_short || '-'}</td>
                                    <td>
                                        {school.image ? (
                                            <img
                                                src={school.image}
                                                alt="School"
                                                className="img-thumbnail"
                                                style={{ width: "80px", height: "50px", objectFit: "cover", cursor: "pointer" }}
                                                onClick={() => showImageModal(school.image)}
                                            />
                                        ) : (
                                            <span className="text-muted">No image</span>
                                        )}
                                    </td>
                                    <td>
                                        <span
                                            className={`badge cursor-pointer ${school.status ? "bg-label-success" : "bg-label-danger"}`}
                                            onClick={() => toggleStatus(school.id)}
                                        >
                                            {school.status ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td><i className="bx bx-category bx-sm me-3"></i>{school.display_order ?? "-"}</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <Link
                                                href={route('school.section.create', school.id)}
                                                method="get"
                                                as="button"
                                                className="btn btn-sm btn-outline-primary p-1 m-1"
                                            >
                                                <span className="tf-icons bx bx-right-arrow-circle bx-18px me-2"></span>Sections
                                            </Link>
                                            <div className="dropdown">
                                                <button aria-label='Click me' type="button" className="btn btn-outline-secondary p-1 m-1 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                    <i className="bx bx-dots-vertical-rounded"></i>
                                                </button>
                                                <div className="dropdown-menu">
                                                    <a
                                                        className="dropdown-item"
                                                        href="#"
                                                        onClick={() => showViewModal(school)}
                                                    >
                                                        <i className="bx bx-show me-1"></i> View
                                                    </a>
                                                    <Link className="dropdown-item" href={route("schools.edit", school.id)}>
                                                        <i className="bx bx-edit-alt me-1"></i> Edit
                                                    </Link>
                                                    <a
                                                        className="dropdown-item"
                                                        href="#"
                                                        onClick={() => showDeleteModal(school.id)}
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

            {/* Delete Modal */}
            <div className="modal fade" ref={modalRef} tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm Deletion</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">Are you sure you want to delete this School?</div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button
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
            <div className="modal fade" ref={imageModalRef} tabIndex="-1" aria-hidden="true" style={{ zIndex: 9999 }}>
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Image Preview</h5>
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={closeImageModal}
                            ></button>
                        </div>
                        <div className="modal-body text-center">
                            {selectedImage ? (
                                <img
                                    src={selectedImage}
                                    alt="School Preview"
                                    style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: "8px" }}
                                />
                            ) : (
                                <p>No image available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* View Sidebar Modal */}
            <div
                className="modal fade modal-right"
                id="viewDetailsModal"
                tabIndex="-1"
                aria-hidden="true"
                ref={viewModalRef}
                style={{ zIndex: 9998 }}
            >
                <div className="modal-dialog modal-dialog-scrollable modal-xl">
                    <div className="modal-content h-100">
                        {/* Header */}
                        <div className="modal-header bg-light">
                            <div className="d-flex align-items-center w-100">
                                <div className="flex-grow-1">
                                    <h5 className="modal-title fw-semibold text-primary">
                                        <i className="bx bx-building me-2"></i>
                                        School Details
                                    </h5>
                                    {selectedSchool && (
                                        <p className="text-muted mb-0 small">
                                            ID: {selectedSchool.id} • Display Order: {selectedSchool.display_order}
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
                            {selectedSchool ? (
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
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">School Name</label>
                                                    <p className="fw-semibold text-dark mb-0">{selectedSchool.name}</p>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Menu Name</label>
                                                    <p className="mb-0">{selectedSchool.menu_name || <span className="text-muted">—</span>}</p>
                                                </div>
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-muted small">Short Name</label>
                                                    <p className="mb-0">{selectedSchool.name_short || <span className="text-muted">—</span>}</p>
                                                </div>
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-muted small">Slug</label>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-link text-muted me-2"></i>
                                                        <code className="text-primary">{selectedSchool.slug}</code>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Short Description</label>
                                                    <div className="border rounded p-3 bg-light">
                                                        <p className="mb-0 small">{selectedSchool.short_description || <span className="text-muted">—</span>}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Academic Information */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-book me-2"></i>
                                                Academic Information
                                            </h6>
                                            <div className="row g-3">
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-muted small">Academic Years</label>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-calendar text-success me-2"></i>
                                                        <span>{selectedSchool.academic_years || <span className="text-muted">—</span>}</span>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-muted small">Mobile Contact</label>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-phone text-primary me-2"></i>
                                                        <span>{selectedSchool.mobile_contact || <span className="text-muted">—</span>}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Virtual Tour */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-video me-2"></i>
                                                Virtual Tour
                                            </h6>
                                            <div className="row g-3">
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Virtual Tour URL</label>
                                                    {selectedSchool.virtual_tour ? (
                                                        <a 
                                                            href={selectedSchool.virtual_tour} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="d-flex align-items-center text-primary text-decoration-none"
                                                        >
                                                            <i className="bx bx-play-circle me-2"></i>
                                                            <span className="text-truncate">{selectedSchool.virtual_tour}</span>
                                                        </a>
                                                    ) : (
                                                        <span className="text-muted">—</span>
                                                    )}
                                                </div>
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-muted small">Virtual Display Order</label>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-sort text-info me-2"></i>
                                                        <span>{selectedSchool.virtual_display_order || 0}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Documents */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-file me-2"></i>
                                                Documents
                                            </h6>
                                            <div className="row g-3">
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Prospectus</label>
                                                    {selectedSchool.prospectus ? (
                                                        <a 
                                                            href={selectedSchool.prospectus} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="d-flex align-items-center text-primary text-decoration-none"
                                                        >
                                                            <i className="bx bx-file me-2"></i>
                                                            <span className="text-truncate">Download Prospectus</span>
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
                                                    <span className={`badge ${selectedSchool.status ? "bg-success" : "bg-danger"}`}>
                                                        {selectedSchool.status ? "Active" : "Inactive"}
                                                    </span>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center p-3 bg-white rounded border">
                                                    <span className="fw-semibold">Display Order</span>
                                                    <span className="badge bg-info">{selectedSchool.display_order}</span>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center p-3 bg-white rounded border">
                                                    <span className="fw-semibold">Virtual Display Order</span>
                                                    <span className="badge bg-warning">{selectedSchool.virtual_display_order}</span>
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
                                                    <label className="form-label fw-semibold text-muted small mb-2">School Image</label>
                                                    {selectedSchool.image ? (
                                                        <div 
                                                            className="border rounded p-2 bg-white cursor-pointer"
                                                            onClick={() => showImageModal(selectedSchool.image)}
                                                        >
                                                            <img
                                                                src={selectedSchool.image}
                                                                alt="School"
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
                                                    <label className="form-label fw-semibold text-muted small mb-2">Prospectus</label>
                                                    {selectedSchool.prospectus ? (
                                                        <div className="border rounded p-3 bg-white text-center">
                                                            <i className="bx bx-file-pdf text-danger mb-2" style={{ fontSize: "2rem" }}></i>
                                                            <p className="small mb-1">Prospectus Available</p>
                                                            <a 
                                                                href={selectedSchool.prospectus} 
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
                                                            <i className="bx bx-file text-muted mb-2" style={{ fontSize: "2rem" }}></i>
                                                            <p className="text-muted small mb-0">No prospectus</p>
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
                                                    onClick={() => handleEditFromModal(selectedSchool.id)}
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    <i className="bx bx-edit me-1"></i>
                                                    Edit School
                                                </button>
                                                <button
                                                    onClick={() => handleManageSections(selectedSchool.id)}
                                                    className="btn btn-outline-primary btn-sm"
                                                >
                                                    <i className="bx bx-right-arrow-circle me-1"></i>
                                                    Manage Sections
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        closeViewModal();
                                                        showDeleteModal(selectedSchool.id);
                                                    }}
                                                    className="btn btn-outline-danger btn-sm"
                                                >
                                                    <i className="bx bx-trash me-1"></i>
                                                    Delete School
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

            {/* Pagination */}
            {schools.links.length > 3 && (
                <div className="row m-2">
                    <div className="col-md-4">
                        <p className="text-dark mb-0 mt-2">
                            Showing {schools.from ?? 0} to {schools.to ?? 0} of {schools.total} entries
                        </p>
                    </div>
                    <div className="col-md-8">
                        <div className="float-end">
                            <Pagination links={schools.links} query={query} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Index;