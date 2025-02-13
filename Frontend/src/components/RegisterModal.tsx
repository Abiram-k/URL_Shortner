import axios from "axios";
import { useEffect, useRef, useState } from "react";
const BASE_URL = import.meta.env.VITE_BASE_URL;
import toast from "react-hot-toast";
import { Dispatch, SetStateAction } from "react";

interface RegisterResponse {
  message: string;
  email?: string;
}
interface RegisterPropType {
  modalType?: string;
  isOpen: boolean;
  handleSession?: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
}
interface ErrorType {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
const RegisterModal = ({
  isOpen,
  onClose,
  modalType,
  // handleSession,
}: RegisterPropType) => {
  const modalRef = useRef<any>(null);
  const [formData, setFormData] = useState<ErrorType>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    let newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (): Promise<void> => {
    console.log(validateForm());
    // if () {
    if (modalType == "Register" && validateForm()) {
      try {
        const { data } = await axios.post<RegisterResponse>(
          `${BASE_URL}/register`,
          formData
        );
        console.log(data);
        localStorage.setItem(
          "smolink_user",
          JSON.stringify({ isLoggedIn: true, email: data.email })
        );
        onClose();
        window.location.reload();
        // handleSession(true);
        // toast.success(data.message || "Registration Successful!");
      } catch (error) {
        toast.error("Something went wrong!");
      }
    } else {
      try {
        const { data } = await axios.post<RegisterResponse>(
          `${BASE_URL}/login`,
          formData
        );
        console.log(data);
        localStorage.setItem(
          "smolink_user",
          JSON.stringify({ isLoggedIn: true, email: data.email })
        );
        onClose();
        // handleSession(true);
        window.location.reload();
        // toast.success(data.message || "Login Successful!");
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Something went wrong!");
      }
    }

    // }
  };

  // Close modal when clicking outside
  useEffect(() => {
    setErrors({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="bg-black/80 rounded-lg p-8 w-96 shadow-2xl shadow-green-500/20 border-2 border-green-400/30"
      >
        <h2 className="text-2xl font-bold text-green-400 text-center mb-6 font-mono">
          {modalType?.toUpperCase()}
        </h2>
        {modalType === "Register" && (
          <div className="mb-4">
            <label className="block text-green-400 font-medium font-mono mb-2">
              NAME
            </label>
            <div className="relative group">
              <input
                type="text"
                placeholder="ENTER YOUR NAME"
                onChange={handleChange}
                name="name"
                className="w-full px-4 py-2 bg-black/60 border-2 border-green-400/30 rounded-lg font-mono text-green-400 placeholder-green-600 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all"
              />
              <div className="absolute inset-0 rounded-lg bg-green-400/10 pointer-events-none group-hover:opacity-30 opacity-0 transition-opacity"></div>
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm font-mono mt-1">
                {errors.name}
              </p>
            )}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-green-400 font-medium font-mono mb-2">
            EMAIL
          </label>
          <div className="relative group">
            <input
              type="email"
              placeholder="ENTER YOUR EMAIL"
              onChange={handleChange}
              name="email"
              className="w-full px-4 py-2 bg-black/60 border-2 border-green-400/30 rounded-lg font-mono text-green-400 placeholder-green-600 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all"
            />
            <div className="absolute inset-0 rounded-lg bg-green-400/10 pointer-events-none group-hover:opacity-30 opacity-0 transition-opacity"></div>
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm font-mono mt-1">
              {errors.email}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-green-400 font-medium font-mono mb-2">
            PASSWORD
          </label>
          <div className="relative group">
            <input
              type="password"
              placeholder="ENTER YOUR PASSWORD"
              onChange={handleChange}
              name="password"
              className="w-full px-4 py-2 bg-black/60 border-2 border-green-400/30 rounded-lg font-mono text-green-400 placeholder-green-600 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all"
            />
            <div className="absolute inset-0 rounded-lg bg-green-400/10 pointer-events-none group-hover:opacity-30 opacity-0 transition-opacity"></div>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm font-mono mt-1">
              {errors.password}
            </p>
          )}
        </div>
        {modalType === "Register" && (
          <div className="mb-4">
            <label className="block text-green-400 font-medium font-mono mb-2">
              CONFIRM PASSWORD
            </label>
            <div className="relative group">
              <input
                type="password"
                placeholder="ENTER PASSWORD AGAIN"
                onChange={handleChange}
                name="confirmPassword"
                className="w-full px-4 py-2 bg-black/60 border-2 border-green-400/30 rounded-lg font-mono text-green-400 placeholder-green-600 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all"
              />
              <div className="absolute inset-0 rounded-lg bg-green-400/10 pointer-events-none group-hover:opacity-30 opacity-0 transition-opacity"></div>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm font-mono mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        )}

        <button
          className="w-full px-6 py-3 bg-green-400/10 border-2 border-green-400/40 rounded-lg font-mono font-bold text-green-400 hover:bg-green-400/20 hover:border-green-400/60 hover:text-green-300 transition-all duration-300 flex items-center justify-center gap-2 mt-6"
          onClick={handleSubmit}
        >
          <span className="text-green-400">⫫⫫⫫</span>
          {modalType?.toUpperCase()}
          <span className="text-green-400">⫫⫫⫫</span>
        </button>
      </div>
    </div>
  );
};

export default RegisterModal;
