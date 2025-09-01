import LoginForm from "./login.form";

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-screen p-8 md:p-20">
      <div className="flex flex-col gap-2 items-center bg-violet-500">

      </div>
      <LoginForm />
    </div>
  );
}