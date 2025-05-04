import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    university: "King Abdulaziz University",
    photoURL: ""
  });
  const [profileImage, setProfileImage] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  
  const navigate = useNavigate();
  
  const userEmail = localStorage.getItem("googleEmail");
  
  // Check if the user is logged in
  useEffect(() => {
    if (!userEmail) {
      navigate("/login"); // If not logged in, redirect to login page
    }
  }, [userEmail, navigate]);

  const convertDurationToHours = (duration) => {
    if (!duration) return 0;
    const text = duration.trim().toLowerCase();

    const dayMatch = text.match(/(\d+)\s*day/);
    const weekMatch = text.match(/(\d+)\s*week/);

    if (dayMatch) {
      const days = parseInt(dayMatch[1]);
      return days * 8;
    }

    if (weekMatch) {
      const weeks = parseInt(weekMatch[1]);
      return weeks * 40;
    }

    return 0;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userEmail) return;

      const userRef = doc(db, "users", userEmail);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setProfileData({
          name: data.name || "",
          email: data.email || userEmail,
          university: data.university || "King Abdulaziz University",
          photoURL: data.photoURL || ""
        });

        const appsRef = collection(db, "users", userEmail, "applications");
        const appsSnap = await getDocs(appsRef);

        const userApps = await Promise.all(appsSnap.docs.map(async (docSnap) => {
          const appData = docSnap.data();
          const oppId = appData.opportunityId;

          let duration = "";
          try {
            const oppRef = doc(db, "opportunities", oppId);
            const oppSnap = await getDoc(oppRef);
            if (oppSnap.exists()) {
              const oppData = oppSnap.data();
              duration = oppData.duration || "";
            } else {
              console.warn(`No opportunity found for ID: ${oppId}`);
            }
          } catch (error) {
            console.error("Error fetching opportunity data:", error);
          }

          return {
            ...appData,
            duration,
          };
        }));

        setOpportunities(userApps);
      } else {
        setProfileData((prev) => ({
          ...prev,
          email: userEmail,
          university: "King Abdulaziz University",
        }));
      }
    };

    fetchUserData();
  }, [userEmail]);

  const handleEditClick = () => setEditing(true);

  const handleSaveClick = async () => {
    if (userEmail && profileData.name && profileData.university) {
      try {
        let photoURL = profileData.photoURL;

        if (profileImage) {
          const reader = new FileReader();
          reader.onloadend = async () => {
            photoURL = reader.result;

            const userRef = doc(db, "users", userEmail);
            await updateDoc(userRef, {
              name: profileData.name,
              university: profileData.university,
              photoURL
            });

            setProfileData((prev) => ({ ...prev, photoURL }));
            setEditing(false);
          };
          reader.readAsDataURL(profileImage);
        } else {
          const userRef = doc(db, "users", userEmail);
          await updateDoc(userRef, {
            name: profileData.name,
            university: profileData.university,
            photoURL
          });

          setEditing(false);
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/");
  };

  const completedCount = opportunities.filter(op => op.status?.toLowerCase() === "completed").length;
  const ongoingCount = opportunities.filter(op => op.status?.toLowerCase() === "ongoing").length;
  const totalCount = opportunities.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const totalHours = opportunities
    .filter(op => op.status?.toLowerCase() === "completed")
    .reduce((sum, op) => sum + convertDurationToHours(op.duration), 0);

  return (
    <section id="profile" className="section active">
      <div className="profile-container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="profile-header">
            <img src={profileData.photoURL || "https://via.placeholder.com/150"} alt="Profile" className="profile-pic" />
            <div className="profile-details">
              {editing ? (
                <>
                  <div className="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" value={profileData.name} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={profileData.email} disabled />
                  </div>
                  <div className="form-group">
                    <label>University:</label>
                    <input type="text" name="university" value={profileData.university} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Profile Image:</label>
                    <input type="file" onChange={handleImageChange} />
                  </div>
                  <button className="save-profile-btn" onClick={handleSaveClick}>
                    Save Profile
                  </button>
                </>
              ) : (
                <>
                  <h2>{profileData.name}</h2>
                  <p>{profileData.email}</p>
                  <p>{profileData.university}</p>
                  <div className="rating">
                    <span>Rating: 4.7</span>
                    <div className="stars">★★★★☆</div>
                  </div>
                  <button className="edit-profile-btn" onClick={handleEditClick}>
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>

          {!editing && (
            <button
              onClick={handleSignOut}
              style={{
                backgroundColor: "#014421",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                height: "40px",
              }}
            >
              Sign Out
            </button>
          )}
        </div>

        {!editing && (
          <div className="profile-sections">
            <div className="profile-section">
              <h3>Community Statistics</h3>
              <div className="stats-container">
                <div className="stat-item">
                  <span className="stat-value">{completionRate}%</span>
                  <span className="stat-label">Completion Rate</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{completedCount}</span>
                  <span className="stat-label">Tasks Completed</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{ongoingCount}</span>
                  <span className="stat-label">Ongoing Tasks</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{totalHours}</span>
                  <span className="stat-label">Hours Volunteered</span>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3>Community Participants</h3>
              <div className="activities-list">
                {opportunities.map((op, index) => (
                  <div className="activity-item" key={index}>
                    <h4>{op.opportunityTitle}</h4>
                    <p>Date: {op.submittedAt?.toDate?.().toLocaleDateString()}</p>
                    <p className={`status ${op.status?.toLowerCase() === "completed" ? "completed" : "ongoing"}`}>
                      {op.status ? op.status.charAt(0).toUpperCase() + op.status.slice(1) : "Unknown"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Profile;
