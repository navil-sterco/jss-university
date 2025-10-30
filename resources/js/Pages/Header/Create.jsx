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

    const submit = (e) => {
        e.preventDefault();
        post(route("headers.store"), {
            onSuccess: () => reset()
        });
    };

    const handleTypeChange = (type) => {
        setData('type', type);
        setData('reference_id', '');
        setData('url', '');
        setData('title', ''); // Reset title when type changes
    };

    const handleReferenceChange = (referenceId) => {
        setData('reference_id', referenceId);
        
        // Auto-fill title based on selection
        if (data.type === 'school') {
            const school = schools.find(s => s.id == referenceId);
            if (school) setData('title', school.name);
        } else if (data.type === 'department') {
            const department = departments.find(d => d.id == referenceId);
            if (department) setData('title', department.name);
        } else if (data.type === 'page') {
            const page = pages.find(p => p.id == referenceId);
            if (page) setData('title', page.title);
        }
    };

    return (
        <>
            <h1 className="text-muted">Create Menu Item</h1>
            
            <div className="card mb-4">
                <div className="card-body">
                    <form onSubmit={submit}>
                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label htmlFor="type" className="form-label">Menu Type</label>
                                <select
                                    id="type"
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
                                <label htmlFor="parent_id" className="form-label">Parent Menu (Optional)</label>
                                <select
                                    id="parent_id"
                                    className="form-select"
                                    value={data.parent_id}
                                    onChange={(e) => setData('parent_id', e.target.value)}
                                >
                                    <option value="">No Parent (Main Menu)</option>
                                    {props.menuItems?.filter(item => !item.parent_id).map(item => (
                                        <option key={item.id} value={item.id}>{item.title}</option>
                                    ))}
                                </select>
                            </div>

                            {data.type !== 'custom' && (
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="reference_id" className="form-label">
                                        {data.type === 'school' && 'Select School'}
                                        {data.type === 'department' && 'Select Department'}
                                        {data.type === 'page' && 'Select Page'}
                                    </label>
                                    <select
                                        id="reference_id"
                                        className="form-select"
                                        value={data.reference_id}
                                        onChange={(e) => handleReferenceChange(e.target.value)}
                                    >
                                        <option value="">Select {data.type}</option>
                                        {data.type === 'school' && schools.map(school => (
                                            <option key={school.id} value={school.id}>{school.name}</option>
                                        ))}
                                        {data.type === 'department' && departments.map(dept => (
                                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                                        ))}
                                        {data.type === 'page' && pages.map(page => (
                                            <option key={page.id} value={page.id}>{page.title}</option>
                                        ))}
                                    </select>
                                    <div className="form-text text-danger">{errors.reference_id}</div>
                                </div>
                            )}

                            <div className="mb-3 col-md-6">
                                <label htmlFor="title" className="form-label">Menu Title *</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Enter menu title"
                                />
                                <div className="form-text text-danger">{errors.title}</div>
                            </div>

                            {/* Only show URL field for custom links */}
                            {data.type === 'custom' && (
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="url" className="form-label">
                                        URL (Optional)
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="url"
                                        value={data.url}
                                        onChange={(e) => setData('url', e.target.value)}
                                        placeholder="/example-page or https://example.com"
                                    />
                                    <div className="form-text">
                                        Enter full URL path or leave empty for no link
                                    </div>
                                    <div className="form-text text-danger">{errors.url}</div>
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
                                <div className="form-text">Lower numbers appear first</div>
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

                        <div className="mt-3">
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={processing}
                            >
                                {processing ? 'Creating...' : 'Create Menu Item'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Create;