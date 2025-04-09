import React, { createContext, useState, useEffect } from "react";
import Spinner from "../components/common/Spinner";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  const userLogin = async () => {
    try {
      setLoading(true);
      const url = `${import.meta.env.VITE_APP_BASE_URL}/user-login`;

      const response = await axios.post(url, { email, password });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        setEmail("");
        setPassword("");
        toast.success("Login successful!");
        navigate("/short-url");
      } else {
        toast.error("Invalid credentials!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setToken(null);
    toast.success("Logout successful!");
    navigate("/");
  };

  const isLoggedIn = () => !!token;

  const values = {
    loading,
    email, setEmail,
    password, setPassword,
    userLogin,
    token,
    logoutUser,
    isLoggedIn,
  };

  return (
    <AuthContext.Provider value={values}>
      {loading ? <Spinner /> : children}
    </AuthContext.Provider>
  );
};
