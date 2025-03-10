import { ReactNode, useEffect, useState } from "react";
import { User, UserContext } from "./UserContext";
import { io, Socket } from "socket.io-client";

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (user) {
      const socketInstance = io(import.meta.env.VITE_WS_URL);

      // emitting a register event to the websocket
      socketInstance.emit("register", user);

      // listening when a new user is on the application
      socketInstance.on("newUser", () => {
        // emitting an event to get the users but the currently one
        socketInstance.emit("getUsers", user.token);
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        socket,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
