import { useForm } from '@inertiajs/react';
import React, { useRef, useState } from 'react'

const Create = (props) => {
    const { data, setData, post, progress, errors, processing } = useForm({
        heading: "",
        subheading: "",
        linked_text: "",
        link: "",
        image: "",
        display_order:100,
        show_on_home: 0,
    });
    const fileInputRef = useRef(null);
    const submit = (e) => {
        e.preventDefault(); 
        post(route("banners.store"));
    };

return (
    <>
        <h1 className="text-muted">Create Page</h1>
        <div className="card mb-4">
            <form onSubmit={submit} encType='multipart/form-data'>
                <div className="card-body">
                    <div className="row">
                        <div className="mb-3 col-md-6">
                            <label className="form-label" htmlFor="image">Banner Image</label>
                            <input
                                type="file"
                                id="image"
                                className="form-control"
                                ref={fileInputRef}
                                onChange={(e) =>
                                    setData("image", e.target.files[0])
                                }
                                accept="image/png, image/jpeg"
                            />
                            <div className="form-text text-danger">{errors.image}</div>
                        </div>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="heading" className="form-label">Heading</label>
                            <input
                                className="form-control"
                                type="text"
                                id="heading"
                                name="heading"
                                placeholder='About Us'
                                value={data.heading}
                                onChange={(e) => setData("heading",e.target.value)}
                            />
                            <div className="form-text text-danger">{errors.heading}</div> 
                        </div>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="subheading" className="form-label">Subheading</label>
                            <input
                                className="form-control"
                                type="text"
                                id="subheading"
                                name="subheading"
                                placeholder='About Us'
                                value={data.subheading}
                                onChange={(e) => setData("subheading",e.target.value)}
                            />
                            <div className="form-text text-danger">{errors.subheading}</div> 
                        </div>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="linked_text" className="form-label">Linked Text</label>
                            <input
                                className="form-control"
                                type="text"
                                id="linked_text"
                                name="linked_text"
                                placeholder='About Us'
                                value={data.linked_text}
                                onChange={(e) => setData("linked_text",e.target.value)}
                            />
                            <div className="form-text text-danger">{errors.linked_text}</div> 
                        </div>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="link" className="form-label">Link</label>
                            <input
                                className="form-control"
                                type="text"
                                id="link"
                                name="link"
                                placeholder='About Us'
                                value={data.link}
                                onChange={(e) => setData("link",e.target.value)}
                            />
                            <div className="form-text text-danger">{errors.link}</div> 
                        </div>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="display_order" className="form-label">Display Order</label>
                            <input
                                className="form-control"
                                type="number"
                                id="display_order"
                                name="display_order"
                                placeholder='About Us'
                                value={data.display_order}
                                onChange={(e) => setData("display_order",e.target.value)}
                            />
                            <div className="form-text text-danger">{errors.display_order}</div> 
                        </div>
                        <div className="mb-3 col-md-6">
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