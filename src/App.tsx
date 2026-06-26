import { useState } from "react"
import "./App.css"
import { WalletView } from "./components/WalletView"
import { LobbyView } from "./components/LobbyView"
import { Toaster } from "./components/ui/sonner"

function App() {
  const [view, setView] = useState("lobby")
  const [name, setName] = useState("")
  const [role, setRole] = useState<"bank" | "player" | "">("")
  const [bankCode, setBankCode] = useState<string>("")

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {view === "lobby" && (
        <LobbyView
          bankCode={bankCode}
          name={name}
          role={role}
          setBankCode={setBankCode}
          setName={setName}
          setRole={setRole}
          setView={setView}
        />
      )}
      {view === "bank" && (
        <WalletView
          bankCode={bankCode}
          name="The Bank"
          role="bank"
          setView={setView}
        />
      )}
      {view === "player" && (
        <WalletView
          bankCode={bankCode}
          name={name}
          role="player"
          setView={setView}
        />
      )}
      <Toaster position="bottom-center" />
    </div>
  )
}

export default App

// TODO:
// - Add ability for host to also be a player
