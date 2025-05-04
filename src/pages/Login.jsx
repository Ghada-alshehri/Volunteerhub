import { GoogleLogin } from '@react-oauth/google';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password!");
      return;
    }

    try {
      const userRef = doc(db, "users", email);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        setError("No user found with this email.");
        return;
      }

      const userData = docSnap.data();

      if (userData.method === "manual" && userData.password === password) {
        // ✅ حفظ البيانات في localStorage
        localStorage.setItem("manualEmail", userData.email);
        localStorage.setItem("googleName", userData.name);
        localStorage.setItem("googleEmail", userData.email);

        // ✅ إعادة تحميل الصفحة لتحديث النافبار
        window.location.href = "/profile";
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      localStorage.setItem("google_token", credentialResponse.credential);
      const decoded = jwtDecode(credentialResponse.credential);
      localStorage.setItem("googleName", decoded.name);
      localStorage.setItem("googleEmail", decoded.email);

      const userRef = doc(db, "users", decoded.email);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          name: decoded.name,
          email: decoded.email,
          method: "google",
          university: "King Abdulaziz University",
          photoURL:
            "https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg",
        });
      }

      // ✅ إعادة توجيه
      window.location.href = "/profile";
    } catch (err) {
      console.error("Google Login Error:", err);
    }
  };

  return (
    <section id="login" className="section active">
      <div className="login-container">
        <h2>Welcome to Volunteer Hub</h2>
        <p>Sign in to find volunteer opportunities</p>

        <div className="google-login-btn">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => console.log("Login Failed")}
          />
        </div>

        <div className="divider"><span>OR</span></div>

        <form className="email-login-form" onSubmit={handleSubmit}>
          {error && (
            <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
          )}
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="email-login-btn">
            Sign In
          </button>
        </form>

        <div className="signup-link">
          <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </div>
      </div>
    </section>
  );
}

export default Login;
