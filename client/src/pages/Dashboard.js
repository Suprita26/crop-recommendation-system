import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import CropPhoto from "../components/CropPhoto";

const FIELDS = [
  { name: "nitrogen", label: "Nitrogen (N)", hint: "kg/ha, soil test value", placeholder: "e.g. 80" },
  { name: "phosphorus", label: "Phosphorus (P)", hint: "kg/ha, soil test value", placeholder: "e.g. 45" },
  { name: "potassium", label: "Potassium (K)", hint: "kg/ha, soil test value", placeholder: "e.g. 40" },
  { name: "temperature", label: "Temperature", hint: "average, °C", placeholder: "e.g. 26" },
  { name: "humidity", label: "Humidity", hint: "average, %", placeholder: "e.g. 70" },
  { name: "ph", label: "Soil pH", hint: "0–14 scale", placeholder: "e.g. 6.5" },
  { name: "rainfall", label: "Rainfall", hint: "average, mm", placeholder: "e.g. 120" },
];

const EMPTY_FORM = FIELDS.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {});

export default function Dashboard() {
  const { user } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResults(null);
    setSubmitting(true);
    try {
      const res = await api.post("/recommend", form);
      setResults(res.data.results);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong generating recommendations.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <span className="eyebrow">Field input</span>
          <h1>Hello, {user?.name?.split(" ")[0] || "farmer"} 👋</h1>
          <p>Enter your soil test results and local climate averages to get matched crops.</p>
        </div>
      </div>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {FIELDS.map((f) => (
              <div className="field" key={f.name}>
                <label htmlFor={f.name}>{f.label}</label>
                <input
                  id={f.name}
                  name={f.name}
                  type="number"
                  step="any"
                  required
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                />
                <span className="hint">{f.hint}</span>
              </div>
            ))}
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Analyzing…" : "Get recommendations"}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setForm(EMPTY_FORM);
                setResults(null);
                setError("");
              }}
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {results && (
        <div style={{ marginTop: 36 }}>
          <h2>Top matches</h2>
          <p>Ranked by how closely your conditions match each crop's ideal growing range.</p>
          <div className="results-list">
            {results.map((r, i) => (
              <div className={`result-card rank-${i}`} key={r.cropId}>
                <CropPhoto src={r.imageUrl} alt={r.name} />
                <div className="growth-ring" style={{ "--pct": r.matchPercentage }}>
                  <span>{Math.round(r.matchPercentage)}%</span>
                </div>
                <div className="result-body">
                  <div className="result-rank">#{i + 1} match</div>
                  <h3>{r.name}</h3>
                  {r.season && <div className="result-meta">{r.season} season</div>}
                  <p className="result-notes">{r.notes}</p>
                  {r.description && <p className="result-notes">{r.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
