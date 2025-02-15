import { ChangeEvent, FormEvent, useContext, useRef, useState } from "react";
import { UserContext } from "../../UserContext";
import { ImageIcon } from "lucide-react";

export default function Authentication() {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { setUser } = useContext(UserContext);

  const [formValues, setFormValues] = useState({
    name: "",
    phonenumber: "",
    img: "",
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUser(formValues);
  };

  const handleImageIconClick = () => {
    if (!imageInputRef.current) return;
    imageInputRef.current.click();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const images = event.target.files;
    if (!images) return;
    const image = images[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormValues((previousFormValues) => {
        return { ...previousFormValues, img: reader.result as string };
      });
    };
    reader.readAsDataURL(image);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          ChatUP
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 cursor-pointer"
              htmlFor="name"
            >
              Username
            </label>
            <input
              name="name"
              id="name"
              type="text"
              placeholder="Enter your name"
              value={formValues.name}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setFormValues((prev) => ({ ...prev, name: event.target.value }))
              }
              className="outline-none mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 cursor-pointer"
              htmlFor="phonenumber"
            >
              Phone number
            </label>
            <input
              name="phonenumber"
              id="phonenumber"
              type="text"
              placeholder="Enter your phone number"
              value={formValues.phonenumber}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setFormValues((prev) => ({
                  ...prev,
                  phonenumber: event.target.value,
                }))
              }
              className="outline-none mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            />
          </div>
          <div className="flex items-center">
            <input
              ref={imageInputRef}
              onChange={handleImageChange}
              className="hidden"
              type="file"
              name=""
              id=""
              accept="image/png, image/jpeg, image/jpg"
            />
            <div
              className="text-white bg-slate-400 p-2 rounded-full cursor-pointer transition duration-300 hover:bg-slate-700 hover:text-white"
              onClick={handleImageIconClick}
            >
              <ImageIcon />
            </div>
          </div>
          <button className="w-full rounded-lg bg-slate-600 px-4 py-2 text-white transition hover:bg-slate-700">
            Next
          </button>
        </form>
      </div>
    </div>
  );
}
