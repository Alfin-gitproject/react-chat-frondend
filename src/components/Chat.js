import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000'); // Replace with your server URL

const App = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    // Listen for incoming messages
    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Update the list of users
    socket.on('userList', (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.off('message');
      socket.off('userList');
    };
  }, []);

  const joinChat = () => {
    if (username.trim()) {
      socket.emit('join', username);
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('sendMessage', { text: message });
      setMessage('');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      {!joined ? (
        <div>
          <h2>Join the Chat</h2>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ padding: '10px', marginRight: '10px' }}
          />
          <button onClick={joinChat} style={{ padding: '10px 20px' }}>
            Join
          </button>
        </div>
      ) : (
        <div>
          <h2>Chat Room</h2>
          <div
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              height: '300px',
              overflowY: 'scroll',
              marginBottom: '10px',
            }}
          >
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.user}:</strong> {msg.text}
              </div>
            ))}
          </div>
          <div>
            <input
              type="text"
              placeholder="Type your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ padding: '10px', marginRight: '10px', width: '70%' }}
            />
            <button onClick={sendMessage} style={{ padding: '10px 20px' }}>
              Send
            </button>
          </div>
          <div style={{ marginTop: '20px' }}>
            <h4>Online Users:</h4>
            <ul>
  {users.map((user, index) => (
    <li key={index}>
      
      <label htmlFor={`checkbox-${index}`}>{user}</label>
    </li>
  ))}
</ul>

          </div>
        </div>
      )}
    </div>
  );
};

export default App;
