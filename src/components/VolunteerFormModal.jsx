import React from "react";

function VolunteerFormModal({ formData, onChange, onSubmit, onClose, success }) {
  return (
    <div className="modal active" onClick={(e) => e.target.classList.contains("modal") && onClose()}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-btn" onClick={onClose}>&times;</span>
        <h2>Volunteer Application</h2>
        <form onSubmit={onSubmit} className="volunteer-form">
          {["fullName", "email", "phone"].map((field) => (
            <div className="form-group" key={field}>
              <label>{field === "fullName" ? "Full Name" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                name={field}
                value={formData[field]}
                onChange={onChange}
                required
              />
            </div>
          ))}
          <div className="form-group">
            <label>Available Time Slots</label>
            <select name="availability" multiple value={formData.availability} onChange={onChange} required>
              <option value="morning">Morning (8AM-12PM)</option>
              <option value="afternoon">Afternoon (1PM-5PM)</option>
              <option value="evening">Evening (6PM-9PM)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Relevant Skills</label>
            <textarea name="skills" value={formData.skills} onChange={onChange} rows="3" required />
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">Submit Application</button>
          </div>
        </form>
        {success && <p style={{ color: "green", marginTop: "20px", textAlign: "center" }}>Application submitted successfully!</p>}
      </div>
    </div>
  );
}

export default VolunteerFormModal;
