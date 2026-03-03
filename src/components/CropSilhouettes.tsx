import { motion } from "framer-motion";

const CropSilhouettes = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
    <svg
      className="absolute bottom-0 left-0 h-[60%] w-full"
      viewBox="0 0 1200 400"
      fill="none"
      preserveAspectRatio="xMidYMax slice"
    >
      {/* Rice stalks */}
      <motion.g
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, delay: 0.5 }}
      >
        {[100, 130, 160].map((x, i) => (
          <g key={`rice-${i}`}>
            <line x1={x} y1={400} x2={x + 5} y2={250} stroke="hsl(155,100%,62%)" strokeWidth="2" />
            <ellipse cx={x + 5} cy={245} rx="4" ry="12" fill="hsl(155,100%,62%)" />
          </g>
        ))}
      </motion.g>

      {/* Papaya tree */}
      <motion.g
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 2.5, delay: 1 }}
        style={{ transformOrigin: "bottom" }}
      >
        <line x1="500" y1="400" x2="500" y2="180" stroke="hsl(155,100%,62%)" strokeWidth="4" />
        {[-40, -20, 0, 20, 40].map((angle, i) => (
          <line
            key={`leaf-${i}`}
            x1="500"
            y1={190}
            x2={500 + Math.cos((angle * Math.PI) / 30) * 60}
            y2={190 - Math.abs(Math.sin((angle * Math.PI) / 30) * 40) - 10}
            stroke="hsl(155,100%,62%)"
            strokeWidth="2"
          />
        ))}
        <circle cx="490" cy="220" r="6" fill="hsl(155,100%,62%)" />
        <circle cx="510" cy="230" r="5" fill="hsl(155,100%,62%)" />
      </motion.g>

      {/* Maize */}
      <motion.g
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, delay: 1.5 }}
      >
        <line x1="900" y1="400" x2="900" y2="200" stroke="hsl(155,100%,62%)" strokeWidth="3" />
        {[220, 260, 300, 340].map((y, i) => (
          <g key={`maize-leaf-${i}`}>
            <path
              d={`M900,${y} Q${i % 2 === 0 ? 950 : 850},${y - 15} ${i % 2 === 0 ? 960 : 840},${y + 5}`}
              stroke="hsl(155,100%,62%)"
              strokeWidth="2"
              fill="none"
            />
          </g>
        ))}
      </motion.g>
    </svg>
  </div>
);

export default CropSilhouettes;
