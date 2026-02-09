import React from "react";

export default function Button(props) {
  return (
    <button
    style={{backgroundColor:'indigo'}}
      className="w-full py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
      onClick={props.onClick}
      type={props.type}
    >
      {props.text}
    </button>
  );
}
