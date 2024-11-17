import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Spot from "../components/Spot";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [spots, setSpots] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("/api/parking-tickets/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((response) => {
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

  const updateTicket = (ticketId) => {
    setSpots(prev => {
      return prev.map(item => {
        if (item.ticketId === ticketId) {
          if(item.status == 'reserved')
            return {
              ...item,
              status: 'available',
              user: null
            };

            return {
              ...item,
              status:'reserved',
              reservedBy: user
            }
        }
        return item;
      });
    });
  }


  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null)
    navigate("/login");
  };

  if(!user) return null

  return (
    <>
      <nav className="bg-white shadow-lg p-4">
        <div className="container mx-auto flex justify-between items-center">
          <a href="#" className="text-xl font-bold text-gray-800">
            Dashboard
          </a>
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-800">
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
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Parking Spots Overview
        </h1>
        <div className="grid grid-cols-4 gap-4">
        {spots.map((item) => {
            
            return (
              <Spot email={item.reservedBy?.email} show={user?._id === item.reservedBy?._id} updateTicket={updateTicket} id={item._id} ticketId={item.ticketId} status={item.status} isAdmin={user?.isAdmin} />
            );
          })}
        </div>
      </div>
    </>
  );
}
