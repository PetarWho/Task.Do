import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';



const SpinnerLoading = () => {
  return (
    <div className="container m-5 d-flex justify-content-center" style={{ height: 550 }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default SpinnerLoading;
