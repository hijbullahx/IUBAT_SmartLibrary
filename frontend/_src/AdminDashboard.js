import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminDashboard.css";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="min-vh-100 d-flex justify-content-center">
        {/* Login Box */}
        <div
          className="bg-white shadow-sm p-4 text-center"
          style={{ width: "100%", maxWidth: "55%", height: "450px" }}
        >
          {/* Title */}
          <button className="btn btn-outline-secondary mb-4 fw-bold px-4 rounded-pill">
            Admin Login
          </button>

          {/* Username */}
          <div className="">
            <input
              type="text"
              className="form-control rounded-pill"
              placeholder="Username"
            />
          </div>

          {/* Password */}
          <div className="mb-3 position-relative mt-3">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control rounded-pill pe-5"
              placeholder="Password"
            />
            <button
              type="button"
              className="btn btn-small text-dark position-absolute top-50 end-0 mr-3 translate-middle-y me-2 border-0"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="mb-3 text-start">
            <a href="#" className="text-decoration-none small fw-bold">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button
            className="btn w fw-bold round"
            style={{ backgroundColor: "#e2ffbf" }}
          >
            Login
          </button>
        </div>

        {/* Warning Text */}
        <div
          className="position-absolute bottom-0 text-center fw-bold"
          style={{ opacity: 0.2 }}
        >
          Warning!!! Restricted site for common user & Students
        </div>
      </div>
    </>
  );
}
