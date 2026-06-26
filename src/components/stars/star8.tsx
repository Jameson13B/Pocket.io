import Star8Component from "@/components/stars/s8"

const colors = {
  red: "oklch(67.28% 0.2147 24.22)",
  orange: "oklch(72.27% 0.1894 50.19)",
  yellow: "oklch(86.03% 0.176 92.36)",
  green: "oklch(79.76% 0.2044 153.08)",
  blue: "oklch(67.47% 0.1726 259.49)",
  purple: "oklch(60.78% 0.1595 283.96)",
}

export const Star8 = ({
  color,
  size = 50,
  position = "top-0 left-0",
}: {
  color: string
  size?: number
  position?: string
}) => {
  return (
    <Star8Component
      className={`absolute ${position} text-[var(--main)]`}
      size={size}
      stroke="black"
      strokeWidth={0}
    />
  )
}
