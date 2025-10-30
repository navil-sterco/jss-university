import { Link, useForm, usePage } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Image, FileText, Copy, Edit, Trash2, X } from "lucide-react";

const Index = ({ galleries, mediaCoverage, notices }) => {
    const [activeTab, setActiveTab] = useState("gallery");
    const [modalData, setModalData] = useState(null);
    const { flash } = usePage().props;
    const { get, processing } = useForm();
    const modalRef = useRef(null);
    const modalInstance = useRef(null);
    const [idDelete, setIdDelete] = useState(null);

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
    }, [flash.success]);

    const copyToClipboard = (url) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url)
                .then(() => toast.info("URL copied!"))
                .catch(() => toast.error("Failed to copy URL."));
        } else {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = url;
            textArea.style.position = "fixed"; // prevent scrolling to bottom
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                const successful = document.execCommand("copy");
                if (successful) toast.info("URL copied!");
                else toast.error("Failed to copy URL.");
            } catch (err) {
                toast.error("Failed to copy URL.");
            }
            document.body.removeChild(textArea);
        }
    };

    // Initialize modals
    useEffect(() => {
        if (modalRef.current) {
            modalInstance.current = new bootstrap.Modal(modalRef.current);
        }
    }, []);

    // Delete modal
    const showDeleteModal = (id) => {
        setIdDelete(id);
        modalInstance.current.show();
    };

    const handleConfirmDelete = () => {
        get(route('galleries.destroy', idDelete), {
            onSuccess: () => {
                modalInstance.current.hide();
                setIdDelete(null);
            }
        });
    };

    const renderCard = (item, type) => {
        const mainImage = item.images?.[0] || "/placeholder.jpg";

        return (
            <div
                className="col-auto mb-4 d-flex"
                style={{ minWidth: "280px", maxWidth: "280px", flexShrink: 0 }}
                key={item.id}
            >
                <div className="card h-100 border-light shadow-sm hover-shadow d-flex flex-column">
                    {/* Hide image for notice cards */}
                    {type !== "notice_announcement" && (
                        <div
                            className="position-relative"
                            onClick={() => setModalData(item)}
                            style={{ cursor: "pointer" }}
                        >
                            <img
                                src={mainImage}
                                alt={item.title}
                                className="card-img-top"
                                style={{
                                    height: "180px",
                                    objectFit: "cover",
                                    borderRadius: "8px 8px 0 0",
                                }}
                            />
                            <div className="position-absolute bottom-0 end-0 bg-secondary bg-opacity-50 text-white px-2 py-1 rounded-start">
                                View All
                            </div>
                        </div>
                    )}

                    <div className="card-body d-flex flex-column p-4">
                        <h5 className="card-title" style={{ fontSize: "1rem" }}>
                            {item.title}
                        </h5>
                        <p className="text-muted mb-2" style={{ fontSize: "0.75rem" }}>
                            {new Date(item.event_date).toLocaleDateString()}
                        </p>

                        {/* PDF Section for Notices */}
                        {type === "notice_announcement" && item.pdf && (
                            <div className="d-flex gap-2 align-items-center">
                                <a
                                    href={item.pdf}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-secondary d-flex align-items-center gap-1 btn-sm"
                                >
                                    <FileText size={16} /> View PDF
                                </a>
                                <button
                                    className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                                    onClick={() => copyToClipboard(item.pdf)}
                                    title="Copy URL"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-auto d-flex justify-content-between align-items-center pt-2">
                            <div className="d-flex gap-1">
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => get(route("galleries.mapping", item.id))}
                                    title="Mapping"
                                >
                                    Mapping
                                </button>
                                <button
                                    className="btn btn-sm btn-warning"
                                    onClick={() => get(route("galleries.edit", item.id))}
                                    title="Edit"
                                >
                                    <Edit size={14} />
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => showDeleteModal(item.id)}
                                    title="Delete"
                                >
                                    <Trash2 size={14} />
                                </button>
                                <span className="badge bg-info text-dark d-flex align-items-center gap-1" title="Total Media">
                                    {type === "notice_announcement"
                                        ? "PDF"
                                        : `${(item.images?.length || 0) + (item.videos?.length || 0)} Media`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container py-4">
            <ToastContainer />
            <div className="card-header mb-4 d-flex align-items-end justify-content-end">
                <div className="row">
                    <div className="col-md-12 col-12">
                        <Link
                            href={route('galleries.create')}
                            className="btn btn-primary"
                            aria-label="Click me"
                        >
                            <i className='bx bx-plus'></i>
                            <span className='d-none d-sm-inline-block'>Add Gallery</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-4 p-2 bg-white shadow rounded">
                <ul className="nav nav-pills nav-fill" role="tablist">
                    <li className="nav-item">
                        <button
                            type="button"
                            className={`nav-link ${activeTab === "gallery" ? "active" : ""}`}
                            onClick={() => setActiveTab("gallery")}
                        >
                            <Image size={18} style={{marginRight:"6px"}} /> Gallery
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            type="button"
                            className={`nav-link ${activeTab === "media_coverage" ? "active" : ""}`}
                            onClick={() => setActiveTab("media_coverage")}
                        >
                             <Image size={18} style={{marginRight:"6px"}} /> Media Coverage
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            type="button"
                            className={`nav-link ${activeTab === "notice_announcement" ? "active" : ""}`}
                            onClick={() => setActiveTab("notice_announcement")}
                        >
                            <FileText size={18} style={{marginRight:"6px"}} /> Notices & Announcements
                        </button>
                    </li>
                </ul>
            </div>

            {/* Content */}
            <div className="tab-content">
                {activeTab === "gallery" && (
                    <div className="d-flex flex-row overflow-auto py-2 flex-wrap" style={{gap:"3.5rem"}}>
                        {galleries.length ? (
                            galleries.map((item) => renderCard(item, "gallery"))
                        ) : (
                            <p>No gallery items found.</p>
                        )}
                    </div>
                )}

                {activeTab === "media_coverage" && (
                    <div className="d-flex flex-row overflow-auto py-2 flex-wrap" style={{gap:"3.5rem"}}>
                        {mediaCoverage.length ? (
                            mediaCoverage.map((item) => renderCard(item, "media_coverage"))
                        ) : (
                            <p>No media coverage found.</p>
                        )}
                    </div>
                )}

                {activeTab === "notice_announcement" && (
                    <div className="d-flex flex-row overflow-auto py-2 flex-wrap" style={{gap:"3.5rem"}}>
                        {notices.length ? (
                            notices.map((item) => renderCard(item, "notice_announcement"))
                        ) : (
                            <p>No notices found.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {modalData && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center"
                    style={{ zIndex: 1050 }}
                >
                    <div
                        className="bg-white rounded p-3 position-relative"
                        style={{
                            maxWidth: "900px",
                            width: "95%",
                            maxHeight: "90vh",
                            overflowY: "auto",
                        }}
                    >
                        <button
                            className="btn btn-light position-absolute top-0 end-0 m-2"
                            onClick={() => setModalData(null)}
                        >
                            <X size={18} />
                        </button>
                        <h3 className="m-3">{modalData.title}</h3>

                        <div className="d-flex flex-wrap gap-3 justify-content-center">
                            {/* IMAGES */}
                            {modalData.images?.map((img, i) => (
                                <div key={i} className="position-relative">
                                    <img
                                        src={img}
                                        alt=""
                                        style={{
                                            width: "220px",
                                            height: "150px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                        }}
                                    />
                                    <button
                                        className="btn btn-sm btn-light position-absolute top-0 end-0 m-1"
                                        onClick={() => copyToClipboard(img)}
                                        title="Copy Image URL"
                                    >
                                        <Copy size={14} />
                                    </button>
                                </div>
                            ))}

                            {/* VIDEOS */}
                            {modalData.videos?.map((vid, i) => (
                                <div key={i} className="position-relative">
                                    <video
                                        controls
                                        style={{
                                            width: "220px",
                                            height: "150px",
                                            borderRadius: "8px",
                                            background: "#000",
                                        }}
                                    >
                                        <source src={vid} type="video/mp4" />
                                    </video>
                                    <button
                                        className="btn btn-sm btn-light position-absolute top-0 end-0 m-1"
                                        onClick={() => copyToClipboard(vid)}
                                        title="Copy Video URL"
                                    >
                                        <Copy size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

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
                            Are you sure you want to delete this Gallery?
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
        </div>
    );
};

export default Index;
