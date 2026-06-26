import Star8Component from "@/components/stars/s8"

export const Star8 = ({
  size = 50,
  position = "top-0 left-0",
}: {
  size?: number
  position?: string
}) => {
  return (
    <Star8Component
      className={`absolute ${position} text-[var(--main)] z-[-1]`}
      size={size}
      stroke="black"
      strokeWidth={0}
    />
  )
}
