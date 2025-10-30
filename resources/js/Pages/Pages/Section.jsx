import { useState, useRef, useEffect } from "react";
import { router, usePage } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SECTION_TEMPLATES from '../../data/sectionTemplates.json';
import {
  PlusCircle,
  Trash2,
  Save,
  ChevronDown,
  ChevronUp,
  GripVertical,
  X,
  Quote,
  TextQuote,
  Wallpaper,
  Images,
  CircleArrowRight,
  Blocks,
} from "lucide-react";

const componentIcons = {
  testimonials: <Quote size={20} />,
  pricing: <Wallpaper size={20} />,
  hero: <Images size={20} />,
  features: <Blocks size={20} />,
  cta: <CircleArrowRight size={20} />,
};

const PageBuilder = () => {
  const { props } = usePage();
  const { page, existingSections = [], flash } = props;
  
  const [sections, setSections] = useState([]);
  const [showComponentPicker, setShowComponentPicker] = useState(false);
  const [draggedSection, setDraggedSection] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const modalRef = useRef(null);
  const editModalRef = useRef(null);

  // Handle flash messages
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  // Initialize sections from existing data with positions
  useEffect(() => {
    if (existingSections && existingSections.length > 0) {
      const formatted = existingSections.map((section, index) => ({
        section_uuid: section.group_key,
        section_name: section.type,
        group_key: section.group_key,
        position: index + 1,
        items: section.items.map((item, itemIndex) => ({
          ...item,
          item_uuid: item.item_uuid || generateUUID(),
          id: item.id,
          position: item.position || itemIndex + 1, // Add item position
        })),
        isCollapsed: true,
      }));
      setSections(formatted);
    }
  }, [existingSections]);

  const generateUUID = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  const addNewSection = (sectionType) => {
    const newSection = {
      section_uuid: generateUUID(),
      section_name: sectionType,
      items: [],
      position: sections.length + 1,
      isCollapsed: false,
    };
    setSections([...sections, newSection]);
    setShowComponentPicker(false);
    toast.success(`${SECTION_TEMPLATES[sectionType].label} section added`);
  };

  const addItemToSection = (sectionIndex) => {
    const updated = [...sections];
    const newItem = { 
      item_uuid: generateUUID(),
      position: updated[sectionIndex].items.length + 1 // Set item position
    };
    
    // Initialize empty values for all fields
    const sectionType = updated[sectionIndex].section_name;
    if (SECTION_TEMPLATES[sectionType]) {
      SECTION_TEMPLATES[sectionType].fields.forEach(field => {
        newItem[field.name] = '';
      });
    }
    
    updated[sectionIndex].items.push(newItem);
    updated[sectionIndex].isCollapsed = false;
    setSections(updated);
    toast.success("Item added. Fill in the details below.");
  };

  const deleteSection = (sectionIndex) => {
    const section = sections[sectionIndex];
    
    if (section.group_key) {
      router.get(route('sections.delete', section.group_key), {}, {
        preserveScroll: true,
        onSuccess: () => {
          const updated = sections.filter((_, i) => i !== sectionIndex);
          const withUpdatedPositions = updated.map((section, index) => ({
            ...section,
            position: index + 1
          }));
          setSections(withUpdatedPositions);
          toast.success("Section deleted successfully");
        },
        onError: () => {
          toast.error("Error deleting section");
        }
      });
    } else {
      const updated = sections.filter((_, i) => i !== sectionIndex);
      const withUpdatedPositions = updated.map((section, index) => ({
        ...section,
        position: index + 1
      }));
      setSections(withUpdatedPositions);
      toast.success("Section removed");
    }
  };

  const deleteItem = (sectionIndex, itemIndex) => {
    const section = sections[sectionIndex];
    const item = section.items[itemIndex];
    
    if (item.id) {
      router.get(route('sections.item.delete', item.id), {}, {
        preserveScroll: true,
        onSuccess: () => {
          const updated = [...sections];
          updated[sectionIndex].items = updated[sectionIndex].items.filter((_, i) => i !== itemIndex);
          
          // Update item positions after deletion
          const itemsWithUpdatedPositions = updated[sectionIndex].items.map((item, index) => ({
            ...item,
            position: index + 1
          }));
          updated[sectionIndex].items = itemsWithUpdatedPositions;
          
          setSections(updated);
          toast.success("Item deleted successfully");
        },
        onError: () => {
          toast.error("Error deleting item");
        }
      });
    } else {
      const updated = [...sections];
      updated[sectionIndex].items = updated[sectionIndex].items.filter((_, i) => i !== itemIndex);
      
      // Update item positions after deletion
      const itemsWithUpdatedPositions = updated[sectionIndex].items.map((item, index) => ({
        ...item,
        position: index + 1
      }));
      updated[sectionIndex].items = itemsWithUpdatedPositions;
      
      setSections(updated);
      toast.success("Item removed");
    }
  };

  const toggleSectionCollapse = (sectionIndex) => {
    const updated = [...sections];
    updated[sectionIndex].isCollapsed = !updated[sectionIndex].isCollapsed;
    setSections(updated);
  };

  const handleFieldChange = (sectionIndex, itemIndex, field, value) => {
    const updated = [...sections];
    updated[sectionIndex].items[itemIndex][field] = value;
    setSections(updated);
  };

  const handleSectionDragStart = (e, index) => {
    setDraggedSection(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleSectionDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleSectionDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedSection === null) return;

    const updated = [...sections];
    const [removed] = updated.splice(draggedSection, 1);
    updated.splice(dropIndex, 0, removed);
    
    const withUpdatedPositions = updated.map((section, index) => ({
      ...section,
      position: index + 1
    }));
    
    setSections(withUpdatedPositions);
    setDraggedSection(null);
    toast.success("Section reordered");
  };

  const handleItemDragStart = (e, sectionIndex, itemIndex) => {
    setDraggedItem({ sectionIndex, itemIndex });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleItemDrop = (e, sectionIndex, dropIndex) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.sectionIndex !== sectionIndex) return;

    const updated = [...sections];
    const items = [...updated[sectionIndex].items];
    const [removed] = items.splice(draggedItem.itemIndex, 1);
    items.splice(dropIndex, 0, removed);
    
    // Update item positions after reordering
    const itemsWithUpdatedPositions = items.map((item, index) => ({
      ...item,
      position: index + 1
    }));
    
    updated[sectionIndex].items = itemsWithUpdatedPositions;
    setSections(updated);
    setDraggedItem(null);
    toast.success("Item reordered");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData();
    formData.append('page_id', page.id);

    // Prepare sections data with positions
    sections.forEach((section, sIndex) => {
      if (section.group_key) {
        // Existing section
        formData.append(`existing[${sIndex}][group_key]`, section.group_key);
        formData.append(`existing[${sIndex}][section_name]`, section.section_name);
        formData.append(`existing[${sIndex}][position]`, section.position);
        
        section.items.forEach((item, iIndex) => {
          // Send ALL items with their positions and IDs
          Object.entries(item).forEach(([key, value]) => {
            if (value instanceof File) {
              formData.append(`existing[${sIndex}][items][${iIndex}][${key}]`, value);
            } else if (value !== null && value !== undefined && key !== 'id') {
              formData.append(`existing[${sIndex}][items][${iIndex}][${key}]`, value);
            }
          });
          
          // Always send item position
          formData.append(`existing[${sIndex}][items][${iIndex}][position]`, item.position);
          
          // Send item ID if it exists (for existing items)
          if (item.id) {
            formData.append(`existing[${sIndex}][items][${iIndex}][id]`, item.id);
          }
        });
      } else {
        // New section
        formData.append(`sections[${sIndex}][section_uuid]`, section.section_uuid);
        formData.append(`sections[${sIndex}][section_name]`, section.section_name);
        formData.append(`sections[${sIndex}][position]`, section.position);
        
        section.items.forEach((item, iIndex) => {
          Object.entries(item).forEach(([key, value]) => {
            if (value instanceof File) {
              formData.append(`sections[${sIndex}][items][${iIndex}][${key}]`, value);
            } else if (value !== null && value !== undefined) {
              formData.append(`sections[${sIndex}][items][${iIndex}][${key}]`, value);
            }
          });
          // Add item position for all items in new sections
          formData.append(`sections[${sIndex}][items][${iIndex}][position]`, item.position);
        });
      }
    });

    router.post(route('sections.store'), formData, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSaving(false);
        toast.success("Sections saved successfully!");
      },
      onError: (errors) => {
        setIsSaving(false);
        console.error('Save errors:', errors);
        toast.error("Error saving sections");
      }
    });
  };

  const showDeleteModal = (type, sectionIndex, itemIndex = null) => {
    setDeleteTarget({ type, sectionIndex, itemIndex });
    const modal = new window.bootstrap.Modal(modalRef.current);
    modal.show();
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    
    if (deleteTarget.type === "section") {
      deleteSection(deleteTarget.sectionIndex);
    } else if (deleteTarget.type === "item") {
      deleteItem(deleteTarget.sectionIndex, deleteTarget.itemIndex);
    }
    
    const modal = window.bootstrap.Modal.getInstance(modalRef.current);
    modal.hide();
    setDeleteTarget(null);
  };

  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <h1 className="text-muted">Page Builder</h1>
      <p className="text-muted fs-5">
        Page: {page?.title}
      </p>

      {/* Delete Confirmation Modal */}
      <div className="modal fade" ref={modalRef} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Deletion</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <p className="mb-0">
                Are you sure you want to delete this {deleteTarget?.type}? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card p-4 mb-4">
          <div className="d-flex align-items-center gap-2 mb-4">
            <GripVertical size={18} className="text-muted" />
            <span className="text-muted fw-medium">
              Dynamic Zone ({sections.length} {sections.length === 1 ? "section" : "sections"})
            </span>
          </div>

          <div className="d-flex flex-column gap-3">
            {sections.map((section, sIndex) => (
              <div
                key={section.section_uuid}
                className={`section-card ${draggedSection === sIndex ? "dragging" : ""}`}
                draggable
                onDragStart={(e) => handleSectionDragStart(e, sIndex)}
                onDragOver={handleSectionDragOver}
                onDrop={(e) => handleSectionDrop(e, sIndex)}
              >
                <div className="section-header px-4 py-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <GripVertical size={20} className="drag-handle text-muted" />
                      <button
                        type="button"
                        className="btn btn-link p-0 text-decoration-none"
                        onClick={() => toggleSectionCollapse(sIndex)}
                      >
                        {section.isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                      </button>
                      <div className="d-flex align-items-center gap-2">
                        {componentIcons[section.section_name] || <TextQuote size={24} />}
                        <span className="fw-semibold">
                          {SECTION_TEMPLATES[section.section_name]?.label || section.section_name}
                        </span>
                      </div>
                      <span className="position-badge">Section: {section.position}</span>
                      <span className="badge-count">{section.items.length} items</span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => showDeleteModal("section", sIndex)}
                    >
                      <Trash2 size={18} />
                      Delete Section
                    </button>
                  </div>
                </div>

                {!section.isCollapsed && (
                  <div className="p-4">
                    {section.items.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-muted mb-3">No items yet. Add your first entry to get started.</p>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={() => addItemToSection(sIndex)}
                        >
                          <PlusCircle size={16} className="me-2" />
                          Add First Entry
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="d-flex flex-column gap-3">
                          {section.items.map((item, iIndex) => (
                            <div
                              key={item.item_uuid}
                              className={`item-card p-3 ${
                                draggedItem?.sectionIndex === sIndex && draggedItem?.itemIndex === iIndex ? "dragging" : ""
                              }`}
                              draggable
                              onDragStart={(e) => handleItemDragStart(e, sIndex, iIndex)}
                              onDragOver={handleSectionDragOver}
                              onDrop={(e) => handleItemDrop(e, sIndex, iIndex)}
                            >
                              <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="d-flex align-items-center gap-2">
                                  <GripVertical size={16} className="drag-handle text-muted" />
                                  <div className="d-flex align-items-center gap-2">
                                    {componentIcons[section.section_name] || <TextQuote size={18} />}
                                    <span className="small fw-medium">
                                      {SECTION_TEMPLATES[section.section_name]?.label} Item #{iIndex + 1}
                                    </span>
                                    <span className="item-position-badge">Pos: {item.position}</span>
                                  </div>
                                </div>
                                <div className="d-flex align-items-center gap-1">
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => showDeleteModal("item", sIndex, iIndex)}
                                  >
                                    <Trash2 size={14}/>
                                    Delete Item
                                  </button>
                                </div>
                              </div>

                              <div className="row g-3">
                                {SECTION_TEMPLATES[section.section_name]?.fields.map((field, fIndex) => (
                                  <div key={fIndex} className="col-md-6">
                                    <label className="form-label small fw-medium">{field.label}</label>
                                    {field.type === "file" ? (
                                      <div>
                                        {item[field.name] && typeof item[field.name] === "string" && (
                                          <img src={item[field.name]} alt="Preview" className="preview-image mb-2 d-block" />
                                        )}
                                        <input
                                          type="file"
                                          className="form-control "
                                          accept="image/*"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              handleFieldChange(sIndex, iIndex, field.name, file);
                                            }
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      <input
                                        type={field.type}
                                        className="form-control"
                                        value={item[field.name] || ""}
                                        onChange={(e) => handleFieldChange(sIndex, iIndex, field.name, e.target.value)}
                                        placeholder={field.placeholder}
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary mt-3 w-100"
                          style={{ borderStyle: "dashed" }}
                          onClick={() => addItemToSection(sIndex)}
                        >
                          <PlusCircle size={16} className="me-2" />
                          Add an entry
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}

            {(showComponentPicker || sections.length === 0) && (
              <div className="component-picker-card">
                <div className="component-picker-header px-4 py-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="fw-semibold text-primary">
                      Component Library
                    </span>
                    {sections.length > 0 && (
                      <button
                        type="button"
                        className="btn btn-sm btn-link text-muted p-0"
                        onClick={() => setShowComponentPicker(false)}
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-center text-muted mb-4">
                    {sections.length === 0 ? "Start by picking your first component" : "Pick a component to add"}
                  </p>
                  <div className="row g-3 justify-content-center">
                    {Object.entries(SECTION_TEMPLATES).map(([key, val]) => (
                      <div key={key} className="col-6 col-sm-4 col-md-3 col-lg-2">
                        <button
                          type="button"
                          className="component-btn btn btn-light w-100 p-3 d-flex flex-column align-items-center"
                          onClick={() => addNewSection(key)}
                        >
                          <div className="mb-2">
                            {componentIcons[key] || <TextQuote size={32} />}
                          </div>
                          <div className="small fw-medium">{val.label}</div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {sections.length > 0 && !showComponentPicker && (
              <div className="text-center py-2">
                <button
                  type="button"
                  className="btn btn-outline-dark py-2 px-5"
                  onClick={() => setShowComponentPicker(true)}
                >
                  <PlusCircle size={16} className="me-2" />
                  Add Component
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-end gap-3">
          <button
            type="submit"
            className="btn btn-primary me-2"
            disabled={isSaving}
            style={{ minWidth: "120px" }}
          >
            {isSaving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} className="me-2" />
                Save All Changes
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default PageBuilder;