import { motion } from "framer-motion";
import { ArrowRight, Leaf, Cpu, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import Particles from "@/components/Particles";
import CropSilhouettes from "@/components/CropSilhouettes";

const features = [
  { icon: Leaf, title: "Crop Prediction", desc: "ANN-powered recommendations for optimal crop selection" },
  { icon: Cpu, title: "Explainable AI", desc: "SHAP-based transparency in every decision" },
  { icon: BarChart3, title: "Precision Analysis", desc: "Real-time sensor data to actionable insights" },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-gradient relative flex min-h-screen items-center justify-center overflow-hidden">
        <Particles />
        <CropSilhouettes />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent">
              <div className="status-dot" />
              AI System Active
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glow-text mb-6 font-display text-4xl font-bold leading-tight text-primary-foreground md:text-6xl"
          >
            AI-Powered Smart Farming
            <br />
            <span className="text-accent">Recommendation System</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mb-10 max-w-2xl text-lg text-primary-foreground/70"
          >
            Precision agriculture powered by Artificial Neural Network and Explainable AI.
            Transform sensor data into intelligent crop recommendations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              to="/sensor"
              className="group inline-flex items-center gap-3 rounded-2xl border border-accent/40 bg-accent/10 px-8 py-4 font-display text-lg font-semibold text-accent shadow-glow backdrop-blur-sm transition-all duration-300 hover:bg-accent/20 hover:shadow-glow-strong"
            >
              Start Smart Analysis
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Animated plant element */}
        <motion.div
          className="absolute bottom-0 right-10 hidden lg:block"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 0.15, y: 0 }}
          transition={{ duration: 2, delay: 1 }}
        >
          <svg width="120" height="300" viewBox="0 0 120 300">
            <motion.line
              x1="60" y1="300" x2="60" y2="100"
              stroke="hsl(155,100%,62%)" strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 1.2 }}
            />
            {[80, 130, 180, 230].map((y, i) => (
              <motion.path
                key={i}
                d={`M60,${y} Q${i % 2 === 0 ? 100 : 20},${y - 20} ${i % 2 === 0 ? 110 : 10},${y}`}
                stroke="hsl(155,100%,62%)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 1.5 + i * 0.3 }}
              />
            ))}
          </svg>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative py-24">
        <div className="mx-auto max-w-5xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 font-display text-3xl font-bold text-foreground">
              Intelligent Agriculture
            </h2>
            <p className="text-muted-foreground">
              Powered by advanced machine learning and real-time environmental sensing
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="sensor-card p-8"
              >
                <div className="mb-4 inline-flex rounded-xl bg-accent/10 p-3">
                  <f.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
