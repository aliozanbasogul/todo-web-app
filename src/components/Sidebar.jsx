import React, { useState, useEffect } from "react";
import "../styles/Sidebar.css";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";
import { ExitToApp } from "@mui/icons-material";
import FirebaseMethods from "../auth/FirebaseMethods";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const auth = getAuth();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        fetchLists(user);
      } else {
        setIsAuthenticated(false);
        setLoading(false); 
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const fetchLists = async (user) => {
    try {
      const result = await FirebaseMethods.GetListsFromUser(auth);
      if (result.success) {
        setLists(result.lists);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error fetching lists: ", error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <>
      <div className="menu-icon" onClick={toggleSidebar}>
        <MenuIcon />
        {isOpen && <h2>ToDone</h2>}
      </div>

      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <ul className="sidebar-list-profile">
          <li className="sidebar-item">
            <PersonIcon className="sidebar-icon" />
            {isOpen && <span>Profile</span>}
          </li>
        </ul>

        {/* Sidebar Lists Section */}
        <ul className="sidebar-list">
          {loading ? (
            <li className="sidebar-item">Loading...</li>
          ) : isAuthenticated && lists.length > 0 ? (
            lists.map((list, index) => (
              <li key={index} className="sidebar-item">
                <InfoIcon className="sidebar-icon" />
                {isOpen && <span>{list.name}</span>}
              </li>
            ))
          ) : (
            <li className="sidebar-item">No lists found</li>
          )}
        </ul>
        <div className="add-list-btn">
            <button><PlaylistAddIcon sx={{fontSize: 'x-large'}} /></button>
        </div>
        <div className="logout">
          <ExitToApp className="sidebar-icon" />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
