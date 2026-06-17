/**
 * Two-line quarterly axis label: Q1–Q4 on top, season name below.
 * Keeps labels readable without overlap in narrow chart columns.
 */
export function SeasonalAxisTick({
  x,
  y,
  payload,
  season,
  coldQuarter,
  mutedColor = '#9a939e',
  coldColor = '#b89bc4',
}) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        dy={14}
        textAnchor="middle"
        fill={coldQuarter ? coldColor : mutedColor}
        fontSize={11}
        fontWeight={coldQuarter ? 600 : 400}
      >
        {payload.value}
      </text>
      {season && (
        <text
          dy={26}
          textAnchor="middle"
          fill={coldQuarter ? '#9a7fa8' : '#7a7380'}
          fontSize={9}
        >
          {season}
        </text>
      )}
    </g>
  )
}
