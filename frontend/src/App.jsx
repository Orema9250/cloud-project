import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // fetch backend status
  useEffect(() => {
    fetch("http://localhost:3000/api/status")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  // create user function
  const createUser = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email })
      });

      const result = await res.json();
      console.log("User created:", result);

      alert("User created successfully!");

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Frontend Connected to Backend</h1>

      {/* Backend status */}
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}

      <hr />

      {/* Create user form */}
      <h2>Create User</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />

      <button onClick={createUser}>
        Create User
      </button>
    </div>
  );
}

export default App;
