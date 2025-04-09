import React, { createContext, useContext, useEffect, useState } from "react";
import Spinner from "../components/common/Spinner";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const { token } = useContext(AuthContext);
  const [originalUrl, setoriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [newShortUrl, setNewShortUrl] = useState("");
  const [links, setLinks] = useState([]);

  const fetchLinks = async () => {
    if (!token) {
      toast.error("Unauthorized! Please log in !");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/get-short-links`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success && Array.isArray(response.data.links)) {
        setLinks(response.data.links);
        setData(response.data.links);
      } else {
        setLinks([]);
        setData([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch links !");
      setLinks([]);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const createShortUrl = async () => {
    try {
      setLoading(true);
      const url = `${import.meta.env.VITE_APP_BASE_URL}/create-short-link`;

      const response = await axios.post(
        url,
        {
          originalUrl,
          customAlias,
          expiration: expirationDate,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setNewShortUrl(response.data.newLink);

        console.log(response.data.newLink);

        fetchLinks();
        toast.success(response.data.message || "Short URL created!");
        setoriginalUrl("");
        setCustomAlias("");
        setExpirationDate("");
      } else {
        toast.error("Unable to submit link !");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const redirectAndLog = async (shortId) => {
    try {
      const url = `${
        import.meta.env.VITE_APP_BASE_URL
      }/redirect-and-log/${shortId}`;

      const response = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      if (response.status === 200 && data.originalUrl) {
        window.location.href = data.originalUrl;
      } else {
        alert(data.message || "Redirection failed !");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const searchLink = async (query) => {
    if (!query.trim()) {
      setData(links);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/search-link`,
        {
          params: { query },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success && Array.isArray(response.data.link)) {
        setData(response.data.link);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error(error);
      setData([]);
      toast.error("Search failed !");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLinks();
    }
  }, [token]);

  const values = {
    loading,
    data,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    setData,
    fetchLinks,
    originalUrl,
    setoriginalUrl,
    customAlias,
    setCustomAlias,
    expirationDate,
    setExpirationDate,
    createShortUrl,
    newShortUrl,
    redirectAndLog,
    searchLink,
    links,
  };

  return (
    <AppContext.Provider value={values}>
      {loading ? <Spinner /> : children}
    </AppContext.Provider>
  );
};
