import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={submit}>
      <h2>POS Login</h2>
      <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />
      <input type="password" placeholder="Password"
        onChange={e=>setPassword(e.target.value)} />
      <button>Login</button>
    </form>
  );
}
