import { motion } from "framer-motion";

interface NutrientBarProps {
  label: string;
  value: number;
  max: number;
}

const NutrientBar = ({ label, value, max }: NutrientBarProps) => {
  const percent = Math.min((value / max) * 100, 100);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-32 w-8 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="gradient-bar absolute bottom-0 left-0 right-0"
          initial={{ height: 0 }}
          animate={{ height: `${percent}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
      <div className="text-center">
        <div className="font-display text-sm font-bold text-foreground">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
};

export default NutrientBar;
