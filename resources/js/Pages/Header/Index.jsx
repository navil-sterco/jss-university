// resources/js/Pages/Header/Index.jsx
import { Link, router, useForm, usePage } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from "react-toastify";
import { 
    Plus, 
    Eye, 
    EyeOff, 
    Trash2, 
    ListTree, 
    ArrowDownToLine,
    ListOrdered,
    Save,
    RotateCcw,
    Edit
} from 'lucide-react';

const Index = () => {
    const { menuItems, flash } = usePage().props;
    const { get } = useForm();
    const [items, setItems] = useState(menuItems || []);
    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [originalItems, setOriginalItems] = useState(JSON.parse(JSON.stringify(menuItems || [])));
    const [movedItems, setMovedItems] = useState(new Set());
    const [idDelete, setIdDelete] = useState(null);

    // Modal refs
    const modalRef = useRef(null);
    const modalInstance = useRef(null);

    // Toast for flash messages
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash.success]);

    // Initialize modals
    useEffect(() => {
        if (modalRef.current) {
            modalInstance.current = new bootstrap.Modal(modalRef.current);
        }
    }, []);

    const showDeleteModal = (id) => {
        setIdDelete(id);
        modalInstance.current.show();
    };

    const handleConfirmDelete = () => {
        if (idDelete) {
            get(route('headers.destroy', idDelete), {
                preserveScroll: true,
                onSuccess: () => {
                    const updatedItems = removeItemById(items, idDelete);
                    setItems(updatedItems);
                    setHasChanges(true);
                    modalInstance.current.hide();
                    setIdDelete(null);
                }
            });
        }
    };

    const removeItemById = (items, id) => {
        return items.filter(item => {
            if (item.id === id) return false;
            if (item.children && item.children.length > 0) {
                item.children = removeItemById(item.children, id);
            }
            return true;
        });
    };

    const getItemPath = (level, parentIndex, childIndex, subChildIndex = null) => {
        if (level === 'main') return `main-${parentIndex}`;
        if (level === 'child') return `child-${parentIndex}-${childIndex}`;
        if (level === 'subchild') return `subchild-${parentIndex}-${childIndex}-${subChildIndex}`;
        return '';
    };

    const updateMovedItems = (path) => {
        setMovedItems(prev => new Set([...prev, path]));
        setHasChanges(true);
    };

    const moveItemUp = (index) => {
        if (index === 0) return;
        
        const newItems = [...items];
        const temp = newItems[index];
        newItems[index] = newItems[index - 1];
        newItems[index - 1] = temp;
        
        const updatedItems = newItems.map((item, idx) => ({
            ...item,
            display_order: idx,
            children: item.children || []
        }));

        setItems(updatedItems);
        updateMovedItems(getItemPath('main', index));
        updateMovedItems(getItemPath('main', index - 1));
    };

    const moveItemDown = (index) => {
        if (index === items.length - 1) return;
        
        const newItems = [...items];
        const temp = newItems[index];
        newItems[index] = newItems[index + 1];
        newItems[index + 1] = temp;
        
        const updatedItems = newItems.map((item, idx) => ({
            ...item,
            display_order: idx,
            children: item.children || []
        }));

        setItems(updatedItems);
        updateMovedItems(getItemPath('main', index));
        updateMovedItems(getItemPath('main', index + 1));
    };

    const moveChildUp = (parentIndex, childIndex) => {
        if (childIndex === 0) return;
        
        const newItems = [...items];
        const children = [...newItems[parentIndex].children];
        const temp = children[childIndex];
        children[childIndex] = children[childIndex - 1];
        children[childIndex - 1] = temp;
        
        newItems[parentIndex].children = children.map((child, idx) => ({
            ...child,
            display_order: idx
        }));

        setItems(newItems);
        updateMovedItems(getItemPath('child', parentIndex, childIndex));
        updateMovedItems(getItemPath('child', parentIndex, childIndex - 1));
    };

    const moveChildDown = (parentIndex, childIndex) => {
        const children = items[parentIndex].children;
        if (childIndex === children.length - 1) return;
        
        const newItems = [...items];
        const childArray = [...newItems[parentIndex].children];
        const temp = childArray[childIndex];
        childArray[childIndex] = childArray[childIndex + 1];
        childArray[childIndex + 1] = temp;
        
        newItems[parentIndex].children = childArray.map((child, idx) => ({
            ...child,
            display_order: idx
        }));

        setItems(newItems);
        updateMovedItems(getItemPath('child', parentIndex, childIndex));
        updateMovedItems(getItemPath('child', parentIndex, childIndex + 1));
    };

    const moveSubChildUp = (parentIndex, childIndex, subChildIndex) => {
        if (subChildIndex === 0) return;
        
        const newItems = [...items];
        const subChildren = [...newItems[parentIndex].children[childIndex].children];
        const temp = subChildren[subChildIndex];
        subChildren[subChildIndex] = subChildren[subChildIndex - 1];
        subChildren[subChildIndex - 1] = temp;
        
        newItems[parentIndex].children[childIndex].children = subChildren.map((subChild, idx) => ({
            ...subChild,
            display_order: idx
        }));

        setItems(newItems);
        updateMovedItems(getItemPath('subchild', parentIndex, childIndex, subChildIndex));
        updateMovedItems(getItemPath('subchild', parentIndex, childIndex, subChildIndex - 1));
    };

    const moveSubChildDown = (parentIndex, childIndex, subChildIndex) => {
        const subChildren = items[parentIndex].children[childIndex].children;
        if (subChildIndex === subChildren.length - 1) return;
        
        const newItems = [...items];
        const subChildArray = [...newItems[parentIndex].children[childIndex].children];
        const temp = subChildArray[subChildIndex];
        subChildArray[subChildIndex] = subChildArray[subChildIndex + 1];
        subChildArray[subChildIndex + 1] = temp;
        
        newItems[parentIndex].children[childIndex].children = subChildArray.map((subChild, idx) => ({
            ...subChild,
            display_order: idx
        }));

        setItems(newItems);
        updateMovedItems(getItemPath('subchild', parentIndex, childIndex, subChildIndex));
        updateMovedItems(getItemPath('subchild', parentIndex, childIndex, subChildIndex + 1));
    };

    const saveMenuOrder = () => {
        setIsSaving(true);
        
        const flattenItems = (items, parentId = null) => {
            let flatItems = [];
            
            items.forEach((item, index) => {
                flatItems.push({
                    id: item.id,
                    display_order: index,
                    parent_id: parentId
                });
                
                if (item.children && item.children.length > 0) {
                    flatItems = flatItems.concat(flattenItems(item.children, item.id));
                }
            });
            
            return flatItems;
        };

        const itemsToSave = flattenItems(items);

        router.post(route('headers.update-order'), {
            items: itemsToSave
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setHasChanges(false);
                setIsSaving(false);
                setMovedItems(new Set());
                setOriginalItems(JSON.parse(JSON.stringify(items)));
            },
            onError: (errors) => {
                console.error('Failed to save menu order:', errors);
                setIsSaving(false);
            }
        });
    };

    const resetChanges = () => {
        setItems(JSON.parse(JSON.stringify(originalItems)));
        setHasChanges(false);
        setMovedItems(new Set());
    };

    const toggleStatus = (id) => {
        router.post(route('headers.toggle-status', id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                const updateItemStatus = (items) => {
                    return items.map(item => {
                        if (item.id === id) {
                            return { ...item, is_active: !item.is_active };
                        }
                        if (item.children && item.children.length > 0) {
                            return { 
                                ...item, 
                                children: updateItemStatus(item.children) 
                            };
                        }
                        return item;
                    });
                };

                const updatedItems = updateItemStatus(items);
                setItems(updatedItems);
            }
        });
    };

    const getTypeBadge = (type) => {
        const typeColors = {
            custom: 'bg-label-dark',
            school: 'bg-label-warning',
            department: 'bg-label-secondary',
            page: 'bg-label-dark'
        };

        return (
            <span aria-label={type} className={`badge ${typeColors[type] || 'btn-outline-secondary'}`}>
                {type}
            </span>
        );
    };

    const isItemMoved = (level, parentIndex, childIndex = null, subChildIndex = null) => {
        const path = getItemPath(level, parentIndex, childIndex, subChildIndex);
        return movedItems.has(path);
    };

    const renderMenuItem = (item, level, parentIndex = null, childIndex = null, subChildIndex = null) => {
        const currentIndex = subChildIndex !== null ? subChildIndex : childIndex !== null ? childIndex : parentIndex;
        const isMainLevel = level === 'main';
        const isChildLevel = level === 'child';
        const isSubChildLevel = level === 'subchild';

        return (
            <div key={item.id} className={`card mb-3 ${isItemMoved(level, parentIndex, childIndex, subChildIndex) ? 'border-warning' : ''}`}>
                <div className="card-body">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start gap-3">
                        <div className="flex-grow-1 w-100 w-lg-auto">
                            <div className="d-flex flex-wrap align-items-center mb-2 gap-2">
                                <h6 className="mb-0">{item.title}</h6>
                                <div className="d-flex gap-2">
                                    {getTypeBadge(item.type)}
                                    {isItemMoved(level, parentIndex, childIndex, subChildIndex) && (
                                        <span className="badge bg-warning text-dark">
                                            Moved
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3">
                                <small className="text-muted d-flex align-items-center">
                                    <ListOrdered className="icon-sm me-1" />
                                    Order: {currentIndex + 1}
                                </small>
                                <span
                                    className={`badge ${
                                        item.is_active ? "bg-label-success" : "bg-label-danger"
                                    }`}
                                >
                                    {item.is_active ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>
                        
                        {/* Action buttons - responsive layout */}
                        <div className="d-flex flex-wrap gap-2 w-100 w-lg-auto justify-content-start justify-content-lg-end">
                            <div className="btn-group">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => {
                                        if (isMainLevel) moveItemUp(parentIndex);
                                        if (isChildLevel) moveChildUp(parentIndex, childIndex);
                                        if (isSubChildLevel) moveSubChildUp(parentIndex, childIndex, subChildIndex);
                                    }}
                                    title="Move Up"
                                    disabled={
                                        (isMainLevel && parentIndex === 0) ||
                                        (isChildLevel && childIndex === 0) ||
                                        (isSubChildLevel && subChildIndex === 0) ||
                                        isSaving
                                    }
                                >
                                    ↑
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => {
                                        if (isMainLevel) moveItemDown(parentIndex);
                                        if (isChildLevel) moveChildDown(parentIndex, childIndex);
                                        if (isSubChildLevel) moveSubChildDown(parentIndex, childIndex, subChildIndex);
                                    }}
                                    title="Move Down"
                                    disabled={
                                        (isMainLevel && parentIndex === items.length - 1) ||
                                        (isChildLevel && childIndex === items[parentIndex].children.length - 1) ||
                                        (isSubChildLevel && subChildIndex === items[parentIndex].children[childIndex].children.length - 1) ||
                                        isSaving
                                    }
                                >
                                    ↓
                                </button>
                            </div>
                            <Link
                                href={route('headers.edit', item.id)}
                                className="btn btn-sm btn-outline-primary"
                                title="Edit"
                            >
                                <Edit className="icon-sm" />
                            </Link>
                            <button
                                type="button"
                                className={`btn btn-sm ${item.is_active ? 'btn-outline-success' : 'btn-outline-danger'}`}
                                onClick={() => toggleStatus(item.id)}
                                title={item.is_active ? 'Deactivate' : 'Activate'}
                                disabled={isSaving}
                            >
                                {item.is_active ? (
                                    <Eye className="icon-sm" />
                                ) : (
                                    <EyeOff className="icon-sm" />
                                )}
                            </button>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => showDeleteModal(item.id)}
                                title="Delete"
                                disabled={isSaving}
                            >
                                <Trash2 className="icon-sm" />
                            </button>
                        </div>
                    </div>

                    {item.children && item.children.length > 0 && (
                        <div className="mt-3">
                            <div className={`p-2 p-md-3 bg-light rounded ${!isSubChildLevel ? 'ms-0 ms-md-4' : ''}`}>
                                <h6 className="text-muted mb-2 d-flex align-items-center">
                                    <ArrowDownToLine className="icon me-2" />
                                    {isMainLevel ? 'Submenu Items' : 'Sub-items'}
                                </h6>
                                {item.children.map((child, index) => 
                                    renderMenuItem(
                                        child, 
                                        isMainLevel ? 'child' : 'subchild', 
                                        isMainLevel ? parentIndex : parentIndex,
                                        isMainLevel ? index : childIndex,
                                        isMainLevel ? null : index
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <ToastContainer />
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="text-muted">Menu Management</h1>
                    {hasChanges && (
                        <span className="badge bg-warning text-dark">
                            Unsaved Changes
                        </span>
                    )}
                </div>
                <div className="d-flex gap-2">
                    {hasChanges && (
                        <>
                            <button
                                onClick={resetChanges}
                                className="btn btn-outline-secondary"
                                disabled={isSaving}
                            >
                                <RotateCcw className="icon me-2" />
                                Reset
                            </button>
                            <button
                                onClick={saveMenuOrder}
                                className="btn btn-success"
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <div className="spinner-border spinner-border-sm me-2" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="icon me-2" />
                                        Save Menu Order
                                    </>
                                )}
                            </button>
                        </>
                    )}
                    <Link href={route('headers.create')} className="btn btn-primary">
                        <Plus className="icon me-2" />
                        Add Menu
                    </Link>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h5 className="card-title mb-0">Menu Items</h5>
                    <p className="text-muted mb-0 small">Use arrow buttons to reorder menu items and submenus</p>
                </div>
                <div className="card-body p-2 p-md-3">
                    {items.length === 0 ? (
                        <div className="text-center py-5">
                            <ListTree className="icon-lg text-muted mb-3" style={{ width: '48px', height: '48px' }} />
                            <h4 className="h5 h-md-4">No menu items found</h4>
                            <p className="text-muted small">Get started by creating your first menu item.</p>
                            <Link href={route('headers.create')} className="btn btn-primary btn-sm">
                                <Plus className="icon me-2" style={{ width: '16px', height: '16px' }} />
                                Create Menu Item
                            </Link>
                        </div>
                    ) : (
                        <div className="menu-list">
                            {items.map((item, index) => renderMenuItem(item, 'main', index))}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Modal */}
            <div
                className="modal fade"
                id="deleteConfirmModal"
                aria-labelledby="deleteConfirmLabel"
                tabIndex="-1"
                aria-hidden="true"
                ref={modalRef}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteConfirmLabel">Confirm Deletion</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete this menu item? This action cannot be undone.
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleConfirmDelete}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Index;
