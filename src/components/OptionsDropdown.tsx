import { EllipsisIcon, TrashIcon, XIcon } from "lucide-react";
import { useContext, useState } from "react";
import { MainContext } from "../MainContext";

export default function OptionsDropdown() {
  const { contacts, setContacts, currentReciever } = useContext(MainContext);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const items = [
    {
      value: "Delete",
      Icon: <TrashIcon size={26} className="bg-transparent text-red-400" />,
      label: "Delete contact",
      action: () => {
        setContacts(
          contacts.filter(
            (contact) => contact.phonenumber != currentReciever.phonenumber
          )
        );
      },
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="transition duration-300 p-2 rounded-full bg-slate-700 text-white"
      >
        {isOpen ? <XIcon /> : <EllipsisIcon />}
      </button>
      {isOpen && (
        <div className="absolute -left-40 shadow-md bg-white rounded mt-2 w-[200px] z-10">
          {items.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                item.action();
                setIsOpen(!isOpen);
              }}
              className="flex bg-transparent items-center gap-4"
            >
              {item.Icon}
              <p className="text-slate-500 font-black text-sm">{item.label}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
