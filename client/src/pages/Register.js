import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", farmLocation: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container narrow">
      <div className="auth-hero">
        <span className="glyph">🌾</span>
        <h1>Create your account</h1>
        <p>Set up a free farmer account to start getting crop recommendations.</p>
      </div>
      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field" style={{ marginBottom: 16 }}>
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" required value={form.name} onChange={handleChange} placeholder="Asha Patel" />
          </div>
          <div className="field" style={{ marginBottom: 16 }}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>
          <div className="field" style={{ marginBottom: 16 }}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
            />
          </div>
          <div className="field">
            <label htmlFor="farmLocation">Farm location (optional)</label>
            <input
              id="farmLocation"
              name="farmLocation"
              value={form.farmLocation}
              onChange={handleChange}
              placeholder="e.g. Sirsi, Karnataka"
            />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </div>
        </form>
      </div>
      <p className="auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
