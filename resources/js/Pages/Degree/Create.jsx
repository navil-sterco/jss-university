import { useForm } from '@inertiajs/react';
import React from 'react'

const Create = (props) => {
    const { data, setData, post, errors, processing } = useForm({
        name: "",
        short_name: "",
    });

    const submit = (e) => {
        e.preventDefault(); 
        post(route("degree.store"));
    };

return (
    <>
        <h1 className="text-muted">Create Page</h1>
        <div className="card mb-4">
            <form onSubmit={submit} encType='multipart/form-data'>
                <div className="card-body">
                    <div className="row">
                        <div className="mb-3 col-md-6">
                            <label htmlFor="name" className="form-label">Name <span className="text-danger">*</span></label>
                            <input
                                className="form-control"
                                type="text"
                                id="name"
                                name="name"
                                placeholder='Bachelor Of Technology'
                                value={data.name}
                                onChange={(e) => setData("name",e.target.value)}
                            />
                            <div className="form-text text-danger">{errors.name}</div> 
                        </div>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="short_name" className="form-label">Short Name</label>
                            <input
                                className="form-control"
                                type="text"
                                id="short_name"
                                name="short_name"
                                placeholder='B.Tech'
                                value={data.short_name}
                                onChange={(e) => setData("short_name",e.target.value)}
                            />
                            <div className="form-text text-danger">{errors.short_name}</div> 
                        </div>
                    </div>
                    <div className="mt-2">
                        <button aria-label='Click me' type="submit" className="btn btn-primary me-2" disabled={processing}>Submit</button>
                    </div>
                </div>
            </form>
        </div>
    </>
  )
}

export default Create;