import React, { useEffect, useRef, useState } from 'react';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import { ToastContainer, toast } from 'react-toastify';
import { debounce } from "lodash";

const DepartmentIndex = (props) => {
    const { searchTerm, departments } = props;
    const { flash } = usePage().props;

    const [query, setQuery] = useState(searchTerm || "");
    const modalRef = useRef(null);
    const modalInstance = useRef(null);
    const viewModalRef = useRef(null);
    const viewModalInstance = useRef(null);
    const [departmentIdDelete, setDepartmentIdDelete] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const { get, processing } = useForm();

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
    }, [flash.success]);

    useEffect(() => {
        const delaySearch = debounce(() => {
            router.get("department", { search: query }, { preserveState: true, replace: true });
        }, 300);
        delaySearch();
        return () => delaySearch.cancel();
    }, [query]);

    useEffect(() => {
        if (modalRef.current) modalInstance.current = new bootstrap.Modal(modalRef.current);
        if (viewModalRef.current) viewModalInstance.current = new bootstrap.Modal(viewModalRef.current);
    }, []);

    const showDeleteModal = (id) => {
        setDepartmentIdDelete(id);
        modalInstance.current.show();
    };

    const showViewModal = (department) => {
        setSelectedDepartment(department);
        viewModalInstance.current.show();
    };

    const closeViewModal = () => {
        viewModalInstance.current.hide();
        setSelectedDepartment(null);
    };

    const handleConfirmDelete = () => {
        get(route('department.destroy', departmentIdDelete), {
            onSuccess: () => {
                modalInstance.current.hide();
                setDepartmentIdDelete(null);
            },
        });
    };

    const toggleStatus = (id) => {
        router.post(route('department.toggleStatus', id), {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleEditFromModal = (id) => {
        closeViewModal();
        router.get(route('department.edit', id));
    };

    const renderUsefulLinks = (links) => {  
        if (!links || links.length === 0) return <span className="text-muted">—</span>;
        
        return (
            <div className="space-y-2">
                {links.map((link, index) => (
                    <div key={index} className="d-flex align-items-center p-2 bg-white rounded border mb-1">
                        <i className="bx bx-link text-primary me-2"></i>
                        <div className="flex-grow-1">
                            <div className="fw-medium">{link.text || 'No text'}</div>
                            <a 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary small text-truncate d-block"
                                style={{ maxWidth: '200px' }}
                            >
                                {link.url}
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <h1 className="text-muted">Departments List</h1>
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
                                    placeholder="Search by Department Name..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 col-3">
                            <Link
                                href={route('department.create')}
                                className="btn btn-primary float-end"
                            >
                                <i className='bx bx-plus'></i>
                                <span className='d-none d-sm-inline-block'>Add Department</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="table-responsive text-nowrap">
                    <table className="table table-hover my-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>School</th>
                                <th>Slug</th>
                                <th>Menu Name</th>
                                <th>Status</th>
                                <th>Display Order</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.data.map((department) => (
                                <tr key={department.id}>
                                    <td className='description-cell'><i className="bx bx-heading bx-sm me-3"></i>{department.name}</td>
                                    <td className='description-cell'><i className="bx bx-buildings bx-sm me-3"></i>{department.school}</td>
                                    <td className='description-cell'><i className="bx bx-link bx-sm me-3"></i>{department.slug}</td>
                                    <td><i className="bx bx-navigation bx-sm me-3"></i>{department.menu_name}</td>
                                    <td>
                                        <span
                                            className={`badge cursor-pointer ${department.status == 1 ? "bg-label-success" : "bg-label-danger"}`}
                                            onClick={() => toggleStatus(department.id)}
                                        >
                                            {department.status == 1 ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td><i className="bx bx-category bx-sm me-3"></i>{department.display_order ?? "-"}</td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <Link
                                                href={route('department.section.create', department.id)}
                                                method="get"
                                                as="button"
                                                className="btn btn-sm btn-outline-primary p-1 m-1"
                                            >
                                                <span className="tf-icons bx bx-right-arrow-circle bx-18px me-1"></span>
                                                <span className="d-none d-sm-inline">Sections</span>
                                            </Link>
                                            <div className="dropdown">
                                                <button aria-label='Click me' type="button" className="btn btn-outline-secondary p-1 m-1 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                    <i className="bx bx-dots-vertical-rounded"></i>
                                                </button>
                                                <div className="dropdown-menu">
                                                    <a
                                                        className="dropdown-item"
                                                        href="#"
                                                        onClick={() => showViewModal(department)}
                                                    >
                                                        <i className="bx bx-show"></i>View
                                                    </a>
                                                    <Link className="dropdown-item" href={route("department.edit", department.id)}>
                                                        <i className="bx bx-edit-alt me-1"></i> Edit
                                                    </Link>
                                                    <a
                                                        className="dropdown-item"
                                                        href="#"
                                                        onClick={() => showDeleteModal(department.id)}
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
                        <div className="modal-body">Are you sure you want to delete this Department?</div>
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

            {/* View Details Modal */}
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
                                        <i className="bx bx-buildings me-2"></i>
                                        Department Details
                                    </h5>
                                    {selectedDepartment && (
                                        <p className="text-muted mb-0 small">
                                            ID: {selectedDepartment.id} • School: {selectedDepartment.school}
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
                            {selectedDepartment ? (
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
                                                    <label className="form-label fw-semibold text-muted small">Department Name</label>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-heading text-primary me-2"></i>
                                                        <span className="fw-medium">{selectedDepartment.name}</span>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-muted small">Short Name</label>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-abacus text-primary me-2"></i>
                                                        <span>{selectedDepartment.short_name || <span className="text-muted">—</span>}</span>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-muted small">Menu Name</label>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-navigation text-primary me-2"></i>
                                                        <span>{selectedDepartment.menu_name || <span className="text-muted">—</span>}</span>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-muted small">Academic Year</label>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-calendar text-primary me-2"></i>
                                                        <span>{selectedDepartment.academic_year || <span className="text-muted">—</span>}</span>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Slug</label>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-link text-muted me-2"></i>
                                                        <code className="text-primary">{selectedDepartment.slug}</code>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Links & Resources */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-link-alt me-2"></i>
                                                Links & Resources
                                            </h6>
                                            <div className="row g-3">
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Apply Now Link</label>
                                                    {selectedDepartment.apply_now_link != null ? (
                                                        <a 
                                                            href={selectedDepartment.apply_now_link} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="d-flex align-items-center text-primary text-decoration-none"
                                                        >
                                                            <i className="bx bx-link-external me-2"></i>
                                                            <span className="text-truncate">{selectedDepartment.apply_now_link}</span>
                                                        </a>
                                                    ) : (
                                                        <span className="text-muted">—</span>
                                                    )}
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Useful Links</label>
                                                    {renderUsefulLinks(selectedDepartment.useful_links)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Brochure Section */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-file me-2"></i>
                                                Brochure
                                            </h6>
                                            <div className="row g-3">
                                                <div className="col-12">
                                                    {selectedDepartment.brochure != null ? (
                                                        <div className="d-flex align-items-center justify-content-between p-3 bg-white rounded border">
                                                            <div className="d-flex align-items-center">
                                                                <i className="bx bx-file text-primary me-3" style={{ fontSize: '2rem' }}></i>
                                                                <div>
                                                                    <div className="fw-medium">Department Brochure</div>
                                                                    <small className="text-muted">PDF Document</small>
                                                                </div>
                                                            </div>
                                                            <a 
                                                                href={`/${selectedDepartment.brochure}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="btn btn-primary btn-sm"
                                                            >
                                                                <i className="bx bx-download me-1"></i>
                                                                Download
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center p-4 border rounded bg-light">
                                                            <i className="bx bx-file text-muted mb-2" style={{ fontSize: '2rem' }}></i>
                                                            <p className="text-muted mb-0">No brochure available</p>
                                                        </div>
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
                                                    <span className={`badge ${selectedDepartment.status == 1 ? "bg-success" : "bg-danger"}`}>
                                                        {selectedDepartment.status == 1 ? "Active" : "Inactive"}
                                                    </span>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center p-3 bg-white rounded border">
                                                    <span className="fw-semibold">Display Order</span>
                                                    <span className="badge bg-info">{selectedDepartment.display_order || 0}</span>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center p-3 bg-white rounded border">
                                                    <span className="fw-semibold">School ID</span>
                                                    <span className="badge bg-secondary">{selectedDepartment.school_id}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* School Information */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-building me-2"></i>
                                                School Information
                                            </h6>
                                            <div className="p-3 bg-white rounded border">
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="bx bx-buildings text-primary me-2"></i>
                                                    <span className="fw-medium">{selectedDepartment.school}</span>
                                                </div>
                                                <small className="text-muted">Associated School</small>
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
                                                    onClick={() => handleEditFromModal(selectedDepartment.id)}
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    <i className="bx bx-edit me-1"></i>
                                                    Edit Department
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        closeViewModal();
                                                        showDeleteModal(selectedDepartment.id);
                                                    }}
                                                    className="btn btn-outline-danger btn-sm"
                                                >
                                                    <i className="bx bx-trash me-1"></i>
                                                    Delete Department
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="bx bx-error-circle text-muted mb-3" style={{ fontSize: "3rem" }}></i>
                                    <p className="text-muted">No department details available.</p>
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
            {departments.links.length > 3 && (
                <div className="row m-2">
                    <div className="col-md-4">
                        <p className="text-dark mb-0 mt-2">
                            Showing {departments.from ?? 0} to {departments.to ?? 0} of {departments.total} entries
                        </p>
                    </div>
                    <div className="col-md-8">
                        <div className="float-end">
                            <Pagination links={departments.links} query={query} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DepartmentIndex;
