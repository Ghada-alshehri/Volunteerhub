import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleBrowseClick = () => {
    navigate("/explore");
  };

  return (
    <section id="home" className="section active">
      <section className="banner-wrapper"></section>
      <div className="hero" >
 
     <div style={{ position: 'relative', zIndex: 1 }}>
    <h2>Find Your Perfect Volunteer Opportunity</h2>
    <p>Connect with organizations that need your skills and passion</p>
    <button className="cta-button" onClick={handleBrowseClick}>
      Browse Opportunities
    </button>
  </div>
</div>

      {/* Features */}
      <div className="features">
        <div className="feature-card">
          <i className="fas fa-calendar-alt"></i>
          <h3>Flexible Volunteering</h3>
          <p>Choose opportunities that fit your schedule</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-hands-helping"></i>
          <h3>Skill Matching</h3>
          <p>Get matched with tasks that align with your skills</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-certificate"></i>
          <h3>Certification</h3>
          <p>Earn certificates for your volunteer work</p>
        </div>
      </div>
    </section>
  );
}

export default Home;






