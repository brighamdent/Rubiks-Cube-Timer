import React from "react";
import { useAuth } from "../context/AuthContext";

export const Signup = () => {
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    const email = e.target.email.value;
    const passwordConfirm = e.target.passwordConfirm.value;
    const password = e.target.password.value;

    try {
      // await signup(email, password);
      console.log(email);
      console.log(password);
    } catch (error) {}
  };
  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Email</p>
          <input type="text" name="email" required />
        </label>
        <label>
          <p>Password</p>
          <input type="password" name="password" required />
        </label>
        <label>
          <p>Password Confirm</p>
          <input type="password" name="passwordConfirm" required />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};
