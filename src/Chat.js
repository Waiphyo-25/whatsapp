import { Avatar, IconButton } from "@material-ui/core";
import {
  AttachFile,
  InsertEmoticon,
  MoreVert,
  SearchOutlined,
  TramRounded,
} from "@material-ui/icons";
import MicIcon from "@material-ui/icons/Mic";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Chat.css";
import db from "./firebase";
import { useStateValue } from "./StateProvider";
import firebase from "firebase";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import Linkify from "react-linkify";
import { ReactMic } from "react-mic";
import StopIcon from "@material-ui/icons/Stop";

function Chat() {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]); //for chat rooms
  const [{ user }, dispatch] = useStateValue();
  const [{ photoURL }] = useStateValue();
  const [emoji, setEmoji] = useState(false);
  const [mic, setMic] = useState(true);
  const [letseenPhoto, setLetSeenPhoto] = useState("");

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((shapshot) => setRoomName(shapshot.data().name));

      //for chat room
      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [roomId]);

  //for avatar icons
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  //for Mic
  const addMic = (e) => {
    let mic = e.true;
    setInput(input + mic);
  };
  const stopRecord = () => {
    if (mic) {
      setMic(true);
    }
  };

  //for emoji
  const addEmoji = (e) => {
    let emoji = e.native;
    setInput(input + emoji);
  };
  const checkEmojiClose = () => {
    if (emoji) {
      setEmoji(false);
    }
  };
  //for lastSeen photo
  useEffect(() => {
    setLetSeenPhoto(messages[messages.length - 1]?.photoURL);
  }, [messages]);

  //for send button
  const sendMessage = (e) => {
    e.preventDefault();
    console.log("You Typedd >>>>", input);

    //it come from firebase database
    db.collection("rooms")
      .doc(roomId)
      .collection("messages")
      .add({
        message: input,
        name: user.displayName, //is coming from google auth
        timestamp: firebase.firestore.FieldValue.serverTimestamp() || null,
        photoURL: localStorage.getItem("photoURL"),
      });
    setInput("");
  };

  console.log("letseenPhoto : ", letseenPhoto);
  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={letseenPhoto} />
        <div className="chat__headerInfo">
          <h3> {roomName}</h3>
          <p className="header__lastSeen">
            last seen {""}
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toUTCString()}
          </p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {messages.map((message) => (
          <p
            className={`chat__message ${
              message.name === user.displayName && "chat__receiver"
            }`}
          >
            <span className="chat__name"> {message.name}</span>
            <Linkify>{message.message} </Linkify>
            <span className="chat__timestamp">
              {new Date(message.timestamp?.toDate()).toUTCString()}
            </span>
          </p>
        ))}
      </div>
      <div className="chat__footer">
        <IconButton>
          <InsertEmoticon className="yellow" onClick={() => setEmoji(!emoji)} />
          {emoji ? <Picker onSelect={addEmoji} /> : null}
        </IconButton>

        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onClick={checkEmojiClose}
            type="text"
            placeholder="Type a message"
          />
          <button type="submit" onClick={sendMessage}>
            Send a message
          </button>
        </form>
        <IconButton>
          <MicIcon />
          {/* <MicIcon onClick={() => setMic(mic)} />
          {mic ? <ReactMic record={addMic} /> : true}
          <StopIcon onClick={() => stopRecord(mic)} />
          {mic ? <ReactMic onStop={stopRecord(mic)} /> : false} */}
        </IconButton>
      </div>
    </div>
  );
}

export default Chat;
