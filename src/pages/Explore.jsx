import React, { useState, useEffect } from "react";
import VolunteerFormModal from "../components/VolunteerFormModal";
import OpportunityModal from "../components/OpportunityModal";
import OpportunityCard from "../components/OpportunityCard";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  getDoc, 
} from "firebase/firestore";


// Fix marker icon path manually
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function Explore() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [opportunities, setOpportunities] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    availability: [],
    skills: "",
  });

  useEffect(() => {
    const fetchOpportunities = async () => {
      const querySnapshot = await getDocs(collection(db, "opportunities"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOpportunities(data);
    };
    fetchOpportunities();
  }, []);

  const filteredOpportunities = opportunities.filter((opp) =>
    opp.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowVolunteerForm(false);
    setFormSuccess(false);
  };

  const closeModal = () => {
    setSelectedOpportunity(null);
    setShowVolunteerForm(false);
    setFormSuccess(false);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      availability: [],
      skills: "",
    });
  };

  const openVolunteerForm = async () => {
    setFormSuccess(false);
  
    const userEmail = localStorage.getItem("googleEmail");
    if (!userEmail) {
      alert("Please log in first.");
      return;
    }
  
    try {
      const userRef = doc(db, "users", userEmail);
      const userSnap = await getDoc(userRef);
  
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setFormData((prev) => ({
          ...prev,
          fullName: userData.name || "",
          email: userData.email || userEmail,
          phone: userData.phone || "",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          email: userEmail,
        }));
      }
  
      setShowVolunteerForm(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Failed to load your info. Try again.");
    }
  };
  

  const handleFormChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;
    if (type === "select-multiple") {
      const values = Array.from(selectedOptions, (option) => option.value);
      setFormData((prev) => ({ ...prev, [name]: values }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const userEmail = localStorage.getItem("googleEmail");
    if (!userEmail) {
      alert("Please log in first.");
      return;
    }

    try {
      const userAppsRef = collection(db, "users", userEmail, "applications");
      await addDoc(userAppsRef, {
        ...formData,
        opportunityTitle: selectedOpportunity.title,
        opportunityId: selectedOpportunity.id || null,
        status: "ongoing",
        submittedAt: serverTimestamp(),
      });

      setFormSuccess(true);
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit. Please try again.");
    }
  };

  // Show map for opportunities that have valid coordinates
  useEffect(() => {
    if (
      selectedOpportunity &&
      selectedOpportunity.coordinates &&
      typeof selectedOpportunity.coordinates.latitude === "number" &&
      typeof selectedOpportunity.coordinates.longitude === "number"
    ) {
      setTimeout(() => {
        const map = L.map("opportunity-map").setView(
          [selectedOpportunity.coordinates.latitude, selectedOpportunity.coordinates.longitude],
          15
        );
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(map);
        L.marker([
          selectedOpportunity.coordinates.latitude,
          selectedOpportunity.coordinates.longitude,
        ])
          .addTo(map)
          .bindPopup("📍 " + selectedOpportunity.title);
        map.invalidateSize();
      }, 200);
    }
  }, [selectedOpportunity]);

  return (
    <section id="explore" className="section active">
      <div className="container">
        <div className="explore-header">
          <h2>Explore Volunteer Opportunities</h2>
          <button className="filter-button" onClick={() => alert("Filter clicked!")}>
            Filter
          </button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button">Search</button>
        </div>

        <div className="opportunities-list">
          {filteredOpportunities.map((opp, index) => (
            <OpportunityCard
              key={index}
              opportunity={opp}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {selectedOpportunity && !showVolunteerForm && (
          <OpportunityModal
            opportunity={selectedOpportunity}
            onClose={closeModal}
            onVolunteer={openVolunteerForm}
          >
            {selectedOpportunity.coordinates?.latitude && (
              <div
                id="opportunity-map"
                style={{
                  height: "200px",
                  width: "100%",
                  marginTop: "15px",
                  borderRadius: "10px",
                }}
              ></div>
            )}
          </OpportunityModal>
        )}

        {selectedOpportunity && showVolunteerForm && (
          <VolunteerFormModal
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleFormSubmit}
            onClose={closeModal}
            success={formSuccess}
          />
        )}
      </div>
    </section>
  );
}

export default Explore;
