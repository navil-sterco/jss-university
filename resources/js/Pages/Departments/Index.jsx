import React, { useEffect, useRef, useState } from 'react';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import { ToastContainer, toast } from 'react-toastify';
import _ from 'lodash';

const DepartmentIndex = (props) => {
    const { searchTerm, departments } = props;
    const { flash } = usePage().props;

    const [query, setQuery] = useState(searchTerm || "");
    const modalRef = useRef(null);
    const modalInstance = useRef(null);
    const [departmentIdDelete, setDepartmentIdDelete] = useState(null);

    const { get, processing } = useForm();

    // Toast success messages
    useEffect(() => {
        if (flash.success) toast.success(flash.success);
    }, [flash.success]);

    // Debounced search
    useEffect(() => {
        const delaySearch = _.debounce(() => {
            router.get("department", { search: query }, { preserveState: true, replace: true });
        }, 300);
        delaySearch();
        return () => delaySearch.cancel();
    }, [query]);

    // Initialize modal
    useEffect(() => {
        if (modalRef.current) modalInstance.current = new bootstrap.Modal(modalRef.current);
    }, []);

    // Show delete confirmation modal
    const showDeleteModal = (id) => {
        setDepartmentIdDelete(id);
        modalInstance.current.show();
    };

    // Confirm delete
    const handleConfirmDelete = () => {
        get(route('department.destroy', departmentIdDelete), {
            onSuccess: () => {
                modalInstance.current.hide();
                setDepartmentIdDelete(null);
            },
        });
    };

    // Toggle status
    const toggleStatus = (id) => {
        router.post(route('department.toggleStatus', id), {}, {
            preserveScroll: true,
            preserveState: true,
        });
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
                                            className={`badge cursor-pointer ${department.status ? "bg-label-success" : "bg-label-danger"}`}
                                            onClick={() => toggleStatus(department.id)}
                                        >
                                            {department.status ? "Active" : "Inactive"}
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
                                                <span className="tf-icons bx bx-right-arrow-circle bx-18px me-2"></span>Sections
                                            </Link>
                                            <div className="dropdown">
                                                <button aria-label='Click me' type="button" className="btn btn-outline-secondary p-1 m-1 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                    <i className="bx bx-dots-vertical-rounded"></i>
                                                </button>
                                                <div className="dropdown-menu">
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
