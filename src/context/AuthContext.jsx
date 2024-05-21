import React from "react";
import { useContext } from "react";
import { createContext, useState } from "react";
import { auth } from "../FireBase";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [message, setMessage] = useState("Hi i'm from the AuthContext");

  const value = {
    message,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
