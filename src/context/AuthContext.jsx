import React from "react";
import { useContext } from "react";
import { createContext } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = () => {
  return <div>AuthContext</div>;
};
