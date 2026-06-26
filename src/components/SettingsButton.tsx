import { useEffect, useState } from "react"
import { Button } from "@/components/retroui/Button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Settings } from "lucide-react"
import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore"
import { bankRef, db, transactionsRef } from "@/firebase"

export const SettingsButton = ({
  bankCode,
  role,
  setView,
}: {
  bankCode: string
  role: "bank" | "player"
  setView: (view: "lobby" | "bank" | "player") => void
}) => {
  const [colorTheme, setColorTheme] = useState(
    localStorage.getItem("pocket-io::theme") || "purple-theme",
  )

  useEffect(() => {
    document.documentElement.classList.add(colorTheme)
  }, [colorTheme])

  const handleColorThemeChange = (
    e: React.MouseEvent<HTMLDivElement>,
    newTheme: string,
  ) => {
    e.preventDefault()
    document.documentElement.classList.remove(colorTheme)
    document.documentElement.classList.add(newTheme)
    localStorage.setItem("pocket-io::theme", newTheme)
    setColorTheme(newTheme)
  }

  const handleResetBank = async () => {
    const bankRef = doc(db, "pocket.io", bankCode)
    const bankDoc = await getDoc(bankRef)

    await updateDoc(bankDoc.ref, {
      players: bankDoc
        .data()
        ?.players.map((player: { name: string; balance: number }) => ({
          ...player,
          balance: bankDoc.data()?.startingBalance,
        })),
    })

    await addDoc(transactionsRef(bankCode), {
      payee: "Bank",
      payer: "Reset",
      amount: bankDoc.data()?.startingBalance,
      createdAt: Timestamp.now(),
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon">
          <Settings className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 ml-6">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuCheckboxItem
            checked={colorTheme === "red-theme"}
            className={`red-sample my-1 ${colorTheme === "red-theme" ? "border-1 border-border" : ""}`}
            onClick={(e) => handleColorThemeChange(e, "red-theme")}
          >
            <span>Red</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={colorTheme === "orange-theme"}
            className={`orange-sample my-1 ${colorTheme === "orange-theme" ? "border-1 border-border" : ""}`}
            onClick={(e) => handleColorThemeChange(e, "orange-theme")}
          >
            <span>Orange</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={colorTheme === "yellow-theme"}
            className={`yellow-sample my-1 ${colorTheme === "yellow-theme" ? "border-1 border-border" : ""}`}
            onClick={(e) => handleColorThemeChange(e, "yellow-theme")}
          >
            <span>Yellow</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={colorTheme === "green-theme"}
            className={`green-sample my-1 ${colorTheme === "green-theme" ? "border-1 border-border" : ""}`}
            onClick={(e) => handleColorThemeChange(e, "green-theme")}
          >
            <span>Green</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={colorTheme === "blue-theme"}
            className={`blue-sample my-1 ${colorTheme === "blue-theme" ? "border-1 border-border" : ""}`}
            onClick={(e) => handleColorThemeChange(e, "blue-theme")}
          >
            <span>Blue</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={colorTheme === "purple-theme"}
            className={`purple-sample my-1 ${colorTheme === "purple-theme" ? "border-1 border-border" : ""}`}
            onClick={(e) => handleColorThemeChange(e, "purple-theme")}
          >
            <span>Purple</span>
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>

        <DropdownMenuLabel>General</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {role === "bank" && (
            <>
              <DropdownMenuCheckboxItem
                checked={colorTheme === "orange-theme"}
                className={`my-1 ${colorTheme === "orange-theme" && "border-1 border-border"}`}
                onClick={handleResetBank}
              >
                <span>Reset bank</span>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={colorTheme === "yellow-theme"}
                className={`my-1 ${colorTheme === "yellow-theme" && "border-1 border-border"}`}
                onClick={async () => {
                  await deleteDoc(bankRef(bankCode))
                  setView("lobby")
                }}
              >
                <span>Delete bank (forever)</span>
              </DropdownMenuCheckboxItem>
            </>
          )}
          <DropdownMenuCheckboxItem
            checked={colorTheme === "red-theme"}
            className={`my-1 ${colorTheme === "red-theme" && "border-1 border-border"}`}
            onClick={() => setView("lobby")}
          >
            <span>Go to lobby</span>
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
