import React, { useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { ToastContainer, toast } from 'react-toastify';

const Mapping = ({ banner, schools, pages }) => {
    const { data, setData, post, processing, errors } = useForm({
        school_ids: banner.schools?.map((s) => s.id) || [],
        page_ids: banner.pages?.map((p) => p.id) || [],
        show_on_home: banner.show_on_home || false,
    });

    const toggleItem = (id, field) => {
        const ids = data[field];
        setData(
            field,
            ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
        );
    };

    const toggleHomepage = () => {
        setData('show_on_home', !data.show_on_home);
    };

    const { flash } = usePage().props;
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash.success]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("banners.mapping.attach", banner.id), {
            preserveScroll: true,
        });
    };

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
                        <span>{item.name || item.title}</span>
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
                        Map Banner:{" "}
                        <span className="text-grey">{banner.heading}</span>
                    </h5>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-12 mb-4">
                                <div className="card">
                                    <div className="card-header bg-light">
                                        <h6 className="mb-0 fw-bold">🏠 Homepage</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                role="switch"
                                                id="homepageToggle"
                                                checked={data.show_on_home}
                                                onChange={toggleHomepage}
                                            />
                                            <label 
                                                className="form-check-label fw-bold" 
                                                htmlFor="homepageToggle"
                                            >
                                                Show on Homepage
                                            </label>
                                        </div>
                                        <div className="form-text">
                                            {data.show_on_home 
                                                ? "This happening will be displayed on the homepage"
                                                : "This happening will not be displayed on the homepage"
                                            }
                                        </div>
                                        {errors.show_on_home && (
                                            <div className="text-danger small mt-1">{errors.show_on_home}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {renderTransferList(schools, "school_ids", "🎓 Schools")}
                            {renderTransferList(pages, "page_ids", "📄 Pages")}
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
