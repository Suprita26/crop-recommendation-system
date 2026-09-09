import { useEffect, useState } from "react";
import api from "../api/axios";
import CropPhoto from "../components/CropPhoto";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/recommend/history")
      .then((res) => setHistory(res.data.history))
      .catch((err) => setError(err.response?.data?.message || "Failed to load history"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <span className="eyebrow">Your records</span>
          <h1>Recommendation history</h1>
          <p>Every recommendation you've generated, most recent first.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-text">Loading history…</div>
      ) : history.length === 0 ? (
        <div className="card empty-state">
          <span className="glyph">🌱</span>
          <h3>No recommendations yet</h3>
          <p>Head to the Recommend tab and enter your soil &amp; climate data to get started.</p>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>N</th>
                  <th>P</th>
                  <th>K</th>
                  <th>Temp (°C)</th>
                  <th>Humidity (%)</th>
                  <th>pH</th>
                  <th>Rainfall (mm)</th>
                  <th>Top result</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h._id}>
                    <td>{new Date(h.createdAt).toLocaleString()}</td>
                    <td>{h.input.nitrogen}</td>
                    <td>{h.input.phosphorus}</td>
                    <td>{h.input.potassium}</td>
                    <td>{h.input.temperature}</td>
                    <td>{h.input.humidity}</td>
                    <td>{h.input.ph}</td>
                    <td>{h.input.rainfall}</td>
                    <td>
                      {h.results[0] ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <CropPhoto
                            src={h.results[0].crop?.imageUrl}
                            alt={h.results[0].cropName}
                            size={32}
                          />
                          <span className="tag">
                            {h.results[0].cropName} · {h.results[0].matchPercentage}%
                          </span>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
