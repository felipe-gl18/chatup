import { createContext, Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";

export type User = {
  username: string;
  email: string;
  token: string;
};

type UserContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  socket: Socket | null;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  socket: null,
});
