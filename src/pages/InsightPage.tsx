import { motion } from "framer-motion";
import { Globe, TrendingUp } from "lucide-react";

const globalFeatures = [
  { feature: "Humidity", importance: 0.34 },
  { feature: "Temperature", importance: 0.28 },
  { feature: "Rainfall", importance: 0.16 },
  { feature: "Nitrogen", importance: 0.1 },
  { feature: "pH", importance: 0.06 },
  { feature: "Phosphorus", importance: 0.04 },
  { feature: "Potassium", importance: 0.02 },
];

const maxImportance = globalFeatures[0].importance;

const InsightPage = () => {
  return (
    <div className="min-h-screen pb-16 pt-28">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl bg-primary p-8"
        >
          <div className="flex items-center gap-3">
            <Globe className="h-8 w-8 text-accent" />
            <div>
              <h1 className="font-display text-3xl font-bold text-primary-foreground">
                Global Insight Analytics
              </h1>
              <p className="text-primary-foreground/60">
                Model-wide feature importance and dominance analysis
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Global SHAP */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="sensor-card p-6"
          >
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              <h2 className="font-display text-lg font-semibold text-foreground">
                Global SHAP Importance
              </h2>
            </div>
            <div className="space-y-4">
              {globalFeatures.map((f, i) => (
                <motion.div
                  key={f.feature}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-foreground">{f.feature}</span>
                    <span className="font-display font-bold text-foreground">
                      {(f.importance * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="gradient-bar h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(f.importance / maxImportance) * 100}%` }}
                      transition={{ duration: 1.2, delay: 0.5 + i * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Feature Dominance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
              Feature Dominance Analysis
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                <span className="font-semibold text-accent">Humidity</span> and{" "}
                <span className="font-semibold text-accent">Temperature</span> are the two
                most dominant features across all crop predictions, accounting for over 60% of
                model decision weight.
              </p>
              <p>
                <span className="font-semibold text-accent">Rainfall</span> serves as a
                secondary differentiator, particularly for tropical crops such as rice and
                coconut, where precipitation patterns heavily influence viability.
              </p>
              <p>
                Soil nutrients (<span className="font-semibold text-accent">N, P, K</span>) contribute
                collectively ~16% importance, with Nitrogen being the most influential nutrient
                parameter.
              </p>
              <p>
                <span className="font-semibold text-accent">pH</span> has targeted impact —
                critical for specific crops like coffee and tea but minimal effect on most grain
                recommendations.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Summary Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {[
            { label: "Total Crops", value: "22" },
            { label: "Accuracy", value: "97.3%" },
            { label: "Features", value: "7" },
            { label: "Training Samples", value: "2,200" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="sensor-card p-5 text-center"
            >
              <div className="glow-text font-display text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default InsightPage;
