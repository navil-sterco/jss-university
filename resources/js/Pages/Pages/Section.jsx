import { useState, useRef, useEffect } from "react";
import { router, usePage } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FALLBACK_SECTION_TEMPLATES from '../../data/sectionTemplates.json';
import {
  PlusCircle,
  Trash2,
  Save,
  ChevronDown,
  ChevronUp,
  GripVertical,
  X,
  TextQuote,
  Images,
  HandCoins,
  LayoutList,
  Captions,
  SlidersHorizontal,
  Telescope,
  Lock,
  Unlock,
  Boxes,
  LayoutTemplate,
  Shield,
  Percent,
  Heading,
  Sliders,
  TestTube2,
  Bolt,
  InspectionPanel,
  Dam,
  Library,
  Megaphone,
} from "lucide-react";

const componentIcons = {
  topBanner: <Images size={20} />,
  logoDesc: <LayoutList size={20} />,
  figureDesc: <Captions size={20} />,
  slider: <SlidersHorizontal size={20} />,
  values: <HandCoins size={20} />,
  visionMission: <Telescope size={20} />,
  qualityPolicy: <Shield size={20} />,
  titleBanner: <LayoutTemplate size={20} />,
  boxes: <Boxes size={20} />,
  percentSub: <Percent size={20} />,
  heading: <Heading size={20} />,
  dataSlider: <Sliders size={20} />,
  researchSection: <TestTube2 size={20} />,
  objectives: <Bolt size={20} />,
  sideSection: <InspectionPanel size={20} />,
  featuresSection: <Dam size={20} />,
  librarySection: <Library size={20} />,
  comingSoon: <Megaphone size={20} />,
};

// Helper function to convert File to Base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Helper to check if a value is a File
const isFile = (value) => {
  return value instanceof File;
};

// Helper to process data and convert files to base64
const processItemForSubmit = async (item) => {
  const processed = { ...item };

  for (const [key, value] of Object.entries(item)) {
    if (key === 'item_uuid' || key === 'id' || key === 'position' || key === 'allow_multiple_items') {
      continue;
    }

    // Handle File objects
    if (isFile(value)) {
      try {
        const base64 = await fileToBase64(value);
        processed[key] = {
          base64,
          filename: value.name,
          type: value.type,
          size: value.size
        };
      } catch (error) {
        console.error(`Error converting file ${key}:`, error);
        toast.error(`Error processing file: ${value.name}`);
      }
    }
    // Handle arrays (repeaters)
    else if (Array.isArray(value)) {
      const processedArray = [];

      for (const row of value) {
        if (typeof row === 'object' && row !== null) {
          const processedRow = {};

          for (const [subKey, subValue] of Object.entries(row)) {
            if (isFile(subValue)) {
              try {
                const base64 = await fileToBase64(subValue);
                processedRow[subKey] = {
                  base64,
                  filename: subValue.name,
                  type: subValue.type,
                  size: subValue.size
                };
              } catch (error) {
                console.error(`Error converting repeater file ${subKey}:`, error);
              }
            } else {
              processedRow[subKey] = subValue;
            }
          }

          processedArray.push(processedRow);
        } else {
          processedArray.push(row);
        }
      }

      processed[key] = processedArray;
    }
  }

  return processed;
};

const PageBuilder = () => {
  const { props } = usePage();
  const { page, existingSections = [], sectionTemplates, flash } = props;
  const SECTION_TEMPLATES = sectionTemplates && Object.keys(sectionTemplates).length > 0
    ? sectionTemplates
    : FALLBACK_SECTION_TEMPLATES;

  const [sections, setSections] = useState([]);
  const [showComponentPicker, setShowComponentPicker] = useState(false);
  const [draggedSection, setDraggedSection] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [dragEnabled, setDragEnabled] = useState(false);

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
        allowMultipleItems: (() => {
          const first = section.items?.[0];
          if (first && (first.allow_multiple_items === 0 || first.allow_multiple_items === 1)) {
            return !!first.allow_multiple_items;
          }
          return !!SECTION_TEMPLATES?.[section.type]?.allow_multiple_items;
        })(),
        items: section.items.map((item, itemIndex) => ({
          ...item,
          item_uuid: item.item_uuid || generateUUID(),
          id: item.id,
          position: item.position || itemIndex + 1,
        })),
        isCollapsed: true,
      }));
      setSections(formatted);
    }
  }, [existingSections, SECTION_TEMPLATES]);

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
      allowMultipleItems: !!SECTION_TEMPLATES?.[sectionType]?.allow_multiple_items,
    };
    setSections([...sections, newSection]);
    setShowComponentPicker(false);
    toast.success(`${SECTION_TEMPLATES[sectionType].label} section added`);
  };

  const addItemToSection = (sectionIndex) => {
    const updated = [...sections];
    if (updated[sectionIndex]?.allowMultipleItems === false && updated[sectionIndex].items.length >= 1) {
      toast.info("This section is set to Single item. Switch to Multiple to add more.");
      return;
    }
    const newItem = {
      item_uuid: generateUUID(),
      position: updated[sectionIndex].items.length + 1
    };

    const sectionType = updated[sectionIndex].section_name;
    if (SECTION_TEMPLATES[sectionType]) {
      SECTION_TEMPLATES[sectionType].fields.forEach(field => {
        if (field.type === 'repeater') {
          newItem[field.name] = [];
        } else {
          newItem[field.name] = '';
        }
      });
    }
    newItem.allow_multiple_items = updated[sectionIndex]?.allowMultipleItems ? 1 : 0;

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

  const normalizeRepeaterValue = (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const addRepeaterRow = (sectionIndex, itemIndex, fieldName, subfields = []) => {
    const updated = [...sections];
    const curr = normalizeRepeaterValue(updated[sectionIndex].items[itemIndex][fieldName]);
    const row = {};
    subfields.forEach((sf) => {
      row[sf.name] = '';
    });
    updated[sectionIndex].items[itemIndex][fieldName] = [...curr, row];
    setSections(updated);
  };

  const removeRepeaterRow = (sectionIndex, itemIndex, fieldName, rowIndex) => {
    const updated = [...sections];
    const curr = normalizeRepeaterValue(updated[sectionIndex].items[itemIndex][fieldName]);
    updated[sectionIndex].items[itemIndex][fieldName] = curr.filter((_, idx) => idx !== rowIndex);
    setSections(updated);
  };

  const updateRepeaterCell = async (sectionIndex, itemIndex, fieldName, rowIndex, subName, value) => {
    const updated = [...sections];
    const curr = normalizeRepeaterValue(updated[sectionIndex].items[itemIndex][fieldName]);

    if (value instanceof File) {
      // For files, we can store the File object directly
      const next = curr.map((row, idx) => {
        if (idx === rowIndex) {
          return { ...(row || {}), [subName]: value };
        }
        return row;
      });
      updated[sectionIndex].items[itemIndex][fieldName] = next;
      setSections(updated);
    } else {
      const next = curr.map((row, idx) =>
        idx === rowIndex ? { ...(row || {}), [subName]: value } : row
      );
      updated[sectionIndex].items[itemIndex][fieldName] = next;
      setSections(updated);
    }
  };

  const addNestedRepeaterRow = (sectionIndex, itemIndex, fieldName, rowIndex, subName, subSubfields = []) => {
    const updated = [...sections];
    const curr = normalizeRepeaterValue(updated[sectionIndex].items[itemIndex][fieldName]);
    const row = curr[rowIndex] || {};
    const subCurr = normalizeRepeaterValue(row[subName]);

    const subRow = {};
    subSubfields.forEach((ssf) => {
      subRow[ssf.name] = '';
    });

    curr[rowIndex] = { ...row, [subName]: [...subCurr, subRow] };
    updated[sectionIndex].items[itemIndex][fieldName] = curr;
    setSections(updated);
  };

  const removeNestedRepeaterRow = (sectionIndex, itemIndex, fieldName, rowIndex, subName, subRowIndex) => {
    const updated = [...sections];
    const curr = normalizeRepeaterValue(updated[sectionIndex].items[itemIndex][fieldName]);
    const row = curr[rowIndex] || {};
    const subCurr = normalizeRepeaterValue(row[subName]);

    curr[rowIndex] = { ...row, [subName]: subCurr.filter((_, idx) => idx !== subRowIndex) };
    updated[sectionIndex].items[itemIndex][fieldName] = curr;
    setSections(updated);
  };

  const updateNestedRepeaterCell = async (sectionIndex, itemIndex, fieldName, rowIndex, subName, subRowIndex, subSubName, value) => {
    const updated = [...sections];
    const curr = normalizeRepeaterValue(updated[sectionIndex].items[itemIndex][fieldName]);
    const row = curr[rowIndex] || {};
    const subCurr = normalizeRepeaterValue(row[subName]);

    const nextSubCurr = subCurr.map((subRow, idx) => {
      if (idx === subRowIndex) {
        return { ...(subRow || {}), [subSubName]: value };
      }
      return subRow;
    });

    curr[rowIndex] = { ...row, [subName]: nextSubCurr };
    updated[sectionIndex].items[itemIndex][fieldName] = curr;
    setSections(updated);
  };

  const handleSectionDragStart = (e, index) => {
    if (!dragEnabled) {
      e.preventDefault();
      return;
    }
    setDraggedSection(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleSectionDragOver = (e) => {
    if (!dragEnabled) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleSectionDrop = (e, dropIndex) => {
    if (!dragEnabled) {
      e.preventDefault();
      return;
    }
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
    if (!dragEnabled) {
      e.preventDefault();
      return;
    }
    setDraggedItem({ sectionIndex, itemIndex });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleItemDrop = (e, sectionIndex, dropIndex) => {
    if (!dragEnabled) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    if (!draggedItem || draggedItem.sectionIndex !== sectionIndex) return;

    const updated = [...sections];
    const items = [...updated[sectionIndex].items];
    const [removed] = items.splice(draggedItem.itemIndex, 1);
    items.splice(dropIndex, 0, removed);

    const itemsWithUpdatedPositions = items.map((item, index) => ({
      ...item,
      position: index + 1
    }));

    updated[sectionIndex].items = itemsWithUpdatedPositions;
    setSections(updated);
    setDraggedItem(null);
    toast.success("Item reordered");
  };

  const toggleDragEnabled = () => {
    setDragEnabled(!dragEnabled);
    toast.info(`Drag & Drop ${!dragEnabled ? 'enabled' : 'disabled'}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Prepare data structure
      const data = {
        page_id: page.id,
        sections: [],
        existing: []
      };

      // Process sections
      for (const [sIndex, section] of sections.entries()) {
        const sectionData = {
          section_uuid: section.section_uuid,
          section_name: section.section_name,
          group_key: section.group_key,
          position: section.position,
          items: []
        };

        // Process items in section
        for (const [iIndex, item] of section.items.entries()) {
          const processedItem = await processItemForSubmit({
            ...item,
            allow_multiple_items: section.allowMultipleItems ? 1 : 0,
            position: item.position
          });

          sectionData.items.push(processedItem);
        }

        if (section.group_key) {
          data.existing.push(sectionData);
        } else {
          data.sections.push(sectionData);
        }
      }

      console.log('Sending data:', data);

      // Send as JSON instead of FormData
      router.post(route('sections.store'), data, {
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
    } catch (error) {
      setIsSaving(false);
      console.error('Error processing data:', error);
      toast.error("Error processing files");
    }
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

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="text-muted mb-1">Page Builder</h1>
          <p className="text-muted mb-0">
            Page: {page?.title}
          </p>
        </div>
        <button
          type="button"
          className={`btn ${dragEnabled ? 'btn-warning' : 'btn-secondary'}`}
          onClick={toggleDragEnabled}
          title={dragEnabled ? 'Disable Drag & Drop' : 'Enable Drag & Drop'}
        >
          {dragEnabled ? <Lock className="m-1" size={16} /> : <Unlock className="m-1" size={16} />}
          {dragEnabled ? ' Disable Drag' : ' Enable Drag'}
        </button>
      </div>

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
            <GripVertical size={18} className={`${dragEnabled ? 'text-muted' : 'text-muted opacity-25'}`} />
            <span className={`fw-medium ${dragEnabled ? 'text-muted' : 'text-muted opacity-50'}`}>
              Dynamic Zone ({sections.length} {sections.length === 1 ? "section" : "sections"})
              {!dragEnabled && <span className="badge bg-secondary ms-2">Drag Disabled</span>}
            </span>
          </div>

          <div className="d-flex flex-column gap-3">
            {sections.map((section, sIndex) => (
              <div
                key={section.section_uuid}
                className={`section-card ${draggedSection === sIndex ? "dragging" : ""} ${!dragEnabled ? "drag-disabled" : ""
                  }`}
                draggable={dragEnabled}
                onDragStart={(e) => handleSectionDragStart(e, sIndex)}
                onDragOver={handleSectionDragOver}
                onDrop={(e) => handleSectionDrop(e, sIndex)}
              >
                <div className="section-header px-4 py-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <GripVertical
                        size={20}
                        className={`drag-handle ${dragEnabled ? 'text-muted' : 'text-muted opacity-25'}`}
                      />
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
                      {section.section_name === "heading" && SECTION_TEMPLATES?.[section.section_name] && (
                        <div className="d-flex align-items-center gap-2 ms-2">
                          <span className="text-muted small">Heading:</span>
                          <div className="btn-group btn-group-sm" role="group" aria-label="Multiple mode">
                            <input
                              type="radio"
                              className="btn-check"
                              name={`multiple-mode-${section.section_uuid}`}
                              id={`single-${section.section_uuid}`}
                              checked={!section.allowMultipleItems}
                              onChange={() => {
                                const updated = [...sections];
                                updated[sIndex].allowMultipleItems = false;
                                if (updated[sIndex].items.length > 1) {
                                  updated[sIndex].items = updated[sIndex].items.slice(0, 1);
                                  toast.info("Switched to Single item. Extra items were removed.");
                                }
                                setSections(updated);
                              }}
                            />
                            <label className="btn btn-outline-secondary" htmlFor={`single-${section.section_uuid}`}>
                              Single
                            </label>

                            <input
                              type="radio"
                              className="btn-check"
                              name={`multiple-mode-${section.section_uuid}`}
                              id={`multiple-${section.section_uuid}`}
                              checked={!!section.allowMultipleItems}
                              onChange={() => {
                                const updated = [...sections];
                                updated[sIndex].allowMultipleItems = true;
                                setSections(updated);
                              }}
                            />
                            <label className="btn btn-outline-secondary" htmlFor={`multiple-${section.section_uuid}`}>
                              Multiple
                            </label>
                          </div>
                        </div>
                      )}
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
                              className={`item-card p-3 ${draggedItem?.sectionIndex === sIndex && draggedItem?.itemIndex === iIndex ? "dragging" : ""
                                } ${!dragEnabled ? "drag-disabled" : ""}`}
                              draggable={dragEnabled}
                              onDragStart={(e) => handleItemDragStart(e, sIndex, iIndex)}
                              onDragOver={handleSectionDragOver}
                              onDrop={(e) => handleItemDrop(e, sIndex, iIndex)}
                            >
                              <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="d-flex align-items-center gap-2">
                                  <GripVertical
                                    size={16}
                                    className={`drag-handle ${dragEnabled ? 'text-muted' : 'text-muted opacity-25'}`}
                                  />
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
                                    <Trash2 size={14} />
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
                                          <div className="mb-2 d-flex align-items-start gap-2">
                                            <div>
                                              <img
                                                src={item[field.name]}
                                                alt="Preview"
                                                className="preview-image mb-1 d-block"
                                                style={{ maxWidth: '200px', maxHeight: '150px' }}
                                              />
                                              <small className="text-muted d-block">Current file</small>
                                            </div>
                                            <button
                                              type="button"
                                              className="btn btn-sm btn-outline-danger"
                                              title="Remove image"
                                              onClick={() => handleFieldChange(sIndex, iIndex, field.name, null)}
                                            >
                                              <Trash2 size={13} className="me-1" />
                                              Remove
                                            </button>
                                          </div>
                                        )}
                                        {item[field.name] === null && (
                                          <div className="mb-2">
                                            <span className="badge bg-danger">Image will be removed on save</span>
                                          </div>
                                        )}
                                        {item[field.name] instanceof File && (
                                          <div className="mb-2">
                                            <small className="text-success d-block">
                                              New file selected: {item[field.name].name}
                                            </small>
                                          </div>
                                        )}
                                        <input
                                          type="file"
                                          className="form-control"
                                          accept="image/*,.pdf,.doc,.docx,.mp4"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              handleFieldChange(sIndex, iIndex, field.name, file);
                                            }
                                          }}
                                        />
                                      </div>
                                    ) : field.type === "repeater" ? (
                                      <div className="border rounded p-2">
                                        <div className="text-muted small mb-2">
                                          Stored as an array (JSON). Use "Add item" to add multiple rows.
                                        </div>

                                        {normalizeRepeaterValue(item[field.name]).map((row, rIdx) => (
                                          <div key={rIdx} className="border rounded p-2 mb-2 bg-light">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                              <div className="small fw-medium">Item #{rIdx + 1}</div>
                                              <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => removeRepeaterRow(sIndex, iIndex, field.name, rIdx)}
                                              >
                                                <Trash2 size={14} />
                                                Remove
                                              </button>
                                            </div>
                                            <div className="row g-2">
                                              {(field.subfields || []).map((sf, sfIdx) => (
                                                <div key={sfIdx} className="col-12">
                                                  <label className="form-label small fw-medium">{sf.label || sf.name}</label>
                                                  {sf.type === "file" ? (
                                                    <div>
                                                      {/* Show existing file preview */}
                                                      {row && row[sf.name] && typeof row[sf.name] === "string" && (
                                                        <div className="mb-2 d-flex align-items-start gap-2">
                                                          <div>
                                                            <img
                                                              src={row[sf.name]}
                                                              alt="Preview"
                                                              className="preview-image mb-1 d-block"
                                                              style={{ maxWidth: '200px', maxHeight: '150px' }}
                                                            />
                                                            <small className="text-muted d-block">Current file</small>
                                                          </div>
                                                          <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            title="Remove image"
                                                            onClick={() => updateRepeaterCell(sIndex, iIndex, field.name, rIdx, sf.name, null)}
                                                          >
                                                            <Trash2 size={13} className="me-1" />
                                                            Remove
                                                          </button>
                                                        </div>
                                                      )}
                                                      {row && row[sf.name] === null && (
                                                        <div className="mb-2">
                                                          <span className="badge bg-danger">Image will be removed on save</span>
                                                        </div>
                                                      )}
                                                      {/* Show newly selected file name */}
                                                      {row && row[sf.name] instanceof File && (
                                                        <div className="mb-2">
                                                          <small className="text-success d-block">
                                                            New file: {row[sf.name].name}
                                                          </small>
                                                        </div>
                                                      )}
                                                      {/* File input */}
                                                      <input
                                                        type="file"
                                                        className="form-control"
                                                        accept="image/*,.pdf,.doc,.docx,.mp4"
                                                        onChange={(e) => {
                                                          const file = e.target.files?.[0];
                                                          if (file) {
                                                            updateRepeaterCell(sIndex, iIndex, field.name, rIdx, sf.name, file);
                                                          }
                                                        }}
                                                      />
                                                    </div>
                                                  ) : sf.type === "textarea" ? (
                                                    <textarea
                                                      className="form-control"
                                                      rows={2}
                                                      value={(row && row[sf.name]) || ""}
                                                      onChange={(e) =>
                                                        updateRepeaterCell(sIndex, iIndex, field.name, rIdx, sf.name, e.target.value)
                                                      }
                                                      placeholder={sf.placeholder}
                                                    />
                                                  ) : sf.type === "repeater" ? (
                                                    <div className="border rounded p-2 ms-3 mb-2 border-primary">
                                                      <div className="text-muted small mb-2">Nested Repeater</div>
                                                      {normalizeRepeaterValue((row && row[sf.name]) || []).map((subRow, srIdx) => (
                                                        <div key={srIdx} className="border rounded p-2 mb-2 bg-white">
                                                          <div className="d-flex justify-content-between align-items-center mb-2">
                                                            <div className="small fw-medium">Nested Item #{srIdx + 1}</div>
                                                            <button
                                                              type="button"
                                                              className="btn btn-sm btn-outline-danger"
                                                              onClick={() => removeNestedRepeaterRow(sIndex, iIndex, field.name, rIdx, sf.name, srIdx)}
                                                            >
                                                              <Trash2 size={14} /> Remove
                                                            </button>
                                                          </div>
                                                          <div className="row g-2">
                                                            {(sf.subfields || []).map((ssf, ssfIdx) => (
                                                              <div key={ssfIdx} className="col-12">
                                                                <label className="form-label small fw-medium">{ssf.label || ssf.name}</label>
                                                                {ssf.type === "file" ? (
                                                                  <div>
                                                                    {subRow && subRow[ssf.name] && typeof subRow[ssf.name] === "string" && (
                                                                      <div className="mb-2 d-flex align-items-start gap-2">
                                                                        <div>
                                                                          <img src={subRow[ssf.name]} alt="Preview" className="preview-image mb-1 d-block" style={{ maxWidth: '200px', maxHeight: '150px' }} />
                                                                          <small className="text-muted d-block">Current file</small>
                                                                        </div>
                                                                        <button
                                                                          type="button"
                                                                          className="btn btn-sm btn-outline-danger"
                                                                          title="Remove image"
                                                                          onClick={() => updateNestedRepeaterCell(sIndex, iIndex, field.name, rIdx, sf.name, srIdx, ssf.name, null)}
                                                                        >
                                                                          <Trash2 size={13} className="me-1" />
                                                                          Remove
                                                                        </button>
                                                                      </div>
                                                                    )}
                                                                    {subRow && subRow[ssf.name] === null && (
                                                                      <div className="mb-2"><span className="badge bg-danger">Image will be removed on save</span></div>
                                                                    )}
                                                                    {subRow && subRow[ssf.name] instanceof File && (
                                                                      <div className="mb-2"><small className="text-success d-block">New file: {subRow[ssf.name].name}</small></div>
                                                                    )}
                                                                    <input type="file" className="form-control" accept="image/*,.pdf,.doc,.docx,.mp4" onChange={(e) => {
                                                                      const file = e.target.files?.[0];
                                                                      if (file) updateNestedRepeaterCell(sIndex, iIndex, field.name, rIdx, sf.name, srIdx, ssf.name, file);
                                                                    }} />
                                                                  </div>
                                                                ) : ssf.type === "textarea" ? (
                                                                  <textarea className="form-control" rows={2} value={(subRow && subRow[ssf.name]) || ""} onChange={(e) => updateNestedRepeaterCell(sIndex, iIndex, field.name, rIdx, sf.name, srIdx, ssf.name, e.target.value)} placeholder={ssf.placeholder} />
                                                                ) : (
                                                                  <input type={ssf.type || "text"} className="form-control" value={(subRow && subRow[ssf.name]) || ""} onChange={(e) => updateNestedRepeaterCell(sIndex, iIndex, field.name, rIdx, sf.name, srIdx, ssf.name, e.target.value)} placeholder={ssf.placeholder} />
                                                                )}
                                                              </div>
                                                            ))}
                                                          </div>
                                                        </div>
                                                      ))}
                                                      <button type="button" className="btn btn-sm btn-outline-primary w-100 mt-2" style={{ borderStyle: "dashed" }} onClick={() => addNestedRepeaterRow(sIndex, iIndex, field.name, rIdx, sf.name, sf.subfields || [])}>
                                                        <PlusCircle size={16} className="me-2" />
                                                        Add nested item
                                                      </button>
                                                    </div>
                                                  ) : (
                                                    <input
                                                      type={sf.type || "text"}
                                                      className="form-control"
                                                      value={(row && row[sf.name]) || ""}
                                                      onChange={(e) =>
                                                        updateRepeaterCell(sIndex, iIndex, field.name, rIdx, sf.name, e.target.value)
                                                      }
                                                      placeholder={sf.placeholder}
                                                    />
                                                  )}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        ))}

                                        <button
                                          type="button"
                                          className="btn btn-sm btn-outline-primary w-100"
                                          style={{ borderStyle: "dashed" }}
                                          onClick={() => addRepeaterRow(sIndex, iIndex, field.name, field.subfields || [])}
                                        >
                                          <PlusCircle size={16} className="me-2" />
                                          Add item
                                        </button>
                                      </div>
                                    ) : field.type === "textarea" ? (
                                      <textarea
                                        className="form-control"
                                        value={item[field.name] || ""}
                                        onChange={(e) => handleFieldChange(sIndex, iIndex, field.name, e.target.value)}
                                        placeholder={field.placeholder}
                                        rows={3}
                                      />
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

                        {section.allowMultipleItems !== false && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary mt-3 w-100"
                            style={{ borderStyle: "dashed" }}
                            onClick={() => addItemToSection(sIndex)}
                          >
                            <PlusCircle size={16} className="me-2" />
                            Add an entry
                          </button>
                        )}
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
                            {componentIcons[key] || <TextQuote size={20} />}
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

      <style jsx>{`
        .drag-disabled {
          cursor: not-allowed !important;
        }
        .drag-disabled .drag-handle {
          cursor: not-allowed !important;
        }
      `}</style>
    </>
  );
};

export default PageBuilder;
