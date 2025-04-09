import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";

export default function ShortUrlForm({ onSubmit }) {
  const {
    originalUrl,
    setoriginalUrl,
    customAlias,
    setCustomAlias,
    expirationDate,
    setExpirationDate,
    createShortUrl,
    newShortUrl,
  } = useContext(AppContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!originalUrl) {
      return alert("Please enter a valid URL");
    }
    createShortUrl();
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="w-full max-w-xl mx-auto mt-16 p-10 rounded-sm shadow-xl bg-white">
        <h2 className="text-2xl font-semibold mb-4 text-center text-[#252525]">
          Create a Short URL
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-sm mb-1 text-[#333]">
              Long URL
            </label>
            <input
              type="url"
              placeholder="https://example.com/long-url"
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none"
              value={originalUrl}
              onChange={(e) => setoriginalUrl(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium text-sm mb-1 text-[#333]">
              Custom Alias (Optional)
            </label>
            <input
              type="text"
              placeholder="custom-alias"
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium text-sm mb-1 text-[#333]">
              Expiration Date (Optional)
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none "
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#ff4141] text-white py-2 rounded-sm hover:bg-[#e63a3a] transition-colors"
          >
            Generate Short URL
          </button>
        </form>
      </div>

      {newShortUrl && (
        <div className="mt-6 p-4 border border-green-400 bg-green-50 text-green-800 rounded-sm text-center">
          <p className="text-sm font-medium mb-2">Generated Short URL:</p>
          <a
            href={newShortUrl.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all"
          >
            {newShortUrl.shortUrl}
          </a>
        </div>
      )}
    </div>
  );
}
