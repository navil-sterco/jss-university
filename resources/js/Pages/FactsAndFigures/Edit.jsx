import { useForm, usePage } from '@inertiajs/react';
import React, { useRef } from 'react';

const Edit = ({ factsAndFigures }) => {
    const { data, setData, post, errors, processing,progress } = useForm({
        _method: "PUT",
        title: factsAndFigures.title || "",
        description: factsAndFigures.description || "",
        figure: factsAndFigures.figure || "",
        status: factsAndFigures.status || "",
        show_on_home: factsAndFigures.show_on_home || 0,
        display_order: factsAndFigures.display_order || "",
        image: null,
    });

    const appUrl = usePage().props.appUrl;
    const fileInputRef = useRef(null);
    
    const submit = (e) => {
        e.preventDefault();
        post(route("facts-and-figures.update", factsAndFigures.id));
    };

    return (
        <>
            <h1 className="text-muted">Edit Facts And Figures</h1>
            <div className="card mb-4">
                <form onSubmit={submit} encType="multipart/form-data">
                    <div className="card-body">
                        <div className="row">
                            {/* Title */}
                            <div className="mb-3 col-md-12">
                                <label htmlFor="title" className="form-label">Title <span className="text-danger">*</span></label>
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
                            {/* Image upload */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label" htmlFor="image">Image</label>
                                <input
                                    type="file"
                                    id="image"
                                    className="form-control"
                                    ref={fileInputRef}
                                    onChange={(e) => setData("image", e.target.files[0])}
                                    accept="image/png, image/jpg, image/jpeg, image/webp"
                                />
                                {errors.image && <div className="form-text text-danger">{errors.image}</div>}
                            </div>

                            <div className="mb-3 col-md-3">
                                <label className="form-label" htmlFor="image">Current Image</label>
                                {factsAndFigures.image && (
                                    <div className="mb-2">
                                        <img
                                            src={`${appUrl}/${factsAndFigures.image}`}
                                            alt="Current Facts And Figures"
                                            style={{
                                                width: "100px",
                                                height: "60px",
                                                objectFit: "cover",
                                                borderRadius: "4px"
                                            }}
                                        />
                                    </div>
                                )}
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

export default Edit;
