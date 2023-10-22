/* eslint-disable no-empty */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import PortalLayout from "../layout/PortalLayout";
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/authConstants";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export default function Dashboard() {
  const auth = useAuth();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [value, setValue] = useState("");

  async function getTodos() {
    const accessToken = auth.getAccessToken();
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const json = await response.json();
        setTodos(json);
        console.log(json);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function createTodo() {
    if (value.length > 3) {
      try {
        const response = await fetch(`${API_URL}/posts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.getAccessToken()}`,
          },
          body: JSON.stringify({ title: value }),
        });
        if (response.ok) {
          const todo = (await response.json()) as Todo;
          setTodos([...todos, todo]);
        }
      } catch (error) {}
    }
  }

  useEffect(() => {
    getTodos();
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    createTodo();
  }

  return (
    <PortalLayout>
      <div className="dashboard">
        <h1> Tablero de {auth.getUser()?.name ?? ""}</h1>
        <div className="input-container">
        <form onSubmit={handleSubmit}>
          <input
              type="text"
              className="input-field"
            placeholder="Escribe aquí tu nueva tarea!"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            />
            <label htmlFor="input-field" className="input-label"> Escribiendo...</label>
            <span className="input-highlight"></span>
          </form>
        </div>
        {todos.map((post: Todo) => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.completed}</p>
          </div>
        ))}
      </div>
    </PortalLayout>
  );
}
