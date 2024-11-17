import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = () => {
      const token = localStorage.getItem("token");
      axios
        .get("/api/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUser();
  }, [location.pathname]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    axios
      .put("/api/auth/user", { email: form.email },  {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setForm({ email: "", password: "" });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    axios
      .put("/api/auth/user/password", { password: form.password },  {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setForm({ email: "", password: "" });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if(!user) return null

  return (
    <>
      <nav className="bg-white shadow-lg p-4">
        <div className="container mx-auto flex justify-between items-center">
          <a href="#" className="text-xl font-bold text-gray-800">
            Dashboard {user?.isAdmin && '- Admin'}
          </a>
          <div className="flex items-center space-x-4">
          <Link to={user?.isAdmin ? "/admin-dashboard" : "/dashboard"} className="text-gray-600 hover:text-gray-800">
              Dashboard
            </Link>
            <Link to="/settings" className="text-gray-600 hover:text-gray-800">
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <div className="w-full flex items-center justify-center py-24">
        <div className="flex w-full max-w-[850px] space-x-3 border py-20 shadow">
          <div className="w-full flex flex-col items-center max-w-xl gap-10 m-auto">
            <h3 className="text-sm font-bold">Update your settings</h3>
            <form
              className="w-full flex items-center gap-2"
              onSubmit={handleEmailSubmit}
            >
              <div className="relative w-full">
                <input
                  type="text"
                  id="contact-form-email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded flex-1 appearance-none border border-gray-300 py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none"
                  placeholder="Email"
                />
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  className="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                >
                  Save
                </button>
              </div>
            </form>
            <form
              className="w-full flex items-center gap-2"
              onSubmit={handlePasswordSubmit}
            >
              <div className="relative w-full">
                <input
                  type="password"
                  id="contact-form-password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded flex-1 appearance-none border border-gray-300 py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base outline-none"
                  placeholder="Password"
                />
              </div>
              <div className="col-span-2 text-right">
                <button
                  type="submit"
                  className="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
