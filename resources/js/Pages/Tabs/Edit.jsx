import { useForm } from "@inertiajs/react";
import React from "react";

const Edit = ({ tab }) => {
    const { data, setData, post, errors, processing } = useForm({
        _method: "PUT",
        title: tab.title || "",
        subtitle: tab.subtitle || "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("tab.update", tab.id));
    };

    return (
        <>
            <h1 className="text-muted">Edit Tab</h1>
            <div className="card mb-4">
                <form onSubmit={submit} encType="multipart/form-data">
                    <div className="card-body">
                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label htmlFor="title" className="form-label">Title <span className="text-danger">*</span></label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder='SRI SUTTUR MATH THE 1000-YEAR LEGACY'
                                    value={data.title}
                                    onChange={(e) => setData("title",e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.title}</div> 
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="subtitle" className="form-label">Subtitle</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="subtitle"
                                    name="subtitle"
                                    placeholder='About'
                                    value={data.subtitle}
                                    onChange={(e) => setData("subtitle",e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.subtitle}</div> 
                            </div>
                        </div>
                        <div className="mt-2">
                            <button aria-label='Click me' type="submit" className="btn btn-primary me-2" disabled={processing}>Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Edit;
