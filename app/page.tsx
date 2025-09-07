import { jellyfin } from "@/client";
import { getUserApi } from "@jellyfin/sdk/lib/utils/api";
import { cookies } from "next/headers";
import { UserProfile } from "./(ui)/user";

export default async function Page() {
  const cookieStore = await cookies();
  const server = cookieStore.get('jf_server')!.value;
  const api = jellyfin.createApi(server, cookieStore.get('jf_token')!.value);
  const user = await getUserApi(api).getCurrentUser();

  return (
    <div className="flex flex-col min-h-screen p-8 md:p-20">
      <UserProfile user={user.data} server={server} />
    </div>
  );
}