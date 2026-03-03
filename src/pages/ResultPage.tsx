import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Brain, Leaf } from "lucide-react";
import ConfidenceRing from "@/components/ConfidenceRing";
import ProbabilityBar from "@/components/ProbabilityBar";

const mockResult = {
  crop: "Papaya",
  confidence: 98.7,
  topCrops: [
    { name: "Papaya", prob: 98.7 },
    { name: "Mango", prob: 1.2 },
    { name: "Coconut", prob: 0.1 },
  ],
  explanation:
    "Recommendation of **Papaya** is primarily driven by **Humidity** and **Temperature**. The high moisture content (82%) combined with warm temperatures (28°C) creates optimal conditions. **Nitrogen** levels further support this recommendation, while **pH** (6.5) falls within the ideal acidic-to-neutral range for Papaya cultivation.",
  shapFeatures: [
    { feature: "Humidity", value: 0.42, positive: true },
    { feature: "Temperature", value: 0.31, positive: true },
    { feature: "Nitrogen", value: 0.18, positive: true },
    { feature: "pH", value: 0.05, positive: true },
    { feature: "Potassium", value: -0.03, positive: false },
    { feature: "Phosphorus", value: -0.02, positive: false },
    { feature: "Rainfall", value: 0.09, positive: true },
  ],
};

const ResultPage = () => {
  const location = useLocation();
  const _sensorData = location.state?.sensorData;

  const highlightBold = (text: string) => {
    return text.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <span key={i} className="font-semibold text-accent">
            {part.slice(2, -2)}
          </span>
        );
      }
      return part;
    });
  };

  const maxAbsShap = Math.max(...mockResult.shapFeatures.map((f) => Math.abs(f.value)));

  return (
    <div className="min-h-screen pb-16 pt-28">
      <div className="mx-auto max-w-5xl px-6">
        {/* AI Decision Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 overflow-hidden rounded-2xl p-8"
          style={{
            background:
              "linear-gradient(135deg, hsl(155 62% 15% / 0.05) 0%, hsl(155 100% 62% / 0.08) 100%)",
          }}
        >
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-around">
            <div className="text-center md:text-left">
              <p className="mb-1 text-sm uppercase tracking-wider text-muted-foreground">
                AI Recommended Crop
              </p>
              <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="glow-text flex items-center gap-3 font-display text-4xl font-bold text-foreground md:text-5xl"
              >
                <Leaf className="h-8 w-8 text-accent" />
                {mockResult.crop}
              </motion.h1>
            </div>
            <ConfidenceRing value={mockResult.confidence} label="Model Confidence" />
          </div>
        </motion.div>

        {/* Probability Bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="sensor-card mb-8 p-6"
        >
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            Top Crop Probabilities
          </h2>
          <div className="space-y-3">
            {mockResult.topCrops.map((crop, i) => (
              <ProbabilityBar key={crop.name} label={crop.name} value={crop.prob} rank={i} />
            ))}
          </div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                <Brain className="h-4 w-4 text-accent" />
              </div>
              <h2 className="font-display text-lg font-semibold text-foreground">
                AI Insight Analysis
              </h2>
            </div>
            <p className="leading-relaxed text-muted-foreground">
              {highlightBold(mockResult.explanation)}
            </p>
          </motion.div>

          {/* SHAP Waterfall */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-6"
          >
            <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
              Feature Contribution (SHAP)
            </h2>
            <div className="space-y-3">
              {mockResult.shapFeatures
                .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
                .map((f, i) => (
                  <motion.div
                    key={f.feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <span className="w-24 text-right text-sm text-muted-foreground">
                      {f.feature}
                    </span>
                    <div className="relative h-5 flex-1 overflow-hidden rounded bg-muted">
                      <motion.div
                        className={`absolute inset-y-0 left-0 rounded ${
                          f.positive ? "gradient-bar" : "bg-destructive/60"
                        }`}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(Math.abs(f.value) / maxAbsShap) * 100}%`,
                        }}
                        transition={{ duration: 1, delay: 1 + i * 0.1 }}
                      />
                    </div>
                    <span className="w-12 text-right font-display text-xs font-bold text-foreground">
                      {f.value > 0 ? "+" : ""}
                      {f.value.toFixed(2)}
                    </span>
                  </motion.div>
                ))}
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-accent shadow-glow" /> Positive
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-destructive" /> Negative
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
