import React from "react";

function OpportunityModal({ opportunity, onClose, onVolunteer, children }) {
  return (
    <div
      className="modal active"
      onClick={(e) => e.target.classList.contains("modal") && onClose()}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>
        <h2>{opportunity.title}</h2>
        <div className="opportunity-content">
          <div className="main-details">
            <h3>Opportunity Description:</h3>
            <p>{opportunity.description}</p>

            <h3>Skills Gained:</h3>
            <ul>
              {opportunity.skills?.map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>

            <h3>Requirements:</h3>
            <ul>
              {opportunity.requirements?.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="side-details">
            <div className="detail-box">
              <h4>Location</h4>
              <p>{opportunity.location}</p>
            </div>
            <div className="detail-box">
              <h4>Duration</h4>
              <p>{opportunity.duration}</p>
            </div>
            <div className="detail-box">
              <h4>Payment</h4>
              <p>{opportunity.payment}</p>
            </div>

            <button className="volunteer-btn" onClick={onVolunteer}>
              Volunteer Now
            </button>
          </div>
        </div>

        {opportunity.coordinates && (
          <div
            style={{
              height: "300px",
              width: "100%",
              margin: "30px 0 0",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              id="opportunity-map"
              style={{
                height: "100%",
                width: "100%",
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OpportunityModal;
