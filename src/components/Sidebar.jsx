import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import "../styles/Sidebar.css";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import LabelIcon from "@mui/icons-material/Label";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { ExitToApp } from "@mui/icons-material";
import FirebaseMethods from "../auth/FirebaseMethods";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";

const Sidebar = ({ lists, onSelectList, setLists }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [addingNewList, setAddingNewList] = useState(false);
  const [userProfile, setUserProfile] = useState(null); 
  const auth = getAuth();
  const navigate = useNavigate(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const result = await FirebaseMethods.GetUserFromFirestore(auth);
        if (result.success) {
          setUserProfile(result.user); 
        } else {
          console.error(result.message);
          navigate("/authpage");
        }
      } else {
        setUserProfile(null);
        navigate("/authpage"); 
      }
    });

    return () => unsubscribe(); 
  }, [auth, navigate]);

  const toggleSidebar = () => {
    if (!addingNewList) {
      setIsOpen(!isOpen);
    }
  };

  const handleListItemClick = (list) => {
    onSelectList(list);
  };

  const handleAddList = async () => {
    if (!newListName.trim()) {
      toast.error("List name cannot be empty.");
      return;
    }

    const newList = new List(newListName, []);
    try {
      const result = await FirebaseMethods.SaveListToUser(
        auth,
        newList.name,
        newList.items
      );
      if (result.success) {
        console.log("List added successfully");
        setLists((prevLists) => [...prevLists, newList]); 
        setNewListName("");
        setAddingNewList(false);
        toast.success("List created successfully!");
      } else {
        toast.error("Error creating list, try again!");
        console.error(result.message);
      }
    } catch (error) {
      toast.error("Error creating list, try again!");
      console.error("Error adding list: ", error);
    }
  };

  const handleAddListEnter = (e) => {
    if (e.key === "Enter") {
      handleAddList();
    }
  };

  const handleAddListCancel = () => {
    setAddingNewList(false);
    setNewListName("");
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth); 
      toast.success("Signed out successfully!");
      navigate("/authpage"); 
    } catch (error) {
      toast.error("Error signing out, try again!");
      console.error("Error signing out: ", error);
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
            {isOpen && (
              <span>
                {userProfile?.username ? userProfile.username : userProfile?.email}
              </span>
            )}
          </li>
        </ul>

        <ul className="sidebar-list">
          {lists.length > 0 ? (
            lists.map((list, index) => (
              <li
                key={index}
                className="sidebar-item"
                onClick={() => handleListItemClick(list)}
              >
                <LabelIcon className="sidebar-icon" />
                {isOpen && <span>{list.name}</span>}
              </li>
            ))
          ) : (
            <li className="sidebar-item">No lists found</li>
          )}

          {addingNewList && (
            <li className="sidebar-item">
              <LabelIcon className="sidebar-icon" />
              <input
                className="input-new-list"
                type="text"
                placeholder="New list name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={handleAddListEnter}
                autoFocus
              />
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <CheckCircleIcon
                  sx={{
                    fontSize: "x-large",
                    cursor: "pointer",
                    ":hover": { color: "green" },
                  }}
                  onClick={handleAddList}
                />
                <CancelIcon
                  sx={{
                    fontSize: "x-large",
                    cursor: "pointer",
                    ":hover": { color: "red" },
                  }}
                  onClick={handleAddListCancel}
                />
              </div>
            </li>
          )}
        </ul>

        <div className="add-list-btn">
          {!addingNewList && (
            <button onClick={() => setAddingNewList(true)}>
              <PlaylistAddIcon sx={{ fontSize: "x-large" }} />
            </button>
          )}
        </div>

        <div className="logout" onClick={handleSignOut}>
          <ExitToApp className="sidebar-icon" />
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default Sidebar;
