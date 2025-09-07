"use client"
import { jellyfin } from "@/client";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getUserApi } from "@jellyfin/sdk/lib/utils/api";
import { useState } from "react"
import { logInUserAction } from "./authAction";
import { useRouter } from "next/navigation";
import { getPfpUrl } from "../(ui)/user";

const formClassName = "bg-slate-500 border-2 px-2 py-1 border-slate-300 dark:border-slate-700 rounded-xl mb-4";
export default function LoginForm() {
  const router = useRouter();
  const [server, setServer] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isValidServer, setValidServer] = useState<boolean>(false);
  const [publicUsers, setPublicUsers] = useState<{ name: string, id: string, hasImage: boolean }[]>([]);

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
    // note: i stopped checking passwords in the form event, since jellyfin users can have empty passwords
    logInUserAction(username, password, server)
      .then((result) => {
        if (result.success) {
          router.push("/");
        } else {
          alert(`Jellyfin login failed${result.message ? `: "${result.message}"` : "!"}`);
        }
      })
  }
  function apiSetPublicUsers(address: string) {
    const api = jellyfin.createApi(address);
    getUserApi(api).getPublicUsers()
      .then((users) => {
        if (!users) return;
        const usersToPush = [];
        for (const user of users.data) {
          usersToPush.push({ name: user.Name || "Unknown Name", id: user.Id!, hasImage: user.PrimaryImageTag ? true : false });
          setPublicUsers(usersToPush);
        }
      });
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
        <div className={`${formClassName} flex gap-2`}>
          {publicUsers.length < 1 && <p>No public users found!</p>}
          {publicUsers.map((user, index) => <button type="button" key={index} className="flex gap-2 align-middle" onClick={() => setUsername(user.name)}>
            {user.hasImage ?
              // eslint-disable-next-line @next/next/no-img-element
              <img src={getPfpUrl(server, user.id)} height={30} width={30} alt={`Profile picture of user ${user.name}`} className="rounded-full" /> :
              <div className="w-[30px] h-[30px] rounded-full bg-violet-300" />
            }
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