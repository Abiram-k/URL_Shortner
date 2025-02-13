import "./App.css";
import ShortenForm from "./pages/ShortenForm";
import Navbar from "./pages/Navbar";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      <ShortenForm />
    </>
  );
}

export default App;
