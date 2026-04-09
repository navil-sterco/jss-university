import React, { useEffect, useMemo, useRef, useState } from "react";
import { router, useForm, usePage } from "@inertiajs/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FIELD_TYPES = ["text", "textarea", "file", "repeater"];

const emptyField = () => ({ name: "", label: "", type: "text", placeholder: "" });

const emptyTemplate = () => ({
  key: "",
  label: "",
  allow_multiple_items: true,
  is_active: true,
  fields: [emptyField()],
});

// Recursive Field Editor Component
const FieldEditor = ({
  field,
  index,
  level = 1,
  onUpdate,
  onRemove
}) => {
  const isRepeater = field.type === "repeater";

  const handleUpdate = (key, value) => {
    const next = { ...field, [key]: value };
    if (key === "type" && value === "repeater" && !Array.isArray(next.subfields)) {
      next.subfields = [emptyField(), emptyField()];
    }
    if (key === "type" && value !== "repeater") {
      delete next.subfields;
    }
    onUpdate(index, next);
  };

  const handleSubUpdate = (subIdx, subField) => {
    const nextSubfields = [...(field.subfields || [])];
    nextSubfields[subIdx] = subField;
    handleUpdate("subfields", nextSubfields);
  };

  const addSubField = () => {
    handleUpdate("subfields", [...(field.subfields || []), emptyField()]);
  };

  const removeSubField = (subIdx) => {
    handleUpdate("subfields", (field.subfields || []).filter((_, i) => i !== subIdx));
  };

  const bgColors = ["bg-white", "bg-light", "bg-white", "bg-light"];
  const bgColor = bgColors[level % 2] || "bg-white";

  return (
    <div className={`border rounded p-2 ${level > 1 ? `ms-${Math.min(level - 1, 3)} ${bgColor}` : ""}`}>
      <div className="row g-2">
        <div className="col-6">
          <label className="form-label small mb-1">Name</label>
          <input
            className="form-control form-control-sm"
            value={field.name}
            onChange={(e) => handleUpdate("name", e.target.value)}
            placeholder="field_name"
          />
        </div>
        <div className="col-6">
          <label className="form-label small mb-1">Label</label>
          <input
            className="form-control form-control-sm"
            value={field.label}
            onChange={(e) => handleUpdate("label", e.target.value)}
            placeholder="Field Label"
          />
        </div>
        <div className="col-6">
          <label className="form-label small mb-1">Type</label>
          <select
            className="form-select form-select-sm"
            value={field.type}
            onChange={(e) => handleUpdate("type", e.target.value)}
          >
            {(level >= 3 ? FIELD_TYPES.filter(t => t !== "repeater") : FIELD_TYPES).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="col-6">
          <label className="form-label small mb-1">Placeholder</label>
          <input
            className="form-control form-control-sm"
            value={field.placeholder || ""}
            onChange={(e) => handleUpdate("placeholder", e.target.value)}
            placeholder="Optional..."
            disabled={isRepeater}
          />
        </div>
      </div>

      {isRepeater && (
        <div className="mt-3 ps-2 border-start border-primary">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="fw-semibold small text-primary">Subfields (Level {level + 1})</div>
            <button type="button" className="btn btn-xs btn-outline-primary" onClick={addSubField}>
              <i className="bx bx-plus me-1" /> Add
            </button>
          </div>
          <div className="d-flex flex-column gap-2">
            {(field.subfields || []).map((sf, sIdx) => (
              <FieldEditor
                key={sIdx}
                field={sf}
                index={sIdx}
                level={level + 1}
                onUpdate={handleSubUpdate}
                onRemove={removeSubField}
              />
            ))}
            {(field.subfields || []).length === 0 && (
              <div className="text-muted small">Add at least one subfield.</div>
            )}
          </div>
        </div>
      )}

      <div className="text-end mt-2">
        <button
          type="button"
          className="btn btn-sm btn-outline-danger border-0"
          onClick={() => onRemove(index)}
        >
          <i className="bx bx-trash" />
        </button>
      </div>
    </div>
  );
};

export default function Index({ templates = [] }) {
  const { processing } = useForm();
  const { flash } = usePage().props;
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyTemplate());
  const [editingId, setEditingId] = useState(null);
  const modalRef = useRef(null);
  const modalInstance = useRef(null);
  const [idDelete, setIdDelete] = useState(null);

  const editingTemplate = useMemo(
    () => templates.find((t) => t.id === editingId) || null,
    [templates, editingId]
  );

  const resetForm = () => {
    setForm(emptyTemplate());
    setEditingId(null);
    setCreating(false);
  };

  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
  }, [flash]);

  useEffect(() => {
    if (editingTemplate) {
      setForm({
        key: editingTemplate.key || "",
        label: editingTemplate.label || "",
        allow_multiple_items: !!editingTemplate.allow_multiple_items,
        is_active: !!editingTemplate.is_active,
        fields: Array.isArray(editingTemplate.fields) ? editingTemplate.fields : [],
      });
      setCreating(false);
    } else if (creating) {
      // Keep form as is
    } else {
      setForm(emptyTemplate());
    }
  }, [editingTemplate, creating]);

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyTemplate());
    setCreating(true);
  };

  const cancel = () => {
    setEditingId(null);
    setCreating(false);
    setForm(emptyTemplate());
  };

  const addTopField = () => {
    setForm((prev) => ({
      ...prev,
      fields: [...(prev.fields || []), emptyField()],
    }));
  };

  const updateTopField = (idx, nextField) => {
    setForm((prev) => {
      const nextFields = [...(prev.fields || [])];
      nextFields[idx] = nextField;
      return { ...prev, fields: nextFields };
    });
  };

  const removeTopField = (idx) => {
    setForm((prev) => ({
      ...prev,
      fields: (prev.fields || []).filter((_, i) => i !== idx),
    }));
  };

  const recursiveSanitize = (fields) => {
    return (fields || [])
      .map((f) => {
        const base = {
          name: (f.name || "").trim(),
          label: (f.label || "").trim(),
          type: (f.type || "text").trim(),
          placeholder: (f.placeholder || "").trim(),
        };
        if (base.type === "repeater" && Array.isArray(f.subfields)) {
          base.subfields = recursiveSanitize(f.subfields);
        }
        return base;
      })
      .filter((f) => f.name.length > 0);
  };

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      fields: recursiveSanitize(form.fields),
    };

    if (!payload.key || !payload.label) {
      toast.error("Key and Label are required.");
      return;
    }

    if (editingId) {
      router.put(route("section-templates.update", editingId), payload, {
        preserveScroll: true,
        onSuccess: resetForm,
      });
    } else {
      router.post(route("section-templates.store"), payload, {
        preserveScroll: true,
        onSuccess: resetForm,
      });
    }
  };

  const destroy = () => {
    router.delete(route("section-templates.destroy", idDelete), {
      preserveScroll: true,
      onSuccess: () => {
        modalInstance.current.hide();
        setIdDelete(null);
      },
    });
  };

  useEffect(() => {
    if (modalRef.current) {
      modalInstance.current = new bootstrap.Modal(modalRef.current);
    }
  }, []);

  const showDeleteModal = (id) => {
    setIdDelete(id);
    modalInstance.current.show();
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1 className="text-muted mb-1">Section Templates</h1>
          <div className="text-muted small">
            Define fields for sections. Support for up to 3 levels of nested repeaters.
          </div>
        </div>
        <button type="button" className="btn btn-primary" onClick={startCreate}>
          <i className="bx bx-plus me-1" /> Add Template
        </button>
      </div>

      <div className="row g-3">
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header d-flex align-items-center justify-content-between">
              <div className="fw-semibold">Existing Templates</div>
              <div className="text-muted small">{templates.length} total</div>
            </div>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Label</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody className="table-border-bottom-0">
                  {templates.map((t) => (
                    <tr key={t.id} className={editingId === t.id ? "table-active" : ""}>
                      <td className="fw-medium">{t.key}</td>
                      <td>{t.label}</td>
                      <td>
                        <span className={`badge ${t.is_active ? "bg-label-success" : "bg-label-secondary"}`}>
                          {t.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="text-end text-nowrap">
                        <button
                          type="button"
                          className="btn btn-sm btn-icon btn-outline-primary me-1"
                          onClick={() => setEditingId(t.id)}
                        >
                          <i className="bx bx-edit-alt" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-icon btn-outline-danger"
                          onClick={() => showDeleteModal(t.id)}
                        >
                          <i className="bx bx-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {templates.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-4">No templates found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">
              <div className="fw-semibold">
                {editingId ? `Edit: ${editingTemplate?.key}` : creating ? "New Template" : "Select a template"}
              </div>
            </div>
            <div className="card-body">
              {(creating || editingId) ? (
                <form onSubmit={submit}>
                  <div className="mb-3">
                    <label className="form-label">Key (Slug)</label>
                    <input
                      className="form-control"
                      value={form.key}
                      onChange={(e) => setForm((p) => ({ ...p, key: e.target.value }))}
                      placeholder="e.g. hero_banner"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Display Label</label>
                    <input
                      className="form-control"
                      value={form.label}
                      onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
                      placeholder="e.g. Hero Banner"
                    />
                  </div>

                  <div className="d-flex gap-3 mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={!!form.allow_multiple_items}
                        onChange={(e) => setForm((p) => ({ ...p, allow_multiple_items: e.target.checked }))}
                        id="allowMult"
                      />
                      <label className="form-check-label" htmlFor="allowMult">Multiple Items</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={!!form.is_active}
                        onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
                        id="isAct"
                      />
                      <label className="form-check-label" htmlFor="isAct">Active</label>
                    </div>
                  </div>

                  <hr />

                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="fw-bold">Structure (Fields)</div>
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={addTopField}>
                      <i className="bx bx-plus me-1" /> Add Top Field
                    </button>
                  </div>

                  <div className="d-flex flex-column gap-3">
                    {(form.fields || []).map((f, idx) => (
                      <FieldEditor
                        key={idx}
                        field={f}
                        index={idx}
                        onUpdate={updateTopField}
                        onRemove={removeTopField}
                      />
                    ))}
                    {(form.fields || []).length === 0 && (
                      <div className="text-center py-3 bg-light rounded text-muted">No fields defined.</div>
                    )}
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-outline-secondary" onClick={cancel}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={processing}>
                      {processing ? "Saving..." : "Save Template"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-5 text-muted">
                  Select a template from the left or click "Add Template"
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="deleteConfirmModal" tabIndex="-1" ref={modalRef}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Delete Template</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              Are you sure? Any sections using this template will stop working.
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-danger" onClick={destroy} disabled={processing}>
                {processing ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
