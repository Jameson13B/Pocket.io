import { useEffect, useState } from "react"

import { Badge } from "@/components/retroui/Badge"
import { Keypad } from "@/components/Keypad"
import { Card } from "@/components/retroui/Card"
import { TransactionLog } from "@/components/TransactionLog"
import { SettingsButton } from "@/components/SettingsButton"
import { SendButton } from "@/components/SendButton"
import { onSnapshot } from "firebase/firestore"
import { bankRef } from "@/firebase"

export const WalletView = ({
  bankCode,
  name,
  role,
  setView,
}: {
  bankCode: string
  name: string
  role: "bank" | "player"
  setView: (view: "lobby" | "bank" | "player") => void
}) => {
  const [balance, setBalance] = useState(0)
  const [sendAmount, setSendAmount] = useState(0)

  useEffect(() => {
    if (bankCode) {
      const unsub = onSnapshot(bankRef(bankCode), (snapshot) => {
        const players = snapshot.data()?.players

        setBalance(
          role === "bank"
            ? "10000"
            : players.find((player: { name: string }) => player.name === name)
                .balance,
        )
      })

      return () => unsub()
    }
  }, [bankCode, name, role])

  return (
    <Card className="flex h-full max-h-[calc(100vh-2rem)] min-h-0 w-full max-w-3xl flex-col overflow-hidden">
      <Card.Header className="flex flex-row justify-between border-b border-black/50 dark:border-white/50 px-4 sm:px-8">
        <SettingsButton bankCode={bankCode} role={role} setView={setView} />
        <div className="flex flex-col items-center justify-center text-center">
          <Card.Title className="text-xl font-bold">Pocket.io</Card.Title>
          <p className="text-xs text-muted-foreground">{name || "Guest"}</p>
        </div>
        <SendButton
          bankCode={bankCode}
          disabled={sendAmount === 0}
          name={name}
          role={role}
          sendAmount={sendAmount}
          setSendAmount={setSendAmount}
        />
      </Card.Header>

      <Card.Content className="flex min-h-0 flex-1 flex-col items-center overflow-hidden px-4">
        <div className="flex flex-row gap-2 items-center justify-center w-full">
          {role !== "bank" && (
            <Badge className="py-1">
              <span className="text-lg font-bold">Balance: ${balance}</span>
            </Badge>
          )}
          <Badge className="py-1" variant="neutral">
            <span className="text-lg font-bold">Send: ${sendAmount}</span>
          </Badge>
        </div>

        <Keypad
          balance={balance}
          sendAmount={sendAmount}
          setSendAmount={setSendAmount}
        />

        <hr className="w-full mt-5 mb-3 border-black/50 dark:border-white/50" />

        <TransactionLog id={bankCode} />
      </Card.Content>
    </Card>
  )
}
