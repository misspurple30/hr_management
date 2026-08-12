interface DepartmentSlice {
  id: string;
  name: string;
  color: string;
  count: number;
}

interface DepartmentDistributionChartProps {
  data: DepartmentSlice[];
}

const SIZE = 160;
const STROKE_WIDTH = 20;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function DepartmentDistributionChart({ data }: DepartmentDistributionChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-neutral-400">
        Aucune donnée de répartition disponible
      </div>
    );
  }

  let cumulative = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8">
      <div className="relative flex-shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={STROKE_WIDTH}
          />
          {data.map((d) => {
            const fraction = d.count / total;
            const dash = fraction * CIRCUMFERENCE;
            const offset = cumulative;
            cumulative += dash;
            return (
              <circle
                key={d.id}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke={d.color}
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
                strokeDashoffset={-offset}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-display font-bold text-white">{total}</span>
          <span className="text-[10px] uppercase tracking-wider text-neutral-400">Employés</span>
        </div>
      </div>

      <div className="flex-1 w-full space-y-3">
        {data.map((d) => (
          <div key={d.id} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-neutral-300 truncate font-medium">{d.name}</span>
            </div>
            <span className="text-white font-semibold flex-shrink-0">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
