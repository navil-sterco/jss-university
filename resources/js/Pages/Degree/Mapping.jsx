import React, { useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { ToastContainer, toast } from "react-toastify";

const Mapping = ({ degree, programs }) => {
    const { data, setData, post, processing, errors } = useForm({
        program_id: degree.programs?.[0]?.id || null, // Single program ID instead of array
    });

    const selectItem = (id) => {
        setData("program_id", id);
    };

    const { flash } = usePage().props;
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash.success]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("degree.mapping.attach", degree.id), {
            preserveScroll: true,
        });
    };

    return (
        <div className="container py-4">
            <ToastContainer />
            <div className="card shadow-sm">
                <div className="card-header bg-white">
                    <h5>
                        Map Degree:{" "}
                        <span className="text-secondary">{degree.name}</span>
                    </h5>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <h6 className="fw-bold mb-2">🎉 Programs</h6>
                                <div
                                    className="border rounded p-2"
                                    style={{ minHeight: 250 }}
                                >
                                    {programs.length > 0 ? (
                                        programs.map((p) => (
                                            <div
                                                key={p.id}
                                                onClick={() => selectItem(p.id)}
                                                className={`p-2 mb-1 rounded d-flex justify-content-between align-items-center ${
                                                    data.program_id === p.id
                                                        ? "bg-primary text-white"
                                                        : "bg-light"
                                                }`}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <span>{p.name}</span>
                                                {data.program_id === p.id && (
                                                    <i className="bi bi-check-lg"></i>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted text-center my-4">
                                            No Programs found.
                                        </p>
                                    )}
                                </div>
                                {errors.program_id && (
                                    <div className="text-danger small mt-1">
                                        {errors.program_id}
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
