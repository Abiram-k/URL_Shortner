import React, { useState } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import { CopyToClipboard } from "react-copy-to-clipboard";
import History from "./History";
import toast from "react-hot-toast";
const BASE_URL = import.meta.env.VITE_BASE_URL;

interface UserType {
  isLoggedIn: boolean;
  email: string;
}
const ShortenForm = () => {
  const user: UserType = localStorage.getItem("smolink_user")
    ? JSON.parse(localStorage.getItem("smolink_user") as string)
    : null;
  const [url, setUrl] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>("");

  const validateURL = (input: string): boolean => {
    try {
      new URL(input);
      return true;
    } catch (error) {
      toast.error("Not a valid URL", { position: "top-center" });
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Login and Try again!", {
        position: "top-center",
        duration: 5000,
      });
      return;
    }

    // console.log(user);
    if (!validateURL(url)) return;
    if (!url.length) {
      toast.error("URL not found", { position: "top-center" });
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/shorten/${user.email}`, {
        longUrl: url,
      });
      setShortUrl(`${BASE_URL}/${res.data.shortCode}`);
      // setQrCode(res.data.qrCode);
      setUrl("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/20 to-black opacity-30 pointer-events-none"></div>

      <h1
        className="text-4xl lg:text-6xl text-center font-bold mb-12 neon-text glitch"
        data-text="URL_Shortener"
      >
        URL_Shortener
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 cyber-border">
        <div className="p-8 bg-black/90 backdrop-blur-sm border border-green-400/30 rounded-lg shadow-2xl shadow-green-500/20 flex flex-col justify-between h-full">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 flex flex-col flex-grow"
          >
            <div className="flex-grow flex flex-col justify-center">
              <div className="relative group mb-6">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="ENTER TARGET URL"
                  className="w-full px-6 py-4 bg-black/80 border-2 border-green-400/30 rounded-lg font-mono text-green-400 placeholder-green-600 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all"
                />
                <div className="absolute inset-0 rounded-lg bg-green-400/10 pointer-events-none group-hover:opacity-30 opacity-0 transition-opacity"></div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 lg:px-6 lg:py-3 bg-green-400/10 border-2 border-green-400/40 rounded-lg font-mono font-bold text-green-400 hover:bg-green-400/20 hover:border-green-400/60 hover:text-green-300 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="text-green-400">⫫⫫⫫</span>
                GENERATE SHORTLINK
                <span className="text-green-400">⫫⫫⫫</span>
              </button>
            </div>

            {shortUrl && (
              <div className="mt-6 p-4 bg-black/60 border border-green-400/20 rounded-lg">
                <p className="font-mono text-green-500/80 text-sm text-center animate-pulse">
                  [STATUS] <span>{user.email.split("@")[0].toUpperCase()}</span>{" "}
                  YOUR SHORTENED URL READY
                </p>
                <p className="font-mono text-green-400 text-center mt-2 break-all">
                  ⚡
                </p>
              </div>
            )}
          </form>
        </div>

        <div className="p-8 bg-black/90 backdrop-blur-sm border border-green-400/30 rounded-lg shadow-2xl shadow-green-500/20 h-[500px]">
          {shortUrl ? (
            <div className="h-full flex flex-col justify-between">
              <div className="p-4 bg-black/60 rounded-lg border border-green-400/20 flex items-center justify-center">
                <QRCode
                  value={shortUrl}
                  size={200}
                  bgColor="transparent"
                  fgColor="#00FF00"
                  className="transition-transform duration-300 hover:scale-110"
                />
              </div>

              <div className="space-y-4">
                <CopyToClipboard text={shortUrl}>
                  <button className="w-full px-6 py-3 bg-green-400/10 border-2 border-green-400/40 rounded-lg font-mono text-green-400 hover:bg-green-400/20 hover:border-green-400/60 transition-all duration-300 cursor-copy">
                    COPY:CLIPBOARD.exe
                  </button>
                </CopyToClipboard>

                <div className="p-4 bg-black/60 border border-green-400/20 rounded-lg break-all">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-green-400 hover:text-green-300 transition-colors"
                  >
                    {shortUrl.replace("https://", "")}
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 border-2 border-dashed border-green-400/20 rounded-lg">
              <span className="font-mono text-green-400/40 text-center">
                [AWAITING INPUT] <br />
                SHORTENED URL WILL APPEAR HERE
              </span>
            </div>
          )}
        </div>
      </div>

      {user?.isLoggedIn && <History shortUrl={shortUrl} />}

      <div className="fixed inset-0 pointer-events-none opacity-10 z-50 scanlines"></div>
    </div>
  );
};

export default ShortenForm;
