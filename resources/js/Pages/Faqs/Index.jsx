import React, { useEffect, useRef, useState } from 'react';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import { ToastContainer, toast } from 'react-toastify';
import { debounce } from "lodash";

const Index = (props) => {
    const { searchTerm, faqs } = props;
    const { flash } = usePage().props;

    const [query, setQuery] = useState(searchTerm || "");
    const modalRef = useRef(null);
    const modalInstance = useRef(null);
    const [faqIdDelete, setFaqIdDelete] = useState(null);

    const { get, processing } = useForm();

    // Toast success messages
    useEffect(() => {
        if (flash.success) toast.success(flash.success);
    }, [flash.success]);

    // Debounced search
    useEffect(() => {
        const delaySearch = debounce(() => {
            router.get("faq", { search: query }, { preserveState: true, replace: true });
        }, 300);
        delaySearch();
        return () => delaySearch.cancel();
    }, [query]);

    // Initialize modals
    useEffect(() => {
        if (modalRef.current) modalInstance.current = new bootstrap.Modal(modalRef.current);
    }, []);

    const showDeleteModal = (id) => {
        setFaqIdDelete(id);
        modalInstance.current.show();
    };

    const handleConfirmDelete = () => {
        get(route('faq.destroy', faqIdDelete), {
            onSuccess: () => {
                modalInstance.current.hide();
                setFaqIdDelete(null);
            },
        });
    };

    const toggleStatus = (id) => {
        router.post(route('faq.toggleStatus', id), {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };
    return (
        <>
            <h1 className="text-muted">FAQ List</h1>
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
                                    placeholder="Search by Question..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 col-3">
                            <Link
                                href={route('faq.create')}
                                className="btn btn-primary float-end"
                            >
                                <i className='bx bx-plus'></i>
                                <span className='d-none d-sm-inline-block'>Add FAQ</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="table-responsive text-nowrap">
                    <table className="table table-hover my-table">
                        <thead>
                            <tr>
                                <th>Question</th>
                                <th>Answer</th>
                                <th>Display Order</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faqs.data.map((faq) => (
                                <tr key={faq.id}>
                                    <td className='description-cell'>
                                        <i className="bx bx-question-mark bx-sm me-3"></i>
                                        {faq.question}
                                    </td>
                                    <td className='description-cell'>
                                        <i className="bx bx-message-alt bx-sm me-3"></i>
                                        {faq.answer.length > 100 ? `${faq.answer.substring(0, 100)}...` : faq.answer}
                                    </td>
                                    <td>
                                        <i className="bx bx-sort bx-sm me-3"></i>
                                        {faq.display_order}
                                    </td>
                                    <td>
                                        <span
                                            className={`badge cursor-pointer ${faq.status == 1 ? "bg-label-success" : "bg-label-danger"}`}
                                            onClick={() => toggleStatus(faq.id)}
                                        >
                                            {faq.status == 1 ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <Link
                                                className="btn btn-sm btn-outline-primary p-1"
                                                href={route("faq.mapping", faq.id)}
                                            >
                                                <span className="tf-icons bx bx-right-arrow-circle bx-18px me-1"></span>
                                                Mapping
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
                                                    <Link className="dropdown-item" href={route("faq.edit", faq.id)}>
                                                        <i className="bx bx-edit-alt me-1"></i> Edit
                                                    </Link>
                                                    <a
                                                        className="dropdown-item"
                                                        href="#"
                                                        onClick={() => showDeleteModal(faq.id)}
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
                        <div className="modal-body">Are you sure you want to delete this FAQ?</div>
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

            {/* Pagination */}
            {faqs.links.length > 3 && (
                <div className="row m-2">
                    <div className="col-md-4">
                        <p className="text-dark mb-0 mt-2">
                            Showing {faqs.from ?? 0} to {faqs.to ?? 0} of {faqs.total} entries
                        </p>
                    </div>
                    <div className="col-md-8">
                        <div className="float-end">
                            <Pagination links={faqs.links} query={query} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Index;
