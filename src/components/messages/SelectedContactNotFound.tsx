import { useContext, useState } from "react";
import { UserContext } from "../../UserContext";
import { GithubIcon, LinkedinIcon } from "lucide-react";

export default function SelectedContactNotFound() {
  const { user } = useContext(UserContext);
  const [isLinkedinHovered, setIsLinkedinHovered] = useState(false);
  const [isGithubHovered, setIsGithubHovered] = useState(false);

  return (
    <div className="flex h-full w-full flex-col justify-center items-center space-y-8">
      <p className="font-bold text-3xl">Hello, {user?.username}</p>
      <p className="text-slate-400 font-medium">
        Please, feel free to meet new people on ChatUP
      </p>
      <div className="flex gap-4">
        <button
          onMouseEnter={() => setIsLinkedinHovered(true)}
          onMouseLeave={() => setIsLinkedinHovered(false)}
          onClick={() => {
            window.open("https://www.linkedin.com/in/felipe-lino-developer/");
          }}
          className={`flex gap-2 border-slate-700 text-black p-4 transition duration-300 
            ${isGithubHovered ? "bg-slate-700 text-white" : ""} 
            hover:bg-slate-700 hover:text-white hover:border-slate-700`}
        >
          <LinkedinIcon /> Linkedin
        </button>
        <button
          onMouseEnter={() => setIsGithubHovered(true)}
          onMouseLeave={() => setIsGithubHovered(false)}
          onClick={() => {
            window.open("https://github.com/felipe-gl18");
          }}
          className={`flex gap-2 bg-slate-700 text-white p-4 transition duration-300 
            ${
              isLinkedinHovered
                ? "bg-transparent border-slate-700 text-slate-700"
                : ""
            } 
            hover:bg-transparent hover:text-slate-700 hover:border-slate-700`}
        >
          <GithubIcon /> GitHub Code
        </button>
      </div>
    </div>
  );
}
