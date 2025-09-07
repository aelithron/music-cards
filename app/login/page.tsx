import LoginForm from "./login.form";
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = await cookies();
  const server = cookieStore.get('jf_server');
  const token = cookieStore.get('jf_token');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-screen p-8 md:p-20">
      <div className="flex flex-col gap-2 items-center bg-violet-500 rounded-xl">
        <h1 className="text-3xl mt-4">Music Cards</h1>
        <p className="text-xl">A fun card-based interface for playing music from a Jellyfin server!</p>
        
      </div>
      <LoginForm />
    </div>
  );
}