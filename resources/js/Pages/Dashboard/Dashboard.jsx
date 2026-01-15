import { Link } from '@inertiajs/react';
import { CircleArrowRight, Calendar, MapPin, Clock } from 'lucide-react';
import React, { useEffect } from 'react'

const Dashboard = ({ schoolcount, departmentcount, programcount, coursecount, bannercount, testimonialcount, happeningcount, factsandfigurescount, recruitercount, upcomingevent, schoolactivepercent, departmentactivepercent, programactivepercent, courseactivepercent,contactinfo }) => {
    
    useEffect(() => {
        dashboardAnalitics();
    }, [])
    
    return (
        <>
            <div className="row">
                <div className="col-lg-8 mb-4 order-0">
                    <div className="card">
                        <div className="d-flex align-items-end row">
                            <div className="col-sm-7">
                                <div className="card-body">
                                    <h5 className="card-title text-primary">
                                        Welcome to JSS Noida CMS 🎉
                                    </h5>
                                    <p className="mb-4">
                                        Manage your university's digital presence efficiently with this comprehensive content management system.
                                    </p>

                                    <a aria-label="view badges"
                                        href="#"
                                        className="btn btn-sm btn-outline-primary"
                                    >
                                        View Website
                                    </a>
                                </div>
                            </div>
                            <div className="col-sm-5 text-center text-sm-left">
                                <div className="card-body pb-0 px-0 px-md-4">
                                    <img aria-label='dashboard icon image'
                                        src="/jss/assets/img/illustrations/man-with-laptop-light.png"
                                        height="140"
                                        alt="View Badge User"
                                        data-app-dark-img="illustrations/man-with-laptop-dark.png"
                                        data-app-light-img="illustrations/man-with-laptop-light.png"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4 col-md-4 order-1">
                    <div className="row">
                        <div className="col-lg-6 col-md-12 col-6 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between">
                                        <div className="avatar flex-shrink-0 me-2">
                                            <span className="avatar-initial rounded bg-label-success">
                                                <i className="bx bxs-school"></i>
                                            </span>
                                        </div>
                                        <div className="dropdown">
                                            <button aria-label='Click me'
                                                className="btn p-0"
                                                type="button"
                                                id="cardOpt3"
                                                data-bs-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                <i className="bx bx-dots-vertical-rounded"></i>
                                            </button>
                                            <div
                                                className="dropdown-menu dropdown-menu-end"
                                                aria-labelledby="cardOpt3"
                                            >
                                                <Link aria-label="view more" className="dropdown-item" href={route("schools.index")}>
                                                    View More
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="display-6 d-block mb-3">School</span>
                                    
                                    {/* Additional Content */}
                                    <div className="mt-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <small className="text-muted">Total Schools</small>
                                            <small className="fw-semibold">{schoolcount}</small>
                                        </div>
                                        <div className="progress mb-2" style={{height: '6px'}}>
                                            <div className="progress-bar bg-success" style={{width: `${schoolactivepercent}%`}}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-12 col-6 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between">
                                        <div className="avatar flex-shrink-0 me-2">
                                            <span className="avatar-initial rounded bg-label-info">
                                                <i className="bx bx-book"></i>
                                            </span>
                                        </div>
                                        <div className="dropdown">
                                            <button aria-label='Click me'
                                                className="btn p-0"
                                                type="button"
                                                id="cardOpt3"
                                                data-bs-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                <i className="bx bx-dots-vertical-rounded"></i>
                                            </button>
                                            <div
                                                className="dropdown-menu dropdown-menu-end"
                                                aria-labelledby="cardOpt3"
                                            >
                                                <Link aria-label="view more" className="dropdown-item" href={route("department.index")}>
                                                    View More
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="display-6 d-block mb-3">Department</span>
                                    
                                    {/* Additional Content */}
                                    <div className="mt-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <small className="text-muted">Total Departments</small>
                                            <small className="fw-semibold">{departmentcount}</small>
                                        </div>
                                        <div className="progress mb-2" style={{height: '6px'}}>
                                            <div className="progress-bar bg-info" style={{width: `${departmentactivepercent}%`}}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-4 order-2 mb-4">
                    <div className="card h-100">
                        <div className="card-header d-flex align-items-center justify-content-between pb-0">
                            <div className="card-title mb-0">
                                <h5 className="m-0 me-2">Elements</h5>
                                <small className="text-muted">{bannercount + testimonialcount + happeningcount + factsandfigurescount + recruitercount} Total Elements</small>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="d-flex flex-column align-items-center gap-1">
                                </div>
                            </div>
                            <ul className="p-0 m-0">
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <span className="avatar-initial rounded bg-label-primary">
                                            <i className='bx bx-image-add'></i>
                                        </span>
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <h6 className="mb-0">Banner</h6>
                                            <small className="text-muted">"Slider images for website"</small>
                                        </div>
                                        <div className="user-progress">
                                            <small className="fw-medium">{bannercount}</small>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <span className="avatar-initial rounded bg-label-success">
                                            <i className='bx bxs-quote-left'></i>
                                        </span>
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <h6 className="mb-0">Testimonial</h6>
                                            <small className="text-muted">"Alumni success stories"</small>
                                        </div>
                                        <div className="user-progress">
                                            <small className="fw-medium">{testimonialcount}</small>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <span className="avatar-initial rounded bg-label-info">
                                            <i className="bx bx-party"></i>
                                        </span>
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <h6 className="mb-0">Happening</h6>
                                            <small className="text-muted">"University events and activities"</small>
                                        </div>
                                        <div className="user-progress">
                                            <small className="fw-medium">{happeningcount}</small>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <span className="avatar-initial rounded bg-label-warning">
                                            <i className="bx bx-bar-chart"></i>
                                        </span>
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <h6 className="mb-0">Facts & Figures</h6>
                                            <small className="text-muted">"Statistics and achievements"</small>
                                        </div>
                                        <div className="user-progress">
                                            <small className="fw-medium">{factsandfigurescount}</small>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <span className="avatar-initial rounded bg-label-secondary">
                                            <i className='bx bxs-graduation'></i>
                                        </span>
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <h6 className="mb-0">Recruiter</h6>
                                            <small className="text-muted">"Company ties for placements"</small>
                                        </div>
                                        <div className="user-progress">
                                            <small className="fw-medium">{recruitercount}</small>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-4 order-2 mb-4">
                    <div className="card h-100">
                        <div className="card-header d-flex align-items-center justify-content-between pb-0">
                            <div className="card-title mb-0">
                                <h5 className="m-0 me-2">Campus Snapshot</h5>
                                <small className="text-muted">JSS Academy of Technical Education, Noida</small>
                            </div>
                        </div>

                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="d-flex flex-column align-items-center gap-1">
                                </div>
                            </div>
                            <ul className="p-0 m-0 list-unstyled">
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <span className="avatar-initial rounded bg-label-primary">
                                            <i className="bx bx-map"></i>
                                        </span>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <small className="text-muted">Location</small>
                                        <h6 className="mb-0">
                                            {contactinfo.address}
                                        </h6>
                                    </div>
                                </li>

                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <span className="avatar-initial rounded bg-label-success">
                                            <i className="bx bx-map-alt"></i>
                                        </span>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <small className="text-muted">Map</small>
                                        <h6 className="mb-0">
                                            <a href={contactinfo.direction_url} target='_blank'>Get Direction</a>
                                        </h6>
                                    </div>
                                </li>

                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <span className="avatar-initial rounded bg-label-info">
                                            <i className="bx bx-bulb"></i>
                                        </span>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <small className="text-muted">Motto</small>
                                        <h6 className="mb-0 fst-italic">
                                            "Service to Humanity through Education"
                                        </h6>
                                    </div>
                                </li>
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <span className="avatar-initial rounded bg-label-warning">
                                            <i className='bx bxs-graduation'></i>
                                        </span>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <small className="text-muted">Accreditation</small>
                                        <h6 className="mb-0 fst-italic">
                                            NAAC Grade A
                                        </h6>
                                    </div>
                                </li>
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <span className="avatar-initial rounded bg-label-secondary">
                                            <i className='bx bxs-copyright'></i>
                                        </span>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <small className="text-muted">Copyright</small>
                                        <h6 className="mb-0 fst-italic">
                                            {contactinfo.copyright}
                                        </h6>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div className="col-12 col-md-8 col-lg-4 order-3 order-md-2">
                    <div className="row">
                        <div className="col-6 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between">
                                        <div className="avatar flex-shrink-0 me-2">
                                            <span className="avatar-initial rounded bg-label-danger">
                                                <i className="bx bx-book-content"></i>
                                            </span>
                                        </div>
                                        <div className="dropdown">
                                            <button aria-label='Click me'
                                                className="btn p-0"
                                                type="button"
                                                id="cardOpt3"
                                                data-bs-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                <i className="bx bx-dots-vertical-rounded"></i>
                                            </button>
                                            <div
                                                className="dropdown-menu dropdown-menu-end"
                                                aria-labelledby="cardOpt3"
                                            >
                                                <Link aria-label="view more" className="dropdown-item" href={route("program.index")}>
                                                    View More
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="display-6 d-block mb-3">Program</span>
                                    
                                    {/* Additional Content */}
                                    <div className="mt-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <small className="text-muted">Total Programs</small>
                                            <small className="fw-semibold">{programcount}</small>
                                        </div>
                                        <div className="progress mb-2" style={{height: '6px'}}>
                                            <div className="progress-bar bg-danger" style={{width: `${programactivepercent}%`}}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-6 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between">
                                        <div className="avatar flex-shrink-0 me-2">
                                            <span className="avatar-initial rounded bg-label-secondary">
                                                <i className="bx bx-receipt"></i>
                                            </span>
                                        </div>
                                        <div className="dropdown">
                                            <button aria-label='Click me'
                                                className="btn p-0"
                                                type="button"
                                                id="cardOpt3"
                                                data-bs-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                <i className="bx bx-dots-vertical-rounded"></i>
                                            </button>
                                            <div
                                                className="dropdown-menu dropdown-menu-end"
                                                aria-labelledby="cardOpt3"
                                            >
                                                <Link aria-label="view more" className="dropdown-item" href={route("course.index")}>
                                                    View More
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="display-6 d-block mb-3">Course</span>
                                    
                                    {/* Additional Content */}
                                    <div className="mt-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <small className="text-muted">Total Course</small>
                                            <small className="fw-semibold">{coursecount}</small>
                                        </div>
                                        <div className="progress mb-2" style={{height: '6px'}}>
                                            <div className="progress-bar bg-secondary" style={{width: `${courseactivepercent}%`}}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-12 mb-4">
                            <div className="card h-100">
                                <div className="card-header d-flex align-items-center justify-content-between pb-0">
                                    <div className="card-title mb-0">
                                        <h5 className="m-0 me-2">Contact Information</h5>
                                        <small className="text-muted">Get in touch with us</small>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div className="d-flex flex-column align-items-center gap-1">
                                        </div>
                                    </div>
                                    <ul className="p-0 m-0 list-unstyled">
                                        <li className="d-flex mb-4 pb-1">
                                            <div className="avatar flex-shrink-0 me-3">
                                                <span className="avatar-initial rounded bg-label-primary">
                                                    <i className="bx bx-phone"></i>
                                                </span>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <small className="text-muted">Phone</small>
                                                <h6 className="mb-0">{contactinfo.phone}</h6>
                                            </div>
                                        </li>
                                        <li className="d-flex mb-4 pb-1">
                                            <div className="avatar flex-shrink-0 me-3">
                                                <span className="avatar-initial rounded bg-label-success">
                                                    <i className="bx bx-envelope"></i>
                                                </span>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <small className="text-muted">Email</small>
                                                <h6 className="mb-0">{contactinfo.email}</h6>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12 mb-4">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title mb-0">
                                <Calendar className="icon me-2 mb-1" />
                                Upcoming Events
                            </h5>
                            <p className="text-muted mb-0">Stay updated with upcoming campus activities</p>
                        </div>
                        <div className="card-body">
                            {upcomingevent && upcomingevent.length > 0 ? (
                                <div className="row">
                                    {upcomingevent.map((event) => (
                                        <div key={event.id} className="col-md-6 mb-4">
                                            <div className="card border h-100">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                        <div className="flex-grow-1">
                                                            <h6 className="card-title text-primary mb-1">
                                                                {event.title}
                                                            </h6>
                                                            <p className="text-muted small mb-2">
                                                                {event.short_description}
                                                            </p>
                                                        </div>
                                                        {event.image && (
                                                            <img 
                                                                src={`${event.image}`}
                                                                alt={event.alt_text}
                                                                className="rounded ms-3"
                                                                style={{
                                                                    width: "80px",
                                                                    height: "60px",
                                                                    objectFit: "cover"
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                    
                                                    <div className="d-flex flex-wrap gap-3 mb-3">
                                                        <div className="d-flex align-items-center text-muted">
                                                            <Calendar className="icon me-1" />
                                                            {new Date(event.event_date_from).toLocaleDateString()} 
                                                            {event.event_date_to && ` - ${new Date(event.event_date_to).toLocaleDateString()}`}
                                                        </div>
                                                        <div className="d-flex align-items-center text-muted">
                                                            <Clock className="icon me-1" />
                                                            {event.event_type}
                                                        </div>
                                                    </div>

                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <span className={`badge ${event.status == 1 ? 'bg-label-success' : 'bg-label-secondary'}`}>
                                                            {event.status == 1 ? 'Active' : 'Inactive'}
                                                        </span>
                                                        <Link
                                                            href={route("happening.edit", event.id)}
                                                            className="btn btn-sm btn-outline-primary"
                                                        >
                                                            Edit Happening
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <Calendar className="icon-lg text-muted mb-2" />
                                    <p className="text-muted mb-0">No upcoming events scheduled</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard