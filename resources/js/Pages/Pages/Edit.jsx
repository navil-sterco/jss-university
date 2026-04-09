import { useForm, usePage } from '@inertiajs/react';
import React, { useRef, useState } from 'react'

const Edit = (props) => {
    const appUrl = usePage().props.appUrl;
    const { page, departments, schools } = props;
    const fileInputRef = useRef(null);
    const [selectedType, setSelectedType] = useState(page.type || "");
    
    function parseDateInput(datetimeStr) {
        const date = new Date(datetimeStr);
        const pad = (n) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    const { data, setData, post, progress, errors, processing } = useForm({
        _method: "PUT",
        title: page.title || "",
        slug: page.slug || "",
        type: page.type || "",
        school_id: page.school_id || "",
        department_id: page.department_id || "",
        image: null,
        sub_title: page.sub_title || "",
        target_blank: page.target_blank == 1 ? 1 : 0,
        publish_date: parseDateInput(page.publish_date),
        template_path: page.template_path || "",
        display_order: page.display_order || 100,
    });

    // Get selected school and department objects
    const selectedSchool = schools.find(s => s.id == data.school_id);
    const selectedDept = departments.find(d => d.id == data.department_id);
    
    // Extract actual page slug (without any school or department prefix)
    const extractPageSlug = () => {
        let slug = data.slug || page.slug || "";
        
        // Remove any school prefix
        for (const school of schools) {
            const prefix = school.slug + "/";
            if (slug.startsWith(prefix)) {
                slug = slug.substring(prefix.length);
                break;
            }
        }
        // Remove any department prefix
        for (const dept of departments) {
            const prefix = dept.slug + "/";
            if (slug.startsWith(prefix)) {
                slug = slug.substring(prefix.length);
                break;
            }
        }
        
        return slug;
    };
    
    const pageSlug = extractPageSlug();
    // Determine final slug based on selected school first, then department (only if content page)
    let finalSlug = pageSlug;
    if (selectedSchool) {
        finalSlug = `${selectedSchool.slug}/${pageSlug}`;
    } else if (selectedDept && data.type === "Content-Page") {
        finalSlug = `${selectedDept.slug}/${pageSlug}`;
    }

    const submit = (e) => {
        e.preventDefault();
        post(route("pages.update", page.id));
    };

    const handleTypeChange = (type) => {
        setSelectedType(type);
        setData("type", type);
        if (type !== "Laboratory" && type !== "Facility") {
            setData("department_id", "");
            setData("image", null);
        }
    };

    // Handle school selection - disable department when school is selected
    const handleSchoolChange = (schoolId) => {
        setData("school_id", schoolId);
        if (schoolId) {
            setData("department_id", "");
        }
    };

    // Handle department selection - disable school when department is selected
    const handleDeptChange = (deptId) => {
        setData("department_id", deptId);
        if (deptId) {
            setData("school_id", "");
        }
    };

    // Check if should show special fields
    const showSpecialFields = selectedType === "Laboratory" || selectedType === "Facility";
    const isDepartmentDisabled = !!data.school_id;

return (
    <>
        <h1 className="text-muted">Edit Page</h1>
        <div className="card mb-4">
            <form onSubmit={submit} encType='multipart/form-data'>
                <div className="card-body">
                    <div className="row">
                        <div className="mb-3 col-md-6">
                            <label htmlFor="type" className="form-label">Page Type <span className="text-danger">*</span></label>
                            <select
                                id="type"
                                className="form-select"
                                value={data.type}
                                onChange={(e) => handleTypeChange(e.target.value)}
                            >
                                <option value="">Select Type</option>
                                <option value="Content-Page">Content Page</option>
                                <option value="Laboratory">Laboratory</option>
                                <option value="Facility">Facility</option>
                            </select>
                            <div className="form-text text-danger">{errors.type}</div>
                        </div>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="title" className="form-label">Title <span className="text-danger">*</span></label>
                            <input
                                className="form-control"
                                type="text"
                                id="title"
                                name="title"
                                placeholder='About Us'
                                value={data.title}
                                onChange={(e) => setData("title",e.target.value)}
                            />
                            <div className="form-text text-danger">{errors.title}</div> 
                        </div>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="slug" className="form-label">Slug</label>
                            <input
                                className="form-control"
                                type="text"
                                id="slug"
                                name="slug"
                                placeholder='about-us'
                                value={pageSlug} 
                                onChange={(e) => setData("slug", e.target.value)}
                            />
                            {pageSlug && (
                                <div className="form-text text-info mt-2">
                                    <strong>Final Slug:</strong> {finalSlug}
                                </div>
                            )}
                            <div className="form-text text-danger">{errors.slug}</div> 
                        </div>

                        <div className="mb-3 col-md-6">
                            <label className="form-label">School (Optional)</label>
                            <select
                                className="form-control"
                                value={data.school_id}
                                onChange={(e) => handleSchoolChange(e.target.value)}
                                disabled={!!data.department_id}
                            >
                                <option value="">Select School</option>
                                {schools.map((school) => (
                                    <option key={school.id} value={school.id}>
                                        {school.name}
                                    </option>
                                ))}
                            </select>
                            <div className="form-text text-danger">{errors.school_id}</div> 
                        </div>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="menu_title" className="form-label">Menu Title</label>
                            <input
                                type="text" 
                                className="form-control" 
                                id="menu_title" 
                                name="sub_title" 
                                placeholder="Menu Title" 
                                value={data.sub_title} 
                                onChange={(e) => setData("sub_title",e.target.value)}
                            />
                            <div className="form-text text-danger">{errors.sub_title}</div>
                        </div>

                        {/* Department */}
                        <div className="mb-3 col-md-6">
                            <label className="form-label">Department</label>
                            <select
                                className="form-control"
                                value={data.department_id}
                                onChange={(e) => handleDeptChange(e.target.value)}
                                disabled={isDepartmentDisabled}
                            >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                            {isDepartmentDisabled && <div className="form-text text-muted">Disabled: School is selected</div>}
                            <div className="form-text text-danger">{errors.department_id}</div>
                        </div>

                        {showSpecialFields && (
                            <div className="mb-3 col-md-6">
                                <label htmlFor="image" className="form-label">Image</label>
                                <input
                                    type="file"
                                    id="image"
                                    ref={fileInputRef}
                                    className="form-control"
                                    onChange={(e) => setData("image", e.target.files[0])}
                                    accept="image/png, image/jpeg, image/webp"
                                />
                                <div className="form-text">
                                    Upload an image for {selectedType.toLowerCase()}
                                </div>
                                <div className="form-text text-danger">{errors.image}</div>
                            </div>
                        )}

                        {/* Current Image Preview - Only show for Laboratory/Facility */}
                        {showSpecialFields && page.image && (
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Current Image</label>
                                <div className="mb-2">
                                    <img
                                        src={`${appUrl}/${page.image}`}
                                        alt="Current Program"
                                        style={{
                                            width: "100px",
                                            height: "60px",
                                            objectFit: "cover",
                                            borderRadius: "4px",
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Show placeholder if no image but special fields are shown */}
                        {showSpecialFields && !page.image && (
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Current Image</label>
                                <div className="mb-2">
                                    <span className="text-muted">No image uploaded</span>
                                </div>
                            </div>
                        )}

                        <div className="mb-3 col-md-6">
                            <label htmlFor="template_path" className="form-label">Overwrite Url</label>
                            <input
                                className="form-control"
                                type="text"
                                id="template_path"
                                name="template_path"
                                placeholder='about-us/overview'
                                value={data.template_path} 
                                onChange={(e) => setData("template_path",e.target.value)}
                            />
                            <div className="form-text text-danger">{errors.template_path}</div> 
                        </div>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="target_blank" className="form-label">Target Blank</label>
                            <select
                                className="form-control"
                                id="target_blank"
                                value={data.target_blank}
                                onChange={(e) => setData("target_blank", e.target.value)}
                            >
                                <option value="">Select an option</option>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                            <div className="form-text text-danger">{errors.target_blank}</div>
                        </div>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="publish_date" className="form-label">Publish Date</label>
                              <input
                                    className="form-control"
                                    type="datetime-local"
                                    id="publish_date" 
                                    value={data.publish_date} 
                                    onChange={(e) => setData("publish_date",e.target.value)}
                                />
                            <div className="form-text text-danger">{errors.publish_date}</div> 
                        </div>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="display_order" className="form-label">Display Order</label>
                              <input
                                    className="form-control"
                                    type="number"
                                    id="display_order" 
                                    value={data.display_order} 
                                    onChange={(e) => setData("display_order",e.target.value)}
                                />
                            <div className="form-text text-danger">{errors.display_order}</div> 
                        </div>
                    </div>
                    <div className="mt-2">
                        <button aria-label='Click me' type="submit" className="btn btn-primary me-2" disabled={processing}>Submit</button>
                    </div>
                </div>
            </form>
        </div>
    </>
  )
}

export default Edit
