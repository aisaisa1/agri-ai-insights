import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const statusItems = [
  "Data Normalized",
  "Model Loaded",
  "Explanation Generated",
];

const StatusPanel = () => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 1 }}
    className="glass-card p-4"
  >
    <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
      <div className="status-dot" />
      Sensor Sync Status
    </div>
    <div className="space-y-2">
      {statusItems.map((item, i) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 + i * 0.3 }}
          className="flex items-center gap-2 text-sm text-foreground"
        >
          <CheckCircle2 className="h-4 w-4 text-accent" />
          {item}
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default StatusPanel;
