import { useForm, usePage } from '@inertiajs/react';
import React from 'react';

const Edit = (props) => {
    const { schools, departments, pages, hamburger } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        _method: "PUT",
        title: hamburger.title || "",
        type: hamburger.type || "custom",
        reference_id: hamburger.reference_id || "",
        parent_id: hamburger.parent_id || "",
        url: hamburger.url || "",

        // Section fields from your migration
        section_title: hamburger.section_title || "",
        section_subtitle: hamburger.section_subtitle || "",
        link: hamburger.link || "",
        section_title_second: hamburger.section_title_second || "",
        section_subtitle_second: hamburger.section_subtitle_second || "",
        section_image_first: null,
        section_heading_first: hamburger.section_heading_first || "",
        section_subheading_first: hamburger.section_subheading_first || "",
        section_image_second: null,
        section_heading_second: hamburger.section_heading_second || "",
        section_subheading_second: hamburger.section_subheading_second || "",
        section_video_url: hamburger.section_video_url || "",
        target_blank: hamburger.target_blank ?? false,

        display_order: hamburger.display_order || 100,
        is_active: hamburger.is_active ?? true,
    });

    // ✅ Handle file change for section images
    const handleFileChange = (field, files) => {
        if (!files || !files.length) return;
        setData(field, files[0]);
    };

    // ✅ Remove image
    const removeImage = (field) => {
        setData(field, null);
    };

    // ✅ Handle type change (custom/school/department/page)
    const handleTypeChange = (type) => {
        setData({
            ...data,
            type,
            reference_id: "",
            url: "",
            title: "",
        });
    };

    // ✅ Handle reference change
    const handleReferenceChange = (referenceId) => {
        setData("reference_id", referenceId);

        if (data.type === "school") {
            const school = schools.find((s) => s.id == referenceId);
            if (school) setData("title", school.name);
        } else if (data.type === "department") {
            const department = departments.find((d) => d.id == referenceId);
            if (department) setData("title", department.name);
        } else if (data.type === "page") {
            const page = pages.find((p) => p.id == referenceId);
            if (page) setData("title", page.title);
        }
    };

    // ✅ Submit function
    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        // Append basic fields
        const fields = {
            title: data.title,
            type: data.type,
            reference_id: data.reference_id,
            parent_id: data.parent_id,
            url: data.url,
            section_title: data.section_title,
            section_subtitle: data.section_subtitle,
            link: data.link,
            section_title_second: data.section_title_second,
            section_subtitle_second: data.section_subtitle_second,
            section_heading_first: data.section_heading_first,
            section_subheading_first: data.section_subheading_first,
            section_heading_second: data.section_heading_second,
            section_subheading_second: data.section_subheading_second,
            section_video_url: data.section_video_url,
            target_blank: data.target_blank ? 1 : 0,
            display_order: data.display_order,
            is_active: data.is_active ? 1 : 0,
            _method: 'PUT'
        };

        Object.entries(fields).forEach(([key, value]) => {
            formData.append(key, value ?? "");
        });

        // Append image files if they exist
        if (data.section_image_first instanceof File) {
            formData.append('section_image_first', data.section_image_first);
        } else if (hamburger.section_image_first) {
            formData.append('section_image_first', hamburger.section_image_first);
        }

        if (data.section_image_second instanceof File) {
            formData.append('section_image_second', data.section_image_second);
        } else if (hamburger.section_image_second) {
            formData.append('section_image_second', hamburger.section_image_second);
        }

        // ✅ Send update request
        post(route("hamburger.update", hamburger.id), formData, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <h1 className="text-muted">Edit Menu Item</h1>

            <div className="card mb-4">
                <div className="card-body">
                    <form onSubmit={submit} encType="multipart/form-data">
                        <div className="row">
                            {/* --- BASIC INFO --- */}
                            <div className="col-12">
                                <h5 className="mb-3">Basic Information</h5>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Menu Type</label>
                                <select
                                    className="form-select"
                                    value={data.type}
                                    onChange={(e) => handleTypeChange(e.target.value)}
                                >
                                    <option value="custom">Custom Link</option>
                                    <option value="school">School</option>
                                    <option value="department">Department</option>
                                    <option value="page">Page</option>
                                </select>
                                <div className="form-text text-danger">{errors.type}</div>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Parent Menu (Optional)</label>
                                <select
                                    className="form-select"
                                    value={data.parent_id}
                                    onChange={(e) => setData("parent_id", e.target.value)}
                                >
                                    <option value="">No Parent (Main Menu)</option>
                                    {props.menuItems?.filter(i => !i.parent_id && i.id !== hamburger.id).map(i => (
                                        <option key={i.id} value={i.id}>{i.title}</option>
                                    ))}
                                </select>
                                <div className="form-text text-danger">{errors.parent_id}</div>
                            </div>

                            {data.type !== "custom" && (
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">
                                        {data.type === "school" && "Select School"}
                                        {data.type === "department" && "Select Department"}
                                        {data.type === "page" && "Select Page"}
                                    </label>
                                    <select
                                        className="form-select"
                                        value={data.reference_id}
                                        onChange={(e) => handleReferenceChange(e.target.value)}
                                    >
                                        <option value="">Select {data.type}</option>
                                        {data.type === "school" &&
                                            schools.map((s) => (
                                                <option key={s.id} value={s.id}>
                                                    {s.name}
                                                </option>
                                            ))}
                                        {data.type === "department" &&
                                            departments.map((d) => (
                                                <option key={d.id} value={d.id}>
                                                    {d.name}
                                                </option>
                                            ))}
                                        {data.type === "page" &&
                                            pages.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.title}
                                                </option>
                                            ))}
                                    </select>
                                    <div className="form-text text-danger">{errors.reference_id}</div>
                                </div>
                            )}

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Menu Title</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                />
                                <div className="form-text text-danger">{errors.title}</div>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">URL</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={data.url}
                                    onChange={(e) => setData("url", e.target.value)}
                                    placeholder="/example-page or https://example.com"
                                />
                                <div className="form-text text-danger">{errors.url}</div>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label htmlFor="display_order" className="form-label">Display Order</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    id="display_order"
                                    value={data.display_order}
                                    onChange={(e) => setData('display_order', parseInt(e.target.value) || 0)}
                                    min="0"
                                />
                                <div className="form-text text-danger">{errors.display_order}</div>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label htmlFor="target_blank" className="form-label">Target Blank</label>
                                <select
                                    id="target_blank"
                                    className="form-select"
                                    value={data.target_blank ? 'true' : 'false'}
                                    onChange={(e) => setData('target_blank', e.target.value === 'true')}
                                >
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </select>
                                <div className="form-text text-danger">{errors.target_blank}</div>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label htmlFor="is_active" className="form-label">Status</label>
                                <select
                                    id="is_active"
                                    className="form-select"
                                    value={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.value === 'true')}
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                                <div className="form-text text-danger">{errors.is_active}</div>
                            </div>
                            {!data.parent_id && (
                                <>
                                    {/* First Section Information */}
                                    <div className="col-12 mt-4">
                                        <hr />
                                        <h5 className="mb-3">First Section Information</h5>
                                    </div>

                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="section_title" className="form-label">Section Title</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="section_title"
                                            value={data.section_title}
                                            onChange={(e) => setData('section_title', e.target.value)}
                                            placeholder="Enter section title"
                                        />
                                        <div className="form-text text-danger">{errors.section_title}</div>
                                    </div>

                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="section_subtitle" className="form-label">Section Subtitle</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="section_subtitle"
                                            value={data.section_subtitle}
                                            onChange={(e) => setData('section_subtitle', e.target.value)}
                                            placeholder="Enter section subtitle"
                                        />
                                        <div className="form-text text-danger">{errors.section_subtitle}</div>
                                    </div>

                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="link" className="form-label">Link</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="link"
                                            value={data.link}
                                            onChange={(e) => setData('link', e.target.value)}
                                            placeholder="/link or https://example.com"
                                        />
                                        <div className="form-text text-danger">{errors.link}</div>
                                    </div>

                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="section_heading_first" className="form-label">First Section Heading</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="section_heading_first"
                                            value={data.section_heading_first}
                                            onChange={(e) => setData('section_heading_first', e.target.value)}
                                        />
                                        <div className="form-text text-danger">{errors.section_heading_first}</div>
                                    </div>

                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="section_subheading_first" className="form-label">First Section Subheading</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="section_subheading_first"
                                            value={data.section_subheading_first}
                                            onChange={(e) => setData('section_subheading_first', e.target.value)}
                                        />
                                        <div className="form-text text-danger">{errors.section_subheading_first}</div>
                                    </div>

                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="section_image_first" className="form-label">First Section Image</label>
                                        <div className="d-flex align-items-center">
                                            <input
                                                className="form-control"
                                                type="file"
                                                id="section_image_first"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange('section_image_first', e.target.files)}
                                            />
                                            {(data.section_image_first || hamburger.section_image_first) && (
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger ms-2"
                                                    onClick={() => removeImage('section_image_first')}
                                                >
                                                    <i className='bx bx-x'></i>
                                                </button>
                                            )}
                                        </div>
                                        {(data.section_image_first || hamburger.section_image_first) && (
                                            <div className="form-text text-success mt-1">
                                                <i className="fas fa-check me-1"></i>
                                                {data.section_image_first instanceof File ? data.section_image_first.name : hamburger.section_image_first || 'Image exists'}
                                            </div>
                                        )}
                                        <div className="form-text text-danger">{errors.section_image_first}</div>
                                    </div>

                                    {/* Second Section Information */}
                                    <div className="col-12 mt-4">
                                        <hr />
                                        <h5 className="mb-3">Second Section Information</h5>
                                    </div>

                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="section_title_second" className="form-label">Second Section Title</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="section_title_second"
                                            value={data.section_title_second}
                                            onChange={(e) => setData('section_title_second', e.target.value)}
                                        />
                                        <div className="form-text text-danger">{errors.section_title_second}</div>
                                    </div>

                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="section_subtitle_second" className="form-label">Second Section Subtitle</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="section_subtitle_second"
                                            value={data.section_subtitle_second}
                                            onChange={(e) => setData('section_subtitle_second', e.target.value)}
                                        />
                                        <div className="form-text text-danger">{errors.section_subtitle_second}</div>
                                    </div>

                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="section_heading_second" className="form-label">Second Section Heading</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="section_heading_second"
                                            value={data.section_heading_second}
                                            onChange={(e) => setData('section_heading_second', e.target.value)}
                                        />
                                        <div className="form-text text-danger">{errors.section_heading_second}</div>
                                    </div>

                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="section_subheading_second" className="form-label">Second Section Subheading</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="section_subheading_second"
                                            value={data.section_subheading_second}
                                            onChange={(e) => setData('section_subheading_second', e.target.value)}
                                        />
                                        <div className="form-text text-danger">{errors.section_subheading_second}</div>
                                    </div>

                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="section_image_second" className="form-label">Second Section Image</label>
                                        <div className="d-flex align-items-center">
                                            <input
                                                className="form-control"
                                                type="file"
                                                id="section_image_second"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange('section_image_second', e.target.files)}
                                            />
                                            {(data.section_image_second || hamburger.section_image_second) && (
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger ms-2"
                                                    onClick={() => removeImage('section_image_second')}
                                                >
                                                    <i className='bx bx-x'></i>
                                                </button>
                                            )}
                                        </div>
                                        {(data.section_image_second || hamburger.section_image_second) && (
                                            <div className="form-text text-success mt-1">
                                                <i className="fas fa-check me-1"></i>
                                                {data.section_image_second instanceof File ? data.section_image_second.name : hamburger.section_image_second || 'Image exists'}
                                            </div>
                                        )}
                                        <div className="form-text text-danger">{errors.section_image_second}</div>
                                    </div>

                                    {/* Video Section */}
                                    <div className="col-12 mt-4">
                                        <hr />
                                        <h5 className="mb-3">Video Section</h5>
                                    </div>

                                    <div className="mb-3 col-12">
                                        <label htmlFor="section_video_url" className="form-label">Video URL</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="section_video_url"
                                            value={data.section_video_url}
                                            onChange={(e) => setData('section_video_url', e.target.value)}
                                            placeholder="https://youtube.com/embed/... or https://vimeo.com/..."
                                        />
                                        <div className="form-text text-danger">{errors.section_video_url}</div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="mt-4">
                            <button
                                type="submit"
                                className="btn btn-primary me-2"
                                disabled={processing}
                            >
                                {processing ? "Updating..." : "Update Menu Item"}
                            </button>
                            <a href={route("hamburger.index")} className="btn btn-secondary">
                                Cancel
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Edit;
