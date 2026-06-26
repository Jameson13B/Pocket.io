import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { transactionsRef } from "@/firebase"
import { onSnapshot, Timestamp } from "firebase/firestore"
import { ArrowRight, Clock } from "lucide-react"
import { Label } from "./ui/label"

export const TransactionLog = ({ id }: { id: string }) => {
  const [transactions, setTransactions] = useState<
    { payee: string; payer: string; amount: number; createdAt: Timestamp }[]
  >([])

  useEffect(() => {
    if (id) {
      const unsub = onSnapshot(transactionsRef(id), (snapshot) => {
        setTransactions(
          snapshot.docs
            .map(
              (doc) =>
                doc.data() as {
                  payee: string
                  payer: string
                  amount: number
                  createdAt: Timestamp
                },
            )
            .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds),
        )
      })

      return () => unsub()
    }
  }, [id])

  return (
    <>
      <Label className="mb-2 text-base">Transaction Log</Label>
      <ScrollArea className="min-h-0 w-full max-w-[350px] flex-1 rounded-base border-2 border-border bg-main px-4 py-1 text-main-foreground shadow-shadow">
        {transactions.length === 0 && (
          <div className="flex flex-col items-center justify-center">
            <p className="text-muted-foreground">No transactions yet</p>
          </div>
        )}
        {transactions.map((transaction) => (
          <div
            className="flex flex-row items-center justify-between border-b border-black/50 dark:border-white/50 py-2 last:border-b-0"
            key={transaction.createdAt.toDate().getTime()}
          >
            <div className="flex flex-col items-start justify-between">
              <div className="flex flex-row items-center font-bold text-[1.1rem]">
                {transaction.payee}
                <ArrowRight className="size-4 mx-2" />
                {transaction.payer}
              </div>
              <span className="text-[0.65rem] text-muted-foreground ml-1 flex items-center">
                <Clock className="size-2 mx-1 inline-block text-muted-foreground" />
                Sent at: {transaction.createdAt.toDate().getHours() % 12 || 12}:
                {transaction.createdAt
                  .toDate()
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}
                :
                {transaction.createdAt
                  .toDate()
                  .getSeconds()
                  .toString()
                  .padStart(2, "0")}
              </span>
            </div>
            <div className="text-[1.3rem] font-bold">${transaction.amount}</div>
          </div>
        ))}
      </ScrollArea>
    </>
  )
}
