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
    <Card className="w-[calc(100%-20px)] max-w-3xl h-full m-4">
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

      <Card.Content className="flex flex-col items-center justify-center px-4">
        {role !== "bank" && (
          <>
            <Badge>
              <span className="text-xl font-bold">Balance: ${balance}</span>
            </Badge>
            <hr className="w-full my-4 border-black/50 dark:border-white/50" />
          </>
        )}
        <Badge className="py-1" variant="neutral">
          <span className="text-xl font-bold">Send: ${sendAmount}</span>
        </Badge>

        <Keypad
          balance={balance}
          sendAmount={sendAmount}
          setSendAmount={setSendAmount}
        />

        <hr className="w-full my-5 border-black/50 dark:border-white/50" />

        <TransactionLog id={bankCode} />
      </Card.Content>
    </Card>
  )
}
