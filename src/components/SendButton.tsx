import { useEffect, useState } from "react"
import { Button } from "@/components/retroui/Button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { Send } from "lucide-react"
import {
  addDoc,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore"
import { bankRef, db, transactionsRef } from "@/firebase"

export const SendButton = ({
  bankCode = "",
  disabled = false,
  name,
  role,
  sendAmount,
  setSendAmount,
}: {
  bankCode: string
  disabled: boolean
  name: string
  role: "bank" | "player"
  sendAmount: number
  setSendAmount: (amount: number) => void
}) => {
  const [recipients, setRecipients] = useState([])
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(
    null,
  )

  useEffect(() => {
    if (bankCode) {
      const unsub = onSnapshot(bankRef(bankCode), (snapshot) => {
        const players = snapshot
          .data()
          ?.players.map((player: { name: string }) => player.name)
          .filter((player: string) => player !== name)

        if (role === "player") {
          players.unshift("The Bank")
        }
        setRecipients(players)
      })

      return () => unsub()
    }
  }, [bankCode, role, name])

  const sendMoney = async () => {
    const bankRef = doc(db, "pocket.io", bankCode)
    const bankDoc = await getDoc(bankRef)

    toast.promise(
      Promise.all([
        updateDoc(bankDoc.ref, {
          players: bankDoc
            .data()
            ?.players?.map((player: { name: string; balance: number }) => {
              return {
                ...player,
                balance:
                  player.name === selectedRecipient
                    ? player.balance + sendAmount
                    : player.balance - sendAmount,
              }
            }),
        }),
        addDoc(transactionsRef(bankCode), {
          payee: selectedRecipient,
          payer: name,
          amount: sendAmount,
          createdAt: Timestamp.now(),
        }),
      ]),
      {
        loading: "Sending money...",
        success: "Money sent successfully",
        error: "Failed to send money",
      },
    )

    setSelectedRecipient(null)
    setSendAmount(0)
  }

  return (
    <DropdownMenu onOpenChange={(open) => !open && setSelectedRecipient(null)}>
      <DropdownMenuTrigger asChild>
        <Button disabled={disabled} size="icon">
          <Send className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-6">
        <DropdownMenuLabel>Send To</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {recipients.map((recipient) => (
            <DropdownMenuItem
              className="w-full flex flex-row items-center justify-between"
              key={recipient}
              data-recipient={recipient}
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                if (selectedRecipient === recipient) sendMoney()
                else {
                  e.preventDefault()
                  setSelectedRecipient(recipient)
                }
              }}
            >
              <span>{recipient}</span>
              {selectedRecipient === recipient && (
                <Send className="size-4 self-end" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
