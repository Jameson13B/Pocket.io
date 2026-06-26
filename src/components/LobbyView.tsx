import { useState } from "react"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { Play } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/retroui/Button"
import { Card } from "@/components/retroui/Card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { SettingsButton } from "@/components/SettingsButton"
import { db } from "@/firebase"
import { Star8 } from "./stars/star8"

const saveLocalStorage = (
  bankCode: string,
  role: "bank" | "player",
  name?: string,
) => {
  localStorage.setItem("pocket-io::last-bank-code", bankCode)
  localStorage.setItem("pocket-io::last-role", role)
  if (name) localStorage.setItem("pocket-io::last-name", name)
}

export const LobbyView = ({
  bankCode,
  name,
  role,
  setBankCode,
  setName,
  setRole,
  setView,
}: {
  bankCode: string
  name: string
  role: "bank" | "player" | ""
  setBankCode: (bankCode: string) => void
  setName: (name: string) => void
  setRole: (role: "bank" | "player" | "") => void
  setView: (view: "lobby" | "bank" | "player") => void
}) => {
  const [startingBalance, setStartingBalance] = useState<number>(0)
  const [billFactor, setBillFactor] = useState<"$1" | "$100" | "$1000">("$1")

  const handleGoClick = async () => {
    const bankRef = doc(db, "pocket.io", bankCode)
    const bankDoc = await getDoc(bankRef)

    if (role === "bank") {
      const wasBankLastRound =
        localStorage.getItem("pocket-io::last-role") === "bank"
      const sameCodeLastRound =
        localStorage.getItem("pocket-io::last-bank-code") === bankCode

      if (bankDoc.exists() && wasBankLastRound && sameCodeLastRound) {
        toast.info("Resuming existing bank...")
        setView(role as "bank" | "player")
      } else {
        toast.promise(
          setDoc(bankRef, {
            players: [],
            bankCode: bankCode,
            billFactor: billFactor,
            startingBalance: startingBalance,
          }),
          {
            loading: `Creating new bank ${bankCode}...`,
            success: `Bank ${bankCode} created successfully`,
            error: `Failed to create bank ${bankCode}`,
          },
        )
        saveLocalStorage(bankCode, role as "bank" | "player")
        setView(role as "bank" | "player")
      }
    } else if (role === "player") {
      const data = bankDoc.data()
      const playerAlreadyExists =
        data?.players?.some(
          (player: { name: string }) => player.name === name,
        ) ?? false

      if (bankDoc.exists()) {
        if (!playerAlreadyExists) {
          toast.promise(
            updateDoc(bankDoc.ref, {
              players: [
                ...(data?.players ?? []),
                { name, balance: data?.startingBalance },
              ],
            }),
            {
              loading: `Joining bank ${bankCode} as ${name}...`,
              success: `Joined bank ${bankCode} as ${name}`,
              error: `Failed to join bank ${bankCode} as ${name}`,
            },
          )
          saveLocalStorage(bankCode, role as "bank" | "player", name)
          setView(role as "bank" | "player")
        } else {
          toast.info(`Resuming as ${name}...`)
          setView(role as "bank" | "player")
        }
      }
    } else {
      return
    }
  }

  return (
    <Card className="flex h-full max-h-[calc(100vh-2rem)] min-h-0 w-full max-w-3xl flex-col overflow-hidden">
      <Card.Header className="flex flex-row justify-between border-b border-black/50 dark:border-white/50 px-4 sm:px-8">
        <SettingsButton
          bankCode={bankCode}
          role={role as "bank" | "player"}
          setView={setView}
        />
        <div className="flex flex-col items-center justify-center text-center">
          <Card.Title className="text-xl font-bold">Pocket.io</Card.Title>
          <p className="text-xs text-muted-foreground">Board game wallet</p>
        </div>
        <Button
          disabled={
            role === "" ||
            (role === "player" &&
              (bankCode.length === 0 || name.length === 0)) ||
            (role === "bank" &&
              (bankCode.length === 0 || startingBalance === null))
          }
          size="icon"
          onClick={handleGoClick}
        >
          <Play className="size-5" />
        </Button>
      </Card.Header>

      <Card.Content className="relative flex min-h-0 flex-1 flex-col items-center overflow-hidden px-4">
        <div className="grid w-full max-w-[250px] items-center gap-1.5 mb-4">
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full max-w-[250px]">
              <SelectValue placeholder="Select a mode..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="player">Player</SelectItem>
                <SelectItem value="bank">Bank</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="grid w-full max-w-[250px] items-center gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            disabled={role === "bank"}
            type="text"
            id="name"
            placeholder="Name"
            value={role === "bank" ? "The Bank" : name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <hr className="w-full my-5 border-black/50 dark:border-white/50" />

        {/* Player Form */}
        {role === "player" && (
          <div className="grid w-full max-w-[250px] items-center gap-1.5 mb-4">
            <Label htmlFor="bank-code">Bank code</Label>
            <Input
              type="text"
              id="bank-code"
              placeholder="Bank Code"
              value={bankCode}
              onChange={(e) => setBankCode(e.target.value)}
            />
          </div>
        )}

        {/* Bank Form */}
        {role === "bank" && (
          <>
            <div className="grid w-full max-w-[250px] items-center gap-1.5 mb-4">
              <Label htmlFor="new-bank-code">Create a bank code</Label>
              <Input
                type="text"
                id="new-bank-code"
                placeholder="Bank Code"
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
              />
            </div>

            <div className="grid w-full max-w-[250px] items-center gap-1.5 mb-4">
              <Label htmlFor="starting-balance">Starting balance</Label>
              <div className="relative">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 select-none">
                  $
                </span>
                <Input
                  className="pl-6"
                  type="number"
                  min={0}
                  id="starting-balance"
                  placeholder="Starting Balance"
                  value={startingBalance}
                  onChange={(e) => setStartingBalance(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid w-full max-w-[250px] items-center gap-1.5 mb-4">
              <Label htmlFor="bill-factor">Bill factor</Label>
              <Select
                value={billFactor}
                onValueChange={(value) =>
                  setBillFactor(value as "$1" | "$100" | "$1000")
                }
              >
                <SelectTrigger className="w-full max-w-[250px]">
                  <SelectValue placeholder="Bill factor..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="$1">$1</SelectItem>
                    <SelectItem value="$100">$100</SelectItem>
                    <SelectItem value="$1000">$1000</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <Star8 position="bottom-0 right-1" size={75} />
        <Star8 position="bottom-9 right-18" />
        <Star8 position="bottom-20 right-12" size={35} />
        <Star8 position="bottom-[13%] left-[-45px]" size={250} />
        <Star8 position="bottom-[45%] left-[45%] z-[-1]" size={350} />
      </Card.Content>
    </Card>
  )
}
