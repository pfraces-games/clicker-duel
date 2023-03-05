import { useState } from "react";

export default function Login({ onLogin }) {
  const [userName, setUserName] = useState("");

  return (
    <div className="Login">
      <h2>Login</h2>
      Name:{" "}
      <input
        type="text"
        value={userName}
        onChange={(e) => {
          setUserName(e.target.value);
        }}
      />
      <button
        onClick={() => {
          onLogin(userName);
        }}
      >
        Login
      </button>
    </div>
  );
}
