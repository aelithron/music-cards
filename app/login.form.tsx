"use client"
import { jellyfin } from "@/client";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getUserApi } from "@jellyfin/sdk/lib/utils/api";
import { useState } from "react"

const formClassName = "bg-slate-500 border-2 px-2 py-1 border-slate-300 dark:border-slate-700 rounded-xl mb-4";
export default function LoginForm() {
  const [server, setServer] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isValidServer, setValidServer] = useState<boolean>(false);
  const publicUsers: { name: string, id: string }[] = [];

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!server) {
      alert("Please enter a server address!");
      return;
    }
    jellyfin.discovery.getRecommendedServerCandidates(server)
      .then((servers) => {
        const bestServer = jellyfin.discovery.findBestServer(servers);
        if (!bestServer) {
          alert("No Jellyfin server found! Please try again.");
          return;
        }
        apiSetPublicUsers(bestServer.address);
        setServer(bestServer.address);
        setValidServer(true);
      })
  }
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!username) {
      alert("Please enter a username!");
      return;
    }
    // note: i stopped checking passwords since jellyfin users can have empty passwords
  }
  function apiSetPublicUsers(address: string) {
    const api = jellyfin.createApi(address);
    getUserApi(api).getPublicUsers()
      .then((users) => {
        if (!users) return;
        for (const user of users.data) {
          console.log(user);
          publicUsers.push({ name: user.Name || "Unknown Name", id: user.Id! });
        }
      })
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
        <div className={formClassName}>
          {publicUsers.length < 1 && <p>No public users found!</p>}
          {publicUsers.map((user, index) => <button key={index} className="flex gap-2" onClick={() => setUsername(user.name)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${server}/Users/${user.id}/Images/Primary`} height={30} width={30} alt={`Profile picture of user ${user.name}`} />
            <p>{user.name}</p>
          </button>)}
        </div>
        <label htmlFor="username">Username</label>
        <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className={formClassName} />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={formClassName} />
        <button type="submit" className="rounded-full bg-violet-500 p-1"><FontAwesomeIcon icon={faChevronRight} /></button>
      </form>}
    </div>
  )
}