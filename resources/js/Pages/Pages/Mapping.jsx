import React, { useEffect, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { ToastContainer, toast } from "react-toastify";

const Mapping = ({ page, tabs }) => {
    const { data, setData, post, processing, errors } = useForm({
        tab_id: page.tabs?.length > 0 ? page.tabs[0].id : '', // Single tab ID or empty string for no selection
    });

    const { flash } = usePage().props;
    
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash.success]);

    const selectItem = (id, field) => {
        // If clicking the same item again, deselect it
        setData(field, data[field] === id ? '' : id);
    };

    const clearSelection = () => {
        setData('tab_id', '');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("pages.mapping.attach", page.id), {
            preserveScroll: true,
        });
    };

    const renderSingleSelectionList = (items, field, label) => (
        <div className="col-md-6 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold mb-0">{label}</h6>
                {data[field] && (
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={clearSelection}
                    >
                        Remove Selection
                    </button>
                )}
            </div>
            <div className="border rounded p-2" style={{ minHeight: 250 }}>
                {/* "No Tab" option */}
                <div
                    onClick={() => selectItem('', field)}
                    className={`p-2 mb-1 rounded d-flex justify-content-between align-items-center ${
                        data[field] === ''
                            ? "bg-secondary text-white"
                            : "bg-light"
                    }`}
                    style={{ cursor: "pointer" }}
                >
                    <span className="fst-italic">No Tab (Remove from all tabs)</span>
                    {data[field] === '' && (
                        <i className="bi bi-check-lg"></i>
                    )}
                </div>

                {items.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => selectItem(item.id, field)}
                        className={`p-2 mb-1 rounded d-flex justify-content-between align-items-center ${
                            data[field] === item.id
                                ? "bg-primary text-white"
                                : "bg-light"
                        }`}
                        style={{ cursor: "pointer" }}
                    >
                        <span>{item.title || item.name}</span>
                        {data[field] === item.id && (
                            <i className="bi bi-check-lg"></i>
                        )}
                    </div>
                ))}
            </div>
            {errors[field] && (
                <div className="text-danger small mt-1">{errors[field]}</div>
            )}
        </div>
    );

    return (
        <div className="container py-4">
            <ToastContainer />
            <div className="card shadow-sm">
                <div className="card-header bg-white">
                    <h5>
                        Map Page:{" "}
                        <span className="text-grey">{page.title}</span>
                    </h5>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {renderSingleSelectionList(tabs, "tab_id", "📑 Select Tab")}
                        </div>

                        <div className="text-end mt-4">
                            <button
                                className="btn btn-primary"
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? "Saving..." : "Save Mapping"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Mapping;