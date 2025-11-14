import { useForm } from '@inertiajs/react';
import React, { useRef } from 'react';

const Create = () => {
    const { data, setData, post, errors, processing,progress } = useForm({
        title: "",
        description: "",
        figure: "",
        image: "",
        status: 1,
        show_on_home: 0,
        display_order: 100,
    });
    const fileInputRef = useRef(null);

    const submit = (e) => {
        e.preventDefault();
        post(route("facts-and-figures.store"));
    };

    return (
        <>
            <h1 className="text-muted">Create Facts And Figures</h1>
            <div className="card mb-4">
                <form onSubmit={submit} encType="multipart/form-data">
                    <div className="card-body">
                        <div className="row">
                            {/* Title */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    className="form-control"
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                    placeholder="Enter title"
                                />
                                <div className="form-text text-danger">{errors.title}</div>
                            </div>

                            {/* Image */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label" htmlFor="image">Image <span className="text-danger">*</span></label>
                                <input
                                    type="file"
                                    id="image"
                                    className="form-control"
                                    ref={fileInputRef}
                                    onChange={(e) =>
                                        setData("image", e.target.files[0])
                                    }
                                    accept="image/png, image/jpeg, image/webp"
                                />
                                <div className="form-text text-danger">{errors.image}</div>
                            </div>

                            {/* Description */}
                            <div className="mb-3 col-md-12">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea
                                    id="description"
                                    className="form-control"
                                    rows="4"
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    placeholder="Enter Description"
                                ></textarea>
                                <div className="form-text text-danger">{errors.description}</div>
                            </div>

                            {/* Figure */}
                            <div className="mb-3 col-md-4">
                                <label htmlFor="figure" className="form-label">Figure</label>
                                <input
                                    type="text"
                                    id="figure"
                                    className="form-control"
                                    value={data.figure}
                                    onChange={(e) => setData("figure", e.target.value)}
                                    placeholder="5000+"
                                />
                                <div className="form-text text-danger">{errors.figure}</div>
                            </div>

                            {/* Show on Home */}
                            <div className="mb-3 col-md-4">
                                <label htmlFor="show_on_home" className="form-label">Show on Home</label>
                                <select
                                    id="show_on_home"
                                    className="form-select"
                                    value={data.show_on_home}
                                    onChange={(e) => setData("show_on_home", e.target.value)}
                                >
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                                <div className="form-text text-danger">{errors.show_on_home}</div>
                            </div>

                            {/* Display Order */}
                            <div className="mb-3 col-md-4">
                                <label htmlFor="display_order" className="form-label">Display Order</label>
                                <input
                                    type="number"
                                    id="display_order"
                                    className="form-control"
                                    value={data.display_order}
                                    onChange={(e) => setData("display_order", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.display_order}</div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        {progress && (
                            <div className="progress mb-3">
                                <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{ width: `${progress.percentage}%` }}
                                >
                                    {progress.percentage}%
                                </div>
                            </div>
                        )}

                        <div className="mt-2">
                            <button type="submit" className="btn btn-primary me-2" disabled={processing}>
                                {processing ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Create;
