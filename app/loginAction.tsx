"use server";
import { jellyfin } from "@/client";
import { cookies } from 'next/headers'

export async function logInUserAction(username: string, password: string, server: string): Promise<{ success: boolean, message: string | null }> {
  const api = jellyfin.createApi(server);
  let res;
  try {
    res = await api.authenticateUserByName(username, password);
  } catch {
    return { success: false, message: null }
  }
  if (res.status.toString().startsWith("2")) {
    const cookieStore = await cookies();
    console.log(api.accessToken);
    cookieStore.set("jf_token", api.accessToken);
    return { success: true, message: res.statusText };
  } else return { success: false, message: res.statusText };
}