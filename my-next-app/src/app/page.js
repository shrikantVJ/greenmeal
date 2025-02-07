// /pages/index.jsx (or /pages/home.jsx, depending on your file structure)
import Image from "next/image";
import AdminPage from "../app/admin/page"; // Updated import path

export default function Home() {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      
      {/* Rendering the AdminPage component */}
      <AdminPage />
    </div>
  );
}
