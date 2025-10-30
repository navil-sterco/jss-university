import React, { useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { ToastContainer, toast } from "react-toastify";

const Mapping = ({ gallery, happenings }) => {
    const { data, setData, post, processing, errors } = useForm({
        happening_ids: gallery.happenings?.map((h) => h.id) || [],
    });

    const toggleItem = (id) => {
        setData(
            "happening_ids",
            data.happening_ids.includes(id)
                ? data.happening_ids.filter((i) => i !== id)
                : [...data.happening_ids, id]
        );
    };

    const { flash } = usePage().props;
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash.success]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("galleries.mapping.attach", gallery.id), {
            preserveScroll: true,
        });
    };

    return (
        <div className="container py-4">
            <ToastContainer />
            <div className="card shadow-sm">
                <div className="card-header bg-white">
                    <h5>
                        Map Gallery:{" "}
                        <span className="text-secondary">{gallery.title}</span>
                    </h5>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <h6 className="fw-bold mb-2">🎉 Happenings</h6>
                                <div
                                    className="border rounded p-2"
                                    style={{ minHeight: 250 }}
                                >
                                    {happenings.length > 0 ? (
                                        happenings.map((h) => (
                                            <div
                                                key={h.id}
                                                onClick={() => toggleItem(h.id)}
                                                className={`p-2 mb-1 rounded d-flex justify-content-between align-items-center ${
                                                    data.happening_ids.includes(h.id)
                                                        ? "bg-primary text-white"
                                                        : "bg-light"
                                                }`}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <span>{h.title}</span>
                                                {data.happening_ids.includes(h.id) && (
                                                    <i className="bi bi-check-lg"></i>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted text-center my-4">
                                            No happenings found.
                                        </p>
                                    )}
                                </div>
                                {errors.happening_ids && (
                                    <div className="text-danger small mt-1">
                                        {errors.happening_ids}
                                    </div>
                                )}
                            </div>
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
