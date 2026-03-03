import { motion } from "framer-motion";

interface ProbabilityBarProps {
  label: string;
  value: number;
  rank: number;
}

const ProbabilityBar = ({ label, value, rank }: ProbabilityBarProps) => (
  <div className="flex items-center gap-4">
    <span className="w-24 text-right text-sm font-medium text-foreground">{label}</span>
    <div className="relative h-6 flex-1 overflow-hidden rounded bg-muted">
      <motion.div
        className="gradient-bar absolute inset-y-0 left-0"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.2, delay: rank * 0.2, ease: "easeOut" }}
        style={{
          opacity: rank === 0 ? 1 : 0.4 + (1 - rank * 0.15),
        }}
      />
    </div>
    <span className="w-16 text-right font-display text-sm font-bold text-foreground">
      {value}%
    </span>
  </div>
);

export default ProbabilityBar;
