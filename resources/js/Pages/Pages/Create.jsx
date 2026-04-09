import { useForm } from '@inertiajs/react';
import React, { useRef, useState } from 'react'

const Create = ({departments, schools}) => {

    const fileInputRef = useRef(null);
    const now = new Date();
    const [selectedType, setSelectedType] = useState("");

    function formatDateForInput(date) {
        const pad = (n) => n.toString().padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    const publishDate = formatDateForInput(now);

    const { data, setData, post, progress, errors, processing } = useForm({
        title: "",
        slug: "",
        school_id: "",
        department_id: "",
        type: "",
        image: "",
        sub_title: "",
        target_blank: 0,
        publish_date: publishDate,
        template_path: "",
        display_order: 100,
    });

    // Get selected school or department info
    const selectedSchool = schools.find(s => s.id == data.school_id);
    const selectedDept = departments.find(d => d.id == data.department_id);
    // Build final slug: school prefix wins; otherwise department prefix only on content pages
    let finalSlug = data.slug;
    if (selectedSchool) {
        finalSlug = `${selectedSchool.slug}/${data.slug}`;
    } else if (selectedDept && data.type === "Content-Page") {
        finalSlug = `${selectedDept.slug}/${data.slug}`;
    }

    const submit = (e) => {
        e.preventDefault(); 
        post(route("pages.store"));
    };

    // Handle type selection
    const handleTypeChange = (type) => {
        setSelectedType(type);
        setData("type", type);
        // Clear department and image when type changes to non-special types
        if (type !== "Laboratory" && type !== "Facility") {
            setData("department_id", "");
            setData("image", "");
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
        <h1 className="text-muted">Create Page</h1>
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
                                value={data.slug} 
                                onChange={(e) => setData("slug",e.target.value)}
                            />
                            {data.slug && (
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

export default Create
