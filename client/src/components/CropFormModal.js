import { useState } from "react";
import CropPhoto from "./CropPhoto";

const RANGE_FIELDS = [
  { key: "nitrogen", label: "Nitrogen (N)" },
  { key: "phosphorus", label: "Phosphorus (P)" },
  { key: "potassium", label: "Potassium (K)" },
  { key: "temperature", label: "Temperature (°C)" },
  { key: "humidity", label: "Humidity (%)" },
  { key: "ph", label: "Soil pH" },
  { key: "rainfall", label: "Rainfall (mm)" },
];

function buildInitialState(crop) {
  const base = {
    name: crop?.name || "",
    description: crop?.description || "",
    season: crop?.season || "",
    imageUrl: crop?.imageUrl || "",
  };
  RANGE_FIELDS.forEach(({ key }) => {
    base[key] = {
      min: crop?.[key]?.min ?? "",
      max: crop?.[key]?.max ?? "",
    };
  });
  return base;
}

export default function CropFormModal({ crop, onClose, onSubmit }) {
  const [form, setForm] = useState(buildInitialState(crop));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleTextChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRangeChange = (key, bound, value) => {
    setForm({ ...form, [key]: { ...form[key], [bound]: value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      season: form.season.trim(),
      imageUrl: form.imageUrl.trim(),
    };
    for (const { key } of RANGE_FIELDS) {
      const min = Number(form[key].min);
      const max = Number(form[key].max);
      if (Number.isNaN(min) || Number.isNaN(max)) {
        setError(`Please enter numeric min/max for ${key}`);
        return;
      }
      payload[key] = { min, max };
    }

    setSubmitting(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save crop");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{crop ? "Edit crop" : "Add a new crop"}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid" style={{ marginBottom: 18 }}>
            <div className="field">
              <label htmlFor="crop-name">Crop name</label>
              <input id="crop-name" name="name" required value={form.name} onChange={handleTextChange} />
            </div>
            <div className="field">
              <label htmlFor="crop-season">Season</label>
              <input
                id="crop-season"
                name="season"
                placeholder="e.g. Kharif, Rabi, Year-round"
                value={form.season}
                onChange={handleTextChange}
              />
            </div>
          </div>
          <div className="field" style={{ marginBottom: 22 }}>
            <label htmlFor="crop-description">Description</label>
            <textarea
              id="crop-description"
              name="description"
              rows={2}
              value={form.description}
              onChange={handleTextChange}
            />
          </div>

          <div className="field" style={{ marginBottom: 22 }}>
            <label htmlFor="crop-image">Image URL</label>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <CropPhoto src={form.imageUrl} alt={form.name || "Crop preview"} size={56} />
              <input
                id="crop-image"
                name="imageUrl"
                type="url"
                placeholder="https://example.com/rice.jpg"
                value={form.imageUrl}
                onChange={handleTextChange}
                style={{ flex: 1 }}
              />
            </div>
            <span className="hint">
              Paste a direct image link (Wikimedia Commons, Unsplash, your own hosting, etc). Leave blank to show a leaf icon instead.
            </span>
          </div>

          <h3 style={{ marginBottom: 10 }}>Ideal ranges</h3>
          <div className="form-grid">
            {RANGE_FIELDS.map(({ key, label }) => (
              <div className="field" key={key}>
                <label>{label}</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="number"
                    step="any"
                    placeholder="Min"
                    value={form[key].min}
                    onChange={(e) => handleRangeChange(key, "min", e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Max"
                    value={form[key].max}
                    onChange={(e) => handleRangeChange(key, "max", e.target.value)}
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Saving…" : crop ? "Save changes" : "Add crop"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
