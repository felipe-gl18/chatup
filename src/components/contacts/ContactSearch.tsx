import { SearchIcon } from "lucide-react";
import { ChangeEvent, useRef } from "react";

export default function ContactSearch({
  handleContactFilter,
}: {
  handleContactFilter: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const handleSearchClick = () => {
    if (!searchInputRef.current) return;
    searchInputRef.current.focus();
  };
  return (
    <div
      className="flex flex-grow justify-between bg-gray-600 mx-8 my-8 py-4 px-4 rounded-md cursor-pointer"
      onClick={handleSearchClick}
    >
      <input
        ref={searchInputRef}
        type="text"
        name="contact"
        id="contact"
        placeholder="John Doe"
        className="bg-transparent outline-none text-white"
        onChange={handleContactFilter}
      />
      <SearchIcon className="text-white" />
    </div>
  );
}
