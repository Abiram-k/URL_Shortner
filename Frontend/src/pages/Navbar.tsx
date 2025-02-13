import { useState } from "react";
import RegisterModal from "../components/RegisterModal";

interface UserType {
  isLoggedIn: boolean;
  name: string;
}
const Navbar = () => {
  const [isOpen, setIsopen] = useState(false);
  const [isLogIn, setIsLoggin] = useState(false);
  const user: UserType = localStorage.getItem("smolink_user")
    ? JSON.parse(localStorage.getItem("smolink_user") as string)
    : null;
  // const [session, setSession] = useState(false);

  const handleIsopen = (type?: boolean) => {
    if (type == true || type == false) setIsLoggin(type);
    setIsopen((prev) => !prev);
  };

  return (
    <nav className=" px-10  text-[#00FF00] bg-black  p-4 flex justify-between items-center border-b-gray-700 border-b-2">
      <h1
        className="text-xl font-bold  cursor-pointer"
        onClick={() => window.location.reload()}
      >
        Smolink
      </h1>
      {!user?.isLoggedIn ? (
        <div className="flex gap-4">
          <button
            className=" border-2  cursor-pointer border-green-500   bg-[#00FF00]  text-black px-4 py-2 rounded-lg font-medium "
            name="login"
            onClick={() => {
              // () => setIsLoggin(true);
              handleIsopen(true);
            }}
          >
            Login
          </button>
          <button
            name="Regester"
            className=" border-2 border-green-500 text-black  bg-[#00FF00]   cursor-pointer  px-4 py-2 rounded-lg font-medium "
            onClick={() => {
              // () => setIsLoggin(false);
              handleIsopen(false);
            }}
          >
            Register
          </button>
        </div>
      ) : (
        <button
          name="Regester"
          className=" border-2 border-green-500 text-black  bg-[#00FF00]  cursor-pointer  px-4 py-2 rounded-lg font-medium "
          onClick={() => {
            localStorage.removeItem("smolink_user");
            // setSession(false);
            window.location.reload();
          }}
        >
          Logout
        </button>
        // <h2 className="text-gray-700 font-medium">Welcome {user.name} !</h2>
      )}
      {isLogIn ? (
        <RegisterModal
          isOpen={isOpen}
          onClose={handleIsopen}
          // handleSession={setSession}
          modalType="Login"
        />
      ) : (
        <RegisterModal
          isOpen={isOpen}
          // handleSession={setSession}
          onClose={handleIsopen}
          modalType="Register"
        />
      )}
    </nav>
  );
};

export default Navbar;
