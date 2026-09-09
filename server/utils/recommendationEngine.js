/**
 * Rule-based crop recommendation engine.
 *
 * For every crop, each of the 7 parameters (N, P, K, temperature, humidity,
 * pH, rainfall) is scored 0-1:
 *   - value inside [min, max]  -> score = 1
 *   - value outside the range  -> score decays linearly based on how far
 *                                  outside the range it is, relative to the
 *                                  width of the range (capped at 0)
 *
 * The 7 scores are averaged into a single match percentage (0-100).
 * Crops are sorted by match percentage descending, and the top N are
 * returned along with human-readable notes about weak parameters.
 */

const PARAM_CONFIG = [
  { key: "nitrogen", field: "nitrogen", label: "Nitrogen (N)" },
  { key: "phosphorus", field: "phosphorus", label: "Phosphorus (P)" },
  { key: "potassium", field: "potassium", label: "Potassium (K)" },
  { key: "temperature", field: "temperature", label: "Temperature" },
  { key: "humidity", field: "humidity", label: "Humidity" },
  { key: "ph", field: "ph", label: "Soil pH" },
  { key: "rainfall", field: "rainfall", label: "Rainfall" },
];

function scoreParameter(value, range) {
  const { min, max } = range;
  if (value >= min && value <= max) return 1;

  const width = Math.max(max - min, 1e-6);
  const distance = value < min ? min - value : value - max;
  // decay: 1 tolerance-width away from the edge => score 0
  const score = 1 - distance / width;
  return Math.max(0, score);
}

function getRecommendations(input, crops, topN = 5) {
  const scored = crops.map((crop) => {
    const paramScores = PARAM_CONFIG.map(({ key, field, label }) => {
      const value = Number(input[key]);
      const range = crop[field];
      const score = scoreParameter(value, range);
      return { key, label, value, range, score };
    });

    const avgScore =
      paramScores.reduce((sum, p) => sum + p.score, 0) / paramScores.length;

    const weakParams = paramScores
      .filter((p) => p.score < 0.6)
      .map((p) => p.label);

    const notes =
      weakParams.length === 0
        ? "Excellent match across all parameters."
        : `Outside ideal range for: ${weakParams.join(", ")}.`;

    return {
      crop,
      matchPercentage: Math.round(avgScore * 1000) / 10, // 1 decimal place
      notes,
      paramScores,
    };
  });

  scored.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return scored.slice(0, topN);
}

module.exports = { getRecommendations, scoreParameter, PARAM_CONFIG };
