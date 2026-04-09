import React, { useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { ToastContainer, toast } from "react-toastify";

const Mapping = ({ page, tabs, schools, departments }) => {
    const { data, setData, post, processing, errors } = useForm({
        tab_id: page.tabs?.length > 0 ? page.tabs[0].id : '',
        school_ids: page.schools?.map((s) => s.id) || [],
        department_ids: page.departments?.map((s) => s.id) || [],
    });

    const { flash } = usePage().props;

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash.success]);

    /* ---------- Single Select (Tab) ---------- */
    const selectItem = (id, field) => {
        setData(field, data[field] === id ? '' : id);
    };

    const clearSelection = () => {
        setData('tab_id', '');
    };

    /* ---------- Multi Select (School) ---------- */
    const toggleItem = (id, field) => {
        const ids = data[field];
        setData(
            field,
            ids.includes(id)
                ? ids.filter((i) => i !== id)
                : [...ids, id]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("pages.mapping.attach", page.id), {
            preserveScroll: true,
        });
    };

    /* ---------- Single Selection List (Tab) ---------- */
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
                <div
                    onClick={() => selectItem('', field)}
                    className={`p-2 mb-1 rounded d-flex justify-content-between align-items-center ${
                        data[field] === ''
                            ? "bg-secondary text-white"
                            : "bg-light"
                    }`}
                    style={{ cursor: "pointer" }}
                >
                    <span className="fst-italic">
                        No Tab (Remove from all tabs)
                    </span>
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
                        <span>{item.title}</span>
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

    /* ---------- Multi Selection List (School) ---------- */
    const renderTransferList = (items, field, label) => (
        <div className="col-md-6 mb-3">
            <h6 className="fw-bold mb-2">{label}</h6>
            <div className="border rounded p-2" style={{ minHeight: 250 }}>
                {items.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => toggleItem(item.id, field)}
                        className={`p-2 mb-1 rounded d-flex justify-content-between align-items-center ${
                            data[field].includes(item.id)
                                ? "bg-primary text-white"
                                : "bg-light"
                        }`}
                        style={{ cursor: "pointer" }}
                    >
                        <span>{item.name}</span>
                        {data[field].includes(item.id) && (
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
                            {renderTransferList(schools, "school_ids", "🎓 Schools")}
                            {renderTransferList(departments, "department_ids", "🎓 Departments")}
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
