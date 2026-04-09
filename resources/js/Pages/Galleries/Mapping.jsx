import React, { useEffect, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { ToastContainer, toast } from "react-toastify";

const Mapping = ({ gallery, happenings, schools, departments, pages  }) => {
    const { data, setData, post, processing, errors } = useForm({
        happening_ids: gallery.happenings?.map((h) => h.id) || [],
        school_ids: gallery.schools?.map((s) => s.id) || [],
        page_ids: gallery.pages?.map((p) => p.id) || [],
        department_ids: gallery.departments?.map((d) => d.id) || [],
    });

    // Group departments by school
    const [groupedDepartments, setGroupedDepartments] = useState({});
    const [expandedSchools, setExpandedSchools] = useState(new Set());

    useEffect(() => {
        // Group departments by school name
        const grouped = departments?.reduce((acc, dept) => {
            const schoolName = dept.school || 'Other';
            if (!acc[schoolName]) {
                acc[schoolName] = [];
            }
            acc[schoolName].push(dept);
            return acc;
        }, {}) || {};
        setGroupedDepartments(grouped);
    }, [departments]);

    const toggleSchool = (schoolName) => {
        const newExpanded = new Set(expandedSchools);
        if (newExpanded.has(schoolName)) {
            newExpanded.delete(schoolName);
        } else {
            newExpanded.add(schoolName);
        }
        setExpandedSchools(newExpanded);
    };

    const toggleItem = (id, field) => {
        const ids = data[field];
        setData(
            field,
            ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
        );
    };

    const { flash } = usePage().props;
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash.success]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("galleries.mapping.attach", gallery.id), {
            preserveScroll: true,
        });
    };

    const renderTransferList = (items, field, label) => (
        <div className="col-md-3 mb-3">
            <h6 className="fw-bold mb-2">{label}</h6>
            <div className="border rounded p-2" style={{ minHeight: 250, maxHeight: 400, overflowY: 'auto' }}>
                {items?.length > 0 ? (
                    items.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => toggleItem(item.id, field)}
                            className={`p-2 mb-1 rounded d-flex justify-content-between align-items-center ${
                                data[field].includes(item.id)
                                    ? "bg-primary text-white"
                                    : "bg-light"
                            }`}
                            style={{ cursor: "pointer" }}
                        >
                            <span>{item.name || item.title}</span>
                            {data[field].includes(item.id) && (
                                <i className="bi bi-check-lg"></i>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-muted text-center my-4">No items found.</p>
                )}
            </div>
            {errors[field] && (
                <div className="text-danger small mt-1">{errors[field]}</div>
            )}
        </div>
    );

    const renderDepartmentList = () => (
        <div className="col-md-3 mb-3">
            <h6 className="fw-bold mb-2">📚 Departments</h6>
            <div className="border rounded p-2" style={{ minHeight: 250, maxHeight: 400, overflowY: 'auto' }}>
                {Object.keys(groupedDepartments).length > 0 ? (
                    Object.entries(groupedDepartments).map(([schoolName, schoolDepts]) => (
                        <div key={schoolName} className="mb-2">
                            {/* School Header */}
                            <div
                                onClick={() => toggleSchool(schoolName)}
                                className="p-2 rounded d-flex justify-content-between align-items-center bg-secondary text-white"
                                style={{ cursor: "pointer" }}
                            >
                                <span className="fw-bold">{schoolName}</span>
                                <i className={`bi bi-chevron-${expandedSchools.has(schoolName) ? 'up' : 'down'}`}></i>
                            </div>
                            
                            {/* Departments List */}
                            {expandedSchools.has(schoolName) && (
                                <div className="mt-1">
                                    {schoolDepts.map((dept) => (
                                        <div
                                            key={dept.id}
                                            onClick={() => toggleItem(dept.id, "department_ids")}
                                            className={`p-2 mb-1 rounded d-flex justify-content-between align-items-center ${
                                                data.department_ids.includes(dept.id)
                                                    ? "bg-primary text-white"
                                                    : "bg-light"
                                            }`}
                                            style={{ cursor: "pointer", marginLeft: '10px' }}
                                        >
                                            <span>{dept.name}</span>
                                            {data.department_ids.includes(dept.id) && (
                                                <i className="bi bi-check-lg"></i>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-muted text-center my-4">No departments found.</p>
                )}
            </div>
            {errors.department_ids && (
                <div className="text-danger small mt-1">{errors.department_ids}</div>
            )}
        </div>
    );

    return (
        <div className="container py-4">
            <ToastContainer />
            <div className="card shadow-sm">
                <div className="card-header bg-white">
                    <h5>
                        Map Gallery:{" "}
                        <span className="text-secondary">{gallery.title}</span>
                    </h5>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {renderTransferList(schools, "school_ids", "🎓 Schools")}
                            {renderTransferList(pages, "page_ids", "📄 Pages")}
                            {renderDepartmentList()}
                            {renderTransferList(happenings, "happening_ids", "🎉 Happenings")}
                        </div>

                        <div className="text-end mt-4">
                            <button
                                className="btn btn-primary"
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? "Saving..." : "Save Mapping"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Mapping;
