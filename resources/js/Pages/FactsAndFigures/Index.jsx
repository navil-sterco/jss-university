import React, { useEffect, useRef, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import { router, usePage } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';
import _, { set } from "lodash";

const Index = (props) => {
    const { searchTerm, factsAndFigures } = props;
    const [query, setQuery] = useState(searchTerm || "");
    const { flash } = usePage().props;
    const modalRef = useRef(null);
    const modalInstance = useRef(null);
    const [idDelete, setIdDelete] = useState(null);
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
            router.get("facts-and-figures", { search: query }, { preserveState: true, replace: true });
        }, 300);

        delaySearch();
        return () => delaySearch.cancel();
    }, [query]);

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
        get(route('facts-and-figures.destroy', idDelete), {
            onSuccess: () => {
                modalInstance.current.hide();
                setIdDelete(null);
            }
        });
    };

    // Toggle status
    const toggleStatus = (id) => {
        router.post(route('facts-and-figures.toggleStatus', id), {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <>
            <h1 className="text-muted">Facts And Figures List</h1>
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
                                    placeholder="Search By Title..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    aria-label="Search..."
                                    aria-describedby="basic-addon-search31"
                                />
                            </div>
                        </div>
                        <div className="col-md-6 col-3">
                            <Link
                                href={route('facts-and-figures.create')}
                                className="btn btn-primary float-end"
                                aria-label="Click me"
                            >
                                <i className='bx bx-plus'></i>
                                <span className='d-none d-sm-inline-block'>Add Facts And Figures</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="table-responsive text-nowrap">
                    <table className="table table-hover my-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Figures</th>
                                <th>Display Order</th>
                                <th>Show On Home</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                            {factsAndFigures.data.map((item) => (
                                <tr key={item.id}>
                                    <td className='description-cell'><i className="bx bx-heading bx-sm me-3"></i>{item.title}</td>
                                    <td className='description-cell'><i className="bx bx-news bx-sm me-3"></i>{item.description}</td>
                                    <td className='description-cell'><i className="bx bx-comment-add bx-sm me-3"></i>{item.figure}</td>            
                                    <td><i className="bx bx-category bx-sm me-3"></i>{item.display_order}</td>
                                    <td>
                                        <span
                                            className={`badge ${item.show_on_home ? "bg-label-warning" : "bg-label-secondary"}`}
                                        >
                                            {item.show_on_home ? "Yes" : "No"}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className={`badge cursor-pointer ${item.status ? "bg-label-success" : "bg-label-danger"}`}
                                            onClick={() => toggleStatus(item.id)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {item.status ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-1">
                                            <Link
                                                className="btn btn-sm btn-outline-primary p-1 m-1"
                                                href={route("facts-and-figures.mapping", item.id)}
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
                                                    <Link
                                                        aria-label="dropdown action option"
                                                        className="dropdown-item"
                                                        href={route("facts-and-figures.edit", item.id)}
                                                    >
                                                        <i className="bx bx-edit-alt me-1"></i> Edit
                                                    </Link>
                                                    <a
                                                        onClick={() => showDeleteModal(item.id)}
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
                            Are you sure you want to delete this Fact And Figure?
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

            {/* Pagination */}
            {factsAndFigures.links.length > 3 && (
                <div className="row m-2">
                    <div className="col-md-4">
                        <p className="text-dark mb-0 mt-2">
                            Showing {factsAndFigures.from ?? 0} to {factsAndFigures.to ?? 0} of {factsAndFigures.total} entries
                        </p>
                    </div>
                    <div className="col-md-8">
                        <div className="float-end">
                            <Pagination links={factsAndFigures.links} query={query} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Index;
