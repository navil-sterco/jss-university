import { useForm } from "@inertiajs/react";
import { GraduationCap, Pin, School, StickyNote } from "lucide-react";
import React, { useState, useEffect } from "react";

const PageManager = ({ schools, departments, pages, footerConfig }) => {
    // Initialize state with existing data from footerConfig
    const [addedItems, setAddedItems] = useState(footerConfig?.navigation_items || []);
    const [quickLinks, setQuickLinks] = useState(footerConfig?.quick_links || []);
    const [selectedType, setSelectedType] = useState('school');
    const [selectedItem, setSelectedItem] = useState('');
    const [displayOrder, setDisplayOrder] = useState(1);

    const { data, setData, post, processing, errors } = useForm({
        _method: "PUT",
        navigation_items: addedItems,
        quick_links: quickLinks,
    });

    // Update form data when state changes
    useEffect(() => {
        setData('navigation_items', addedItems);
        setData('quick_links', quickLinks);
    }, [addedItems, quickLinks]);

    const addNavigationItem = () => {
        if (!selectedItem) return;

        let newItem = {
            id: Date.now(),
            type: selectedType,
            item_id: selectedItem,
            display_order: parseInt(displayOrder),
            name: getItemName(selectedType, selectedItem)
        };

        setAddedItems([...addedItems, newItem]);
        setSelectedItem('');
        setDisplayOrder(1);
    };

    // Get item name based on type and ID
    const getItemName = (type, id) => {
        switch(type) {
            case 'school':
                return schools.find(s => s.id == id)?.name || '';
            case 'department':
                return departments.find(d => d.id == id)?.name || '';
            case 'page':
                return pages.find(p => p.id == id)?.title || '';
            default:
                return '';
        }
    };

    // Remove item from navigation
    const removeNavigationItem = (id) => {
        const updated = addedItems.filter(item => item.id !== id);
        setAddedItems(updated);
    };

    // Add quick link
    const addQuickLink = () => {
        const newLink = {
            id: Date.now(),
            text: '',
            link: '',
            display_order: quickLinks.length > 0 ? Math.max(...quickLinks.map(l => l.display_order)) + 1 : 1
        };
        setQuickLinks([...quickLinks, newLink]);
    };

    // Update quick link
    const updateQuickLink = (id, field, value) => {
        const updated = quickLinks.map(link => 
            link.id === id ? { ...link, [field]: value } : link
        );
        setQuickLinks(updated);
    };

    // Remove quick link
    const removeQuickLink = (id) => {
        const updated = quickLinks.filter(link => link.id !== id);
        setQuickLinks(updated);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("footer.update"));
    };

    // Get available options based on selected type
    const getOptions = () => {
        switch(selectedType) {
            case 'school':
                return schools;
            case 'department':
                return departments;
            case 'page':
                return pages;
            default:
                return [];
        }
    };

    // Helper function to get error message for a specific field
    const getError = (field) => {
        return errors[field];
    };

    // Helper function to get error for quick link specific field
    const getQuickLinkError = (index, field) => {
        return errors[`quick_links.${index}.${field}`];
    };

    const options = getOptions();

    // Get icon for type
    const getTypeIcon = (type) => {
        switch(type) {
            case 'school': return <School/>;
            case 'department': return <GraduationCap />;
            case 'page': return <StickyNote />;
            default: return <Pin/>;
        }
    };

    return (
        <>
            <h1 className="text-muted">Navigation Manager</h1>
            <p>Manage your website navigation menu and quick links</p>

            <div className="row g-4">
                {/* Navigation Items Card */}
                <div className="col-xl-6">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-0 py-4">
                            <div className="d-flex align-items-center">
                                <div className="bg-secondary bg-opacity-10 rounded p-3 me-3">
                                    <i className="bx bx-navigation text-primary fs-4"></i>
                                </div>
                                <div>
                                    <h5 className="fw-bold text-dark mb-1">Navigation Items</h5>
                                    <p className="text-muted mb-0">Add schools, departments, and pages to your menu</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="card-body p-4">
                            {/* Add Item Form */}
                            <div className="bg-light rounded-lg p-4 mb-4 border">
                                <h6 className="fw-semibold text-dark mb-3">Add New Item</h6>
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label className="form-label fw-medium text-dark small">Type</label>
                                        <select
                                            className="form-select border-0 shadow-sm"
                                            value={selectedType}
                                            onChange={(e) => {
                                                setSelectedType(e.target.value);
                                                setSelectedItem('');
                                            }}
                                        >
                                            <option value="school"> School</option>
                                            <option value="department"> Department</option>
                                            <option value="page"> Page</option>
                                        </select>
                                    </div>
                                    <div className="col-md-5">
                                        <label className="form-label fw-medium text-dark small">Select Item</label>
                                        <select
                                            className={`form-select border-0 shadow-sm ${getError('selected_item') ? 'is-invalid' : ''}`}
                                            value={selectedItem}
                                            onChange={(e) => setSelectedItem(e.target.value)}
                                        >
                                            <option value="">Choose {selectedType}</option>
                                            {options.map((option) => (
                                                <option key={option.id} value={option.id}>
                                                    {option.name || option.title}
                                                </option>
                                            ))}
                                        </select>
                                        {getError('selected_item') && (
                                            <div className="form-text text-danger">{getError('selected_item')}</div>
                                        )}
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label fw-medium text-dark small">Order</label>
                                        <input
                                            type="number"
                                            className="form-control border-0 shadow-sm"
                                            value={displayOrder}
                                            onChange={(e) => setDisplayOrder(e.target.value)}
                                            placeholder="1"
                                            min="1"
                                        />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <button
                                        type="button"
                                        className="btn btn-primary px-4"
                                        onClick={addNavigationItem}
                                        disabled={!selectedItem}
                                    >
                                        <i className="bx bx-plus me-2"></i>
                                        Add to Menu
                                    </button>
                                </div>
                            </div>

                            {/* Added Items List */}
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="fw-semibold text-dark mb-0">
                                        Menu Items ({addedItems.length})
                                    </h6>
                                    {addedItems.length > 0 && (
                                        <span className="badge bg-secondary bg-opacity-10 text-primary">
                                            Sorted by order
                                        </span>
                                    )}
                                </div>
                                
                                {addedItems.length === 0 ? (
                                    <div className="text-center py-5">
                                        <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
                                            <i className="bx bx-list-ul text-muted fs-2"></i>
                                        </div>
                                        <h6 className="text-muted fw-medium">No items added yet</h6>
                                        <p className="text-muted small">Start by adding items to your navigation menu</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {addedItems
                                            .sort((a, b) => a.display_order - b.display_order)
                                            .map((item, index) => (
                                            <div key={item.id} className="d-flex align-items-center justify-content-between p-3 bg-white border rounded hover-shadow mb-2">
                                                <div className="d-flex align-items-center">
                                                    <div className={`rounded-circle p-2 me-3 ${
                                                        item.type === 'school' ? 'bg-secondary bg-opacity-10' : 
                                                        item.type === 'department' ? 'bg-secondary bg-opacity-10' : 'bg-secondary bg-opacity-10'
                                                    }`}>
                                                        <span className="fs-5 text-primary">{getTypeIcon(item.type)}</span>
                                                    </div>
                                                    <div>
                                                        <div className="d-flex align-items-center">
                                                            <span className="fw-medium text-dark">{item.name}</span>
                                                            <span className={`badge ms-2 ${
                                                                item.type === 'school' ? 'bg-primary' : 
                                                                item.type === 'department' ? 'bg-secondary' : 'bg-success'
                                                            }`}>
                                                                {item.type}
                                                            </span>
                                                        </div>
                                                        <small className="text-muted">
                                                            Display Order: <strong>{item.display_order}</strong>
                                                        </small>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger btn-icon"
                                                    onClick={() => removeNavigationItem(item.id)}
                                                >
                                                    <i className="bx bx-trash"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {getError('navigation_items') && (
                                <div className="form-text text-danger">{getError('navigation_items')}</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Links Card */}
                <div className="col-xl-6">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-0 py-4">
                            <div className="d-flex align-items-center">
                                <div className="bg-success bg-opacity-10 rounded p-3 me-3">
                                    <i className="bx bx-link text-success fs-4"></i>
                                </div>
                                <div>
                                    <h5 className="fw-bold text-dark mb-1">Quick Links</h5>
                                    <p className="text-muted mb-0">Add external links and resources</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="card-body p-4">
                            {/* Add Quick Link Button */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h6 className="fw-semibold text-dark mb-0">External Links</h6>
                                <button
                                    type="button"
                                    className="btn btn-success px-3"
                                    onClick={addQuickLink}
                                >
                                    <i className="bx bx-plus me-2"></i>
                                    Add Link
                                </button>
                            </div>

                            {/* Quick Links List */}
                            {quickLinks.length === 0 ? (
                                <div className="text-center py-5">
                                    <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
                                        <i className="bx bx-link-alt text-muted fs-2"></i>
                                    </div>
                                    <h6 className="text-muted fw-medium">No quick links added</h6>
                                    <p className="text-muted small">Add external links to display in your menu</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {quickLinks.map((link, index) => (
                                        <div key={link.id} className="border rounded p-4 bg-white hover-shadow">
                                            <div className="row g-3">
                                                <div className="col-md-5">
                                                    <label className="form-label fw-medium text-dark small">Link Text <span className="text-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        className={`form-control border-0 bg-light ${getQuickLinkError(index, 'text') ? 'is-invalid' : ''}`}
                                                        value={link.text}
                                                        onChange={(e) => updateQuickLink(link.id, 'text', e.target.value)}
                                                        placeholder="e.g., Student Portal"
                                                    />
                                                    {getQuickLinkError(index, 'text') && (
                                                        <div className="form-text text-danger">{getQuickLinkError(index, 'text')}</div>
                                                    )}
                                                </div>
                                                <div className="col-md-5">
                                                    <label className="form-label fw-medium text-dark small">URL <span className="text-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        className={`form-control border-0 bg-light ${getQuickLinkError(index, 'link') ? 'is-invalid' : ''}`}
                                                        value={link.link}
                                                        onChange={(e) => updateQuickLink(link.id, 'link', e.target.value)}
                                                        placeholder="https://example.com"
                                                    />
                                                    {getQuickLinkError(index, 'link') && (
                                                        <div className="form-text text-danger">{getQuickLinkError(index, 'link')}</div>
                                                    )}
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="form-label fw-medium text-dark small">Order</label>
                                                    <input
                                                        type="number"
                                                        className={`form-control border-0 bg-light ${getQuickLinkError(index, 'display_order') ? 'is-invalid' : ''}`}
                                                        value={link.display_order}
                                                        onChange={(e) => updateQuickLink(link.id, 'display_order', parseInt(e.target.value))}
                                                        min="1"
                                                    />
                                                    {getQuickLinkError(index, 'display_order') && (
                                                        <div className="form-text text-danger">{getQuickLinkError(index, 'display_order')}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-3 text-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => removeQuickLink(link.id)}
                                                >
                                                    <i className="bx bx-trash me-1"></i> Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Display general quick links errors */}
                            {getError('quick_links') && (
                                <div className="form-text text-danger mt-3">{getError('quick_links')}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="mt-4">
                <div className="card border-0">
                    <div className="card-body py-4">
                        <button 
                            type="submit" 
                            className="btn btn-primary btn-lg px-5 shadow-sm" 
                            onClick={submit}
                            disabled={processing || (addedItems.length === 0 && quickLinks.length === 0)}
                        >
                            <i className="bx bx-save me-2"></i>
                            {processing ? "Saving Configuration..." : "Save Navigation Configuration"}
                        </button>
                        
                        {(addedItems.length === 0 && quickLinks.length === 0) && (
                            <div className="alert alert-warning mt-3 mb-0 border-0 bg-warning bg-opacity-10">
                                <i className="bx bx-info-circle me-2"></i>
                                Add at least one navigation item or quick link to save your configuration.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .hover-shadow:hover {
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    transition: all 0.2s ease;
                }
                .rounded-lg {
                    border-radius: 12px !important;
                }
                .btn-icon {
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>
        </>
    );
};

export default PageManager;