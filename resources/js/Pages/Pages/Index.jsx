import React, { useEffect, useRef, useState } from 'react';
import { Link, useForm } from '@inertiajs/react'
import Pagination from '@/Components/Pagination';
import { router, usePage } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';
import _, { set } from "lodash";

const Index = (props) => {
    const { searchTerm,pages } = props;
    const [query, setQuery] = useState(searchTerm || "");
    const { flash } = usePage().props;
    const modalRef = useRef(null);
    const modalInstance = useRef(null);
    const [pageIdDelete, setPageIdDelete] = useState(null);

    // Image modal
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
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash.error]);

    useEffect(() => {
        const delaySearch = _.debounce(() => {
            router.get("pages", { search: query }, { preserveState: true, replace: true });
        }, 300);

        delaySearch();
        return () => delaySearch.cancel();
    }, [query]);

    useEffect(() => {
        if (modalRef.current) {
            modalInstance.current = new bootstrap.Modal(modalRef.current);
        }
        if (imageModalRef.current) {
            imageModalInstance.current = new bootstrap.Modal(imageModalRef.current);
        }
    }, []);

    const showDeleteModal = (id) => {
        setPageIdDelete(id);
        modalInstance.current.show();
    };

    // Image preview modal
    const showImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        imageModalInstance.current.show();
    };

    const handleConfirmDelete = () => {
        get(route('pages.destroy', pageIdDelete), {
            onSuccess: () => {
                modalInstance.current.hide();
                setPageIdDelete(null);
            }
        });
    };

    const toggleStatus = (id) => {
        router.post(route('pages.toggleStatus', id), {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };


    return (
        <>
            <h1 className="text-muted">Pages List</h1>
            <ToastContainer />
            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-6 col-8">
                            <div className="input-group input-group-merge">
                                <span className="input-group-text" id="basic-addon-search31"><i className="bx bx-search"></i></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search By Page Title..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    aria-label="Search..."
                                    aria-describedby="basic-addon-search31" 
                                />
                            </div>
                        </div>
                        <div className="col-md-6 col-3">
                        <Link
                            href={route('pages.create')}
                            className="btn btn-primary float-end"
                            aria-label="Click me"
                        >
                            <i className='bx bx-plus'></i>
                            <span className='d-none d-sm-inline-block'>Add Page</span>
                        </Link>
                        </div>
                    </div>
                </div>
                <div className="table-responsive text-nowrap">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Slug</th>
                                <th>Target Blank</th>
                                <th>Image</th>
                                <th>Display Order</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                            {pages.data.map((page) => (
                                <tr key={page.id}>
                                    <td className='description-cell'>
                                        <i className="bx bx-news bx-sm me-3"></i>
                                        {page.title}
                                    </td>
                                    <td>
                                        <i className="bx bx-category bx-sm me-3"></i>
                                        {page.type}
                                    </td>
                                    <td className='description-cell'>
                                        <i className="bx bx-link bx-sm me-3"></i>
                                        {page.slug}
                                    </td>
                                    <td>
                                        <span
                                            className={`badge ${page.target_blank == 1 ? "bg-label-warning" : "bg-label-secondary"}`}
                                        >
                                            {page.target_blank == 1 ? "Yes" : "No"}
                                        </span>
                                    </td>
                                    <td>
                                        {page.image ? (
                                            <img
                                                src={page.image}
                                                alt="page"
                                                className="img-thumbnail"
                                                style={{
                                                    width: "80px",
                                                    height: "50px",
                                                    objectFit: "cover",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => showImageModal(page.image)}
                                            />
                                        ) : (
                                            <span className="text-muted">No image</span>
                                        )}
                                    </td>
                                    <td>
                                        <i className="bx bx-category bx-sm me-3"></i>
                                        {page.display_order}
                                    </td>
                                    <td>
                                        <span
                                            className={`badge cursor-pointer ${page.status == 1 ? "bg-label-success" : "bg-label-danger"}`}
                                            onClick={() => toggleStatus(page.id)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {page.status == 1 ? "ACTIVE" : "INACTIVE"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <Link
                                                className="btn btn-sm btn-outline-primary p-1"
                                                href={route("pages.mapping", page.id)}
                                            >
                                                <span className="tf-icons bx bx-right-arrow-circle bx-18px me-1"></span>
                                                Mapping
                                            </Link>
                                            <Link
                                                href={route('sections.index', page.id)}
                                                method="get"
                                                as="button"
                                                className="btn btn-sm btn-outline-primary p-1 m-1"
                                            >
                                                <span className="tf-icons bx bx-right-arrow-circle bx-18px me-2"></span>Add/Edit
                                            </Link>
                                            <Link
                                                href={route('pages.duplicate', page.id)}
                                                method="post"
                                                as="button"
                                                className="btn btn-sm btn-outline-primary p-1 m-1"
                                            >
                                                <span className="tf-icons bx bx-right-arrow-circle bx-18px me-2"></span>Duplicate
                                            </Link>
                                            <div className="dropdown">
                                                <button aria-label='Click me' type="button" className="btn btn-outline-secondary p-1 m-1 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                    <i className="bx bx-dots-vertical-rounded"></i>
                                                </button>
                                                <div className="dropdown-menu">
                                                    <Link aria-label="dropdown action option" className="dropdown-item" href={route("pages.edit",page.id)}
                                                    ><i className="bx bx-edit-alt me-1"></i> Edit</Link>
                                                    <a onClick={() => showDeleteModal(page.id)} aria-label="dropdown action option" className="dropdown-item" href="#"
                                                    ><i className="bx bx-trash me-1"></i> Delete</a>
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
                            <h5 className="modal-title">Page Image</h5>
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
            
            {/* <!-- Delete--> */}            
            <div className="modal fade" id="deleteConfirmModal" aria-labelledby="deleteConfirmLabel" tabIndex="-1" aria-hidden="true" ref={modalRef}>
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
                            Are you sure you want to delete this Page?
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

            {pages.links.length > 3 ? (
                <div className="row m-2">
                    <div className="col-md-4">
                        <p className="text-dark mb-0 mt-2">
                            Showing {pages.from ?? 0}{" "}
                            to {pages.to ?? 0} of{" "}
                            {pages.total} entries
                        </p>
                    </div>
                    <div className="col-md-8">
                        <div className="float-end">
                            <Pagination
                                links={pages.links}
                                query={query}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
  )
}

export default Index