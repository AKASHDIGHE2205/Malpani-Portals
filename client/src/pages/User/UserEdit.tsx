/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { editUser } from "../../services/auth/authApi";

interface Props {
  show: boolean;
  setShow: (show: boolean) => void;
  fetchData: () => void;
  selectedUser: any;
}

const UserEdit: FC<Props> = ({ show, setShow, fetchData, selectedUser }) => {
  const [input, setInput] = useState({
    id: 0,
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    role: "",
    user_type: "",
    loc_id: "",
    status: "",
  });

  useEffect(() => {
    if (selectedUser) {
      setInput({
        id: selectedUser.id || 0,
        password: "",
        first_name: selectedUser.first_name || "",
        last_name: selectedUser.last_name || "",
        email: selectedUser.email || "",
        mobile: selectedUser.mobile || "",
        role: selectedUser.role || "",
        user_type: selectedUser.user_type || "",
        loc_id: selectedUser.loc_id || "",
        status: selectedUser.status || "",
      });
    }
  }, [selectedUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      id: input.id,
      password: input.password || undefined,
      first_name: input.first_name,
      last_name: input.last_name,
      email: input.email,
      mobile: input.mobile,
      role: input.role,
      user_type: input.user_type,
      loc_id: input.loc_id || null,
      status: input.status,
    };
    try {
      await editUser(body);
      setInput({
        id: 0,
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        role: "",
        user_type: "",
        loc_id: "",
        status: "",
      });
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setShow(false);
      fetchData();
    }
  };

  return (
    <div
      id="user-edit-modal"
      className={`fixed top-0 left-0 z-[80] w-full h-full overflow-x-hidden bg-slate-500 bg-opacity-50 ${
        show ? "" : "hidden"
      }`}
      role="dialog"
      aria-labelledby="user-edit-modal-label"
    >
      <div className="flex justify-center items-center min-h-screen m-2">
        <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="flex justify-between items-center py-3 px-4 border-b dark:border-slate-700">
            <h3 id="user-edit-modal-label" className="font-bold text-slate-800 dark:text-white">
              Edit User
            </h3>
            <button
              type="button"
              className="p-2 rounded-full bg-slate-200 dark:bg-slate-700"
              onClick={() => setShow(false)}
            >
              <IoMdClose color="black" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div>
                <label htmlFor="first_name">
                  First Name: <span className="text-red-600 text-xl">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  className="mt-2 py-3 px-4 block w-full border-slate-200 rounded-lg text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                  placeholder="Enter first name..."
                  value={input.first_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="last_name">Last Name:</label>
                <input
                  type="text"
                  name="last_name"
                  className="mt-2 py-3 px-4 block w-full border-slate-200 rounded-lg text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                  placeholder="Enter last name..."
                  value={input.last_name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email">
                  Email: <span className="text-red-600 text-xl">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className="mt-2 py-3 px-4 block w-full border-slate-200 rounded-lg text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                  placeholder="Enter email..."
                  value={input.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="mobile">
                  Mobile: <span className="text-red-600 text-xl">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  className="mt-2 py-3 px-4 block w-full border-slate-200 rounded-lg text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                  placeholder="Enter mobile..."
                  value={input.mobile}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  name="password"
                  className="mt-2 py-3 px-4 block w-full border-slate-200 rounded-lg text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                  placeholder="Enter new password..."
                  value={input.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="loc_id">Location ID:</label>
                <input
                  type="number"
                  name="loc_id"
                  className="mt-2 py-3 px-4 block w-full border-slate-200 rounded-lg text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                  placeholder="Enter location ID..."
                  value={input.loc_id}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="role">
                  Role: <span className="text-red-600 text-xl">*</span>
                </label>
                <select
                  name="role"
                  className="mt-2 py-3 px-4 block w-full border-slate-200 rounded-lg text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                  value={input.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select role</option>
                  <option value="Master">Master</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="User">User</option>
                </select>
              </div>

              <div>
                <label htmlFor="user_type">
                  User Type: <span className="text-red-600 text-xl">*</span>
                </label>
                <select
                  name="user_type"
                  className="mt-2 py-3 px-4 block w-full border-slate-200 rounded-lg text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                  value={input.user_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select user type</option>
                  <option value="Master">Master</option>
                  <option value="Store">Store</option>
                  <option value="Post">Post</option>
                  <option value="Saragam">Saragam</option>
                </select>
              </div>

              <div>
                <label htmlFor="status">
                  Status: <span className="text-red-600 text-xl">*</span>
                </label>
                <select
                  name="status"
                  className="mt-2 py-3 px-4 block w-full border-slate-200 rounded-lg text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                  value={input.status}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select status</option>
                  <option value="A">Active</option>
                  <option value="I">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center gap-4 items-center py-3 px-4 border-t dark:border-slate-700">
              <button
                type="submit"
                className="py-3 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 focus:outline-hidden focus:bg-green-700 disabled:opacity-50 disabled:pointer-events-none"
              >
                Update
              </button>
              <button
                type="button"
                className="py-3 px-6 inline-flex text-sm bg-slate-200 font-medium text-slate-900 dark:bg-slate-700 dark:text-white rounded-lg"
                onClick={() => setShow(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserEdit;