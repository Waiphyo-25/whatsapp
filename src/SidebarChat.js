import { Avatar, IconButton } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import "./SidebarChat.css";
import db from "./firebase";
import { Link } from "react-router-dom";
import firebase from "firebase";
import { password } from "./Constants";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import EditIcon from "@material-ui/icons/Edit";

function SidebarChat({ id, name, addNewChat }) {
  const [seed, setSeed] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [id]);

  //for Avatar Icon
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  // for delete chat room
  const deleteChatRoom = () => {
    db.collection("rooms")
      .doc(id)
      .delete()
      .then(() => {
        window.location = "/";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //for create new chat room
  const createChat = () => {
    const roomName = prompt("Please enter name for chat room");
    if (roomName) {
      //do some clever database stuff....
      db.collection("rooms").add({
        //rooms is coming from firebase
        name: roomName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  };

  return !addNewChat ? (
    <div className="sidebarChat">
      <Link to={`/rooms/${id}`}>
        <div className="sidebarChat__wrapper">
          <Avatar
            src={`https://avatars.dicebear.com/api/avataaars/${seed}.svg`}
          />
          <div className="sidebarChat__info">
            <h2 className="room__name"> {name}</h2>
            <p className="sidebar__lestmessages__color">
              {messages[0]?.message}
            </p>
          </div>
        </div>
      </Link>
      <div className="sidebarChat__updateIcon">
        <EditIcon className="update__icon updateIcon" />
        <DeleteForeverIcon
          onClick={deleteChatRoom}
          className="sidebarChat__delete updateIcon"
        />
      </div>
    </div>
  ) : (
    <div className="sidebarChat addnew__chat" onClick={createChat}>
      <h2> Add New Chat</h2>
      <AddCircleIcon />
    </div>
  );
}

export default SidebarChat;
