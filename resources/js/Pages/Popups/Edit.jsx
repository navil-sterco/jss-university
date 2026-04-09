import React from 'react';
import { useForm, usePage, Head } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';

const Edit = ({ popup }) => {
    const { appUrl } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        heading: popup.heading || '',
        status: popup.status ?? true,
        items: popup.items || [],
    });

    const addItem = () => {
        setData('items', [...data.items, { title: '', link: '', image: null }]);
    };

    const removeItem = (index) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('popup.update'), {
            forceFormData: true,
            onSuccess: () => toast.success('Popup updated successfully!'),
            onError: (errors) => {
                console.error('Error:', errors);
                toast.error('Failed to update popup.');
            },
        });
    };

    return (
        <div className="container-fluid">
            <Head title="Edit Popup" />
            <ToastContainer />
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4 className="card-title">Manage Popup</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="mb-3">
                                    <label className="form-label">Heading</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.heading ? 'is-invalid' : ''}`}
                                        value={data.heading}
                                        onChange={(e) => setData('heading', e.target.value)}
                                        placeholder="Enter popup heading"
                                    />
                                    {errors.heading && <div className="invalid-feedback">{errors.heading}</div>}
                                </div>

                                <div className="mb-3 form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={data.status}
                                        onChange={(e) => setData('status', e.target.checked)}
                                        id="popupStatus"
                                    />
                                    <label className="form-check-label" htmlFor="popupStatus">Show Popup</label>
                                </div>

                                <hr />

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5>Popup Items</h5>
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-sm"
                                        onClick={addItem}
                                    >
                                        Add Item
                                    </button>
                                </div>

                                {data.items.map((item, index) => (
                                    <div key={index} className="card mb-3 border">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="mb-3">
                                                        <label className="form-label">Title</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={item.title}
                                                            onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                                                            placeholder="Item title"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="mb-3">
                                                        <label className="form-label">Link</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={item.link}
                                                            onChange={(e) => handleItemChange(index, 'link', e.target.value)}
                                                            placeholder="Item link"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="mb-3">
                                                        <label className="form-label">Image</label>
                                                        <input
                                                            type="file"
                                                            className="form-control"
                                                            onChange={(e) => handleItemChange(index, 'image', e.target.files[0])}
                                                            accept="image/*"
                                                        />
                                                        {item.image && typeof item.image === 'string' && (
                                                            <div className="mt-2">
                                                                <img
                                                                    src={`${appUrl}/${item.image}`}
                                                                    alt="preview"
                                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                                />
                                                            </div>
                                                        )}
                                                        {item.image instanceof File && (
                                                            <div className="mt-2 text-primary small">New image selected</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-md-1 d-flex align-items-center">
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => removeItem(index)}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                        disabled={processing}
                                    >
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Edit;
