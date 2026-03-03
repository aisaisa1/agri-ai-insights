import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Droplets, Thermometer, Zap, Leaf, FlaskConical, Gauge } from "lucide-react";
import CircularGauge from "@/components/CircularGauge";
import NutrientBar from "@/components/NutrientBar";
import StatusPanel from "@/components/StatusPanel";

interface SensorField {
  key: string;
  label: string;
  unit: string;
  icon: React.ElementType;
  max: number;
  defaultVal: number;
}

const sensorFields: SensorField[] = [
  { key: "nitrogen", label: "Nitrogen", unit: "mg/kg", icon: Leaf, max: 200, defaultVal: 85 },
  { key: "phosphorus", label: "Phosphorus", unit: "mg/kg", icon: FlaskConical, max: 200, defaultVal: 60 },
  { key: "potassium", label: "Potassium", unit: "mg/kg", icon: Zap, max: 300, defaultVal: 45 },
  { key: "temperature", label: "Temperature", unit: "°C", icon: Thermometer, max: 50, defaultVal: 28 },
  { key: "humidity", label: "Humidity", unit: "%", icon: Droplets, max: 100, defaultVal: 82 },
  { key: "ph", label: "pH Level", unit: "pH", icon: Gauge, max: 14, defaultVal: 6.5 },
  { key: "rainfall", label: "Rainfall", unit: "mm", icon: Droplets, max: 400, defaultVal: 200 },
];

const SensorPage = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(sensorFields.map((f) => [f.key, f.defaultVal]))
  );

  const handleChange = (key: string, val: string) => {
    const num = parseFloat(val) || 0;
    setValues((prev) => ({ ...prev, [key]: num }));
  };

  const handleAnalyze = () => {
    navigate("/result", { state: { sensorData: values } });
  };

  return (
    <div className="min-h-screen pb-16 pt-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2 font-display text-3xl font-bold text-foreground">
            Sensor Input Panel
          </h1>
          <p className="text-muted-foreground">
            Enter environmental sensor readings for AI-powered crop analysis
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left – Inputs */}
          <div className="space-y-4 lg:col-span-3">
            <div className="grid gap-4 sm:grid-cols-2">
              {sensorFields.map((field, i) => (
                <motion.div
                  key={field.key}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="sensor-card p-5"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                      <field.icon className="h-4 w-4 text-accent" />
                    </div>
                    <span className="font-display text-sm font-semibold text-foreground">
                      {field.label}
                    </span>
                  </div>
                  <div className="flex items-end gap-2">
                    <input
                      type="number"
                      value={values[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 font-display text-lg font-bold text-foreground outline-none transition-all focus:border-accent focus:shadow-glow"
                    />
                    <span className="pb-2 text-xs text-muted-foreground">{field.unit}</span>
                  </div>
                  {/* Mini progress ring */}
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="gradient-bar h-full"
                      animate={{ width: `${Math.min((values[field.key] / field.max) * 100, 100)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onClick={handleAnalyze}
              className="w-full rounded-2xl border border-accent/40 bg-primary px-8 py-4 font-display text-lg font-semibold text-primary-foreground shadow-glow transition-all duration-300 hover:shadow-glow-strong"
            >
              Run AI Analysis
            </motion.button>
          </div>

          {/* Right – Visualization */}
          <div className="space-y-6 lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Environmental Gauges
              </h3>
              <div className="flex justify-around">
                <CircularGauge value={values.humidity} max={100} label="Humidity" unit="%" />
                <CircularGauge value={values.temperature} max={50} label="Temp" unit="°C" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-6"
            >
              <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Nutrient Levels
              </h3>
              <div className="flex justify-around">
                <NutrientBar label="N" value={values.nitrogen} max={200} />
                <NutrientBar label="P" value={values.phosphorus} max={200} />
                <NutrientBar label="K" value={values.potassium} max={300} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="glass-card p-6"
            >
              <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                pH Scale
              </h3>
              <div className="relative h-6 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="gradient-bar absolute inset-y-0 left-0"
                  animate={{ width: `${(values.ph / 14) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Acidic (0)</span>
                <span className="font-display font-bold text-foreground">{values.ph}</span>
                <span>Alkaline (14)</span>
              </div>
            </motion.div>

            <StatusPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorPage;
