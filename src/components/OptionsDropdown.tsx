import { useContext, useRef } from "react";
import { EllipsisIcon, TrashIcon } from "lucide-react";
import { ContactsContext } from "../ContactsContext";

export default function OptionsDropdown() {
  const { selectedContact } = useContext(ContactsContext);
  const { handleDeleteContact } = useContext(ContactsContext);
  const optionsRef = useRef<HTMLDivElement>(null);
  const items = [
    {
      value: "Delete",
      Icon: <TrashIcon size={26} className="bg-transparent text-red-400" />,
      label: "Delete contact",
      action: () => {
        handleDeleteContact(selectedContact!.token);
      },
    },
  ];

  const handleOptions = (event: "out" | "in") => {
    if (!optionsRef.current) return;
    if (event == "in") {
      optionsRef.current.style.display = "flex";
    } else {
      optionsRef.current.style.display = "none";
    }
  };

  return (
    <div
      className="cursor-pointer relative"
      onMouseLeave={() => handleOptions("out")}
    >
      <div
        className="transition duration-300 p-2 rounded-full bg-slate-700 text-white"
        onMouseEnter={() => handleOptions("in")}
      >
        <EllipsisIcon />
      </div>
      <div
        ref={optionsRef}
        className="absolute hidden -left-40 shadow-md bg-white rounded  w-[200px] z-10"
      >
        {items.map((item) => (
          <button
            key={item.value}
            onClick={item.action}
            className="flex bg-transparent items-center gap-4"
          >
            {item.Icon}
            <p className="text-slate-500 font-black text-sm">{item.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
