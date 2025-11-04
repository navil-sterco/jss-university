import { useForm } from "@inertiajs/react";
import React from "react";

const Edit = ({ faq }) => {
    const { data, setData, post, processing, errors, progress } = useForm({
        _method: "PUT",
        question: faq.question || "",
        answer: faq.answer || "",
        display_order: faq.display_order || 100,
        status: faq.status || 1,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("faq.update", faq.id));
    };

    return (
        <>
            <h1 className="text-muted mb-4">Edit FAQ</h1>

            <div className="card mb-4">
                <form onSubmit={submit}>
                    <div className="card-body">
                        <div className="row">
                            {/* Question */}
                            <div className="mb-3 col-md-12">
                                <label className="form-label">Question</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter FAQ question"
                                    value={data.question}
                                    onChange={(e) => setData("question", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.question}</div>
                            </div>

                            {/* Answer */}
                            <div className="mb-3 col-md-12">
                                <label className="form-label">Answer</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    placeholder="Enter the answer"
                                    value={data.answer}
                                    onChange={(e) => setData("answer", e.target.value)}
                                ></textarea>
                                <div className="form-text text-danger">{errors.answer}</div>
                            </div>

                            {/* Display Order */}
                            <div className="mb-3 col-md-4">
                                <label className="form-label">Display Order</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={data.display_order}
                                    onChange={(e) => setData("display_order", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.display_order}</div>
                            </div>

                            {/* Status */}
                            <div className="mb-3 col-md-4">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-control"
                                    value={data.status}
                                    onChange={(e) => setData("status", e.target.value)}
                                >
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </select>
                                <div className="form-text text-danger">{errors.status}</div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="mt-4">
                            <button type="submit" className="btn btn-primary" disabled={processing}>
                                {processing ? "Updating..." : "Update FAQ"}
                            </button>

                            {progress && (
                                <div className="progress mt-2">
                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: `${progress.percentage}%` }}
                                        aria-valuenow={progress.percentage}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >
                                        {progress.percentage}%
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Edit;
