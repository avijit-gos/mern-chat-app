/** @format */

import { createContext, useContext, useState } from "react";

const MyContext = createContext();

const MyContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [token, setToken] = useState("");
  const [userList, setUserList] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [call, setCall] = useState(false);
  const [selectChatId, setSelectChatId] = useState("");
  const [notifications, setNotifications] = useState([]);

  return (
    <MyContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        userList,
        setUserList,
        chatList,
        setChatList,
        call,
        setCall,
        selectChatId,
        setSelectChatId,
        notifications,
        setNotifications,
      }}>
      {children}
    </MyContext.Provider>
  );
};

export const MyChatState = () => {
  return useContext(MyContext);
};

export default MyContextProvider;
