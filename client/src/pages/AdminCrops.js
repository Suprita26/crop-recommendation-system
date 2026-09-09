import { useEffect, useState } from "react";
import api from "../api/axios";
import CropFormModal from "../components/CropFormModal";
import CropPhoto from "../components/CropPhoto";

export default function AdminCrops() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modalCrop, setModalCrop] = useState(undefined); // undefined = closed, null = "new", object = "edit"

  const loadCrops = () => {
    setLoading(true);
    api
      .get("/crops")
      .then((res) => setCrops(res.data.crops))
      .catch((err) => setError(err.response?.data?.message || "Failed to load crops"))
      .finally(() => setLoading(false));
  };

  useEffect(loadCrops, []);

  const flashSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleCreateOrUpdate = async (payload) => {
    if (modalCrop) {
      await api.put(`/crops/${modalCrop._id}`, payload);
      flashSuccess(`${payload.name} updated.`);
    } else {
      await api.post("/crops", payload);
      flashSuccess(`${payload.name} added.`);
    }
    setModalCrop(undefined);
    loadCrops();
  };

  const handleDelete = async (crop) => {
    if (!window.confirm(`Delete "${crop.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/crops/${crop._id}`);
      flashSuccess(`${crop.name} deleted.`);
      loadCrops();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete crop");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <span className="eyebrow">Admin</span>
          <h1>Manage crop knowledge base</h1>
          <p>Add, edit, or remove the crops the recommendation engine matches against.</p>
        </div>
        <button className="btn btn-accent" onClick={() => setModalCrop(null)}>
          + Add crop
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <div className="loading-text">Loading crops…</div>
      ) : crops.length === 0 ? (
        <div className="card empty-state">
          <span className="glyph">🌾</span>
          <h3>No crops yet</h3>
          <p>Add your first crop, or run the seed script from the server (`npm run seed`).</p>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Crop</th>
                  <th>Season</th>
                  <th>N range</th>
                  <th>P range</th>
                  <th>K range</th>
                  <th>Temp (°C)</th>
                  <th>pH</th>
                  <th>Rainfall (mm)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {crops.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <CropPhoto src={c.imageUrl} alt={c.name} size={40} />
                    </td>
                    <td className="crop-row-name">{c.name}</td>
                    <td>{c.season ? <span className="tag">{c.season}</span> : "—"}</td>
                    <td>{c.nitrogen.min}–{c.nitrogen.max}</td>
                    <td>{c.phosphorus.min}–{c.phosphorus.max}</td>
                    <td>{c.potassium.min}–{c.potassium.max}</td>
                    <td>{c.temperature.min}–{c.temperature.max}</td>
                    <td>{c.ph.min}–{c.ph.max}</td>
                    <td>{c.rainfall.min}–{c.rainfall.max}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setModalCrop(c)}>
                          Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalCrop !== undefined && (
        <CropFormModal
          crop={modalCrop}
          onClose={() => setModalCrop(undefined)}
          onSubmit={handleCreateOrUpdate}
        />
      )}
    </div>
  );
}
