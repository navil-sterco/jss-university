import { useForm, usePage } from "@inertiajs/react";
import React, { useRef } from "react";

const Edit = ({ banner }) => {
    const fileInputRef = useRef(null);

    const appUrl = usePage().props.appUrl;

    const { data, setData, post, progress, errors, processing } = useForm({
        _method: "PUT",
        heading: banner.heading || "",
        subheading: banner.subheading || "",
        linked_text: banner.linked_text || "",
        link: banner.link || "",
        image: null,
        mobile_image: null,
        video_desktop: null,
        video_mobile: null,
        video_url: banner.video_url || "",
        display_order: banner.display_order || "",
        show_on_home: banner.show_on_home || 0,
    });

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (data[key] !== null) {
                formData.append(key, data[key]);
            }
        });

        post(route("banners.update", banner.id), {
            data: formData,
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <h1 className="text-muted">Edit Banner</h1>
            <div className="card mb-4">
                <form onSubmit={submit} encType="multipart/form-data">
                    <div className="card-body">
                        <div className="row">

                            {/* Heading */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="heading" className="form-label">Heading <span className="text-danger">*</span></label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="heading"
                                    value={data.heading}
                                    onChange={(e) => setData("heading", e.target.value)}
                                />
                                {errors.heading && <div className="form-text text-danger">{errors.heading}</div>}
                            </div>

                            {/* Subheading */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="subheading" className="form-label">Subheading</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="subheading"
                                    value={data.subheading}
                                    onChange={(e) => setData("subheading", e.target.value)}
                                />
                                {errors.subheading && <div className="form-text text-danger">{errors.subheading}</div>}
                            </div>

                            {/* Linked Text */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="linked_text" className="form-label">Linked Text</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="linked_text"
                                    value={data.linked_text}
                                    onChange={(e) => setData("linked_text", e.target.value)}
                                />
                                {errors.linked_text && <div className="form-text text-danger">{errors.linked_text}</div>}
                            </div>

                            {/* Link */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="link" className="form-label">Link</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="link"
                                    value={data.link}
                                    onChange={(e) => setData("link", e.target.value)}
                                />
                                {errors.link && <div className="form-text text-danger">{errors.link}</div>}
                            </div>

                            {/* Display Order */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="display_order" className="form-label">Display Order</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    id="display_order"
                                    value={data.display_order}
                                    onChange={(e) => setData("display_order", e.target.value)}
                                />
                                {errors.display_order && <div className="form-text text-danger">{errors.display_order}</div>}
                            </div>
                            
                            {/* Image upload */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label" htmlFor="image">Desktop Banner <span className="text-danger">*</span></label>
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

                            {/*Mobile Image upload */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label" htmlFor="mobile_image">Mobile Banner <span className="text-danger">*</span></label>
                                <input
                                    type="file"
                                    id="mobile_image"
                                    className="form-control"
                                    ref={fileInputRef}
                                    onChange={(e) => setData("mobile_image", e.target.files[0])}
                                    accept="image/png, image/jpg, image/jpeg, image/webp"
                                />
                                {errors.mobile_image && <div className="form-text text-danger">{errors.mobile_image}</div>}
                            </div>
                            
                            {/* Video Desktop */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label" htmlFor="video_desktop">Desktop Video</label>
                                <input
                                    type="file"
                                    id="video_desktop"
                                    className="form-control"
                                    ref={fileInputRef}
                                    onChange={(e) => setData("video_desktop", e.target.files[0])}
                                    accept="video/mp4, video/webm, video/ogg"
                                />
                                {errors.video_desktop && <div className="form-text text-danger">{errors.video_desktop}</div>}
                            </div>

                            {/* Video Mobile */}
                            <div className="mb-3 col-md-6">
                                <label className="form-label" htmlFor="video_mobile">Mobile Video</label>
                                <input
                                    type="file"
                                    id="video_mobile"
                                    className="form-control"
                                    ref={fileInputRef}
                                    onChange={(e) => setData("video_mobile", e.target.files[0])}
                                    accept="video/mp4, video/webm, video/ogg"
                                />
                                {errors.video_mobile && <div className="form-text text-danger">{errors.video_mobile}</div>}
                            </div>

                            {/* Video URL */}
                            <div className="mb-3 col-md-6">
                                <label htmlFor="video_url" className="form-label">Video URL</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="video_url"
                                    name="video_url"
                                    placeholder='https://www.youtube.com/...'
                                    value={data.video_url}
                                    onChange={(e) => setData("video_url",e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.video_url}</div> 
                            </div>
                            
                            {/* Show on Home */}
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
                            <div className="mb-3 col-md-3">
                                <label className="form-label">Current Desktop Banner</label>
                                {banner.image && data.image !== 'null' && (
                                    <div className="mb-2 d-flex align-items-start gap-2">
                                        <img
                                            src={`${appUrl}/${banner.image}`}
                                            alt="Current Banner"
                                            style={{
                                                width: "100px",
                                                height: "60px",
                                                objectFit: "cover",
                                                borderRadius: "4px"
                                            }}
                                        />
                                        <button 
                                            type="button" 
                                            className="btn btn-sm btn-danger" 
                                            onClick={() => {
                                                setData('image', 'null');
                                                if (document.getElementById('image')) document.getElementById('image').value = '';
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="mb-3 col-md-3">
                                <label className="form-label">Current Mobile Banner</label>
                                {banner.mobile_image && data.mobile_image !== 'null' && (
                                    <div className="mb-2 d-flex align-items-start gap-2">
                                        <img
                                            src={`${appUrl}/${banner.mobile_image}`}
                                            alt="Current Mobile Banner"
                                            style={{
                                                width: "100px",
                                                height: "60px",
                                                objectFit: "cover",
                                                borderRadius: "4px"
                                            }}
                                        />
                                        <button 
                                            type="button" 
                                            className="btn btn-sm btn-danger" 
                                            onClick={() => {
                                                setData('mobile_image', 'null');
                                                if (document.getElementById('mobile_image')) document.getElementById('mobile_image').value = '';
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="mb-3 col-md-3">
                                <label className="form-label">Current Desktop Video</label>
                                {banner.video_desktop && data.video_desktop !== 'null' && (
                                    <div className="mb-2 d-flex align-items-start gap-2">
                                        <video
                                            src={`${appUrl}/${banner.video_desktop}`}
                                            style={{
                                                width: "100px",
                                                height: "60px",
                                                objectFit: "cover",
                                                borderRadius: "4px"
                                            }}
                                            controls
                                        />
                                        <button 
                                            type="button" 
                                            className="btn btn-sm btn-danger" 
                                            onClick={() => {
                                                setData('video_desktop', 'null');
                                                if (document.getElementById('video_desktop')) document.getElementById('video_desktop').value = '';
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="mb-3 col-md-3">
                                <label className="form-label">Current Mobile Video</label>
                                {banner.video_mobile && data.video_mobile !== 'null' && (
                                    <div className="mb-2 d-flex align-items-start gap-2">
                                        <video
                                            src={`${appUrl}/${banner.video_mobile}`}
                                            style={{
                                                width: "100px",
                                                height: "60px",
                                                objectFit: "cover",
                                                borderRadius: "4px"
                                            }}
                                            controls
                                        />
                                        <button 
                                            type="button" 
                                            className="btn btn-sm btn-danger" 
                                            onClick={() => {
                                                setData('video_mobile', 'null');
                                                if (document.getElementById('video_mobile')) document.getElementById('video_mobile').value = '';
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Progress bar (optional) */}
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
                            <button
                                aria-label="Click me"
                                type="submit"
                                className="btn btn-primary me-2"
                                disabled={processing}
                            >
                                {processing ? "Updating..." : "Update"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Edit;
