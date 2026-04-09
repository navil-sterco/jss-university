import React, { useEffect, useRef, useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import { router, usePage } from "@inertiajs/react";
import { ToastContainer, toast } from "react-toastify";
import { debounce } from "lodash";

const Index = (props) => {
    const { faculty, searchTerm } = props;
    const [query, setQuery] = useState(searchTerm || "");
    const { flash } = usePage().props;
    const modalRef = useRef(null);
    const modalInstance = useRef(null);
    const [idDelete, setIdDelete] = useState(null);

    // View modal
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const viewModalRef = useRef(null);
    const viewModalInstance = useRef(null);

    // Image modal
    const [selectedImage, setSelectedImage] = useState(null);
    const imageModalRef = useRef(null);
    const imageModalInstance = useRef(null);

    const { get, post, processing } = useForm();

    // Toast for flash messages
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash.success]);

    // Search debounce
    useEffect(() => {
        const delaySearch = debounce(() => {
            router.get("faculty", { search: query }, { preserveState: true, replace: true });
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
        setIsDuplicateAction(false);
        modalInstance.current.show();
    };

    const handleConfirmDelete = () => {
        get(route("faculty.destroy", idDelete), {
            onSuccess: () => {
                modalInstance.current.hide();
                setIdDelete(null);
            },
        });
    };

    // Toggle status
    const toggleStatus = (id) => {
        router.post(route("faculty.toggleStatus", id), {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    // Duplicate modal handling
    const [duplicateId, setDuplicateId] = useState(null);
    const [isDuplicateAction, setIsDuplicateAction] = useState(false);

    const showDuplicateModal = (id) => {
        setDuplicateId(id);
        setIsDuplicateAction(true);
        modalInstance.current.show();
    };

    const handleConfirmDuplicate = () => {
        if (!duplicateId) return;
        // hide modal immediately to avoid leaving it open during redirect
        modalInstance.current.hide();
        post(route('faculty.duplicate', duplicateId), {}, {
            onSuccess: () => {
                setDuplicateId(null);
                setIsDuplicateAction(false);
                toast.success('Faculty duplicated successfully');
            },
            onError: () => {
                setIsDuplicateAction(false);
            },
            onFinish: () => {
                // ensure state reset even if redirect occurs
                setDuplicateId(null);
                setIsDuplicateAction(false);
            }
        });
    };

    // Image preview modal
    const showImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        imageModalInstance.current.show();
    };

    // Show view sidebar modal
    const showViewModal = (faculty) => {
        setSelectedFaculty(faculty);
        viewModalInstance.current.show();
    };

    // Close view sidebar modal and remove backdrop
    const closeViewModal = () => {
        viewModalInstance.current.hide();
        setSelectedFaculty(null);

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
            router.get(route("faculty.edit", id));
        }, 150);
    };

    const parseJsonArrayField = (fieldData) => {
        if (!fieldData) return [];

        try {
            if (Array.isArray(fieldData)) {
                return fieldData.filter(item => item && item.trim() !== '');
            }

            if (typeof fieldData === 'string') {
                const parsed = JSON.parse(fieldData);
                if (Array.isArray(parsed)) {
                    return parsed.filter(item => item && item.trim() !== '');
                }
                return parsed && parsed.trim() !== '' ? [parsed] : [];
            }

            return [];
        } catch (error) {
            // If it's a simple string (not JSON), use it as a single item
            return fieldData && fieldData.trim() !== '' ? [fieldData] : [];
        }
    };

    const parseResearchField = (researchData) => {
        if (!researchData) return [];

        try {
            if (Array.isArray(researchData)) {
                return researchData.filter(r => r && r.title && r.title.trim() !== '');
            }

            if (typeof researchData === 'string') {
                const parsed = JSON.parse(researchData);
                if (Array.isArray(parsed)) {
                    return parsed.filter(r => r && r.title && r.title.trim() !== '');
                }
                return [];
            }

            return [];
        } catch (error) {
            return [];
        }
    };

    const parseSectionsField = (sectionsData) => {
        if (!sectionsData) return [];

        try {
            if (typeof sectionsData === 'string') {
                return JSON.parse(sectionsData);
            } else if (Array.isArray(sectionsData)) {
                return sectionsData;
            }
        } catch (error) {
            console.error('Error parsing sections data:', error);
        }
        return [];
    };

    return (
        <>
            <h1 className="text-muted">Faculty & Staff List</h1>
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
                                href={route("faculty.create")}
                                className="btn btn-primary float-end"
                            >
                                <i className="bx bx-plus"></i>
                                <span className="d-none d-sm-inline-block">Add Faculty/Staff</span>
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
                                <th>School</th>
                                <th>Image</th>
                                <th>Display Order</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faculty.data.map((facultyMember) => (
                                <tr key={facultyMember.id}>
                                    <td><i className="bx bx-heading bx-sm me-3"></i>{facultyMember.name}</td>
                                    <td><i className="bx bx-links bx-sm me-3"></i>{facultyMember.slug}</td>
                                    <td><i className="bx bx-book bx-sm me-3"></i>{facultyMember.school}</td>
                                    <td>
                                        {facultyMember.image ? (
                                            <img
                                                src={facultyMember.image}
                                                alt="faculty"
                                                className="img-thumbnail"
                                                style={{
                                                    width: "80px",
                                                    height: "50px",
                                                    objectFit: "cover",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => showImageModal(facultyMember.image)}
                                            />
                                        ) : (
                                            <span className="text-muted">No image</span>
                                        )}
                                    </td>
                                    <td><i className="bx bx-category bx-sm me-3"></i>{facultyMember.display_order}</td>
                                    <td>
                                        <span
                                            className={`badge cursor-pointer ${facultyMember.status == 1 ? "bg-label-success" : "bg-label-danger"
                                                }`}
                                            onClick={() => toggleStatus(facultyMember.id)}
                                        >
                                            {facultyMember.status == 1 ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-1">
                                            <Link
                                                className="btn btn-sm btn-outline-primary p-1"
                                                href={route("faculty.mapping", facultyMember.id)}
                                            >
                                                <span className="tf-icons bx bx-right-arrow-circle bx-18px me-1"></span>
                                                Mapping
                                            </Link>

                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary p-1 ms-1"
                                                onClick={() => showDuplicateModal(facultyMember.id)}
                                            >
                                                <span className="tf-icons bx bx-copy bx-18px me-1"></span>
                                                Duplicate
                                            </button>

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
                                                        onClick={() => showViewModal(facultyMember)}
                                                        className="dropdown-item"
                                                    >
                                                        <i className="bx bx-show me-1"></i> View
                                                    </a>
                                                    <Link
                                                        className="dropdown-item"
                                                        href={route("faculty.edit", facultyMember.id)}
                                                    >
                                                        <i className="bx bx-edit-alt me-1"></i> Edit
                                                    </Link>
                                                    <a
                                                        onClick={() => showDeleteModal(facultyMember.id)}
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
                                        Faculty Details
                                    </h5>
                                    {selectedFaculty && (
                                        <p className="text-muted mb-0 small">
                                            ID: {selectedFaculty.id} • Created: {selectedFaculty.created_at}
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
                            {selectedFaculty ? (
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
                                                        <span className="fw-medium">{selectedFaculty.name}</span>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold text-muted small">Type</label>
                                                    <div>
                                                        <span className="badge bg-primary">
                                                            <i className="bx bx-tag me-1"></i>
                                                            {selectedFaculty.type}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Email</label>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bx bx-envelope text-muted me-2"></i>
                                                        <span className={selectedFaculty.email != null ? "text-dark" : "text-muted"}>
                                                            {selectedFaculty.email || "—"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">Profile Title</label>
                                                    <p className="mb-0">{selectedFaculty.profile || <span className="text-muted">—</span>}</p>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold text-muted small">LinkedIn</label>
                                                    {selectedFaculty.linkedin_url != null ? (
                                                        <a
                                                            href={selectedFaculty.linkedin_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="d-flex align-items-center text-primary text-decoration-none"
                                                        >
                                                            <i className="bx bxl-linkedin me-2"></i>
                                                            <span className="text-truncate">{selectedFaculty.linkedin_url}</span>
                                                        </a>
                                                    ) : (
                                                        <span className="text-muted">—</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Education */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-graduation-cap me-2"></i>
                                                Education
                                            </h6>
                                            {(() => {
                                                const educationArray = parseJsonArrayField(selectedFaculty.education);
                                                return educationArray.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {educationArray.map((edu, index) => (
                                                            <div key={index} className="border rounded p-3 bg-light mb-1">
                                                                <div className="d-flex align-items-start">
                                                                    <i className="bx bx-check-circle text-success me-2"></i>
                                                                    <span className="small">{edu}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-3 border rounded bg-light">
                                                        <i className="bx bx-book-open text-muted mb-2" style={{ fontSize: "2rem" }}></i>
                                                        <p className="text-muted small mb-0">No education information</p>
                                                    </div>
                                                );
                                            })()}
                                        </div>

                                        {/* Research */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-test-tube me-2"></i>
                                                Research Areas
                                            </h6>
                                            {(() => {
                                                const researchArray = parseResearchField(selectedFaculty.research);

                                                return researchArray.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {researchArray.map((research, index) => (
                                                            <div key={index} className="border rounded p-3 bg-light">
                                                                <div className="row align-items-center">
                                                                    {research.image && (
                                                                        <div className="col-auto">
                                                                            <img
                                                                                src={research.image}
                                                                                alt={research.title}
                                                                                className="rounded"
                                                                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                                            />
                                                                        </div>
                                                                    )}

                                                                    <div className={research.image != null ? "col" : "col-12"}>
                                                                        <div className="d-flex align-items-start">
                                                                            <i className="bx bx-bulb text-warning me-2 mt-1"></i>
                                                                            <div className="flex-grow-1">
                                                                                <h6 className="mb-1 fw-semibold">{research.title}</h6>
                                                                                {research.link && (
                                                                                    <a
                                                                                        href={research.link}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="small text-primary text-decoration-none"
                                                                                    >
                                                                                        <i className="bx bx-link-external me-1"></i>
                                                                                        View Research
                                                                                    </a>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-3 border rounded bg-light">
                                                        <i className="bx bx-microscope text-muted mb-2" style={{ fontSize: "2rem" }}></i>
                                                        <p className="text-muted small mb-0">No research information</p>
                                                    </div>
                                                );
                                            })()}
                                        </div>

                                        {/* NEW: Sections */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-list-ul me-2"></i>
                                                Additional Sections
                                            </h6>
                                            {(() => {
                                                const sectionsArray = parseSectionsField(selectedFaculty.sections);

                                                return sectionsArray.length > 0 ? (
                                                    <div className="space-y-4">
                                                        {sectionsArray.map((section, sectionIndex) => (
                                                            <div key={sectionIndex} className="border rounded p-3 bg-light">
                                                                <div className="d-flex align-items-start mb-2">
                                                                    <i className="bx bx-category text-primary me-2 mb-1"></i>
                                                                    <div className="flex-grow-1">
                                                                        <h6 className="mb-1 fw-semibold">{section.title}</h6>

                                                                        {/* Points */}
                                                                        {section.points && section.points.length > 0 && (
                                                                            <div className="mt-2 ps-3">
                                                                                {section.points.map((point, pointIndex) => (
                                                                                    <div key={pointIndex} className="d-flex align-items-start mb-1">
                                                                                        <i className="bx bx-chevron-right text-muted me-2" style={{ fontSize: '0.75rem' }}></i>
                                                                                        <span className="small">{point}</span>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-3 border rounded bg-light">
                                                        <i className="bx bx-layout text-muted mb-2" style={{ fontSize: "2rem" }}></i>
                                                        <p className="text-muted small mb-0">No additional sections</p>
                                                    </div>
                                                );
                                            })()}
                                        </div>

                                        {/* Teaching */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-chalkboard me-2"></i>
                                                Teaching Experience
                                            </h6>
                                            {(() => {
                                                const teachingArray = parseJsonArrayField(selectedFaculty.teaching);
                                                return teachingArray.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {teachingArray.map((teaching, index) => (
                                                            <div key={index} className="border rounded p-3 bg-light mb-1">
                                                                <div className="d-flex align-items-start">
                                                                    <i className="bx bx-book-reader text-info me-2"></i>
                                                                    <span className="small">{teaching}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-3 border rounded bg-light">
                                                        <i className="bx bx-book text-muted mb-2" style={{ fontSize: "2rem" }}></i>
                                                        <p className="text-muted small mb-0">No teaching information</p>
                                                    </div>
                                                );
                                            })()}
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
                                            {selectedFaculty.image ? (
                                                <div
                                                    className="border rounded p-3 bg-white cursor-pointer text-center"
                                                    onClick={() => showImageModal(selectedFaculty.image)}
                                                >
                                                    <img
                                                        src={selectedFaculty.image}
                                                        alt={selectedFaculty.name}
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

                                        {/* Awards & Honors */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-award me-2"></i>
                                                Awards & Honors
                                            </h6>
                                            {(() => {
                                                const awardsArray = parseJsonArrayField(selectedFaculty.award);
                                                return awardsArray.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {awardsArray.map((award, index) => (
                                                            <div key={index} className="border rounded p-2 bg-white mb-1">
                                                                <div className="d-flex align-items-start">
                                                                    <i className="bx bx-trophy text-warning me-2"></i>
                                                                    <span className="small">{award}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-3 border rounded bg-white">
                                                        <i className="bx bx-medal text-muted mb-2"></i>
                                                        <p className="text-muted small mb-0">No awards</p>
                                                    </div>
                                                );
                                            })()}
                                        </div>

                                        {/* Social Engagement */}
                                        <div className="mb-4">
                                            <h6 className="section-title text-uppercase text-muted fw-semibold mb-3">
                                                <i className="bx bx-group me-2"></i>
                                                Social Engagement
                                            </h6>
                                            {(() => {
                                                const engagementArray = parseJsonArrayField(selectedFaculty.social_engagement);
                                                return engagementArray.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {engagementArray.map((engagement, index) => (
                                                            <div key={index} className="border rounded p-2 bg-white mb-1">
                                                                <div className="d-flex align-items-start">
                                                                    <i className="bx bx-heart text-danger me-2"></i>
                                                                    <span className="small">{engagement}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-3 border rounded bg-white">
                                                        <i className="bx bx-world text-muted mb-2"></i>
                                                        <p className="text-muted small mb-0">No social engagement</p>
                                                    </div>
                                                );
                                            })()}
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
                                                    <span className={`badge ${selectedFaculty.status == 1 ? "bg-success" : "bg-danger"}`}>
                                                        {selectedFaculty.status == 1 ? "Active" : "Inactive"}
                                                    </span>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center p-3 bg-white rounded border">
                                                    <span className="fw-semibold">Display Order</span>
                                                    <span className="badge bg-info">{selectedFaculty.display_order}</span>
                                                </div>

                                                <div className="d-grid gap-2">
                                                    <button
                                                        onClick={() => handleEditFromModal(selectedFaculty.id)}
                                                        className="btn btn-primary btn-sm"
                                                    >
                                                        <i className="bx bx-edit me-1"></i>
                                                        Edit Faculty
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            closeViewModal();
                                                            showDeleteModal(selectedFaculty.id);
                                                        }}
                                                        className="btn btn-outline-danger btn-sm"
                                                    >
                                                        <i className="bx bx-trash me-1"></i>
                                                        Delete Faculty
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
                            <h5 className="modal-title">{isDuplicateAction ? 'Confirm Duplicate' : 'Confirm Deletion'}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            {isDuplicateAction ? (
                                'Are you sure you want to duplicate this faculty member? This will create a copy.'
                            ) : (
                                'Are you sure you want to delete this faculty member? This action cannot be undone.'
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Cancel
                            </button>
                            <button
                                type="button"
                                className={isDuplicateAction ? 'btn btn-primary' : 'btn btn-danger'}
                                onClick={isDuplicateAction ? handleConfirmDuplicate : handleConfirmDelete}
                                disabled={processing}
                            >
                                {processing ? (isDuplicateAction ? 'Duplicating...' : 'Processing...') : (isDuplicateAction ? 'Yes, Duplicate' : 'Yes, Delete')}
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
                            <h5 className="modal-title">Profile Image</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body text-center">
                            {selectedImage ? (
                                <img
                                    src={selectedImage}
                                    alt="Profile Preview"
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
            {faculty.links.length > 3 && (
                <div className="row m-2">
                    <div className="col-md-4">
                        <p className="text-dark mb-0 mt-2">
                            Showing {faculty.from ?? 0} to {faculty.to ?? 0} of {faculty.total} entries
                        </p>
                    </div>
                    <div className="col-md-8">
                        <div className="float-end">
                            <Pagination links={faculty.links} query={query} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Index;
