import React, { useState, useEffect } from 'react';
import './Chat.scss';
import { Avatar, IconButton } from '@material-ui/core';
import {
  AttachFile,
  MoreVert,
  SearchOutlined,
  Mic,
  InsertEmoticon,
} from '@material-ui/icons';
import { useParams } from 'react-router-dom';
import db from '../../Auth/firebase';
import { useCustomHookStateValue } from '../../Context/StateProvider';
import firebase from 'firebase';

function Chat() {
  const [avatarKey, setAvatarKey] = useState('');
  const [inputMsg, setInputMsg] = useState('');
  const [roomName, setRoomName] = useState('');
  const [messages, setMessages] = useState([]);
  const { roomId } = useParams();
  const cssPrefix = 'chat';
  const [{ user }, dispatch] = useCustomHookStateValue();

  useEffect(() => {
    if (roomId) {
      db.collection('rooms')
        .doc(roomId)
        .onSnapshot(snapshot => {
          setRoomName(snapshot.data().name);
        });

      db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .orderBy('timeStamp', 'asc')
        .onSnapshot(snapshot => {
          setMessages(snapshot.docs.map(doc => doc.data()));
        });
    }
  }, [roomId]);

  useEffect(() => {
    setAvatarKey(Math.floor(Math.random() * 5000));
  }, []);

  const sendMesssge = e => {
    e.preventDefault();
    if (inputMsg.trim().length) {
      db.collection('rooms').doc(roomId).collection('messages').add({
        message: inputMsg,
        name: user.displayName,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
    setInputMsg('');
  };

  return (
    <div className={cssPrefix}>
      <div className={`${cssPrefix}__header`}>
        <Avatar
          src={`https://avatars.dicebear.com/api/human/${avatarKey}.svg`}
        />
        <div className={`${cssPrefix}__headerInfo`}>
          <h3> {roomName} </h3>
          <p>
            Last seen at
            {` ${new Date(
              messages[messages.length - 1]?.timeStamp?.toDate(),
            ).toUTCString()}`}
          </p>
        </div>
        <div className={`${cssPrefix}__headerRight`}>
          <IconButton aria-label="">
            <SearchOutlined />
          </IconButton>
          <IconButton aria-label="">
            <AttachFile />
          </IconButton>
          <IconButton aria-label="">
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className={`${cssPrefix}__body`}>
        {messages.map((message, index) => (
          <p
            key={index}
            className={[
              `${cssPrefix}__message`,
              `${
                user.displayName === message.name
                  ? `${cssPrefix}__receiver`
                  : ''
              }`,
            ].join(' ')}
          >
            <span className={`${cssPrefix}__name`}> {message.name}</span>
            {message.message}
            <span className={`${cssPrefix}__time-stamp`}>
              {new Date(message.timeStamp?.toDate()).toUTCString()}
            </span>
          </p>
        ))}
      </div>
      <div className={`${cssPrefix}__footer`}>
        <InsertEmoticon />
        <form>
          <input
            type="text"
            placeholder="Type a message"
            value={inputMsg}
            onChange={e => setInputMsg(e.target.value)}
          ></input>
          <button onClick={sendMesssge}>Send a Message</button>
        </form>
        <Mic />
      </div>
    </div>
  );
}

export default Chat;
