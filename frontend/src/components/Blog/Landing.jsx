import React from 'react';
import { Link } from 'react-router-dom';

function Landing() {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <div className="container-fluid bg-light vh-100 d-flex align-items-center justify-content-center">
                <div className="row text-center">
                    <div className="col">
                        <h1 className="display-4 text-primary mb-4">Blogs </h1>

                        {/* Blog Links */}
                        <div className="d-flex justify-content-center gap-4">
                            <Link to="blogs" className="btn btn-primary btn-lg shadow-sm">
                                View Blogs
                            </Link>
                            <Link to="blogs-manager" className="btn btn-outline-primary btn-lg shadow-sm">
                                Manage Blogs
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Landing;
