import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { db, auth, provider } from "../firebase";
import { collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { signInWithPopup } from "firebase/auth";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!name || !email || !password) {
      setError("Please fill in all fields!");
      return;
    }
  
    try {
      const userRef = doc(db, "users", email);
      const userSnap = await getDoc(userRef);
  
      if (userSnap.exists()) {
        setError("This email is already in use.");
        return;
      }
  
      await setDoc(userRef, {
        name,
        email,
        password, // ملاحظة: للتجارب فقط - للتطبيقات الحقيقية يجب تشفيره!
        university: "King Abdulaziz University",
        photoURL: "https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg",
        method: "manual"
      });
  
      localStorage.setItem("manualEmail", email);

      setError("");
      navigate("/login");
    } catch (error) {
      console.error("Error adding user:", error);
      setError("Something went wrong. Please try again.");
    }
  };
  

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.email);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          university: "King Abdulaziz University",
          photoURL: user.photoURL || "https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg",
          method: "google"
        });
      }

      navigate("/profile");
    } catch (error) {
      console.error("Google sign-up error:", error);
      setError("Google Sign-up failed.");
    }
  };

  return (
    <section id="signup" className="section active">
      <div className="login-container">
        <h2>Create an Account</h2>
        <p>Join Volunteer Hub to find opportunities</p>

        <div className="divider">
          <span>OR</span>
        </div>

        <button onClick={handleGoogleSignup} className="google-signup-btn">
          Sign up with Google
        </button>

        <form className="email-login-form" onSubmit={handleSubmit}>
          {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="email-login-btn">
            Sign Up
          </button>
        </form>

        <div className="signup-link">
          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Signup;
