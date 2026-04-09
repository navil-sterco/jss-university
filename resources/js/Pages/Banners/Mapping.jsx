import React, { useEffect, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { ToastContainer, toast } from 'react-toastify';

const Mapping = ({ banner, schools, pages, departments, courses }) => {
    const { data, setData, post, processing, errors } = useForm({
        selected_id: null,
        selected_type: null,
        show_on_home: banner.show_on_home || false,
    });

    // Set initial selection from banner data
    useEffect(() => {
        if (banner.schools?.length > 0) {
            setData({
                selected_id: banner.schools[0].id,
                selected_type: 'school',
                show_on_home: banner.show_on_home || false,
            });
        } else if (banner.pages?.length > 0) {
            setData({
                selected_id: banner.pages[0].id,
                selected_type: 'page',
                show_on_home: banner.show_on_home || false,
            });
        } else if (banner.departments?.length > 0) {
            setData({
                selected_id: banner.departments[0].id,
                selected_type: 'department',
                show_on_home: banner.show_on_home || false,
            });
        } else if (banner.courses?.length > 0) {
            setData({
                selected_id: banner.courses[0].id,
                selected_type: 'course',
                show_on_home: banner.show_on_home || false,
            });
        }
    }, [banner]);

    // Group departments by school
    const [groupedDepartments, setGroupedDepartments] = useState({});
    const [expandedSchools, setExpandedSchools] = useState(new Set());

    useEffect(() => {
        // Group departments by school name
        const grouped = departments.reduce((acc, dept) => {
            const schoolName = dept.school || 'Other';
            if (!acc[schoolName]) {
                acc[schoolName] = [];
            }
            acc[schoolName].push(dept);
            return acc;
        }, {});
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

    const selectItem = (id, type) => {
        setData({
            selected_id: id,
            selected_type: type,
            show_on_home: data.show_on_home,
        });
    };

    const clearSelection = () => {
        setData({
            selected_id: null,
            selected_type: null,
            show_on_home: data.show_on_home,
        });
    };

    const toggleHomepage = () => {
        setData({
            ...data,
            show_on_home: !data.show_on_home,
        });
    };

    const { flash } = usePage().props;
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash.success]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("banners.mapping.attach", banner.id), {
            preserveScroll: true,
        });
    };

    const getSelectedItemName = () => {
        if (!data.selected_id || !data.selected_type) return null;

        switch (data.selected_type) {
            case 'school':
                const school = schools.find(s => s.id === data.selected_id);
                return school ? `🎓 ${school.name}` : null;
            case 'page':
                const page = pages.find(p => p.id === data.selected_id);
                return page ? `📄 ${page.title}` : null;
            case 'department':
                const department = departments.find(d => d.id === data.selected_id);
                return department ? `📚 ${department.name}` : null;
            case 'course':
                const course = courses.find(c => c.id === data.selected_id);
                return course ? `✏️ ${course.name}` : null;
            default:
                return null;
        }
    };

    const renderSelectionList = (items, type, label, icon) => (
        <div className="col-md-3 mb-3">
            <h6 className="fw-bold mb-2">{label}</h6>
            <div className="border rounded p-2" style={{ minHeight: 250 }}>
                {items.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => selectItem(item.id, type)}
                        className={`p-2 mb-1 rounded d-flex justify-content-between align-items-center ${
                            data.selected_id === item.id && data.selected_type === type
                                ? "bg-primary text-white"
                                : "bg-light"
                        }`}
                        style={{ cursor: "pointer" }}
                    >
                        <span>{item.name || item.title}</span>
                        {data.selected_id === item.id && data.selected_type === type && (
                            <i className="bi bi-check-lg"></i>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderDepartmentList = () => (
        <div className="col-md-3 mb-3">
            <h6 className="fw-bold mb-2">📚 Departments</h6>
            <div className="border rounded p-2" style={{ minHeight: 250 }}>
                {Object.entries(groupedDepartments).map(([schoolName, schoolDepts]) => (
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
                                        onClick={() => selectItem(dept.id, "department")}
                                        className={`p-2 mb-1 rounded d-flex justify-content-between align-items-center ${
                                            data.selected_id === dept.id && data.selected_type === 'department'
                                                ? "bg-primary text-white"
                                                : "bg-light"
                                        }`}
                                        style={{ cursor: "pointer", marginLeft: '10px' }}
                                    >
                                        <span>{dept.name}</span>
                                        {data.selected_id === dept.id && data.selected_type === 'department' && (
                                            <i className="bi bi-check-lg"></i>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="container py-4">
            <ToastContainer />
            <div className="card shadow-sm">
                <div className="card-header bg-white">
                    <h5>
                        Map Banner:{" "}
                        <span className="text-grey">{banner.heading}</span>
                    </h5>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        {/* Current Selection Display */}
                        {data.selected_id && data.selected_type && (
                            <div className="row mb-4">
                                <div className="col-12">
                                    <div className="card border-success">
                                        <div className="card-header text-white">
                                            <h6 className="mb-0 fw-bold">✅ Currently Selected</h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="fw-bold">{getSelectedItemName()}</span>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={clearSelection}
                                                >
                                                    <i className="bi bi-x-lg me-1"></i>
                                                    Clear Selection
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="row">
                            <div className="col-12 mb-4">
                                <div className="card">
                                    <div className="card-header bg-light">
                                        <h6 className="mb-0 fw-bold">🏠 Homepage</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                role="switch"
                                                id="homepageToggle"
                                                checked={data.show_on_home}
                                                onChange={toggleHomepage}
                                            />
                                            <label 
                                                className="form-check-label fw-bold" 
                                                htmlFor="homepageToggle"
                                            >
                                                Show on Homepage
                                            </label>
                                        </div>
                                        <div className="form-text">
                                            {data.show_on_home 
                                                ? "This banner will be displayed on the homepage"
                                                : "This banner will not be displayed on the homepage"
                                            }
                                        </div>
                                        {errors.show_on_home && (
                                            <div className="text-danger small mt-1">{errors.show_on_home}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {renderSelectionList(schools, "school", "🎓 Schools")}
                            {renderSelectionList(pages, "page", "📄 Pages")}
                            {renderDepartmentList()}
                            {renderSelectionList(courses, "course", "✏️ Courses")}
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
