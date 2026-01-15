import React, { useEffect, useRef, useState } from 'react';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import { ToastContainer, toast } from 'react-toastify';
import _ from 'lodash';

const Index = (props) => {
    const { searchTerm, courses } = props;
    const { flash } = usePage().props;

    const [query, setQuery] = useState(searchTerm || "");
    const modalRef = useRef(null);
    const modalInstance = useRef(null);
    const [courseIdDelete, setCourseIdDelete] = useState(null);

    const [selectedCourse, setSelectedCourse] = useState(null);
    const viewModalRef = useRef(null);
    const viewModalInstance = useRef(null);

    const { get, processing } = useForm();

    // Toast success messages
    useEffect(() => {
        if (flash.success) toast.success(flash.success);
    }, [flash.success]);

    // Debounced search
    useEffect(() => {
        const delaySearch = _.debounce(() => {
            router.get("course", { search: query }, { preserveState: true, replace: true });
        }, 300);
        delaySearch();
        return () => delaySearch.cancel();
    }, [query]);

    // Initialize modals
    useEffect(() => {
        if (modalRef.current) modalInstance.current = new bootstrap.Modal(modalRef.current);
        if (viewModalRef.current) viewModalInstance.current = new bootstrap.Modal(viewModalRef.current);
    }, []);

    // Show delete confirmation modal
    const showDeleteModal = (id) => {
        setCourseIdDelete(id);
        modalInstance.current.show();
    };

    // Confirm delete
    const handleConfirmDelete = () => {
        get(route('course.destroy', courseIdDelete), {
            onSuccess: () => {
                modalInstance.current.hide();
                setCourseIdDelete(null);
            },
        });
    };

    // Toggle status
    const toggleStatus = (id) => {
        router.post(route('course.toggleStatus', id), {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    // View modal functions
    const showViewModal = (course) => {
        setSelectedCourse(course);
        viewModalInstance.current.show();
    };

    const closeViewModal = () => {
        viewModalInstance.current.hide();
        setSelectedCourse(null);
    };

    const handleEditFromModal = (id) => {
        closeViewModal();
        router.get(route('course.edit', id));
    };

    const handleManageSections = (id) => {
        closeViewModal();
        router.get(route('course.section.create', id));
    };

    const renderUsefulLinks = (links) => {
        
        if (!links || links.length === 0) return <span className="text-muted">—</span>;
        
        return (
            <div className="space-y-2 mb-1">
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
            <h1 className="text-muted">Courses List</h1>
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
                                    placeholder="Search by Course Name..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 col-3">
                            <Link
                                href={route('course.create')}
                                className="btn btn-primary float-end"
                            >
                                <i className='bx bx-plus'></i>
                                <span className='d-none d-sm-inline-block'>Add Course</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="table-responsive text-nowrap">
                    <table className="table table-hover my-table">
                        <thead>
                            <tr>
                                <th>Department</th>
                                <th>Degree</th>
                                <th>Name</th>
                                <th>Slug</th>
                                <th>Academic Year</th>
                                <th>Display Order</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.data.map((course) => (
                                <tr key={course.id}>
                                    <td className='description-cell'><i className="bx bx-book bx-sm me-3"></i>{course.department_name ?? '-'}</td>
                                    <td className='description-cell'><i className="bx bxs-graduation bx-sm me-3"></i>{course.degree_name ?? '-'}</td>
                                    <td className='description-cell'><i className="bx bx-heading bx-sm me-3"></i>{course.name}</td>
                                    <td className='description-cell'><i className="bx bx-link bx-sm me-3"></i>{course.slug}</td>
                                    <td className='description-cell'><i className="bx bx-calendar bx-sm me-3"></i>{course.academic_year ?? '-'}</td>
                                    <td><i className="bx bx-category bx-sm me-3"></i>{course.display_order ?? '-'}</td>
                                    <td>
                                        <span
                                            className={`badge cursor-pointer ${course.status == 1 ? "bg-label-success" : "bg-label-danger"}`}
                                            onClick={() => toggleStatus(course.id)}
                                            >
                                            {course.status == 1 ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <Link
                                                href={route('course.section.create', course.id)}
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
                                                        onClick={() => showViewModal(course)}
                                                    >
                                                        <i className="bx bx-show me-1"></i> View
                                                    </a>
                                                    <Link className="dropdown-item" href={route("course.edit", course.id)}>
                                                        <i className="bx bx-edit-alt me-1"></i> Edit
                                                    </Link>
                                                    <a
                                                        className="dropdown-item"
                                                        href="#"
                                                        onClick={() => showDeleteModal(course.id)}
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
                        <div className="modal-body">Are you sure you want to delete this Course?</div>
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
                                        <i className="bx bx-book me-2"></i>
                                        Course Details
                                    </h5>
                                    {selectedCourse && (
                                        <p className="text-muted mb-0 small">
                                            ID: {selectedCourse.id} • Display Order: {selectedCourse.display_order}
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
                            {selectedCourse ? (
                                <div className="row g-0">
                                    {/* Main Content - Left Side */}
                                    <div className="col-md-8 p-4 border-end">
                                        {/* Banner Image */}
                                        {selectedCourse.banner && (
                                            <div className="mb-4">
                                                <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                    <i className="bx bx-image me-2"></i>
                                                    Banner Image
                                                </h6>
                                                <div className="text-center">
                                                    <img 
                                                        src={selectedCourse.banner} 
                                                        alt="Course banner" 
                                                        className="img-fluid rounded shadow-sm"
                                                        style={{ maxHeight: '200px' }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Course Image */}
                                        {selectedCourse.image && (
                                            <div className="mb-4">
                                                <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                    <i className="bx bx-image-alt me-2"></i>
                                                    Course Image
                                                </h6>
                                                <div className="text-center">
                                                    <img 
                                                        src={selectedCourse.image} 
                                                        alt="Course image" 
                                                        className="img-fluid rounded shadow-sm"
                                                        style={{ maxHeight: '150px', objectFit: 'cover' }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Basic Information */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-info-circle me-2"></i>
                                                Basic Information
                                            </h6>
                                            <div className="row g-3">
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Course Name</label>
                                                    <p className="fw-semibold text-dark mb-0">{selectedCourse.name}</p>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Menu Name</label>
                                                    <p className="mb-0">{selectedCourse.menu_name || <span className="text-muted">—</span>}</p>
                                                </div>
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-muted small">Short Name</label>
                                                    <p className="mb-0">{selectedCourse.name_short || <span className="text-muted">—</span>}</p>
                                                </div>
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-muted small">Slug</label>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-link text-muted me-2"></i>
                                                        <code className="text-primary">{selectedCourse.slug}</code>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Department</label>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-building text-primary me-2"></i>
                                                        <span>{selectedCourse.department_name}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Course Details */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-detail me-2"></i>
                                                Course Details
                                            </h6>
                                            <div className="row g-3">
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-muted small">Course Duration</label>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-time text-success me-2"></i>
                                                        <span>{selectedCourse.course_duration || <span className="text-muted">—</span>}</span>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-muted small">Annual Fees</label>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-dollar text-warning me-2"></i>
                                                        <span>{selectedCourse.annual_fees || <span className="text-muted">—</span>}</span>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-muted small">Academic Year</label>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-calendar text-info me-2"></i>
                                                        <span>{selectedCourse.academic_year || <span className="text-muted">—</span>}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Eligibility Information */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-check-circle me-2"></i>
                                                Eligibility Criteria
                                            </h6>
                                            <div className="row g-3">
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Eligibility Marks</label>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-award text-success me-2"></i>
                                                        <span>{selectedCourse.eligibility_marks || <span className="text-muted">—</span>}</span>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Eligibility Description</label>
                                                    <div className="bg-light p-3 rounded border">
                                                        {selectedCourse.eligibility_desc != null ? (
                                                            <p className="mb-0 text-dark">{selectedCourse.eligibility_desc}</p>
                                                        ) : (
                                                            <span className="text-muted">—</span>
                                                        )}
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
                                                    {selectedCourse.apply_now_link != null ? (
                                                        <a 
                                                            href={selectedCourse.apply_now_link} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="d-flex align-items-center text-primary text-decoration-none"
                                                        >
                                                            <i className="bx bx-link-external me-2"></i>
                                                            <span className="text-truncate">{selectedCourse.apply_now_link}</span>
                                                        </a>
                                                    ) : (
                                                        <span className="text-muted">—</span>
                                                    )}
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Useful Links</label>
                                                    {renderUsefulLinks(selectedCourse.useful_links)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Documents Section */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-file me-2"></i>
                                                Documents
                                            </h6>
                                            <div className="row g-3">
                                                {/* Program Structure PDF */}
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Program Structure</label>
                                                    {selectedCourse.program_structure != null ? (
                                                        <a 
                                                            href={selectedCourse.program_structure} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="d-flex align-items-center text-primary text-decoration-none"
                                                        >
                                                            <i className="bx bx-file me-2"></i>
                                                            <span>View Program Structure PDF</span>
                                                            <i className="bx bx-link-external ms-2 small"></i>
                                                        </a>
                                                    ) : (
                                                        <span className="text-muted">—</span>
                                                    )}
                                                </div>

                                                {/* Scholarship PDF */}
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Scholarship Details</label>
                                                    {selectedCourse.scholarship != null ? (
                                                        <a 
                                                            href={selectedCourse.scholarship} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="d-flex align-items-center text-primary text-decoration-none"
                                                        >
                                                            <i className="bx bx-file me-2"></i>
                                                            <span>View Scholarship Details PDF</span>
                                                            <i className="bx bx-link-external ms-2 small"></i>
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
                                                    <span className={`badge ${selectedCourse.status == 1 ? "bg-success" : "bg-danger"}`}>
                                                        {selectedCourse.status == 1 ? "Active" : "Inactive"}
                                                    </span>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center p-3 bg-white rounded border">
                                                    <span className="fw-semibold">Display Order</span>
                                                    <span className="badge bg-info">{selectedCourse.display_order}</span>
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
                                                    onClick={() => handleEditFromModal(selectedCourse.id)}
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    <i className="bx bx-edit me-1"></i>
                                                    Edit Course
                                                </button>
                                                <button
                                                    onClick={() => handleManageSections(selectedCourse.id)}
                                                    className="btn btn-outline-primary btn-sm"
                                                >
                                                    <i className="bx bx-right-arrow-circle me-1"></i>
                                                    Manage Sections
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        closeViewModal();
                                                        showDeleteModal(selectedCourse.id);
                                                    }}
                                                    className="btn btn-outline-danger btn-sm"
                                                >
                                                    <i className="bx bx-trash me-1"></i>
                                                    Delete Course
                                                </button>
                                            </div>
                                        </div>

                                        {/* File Information */}
                                        <div className="mt-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-folder me-2"></i>
                                                File Information
                                            </h6>
                                            <div className="space-y-2">
                                                <div className="d-flex justify-content-between align-items-center p-2 bg-white rounded border">
                                                    <span className="small">Banner Image</span>
                                                    <span className={`badge ${selectedCourse.banner != null ? "bg-success" : "bg-secondary"}`}>
                                                        {selectedCourse.banner != null ? "Uploaded" : "Not Set"}
                                                    </span>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center p-2 bg-white rounded border">
                                                    <span className="small">Course Image</span>
                                                    <span className={`badge ${selectedCourse.image != null ? "bg-success" : "bg-secondary"}`}>
                                                        {selectedCourse.image != null ? "Uploaded" : "Not Set"}
                                                    </span>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center p-2 bg-white rounded border">
                                                    <span className="small">Program Structure</span>
                                                    <span className={`badge ${selectedCourse.program_structure != null ? "bg-success" : "bg-secondary"}`}>
                                                        {selectedCourse.program_structure != null ? "Uploaded" : "Not Set"}
                                                    </span>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center p-2 bg-white rounded border">
                                                    <span className="small">Scholarship</span>
                                                    <span className={`badge ${selectedCourse.scholarship != null ? "bg-success" : "bg-secondary"}`}>
                                                        {selectedCourse.scholarship != null ? "Uploaded" : "Not Set"}
                                                    </span>
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

            {/* Pagination */}
            {courses.links.length > 3 && (
                <div className="row m-2">
                    <div className="col-md-4">
                        <p className="text-dark mb-0 mt-2">
                            Showing {courses.from ?? 0} to {courses.to ?? 0} of {courses.total} entries
                        </p>
                    </div>
                    <div className="col-md-8">
                        <div className="float-end">
                            <Pagination links={courses.links} query={query} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Index;