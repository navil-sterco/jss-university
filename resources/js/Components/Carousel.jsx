import React, { useEffect, useState } from 'react';

const Carousel = ({ id, items, dark, onDelete }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const carouselElement = document.getElementById(id);

        const handleSlide = (event) => {
            setActiveIndex(event.to);
        };

        if (carouselElement) {
            carouselElement.addEventListener('slid.bs.carousel', handleSlide);
        }

        return () => {
            if (carouselElement) {
                carouselElement.removeEventListener('slid.bs.carousel', handleSlide);
            }
        };
    }, [id]);

    if (!items || items.length === 0) {
        return <p>No banners available.</p>;
    }

    const currentItem = items[activeIndex];
    
    return (
        <div className="banner-section">
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className='m-2'>
                    <h3 className="mb-1">Heading: {currentItem.heading || 'No Heading'}</h3>
                    <p className="text-muted mb-0">Subheading: {currentItem.subheading || 'No Description'}</p>
                    <a className="text-muted mb-0 text-primary" target='_blank' href={currentItem.link}>Link: {currentItem.linked_text || 'No Link'}</a>
                </div>

                <button
                    onClick={() => onDelete(currentItem.id)}
                    className="btn btn-sm btn-danger"
                >
                    <i className="bx bx-trash"></i> Delete
                </button>
            </div>

            {/* Carousel */}
            <div
                id={id}
                className={`carousel ${dark ? 'carousel-dark slide carousel-fade' : 'carousel slide'}`}
                data-bs-ride="carousel"
            >
                <div className="carousel-indicators">
                    {items.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            data-bs-target={`#${id}`}
                            data-bs-slide-to={index}
                            className={index === 0 ? 'active' : ''}
                            aria-current={index === 0 ? 'true' : 'false'}
                            aria-label={`Slide ${index + 1}`}
                        ></button>
                    ))}
                </div>

                <div className="carousel-inner">
                    {items.map((item, index) => (
                        <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                            <div
                                style={{
                                    width: '100%',
                                    height: '350px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    overflow: 'hidden',
                                    backgroundColor: '#f1f1f1',
                                    borderRadius: '8px',
                                }}
                            >
                                <img
                                    src={item.image}
                                    alt={`Slide ${index + 1}`}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain',
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <a className="carousel-control-prev" href={`#${id}`} role="button" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </a>
                <a className="carousel-control-next" href={`#${id}`} role="button" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </a>
            </div>
        </div>
    );
};

export default Carousel;
