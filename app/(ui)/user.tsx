"use client"
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { logOutUserAction } from "../login/authAction";
import { useRouter } from "next/navigation";

export function UserProfile({ user, server }: { user: UserDto, server: string }) {
  const router = useRouter();
  function logOut() {
    logOutUserAction();
    router.push("/login");
  }
  return (
    <div className="absolute flex gap-2 bg-slate-300 dark:bg-slate-700 p-1 rounded-xl items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={getPfpUrl(server, user.Id!)} height={50} width={50} alt={`Profile picture of user ${user.Name}`} className="rounded-full" />
      <p className="text-lg">{user.Name}</p>
      <button onClick={() => logOut()} className="hover:text-sky-500"><FontAwesomeIcon icon={faSignOut} /></button>
    </div>
  )
}

export function getPfpUrl(server: string, userId: string) {
  if (/\/$/.test(server)) {
    return `${server}Users/${userId}/Images/Primary`;
  } else {
    return `${server}/Users/${userId}/Images/Primary`;
  }
}