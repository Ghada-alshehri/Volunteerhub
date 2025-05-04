import React from "react";

function OpportunityCard({ opportunity, onViewDetails }) {
  return (
    <div className="volunteer-card">
      <div className="card-content">
        <h3>{opportunity.title}</h3>
        <p style={{ color: "seagreen", fontWeight: "500" }}>{opportunity.description}</p>
        <div className="details">
          <div className="detail-item"><strong>Location:</strong> {opportunity.location}</div>
          <div className="detail-item"><strong>Duration:</strong> {opportunity.duration}</div>
          <div className="detail-item"><strong>Payment:</strong> {opportunity.payment}</div>
        </div>
        <div className="skills">
          <strong>Skills Needed:</strong>
          <div className="skill-tags" style={{ marginTop: "5px" }}>
            {opportunity.skills.map((skill, idx) => (
              <span key={idx} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <button className="view-details-btn" onClick={() => onViewDetails(opportunity)}>
          View Details
        </button>
      </div>
    </div>
  );
}

export default OpportunityCard;
