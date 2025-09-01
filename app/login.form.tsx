"use client"
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react"

const formClassName = "bg-slate-500 border-2 px-2 py-1 border-slate-300 dark:border-slate-700 rounded-xl mb-4";
export default function LoginForm() {
  const [server, setServer] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isValidServer, setValidServer] = useState<boolean>(false);
  const publicUsers: Map<string, string> = new Map();

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!server) {
      alert("Please enter a server address!");
      return;
    }
    // todo: check if the server is correct/valid
    // todo: fill all public users
    setValidServer(true);
  }
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!password) {
      alert("Please enter a password!");
      return;
    }
  }

  return (
    <div className="flex flex-col p-8 text-lg">
      <h1 className="mb-4 text-4xl font-semibold text-center">Log in to Jellyfin</h1>
      <form onSubmit={handleContinue} className="flex flex-col">
        <label htmlFor="server">Server Address</label>
        <input id="server" value={server} onChange={(e) => setServer(e.target.value)} className={`${formClassName} ${isValidServer ? "text-slate-300" : ""}`} disabled={isValidServer} />
        {!isValidServer && <button type="submit" className="rounded-full bg-violet-500 p-1"><FontAwesomeIcon icon={faChevronRight} /></button>}
      </form>
      {isValidServer && <form className="flex flex-col" onSubmit={handleLogin}>

        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={formClassName} />
        <button type="submit" className="rounded-full bg-violet-500 p-1"><FontAwesomeIcon icon={faChevronRight} /></button>
      </form>}
    </div>
  )
}