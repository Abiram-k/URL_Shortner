import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CopyToClipboard } from "react-copy-to-clipboard";

interface HistoryProps {
  shortUrl: string;
}
interface HistoryItem {
  longUrl: string;
  shortCode: string;
  qrCode: string;
  _id: string;
  createdAt: string;
}

const History: React.FC<HistoryProps> = ({ shortUrl }) => {
  const user: string | null = localStorage.getItem("smolink_user");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/user/${user}`);
        console.log("URL DATA", data);
        setHistory(data?.data);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    })();
  }, [shortUrl]);
  return (
    <div className="mt-12">
      <h2
        className="text-3xl font-bold mb-6 text-[#00FF00]"
        data-text="HISTORY_LOG"
      >
        HISTORY _ LOG
      </h2>

      <div className="bg-black/90 backdrop-blur-sm border border-green-400/30 rounded-lg shadow-2xl shadow-green-500/20 p-6">
        {history.length ? (
          <ul className="space-y-4">
            {history.map((item, index) => (
              <li
                key={index}
                className="p-4 bg-black/60 border border-green-400/20 rounded-lg hover:border-green-400/40 transition-all group"
              >
                <div className="space-y-3">
                  {/* Original URL */}
                  <div>
                    <p className="font-mono text-green-400/80 text-sm mb-1">
                      [ORIGINAL_URL]
                    </p>
                    <div className="flex items-center gap-2">
                      <a
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-green-400 hover:text-green-300 underline break-all transition-colors flex-1"
                      >
                        {item.longUrl}
                      </a>
                      <CopyToClipboard text={item.longUrl}>
                        <button
                          onClick={() => toast.success("copied to clipboard")}
                          className="px-3 py-1.5 bg-green-400/10 border border-green-400/30 rounded-lg font-mono text-green-400 hover:bg-green-400/20 hover:border-green-400/50 transition-all duration-200"
                        >
                          COPY
                        </button>
                      </CopyToClipboard>
                    </div>
                  </div>

                  <div>
                    <p className="font-mono text-green-400/80 text-sm mb-1">
                      [SHORTENED_URL]
                    </p>
                    <div className="flex items-center gap-2">
                      <a
                        href={`${BASE_URL}/${item.shortCode}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-green-400 hover:text-green-300 underline break-all transition-colors flex-1"
                      >
                        {`${BASE_URL}/${item.shortCode}`}
                      </a>
                      <CopyToClipboard text={`${BASE_URL}/${item.shortCode}`}>
                        <button
                          onClick={() => toast.success("copied to clipboard")}
                          className="px-3 py-1.5 bg-green-400/10 border border-green-400/30 rounded-lg font-mono text-green-400 hover:bg-green-400/20 hover:border-green-400/50 transition-all duration-200"
                        >
                          COPY
                        </button>
                      </CopyToClipboard>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-green-400/60 text-sm">
                      [TIMESTAMP]
                    </span>
                    <span className="font-mono text-green-400/60 text-xs lg:text-sm block lg:inline ">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-green-400/5 opacity-0 group-hover:opacity-100 rounded-lg pointer-events-none transition-opacity"></div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 border-2 border-dashed border-green-400/20 rounded-lg">
            <p className="font-mono text-green-400/40 text-center">
              [NO_DATA] NO URLS WERE CONVERTED!
            </p>
          </div>
        )}
      </div>

      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-10 z-50 scanlines"></div>
    </div>
  );
};

export default History;
