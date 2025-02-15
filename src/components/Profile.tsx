import { useContext } from "react";
import { UserContext } from "../UserContext";

export default function Profile() {
  const { user } = useContext(UserContext);
  return (
    <div className="flex flex-shrink-0 items-center">
      <div
        className={`flex-shrink-0 w-[60px] h-[60px] rounded-full`}
        style={{
          backgroundImage: `url(${user?.img})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundSize: "cover",
          imageRendering: "auto",
        }}
      ></div>
    </div>
  );
}
