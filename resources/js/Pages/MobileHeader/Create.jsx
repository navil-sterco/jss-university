import { useForm, usePage } from '@inertiajs/react';
import React from 'react';

const Create = (props) => {
    const { schools, departments, pages } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        type: "custom",
        reference_id: "",
        parent_id: "",
        url: "",
        display_order: 100,
        is_active: true,
    });

    const handleFileChange = (boxIndex, files) => {
        if (!files || !files.length) return;
        const updatedBoxes = [...data.boxes];
        updatedBoxes[boxIndex].image = files[0];
        setData("boxes", updatedBoxes);
    };

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

    // ✅ Submit function (fixed)
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
            display_order: data.display_order,
            is_active: data.is_active ? 1 : 0,
        };

        Object.entries(fields).forEach(([key, value]) => {
            formData.append(key, value ?? "");
        });

        // ✅ Send request (no forceFormData)
        post(route("mobile-headers.store"), formData, {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <h1 className="text-muted">Create Menu Item</h1>

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
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label">Parent Menu (Optional)</label>
                                <select
                                    className="form-select"
                                    value={data.parent_id}
                                    onChange={(e) => setData("parent_id", e.target.value)}
                                >
                                    <option value="">No Parent (Main Menu)</option>
                                    {props.menuItems?.filter(i => !i.parent_id).map(i => (
                                        <option key={i.id} value={i.id}>{i.title}</option>
                                    ))}
                                </select>
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

                            {data.type === "custom" && (
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">URL (Optional)</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={data.url}
                                        onChange={(e) => setData("url", e.target.value)}
                                        placeholder="/example-page or https://example.com"
                                    />
                                </div>
                            )}

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
                        </div>

                        <div className="mt-4">
                            <button
                                type="submit"
                                className="btn btn-primary me-2"
                                disabled={processing}
                            >
                                {processing ? "Creating..." : "Create Menu Item"}
                            </button>
                            <a href={route("mobile-headers.index")} className="btn btn-secondary">
                                Cancel
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Create;
