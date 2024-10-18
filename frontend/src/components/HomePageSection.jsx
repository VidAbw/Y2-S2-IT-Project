import React from 'react';
import { FaUtensils, FaHeartbeat, FaCalendarAlt } from 'react-icons/fa'; // Import icons from react-icons
import 'bootstrap/dist/css/bootstrap.min.css'; // Import bootstrap

const HomePageSection = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row text-center">
          {/* Section Header */}
          <div className="col-12 mb-4">
            <h2 className="display-4 font-weight-bold">Our Features</h2>
            <p className="lead">Explore the best we have to offer!</p>
          </div>

          {/* Feature 1 */}
          <div className="col-md-4 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <FaUtensils size={50} className="mb-3 text-primary" />
                <h5 className="card-title">Healthy Meals</h5>
                <p className="card-text">
                  Personalized meal recommendations based on your health profile.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="col-md-4 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <FaHeartbeat size={50} className="mb-3 text-success" />
                <h5 className="card-title">Health Tracking</h5>
                <p className="card-text">
                  Keep track of your health with our wellness monitoring tools.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="col-md-4 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <FaCalendarAlt size={50} className="mb-3 text-danger" />
                <h5 className="card-title">Easy Scheduling</h5>
                <p className="card-text">
                  Make reservations effortlessly with our simple scheduling system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePageSection;
