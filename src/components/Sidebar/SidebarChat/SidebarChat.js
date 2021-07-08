import React, { useState, useEffect } from 'react';
import './SidebarChat.scss';
import db from '../../../Auth/firebase';
import { Avatar } from '@material-ui/core';
import { Link } from 'react-router-dom';

function SidebarChat({ addNewChat, id, name }) {
  const [avatarKey, setAvatarKey] = useState('');
  const [lastMessage, setLastMessage] = useState('');
  const cssPrefix = 'sidebarChat';

  useEffect(() => {
    if (id) {
      db.collection('rooms')
        .doc(id)
        .collection('messages')
        .orderBy('timeStamp', 'desc')
        .onSnapshot(snapshot => {
          const messages = snapshot.docs.map(doc => doc.data());
          setLastMessage(messages[0].message);
        });
    }
  }, [id]);

  useEffect(() => {
    setAvatarKey(Math.floor(Math.random() * 5000));
  }, []);

  const createNewChat = () => {
    const roomName = prompt('Enter the chat room');
    if (roomName) {
      db.collection('rooms').add({
        name: roomName,
      });
    }
  };

  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className={cssPrefix}>
        <Avatar
          src={`https://avatars.dicebear.com/api/human/${avatarKey}.svg`}
        />
        <div className={`${cssPrefix}__info`}>
          <h2> {name} </h2>
          <p> {lastMessage} </p>
        </div>
      </div>
    </Link>
  ) : (
    <div className={cssPrefix} onClick={createNewChat}>
      <h2> Add new Chat </h2>
    </div>
  );
}

export default SidebarChat;
