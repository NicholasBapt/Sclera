import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen w-full p-4 pl-21">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="pl-4 py-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
