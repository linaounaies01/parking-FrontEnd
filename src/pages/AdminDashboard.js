import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Spot from "../components/Spot";

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [spots, setSpots] = useState([]);
  const [ticketId, setTicketId] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("/api/parking-tickets/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setSpots(response.data);
      });
  }, []);

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
    const { value } = e.target;
    setTicketId(value);
  };

  const handleSubmit = (e) => {
    axios
      .post(
        "/api/parking-tickets",
        {
          ticketId: ticketId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setTicketId("");
      });
  };

  const updateTicket = (ticketId) => {
    setSpots(prev => {
      return prev.map(item => {
        if (item.ticketId === ticketId) {
          return {
            ...item,
            status: item.status === 'reserved' ? 'available' : 'reserved'
          };
        }
        
        return item;
      });
    });
  }

  const updateSpots = (ticketId) => {
    setSpots(prev => {
      return prev.filter(item => item.ticketId != ticketId)
    })  
  }

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
            Dashboard - Admin
          </a>
          <div className="flex items-center space-x-4">
            <Link
              to={user?.isAdmin ? "/admin-dashboard" : "/dashboard"}
              className="text-gray-600 hover:text-gray-800"
            >
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

      <div className="container mx-auto mt-8 p-4">
        <div className="lg:w-1/3 md:w-2/3 mx-auto">
          <form className="flex flex-wrap" onSubmit={handleSubmit}>
            <div className="p-2 w-full">
              <div className="relative">
                <label
                  htmlFor="ticketId"
                  className="leading-7 text-sm text-gray-600"
                >
                  Spot No
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  id="ticketId"
                  name="ticketId"
                  value={ticketId}
                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <div className="p-2 w-full">
              <button className="flex mx-auto bg-indigo-600 hover:bg-indigo-700 text-white border-0 py-1 px-5 focus:outline-none rounded text-lg">
                Submit
              </button>
            </div>
          </form>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Parking Spots Overview
        </h1>
        <div className="grid grid-cols-4 gap-4">
        {spots.map((item) => {
            
            return (
              <Spot updateSpots={updateSpots} email={item.reservedBy?.email} show={user?._id === item.reservedBy?._id} updateTicket={updateTicket} id={item._id} ticketId={item.ticketId} status={item.status} isAdmin={user?.isAdmin} />
            );
          })}
        </div>
      </div>
    </>
  );
}
