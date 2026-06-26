import { Button } from "@/components/retroui/Button"

const buttons = [
  {
    amount: 1,
    label: "$1",
  },
  {
    amount: 2,
    label: "$2",
  },
  {
    amount: 5,
    label: "$5",
  },
  {
    amount: 10,
    label: "$10",
  },
  {
    amount: 20,
    label: "$20",
  },
  {
    amount: 50,
    label: "$50",
  },
]

export const Keypad = ({
  balance,
  sendAmount,
  setSendAmount,
}: {
  balance: number
  sendAmount: number
  setSendAmount: (amount: number) => void
}) => {
  const handleAmountBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (sendAmount + Number(e.currentTarget.dataset.amount) > balance) return

    setSendAmount(Number(e.currentTarget.dataset.amount) + sendAmount)
  }
  const handleClearBtnClick = () => setSendAmount(0)

  return (
    <div className="flex flex-row items-center justify-center flex-wrap gap-4 mt-7">
      {buttons.map((button) => (
        <Button
          key={button.amount}
          className="w-[calc(33.33%-16px)] h-12"
          data-amount={button.amount}
          onClick={handleAmountBtnClick}
        >
          <span className="text-lg">{button.label}</span>
        </Button>
      ))}
      <Button
        className="w-[calc(100%-20px)] h-10"
        onClick={handleClearBtnClick}
      >
        <span className="text-lg">Clear</span>
      </Button>
    </div>
  )
}
