import axios from "axios";
import React from "react";

export default function Spot(props) {
  const handleSpotStatus = () => {
    let url;
    if (props.status === "available") {
      url = `/api/parking-tickets/reserve/${props.id}`;
    } else {
      url = `/api/parking-tickets/complete/${props.id}`;
    }

    axios
      .put(url, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        props.updateTicket(props.ticketId);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = () => {
    axios
    .delete(`/api/parking-tickets/${props.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      props.updateSpots(props.ticketId);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  return (
    <div className="relative spot-hover">
      <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow h-36">
        <i
          className={`fas fa-parking fa-2x ${
            props.status == "available" ? "text-green-500" : "text-red-500"
          }`}
        ></i>
        <span className="mt-2 text-sm text-gray-700">{props.ticketId}</span>
        <div className="self-end flex items-center gap-3 mt-5">
          {!props?.isAdmin &&
            ((props.status == "reserved" && props.show) ||
              props.status == "available") && (
              <button
                onClick={handleSpotStatus}
                className="px-1.5 py-0.5 rounded text-emerald-500 border border-emerald-500 hover:bg-emerald-500 hover:text-white text-sm"
              >
                {props.status == 'available' ? 'reserve' : 'end reservation'}
              </button>
            )}
          {props.isAdmin && (
            <button className="px-1.5 py-0.5 rounded text-red-500 border border-red-500 hover:bg-red-500 hover:text-white text-sm" onClick={handleDelete}>
              delete
            </button>
          )}
        </div>
      </div>
      {((props.status == "reserved") && (props.isAdmin || props.show)) && (
        <div className="spot-details">
          <div className="text-sm font-bold text-gray-800">{props.email}</div>
        </div>
      )}
    </div>
  );
}
