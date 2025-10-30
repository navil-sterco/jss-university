import { useForm } from '@inertiajs/react';
import React, { useState } from 'react'

const Edit = (props) => {
    const { page } = props;
    
    function parseDateInput(datetimeStr) {
        const date = new Date(datetimeStr);
        const pad = (n) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    const { data, setData, put, progress, errors, processing } = useForm({
        title: page.title || "",
        slug: page.slug || "",
        sub_title: page.sub_title || "",
        target_blank: page.target_blank ? "1" : "0",
        publish_date: parseDateInput(page.publish_date),
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("pages.update", page.id));
    };

return (
    <>
        <h1 className="text-muted">Edit Page</h1>
        <div className="card mb-4">
            <form onSubmit={submit} encType='multipart/form-data'>
                <div className="card-body">
                    <div className="row">
                        <div className="mb-3 col-md-6">
                            <label htmlFor="title" className="form-label">Title</label>
                            <input
                                className="form-control"
                                type="text"
                                id="title"
                                name="title"
                                placeholder='About Us'
                                value={data.title}
                                onChange={(e) => setData("title",e.target.value)}
                            />
                            <div className="form-text text-danger">{errors.title}</div> 
                        </div>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="slug" className="form-label">Slug</label>
                            <input
                                className="form-control"
                                type="text"
                                id="slug"
                                name="slug"
                                placeholder='about-us'
                                value={data.slug} 
                                onChange={(e) => setData("slug",e.target.value)}
                            />
                            <div className="form-text text-danger">{errors.slug}</div> 
                        </div>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="sub_title" className="form-label">Sub Title</label>
                            <input
                                type="text" 
                                className="form-control" 
                                id="sub_title" 
                                name="sub_title" 
                                placeholder="Sub Title" 
                                value={data.sub_title} 
                                onChange={(e) => setData("sub_title",e.target.value)}
                            />
                            <div className="form-text text-danger">{errors.sub_title}</div> 
                        </div>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="template_path" className="form-label">Overwrite Url</label>
                            <input
                                className="form-control"
                                type="text"
                                id="template_path"
                                name="template_path"
                                placeholder='about-us/overview'
                                value={data.template_path} 
                                onChange={(e) => setData("template_path",e.target.value)}
                            />
                            <div className="form-text text-danger">{errors.template_path}</div> 
                        </div>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="target_blank" className="form-label">Target Blank</label>
                            <select
                                className="form-control"
                                id="target_blank"
                                value={data.target_blank}
                                onChange={(e) => setData("target_blank", e.target.value)}
                            >
                                <option value="">Select an option</option>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                            <div className="form-text text-danger">{errors.target_blank}</div>
                        </div>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="publish_date" className="form-label">Publish Date</label>
                              <input
                                    className="form-control"
                                    type="datetime-local"
                                    id="publish_date" 
                                    value={data.publish_date} 
                                    onChange={(e) => setData("publish_date",e.target.value)}
                                />
                            <div className="form-text text-danger">{errors.publish_date}</div> 
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

export default Edit