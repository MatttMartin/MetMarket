import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  // const [userId, setUserId] = useState(Math.random() > 0.5 ? "952944778915676161" : "952944778915807233"); // Initial value
  const [userId, setUserId] = useState("952944778915676161");
  const [conversations, setConversations] = useState([])

  return (
    <UserContext.Provider value={{ userId, setUserId, conversations, setConversations }}>
      {children}
    </UserContext.Provider>
  );
};
