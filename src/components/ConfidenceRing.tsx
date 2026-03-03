import { motion } from "framer-motion";

interface ConfidenceRingProps {
  value: number;
  label: string;
  size?: number;
}

const ConfidenceRing = ({ value, label, size = 180 }: ConfidenceRingProps) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = value / 100;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow backdrop */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, hsl(155 100% 62% / 0.15) 0%, transparent 70%)`,
          }}
        />
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#confidence-gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
            style={{ filter: "drop-shadow(0 0 10px hsl(155 100% 62% / 0.5))" }}
          />
          <defs>
            <linearGradient id="confidence-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(155 100% 62%)" />
              <stop offset="100%" stopColor="hsl(155 62% 15%)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="glow-text font-display text-3xl font-bold text-foreground"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {value}%
          </motion.span>
          <span className="text-xs text-muted-foreground">confidence</span>
        </div>
      </div>
      <span className="font-display text-sm font-semibold text-primary">{label}</span>
    </div>
  );
};

export default ConfidenceRing;
