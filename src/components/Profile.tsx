import { UserIcon } from "lucide-react";

export default function Profile() {
  return (
    <div className="lg:flex md:flex hidden flex-shrink-0 items-center">
      <div className="p-6 rounded-full bg-white text-black shadow-lg">
        <UserIcon />
      </div>
    </div>
  );
}
