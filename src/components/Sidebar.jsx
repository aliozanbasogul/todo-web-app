import React, { useState, useEffect } from "react";
import "../styles/Sidebar.css";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import LabelIcon from '@mui/icons-material/Label';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { ExitToApp } from "@mui/icons-material";
import FirebaseMethods from "../auth/FirebaseMethods";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import List from "../entities/List"; 
import { toast, ToastContainer } from "react-toastify";

const Sidebar = ({ onSelectList }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newListName, setNewListName] = useState(""); // Yeni liste adı için state
  const [addingNewList, setAddingNewList] = useState(false); // Yeni liste inputu gösterme state
  const auth = getAuth();

  const toggleSidebar = () => {
    // Eğer yeni liste ekleme süreci aktifse, sidebar'ı kapatma özelliğini devre dışı bırak
    if (!addingNewList) {
      setIsOpen(!isOpen);
    }
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
        const listsData = result.lists.map(list => new List(list.name, list.items)); // List entity kullanımı
        setLists(listsData);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error fetching lists: ", error);
    } finally {
      setLoading(false); 
    }
  };

  const handleListItemClick = (list) => {
    onSelectList(list);
  };

  // Yeni liste ekleme fonksiyonu
  const handleAddList = async () => {
    if (!newListName.trim()) {
      console.error("List name cannot be empty.");
      return;
    }

    const newList = new List(newListName, []); 
    try {
      const result = await FirebaseMethods.SaveListToUser(auth, newList.name, newList.items); // SaveListToUser'a doğrudan parametreler geçiriliyor
      if (result.success) {
        console.log("List added successfully");
        setLists((prevLists) => [...prevLists, newList]); // Listeyi güncelle
        setNewListName(""); // Liste adı alanını temizleme
        setAddingNewList(false); // Inputu gizle
        fetchLists(auth.currentUser); // Yeni listeyi ekledikten sonra listeyi tekrar al
        toast.success("List created successfully!");
      } else {
        toast.error("Error creating list try again!");
        console.error(result.message);
      }
    } catch (error) {
      toast.error("Error creating list try again!");
      console.error("Error adding list: ", error);
    }
  };

  const handleAddListEnter = (e) => {
    if (e.key === "Enter") {
      handleAddList();
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

        <ul className="sidebar-list">
          {loading ? (
            <li className="sidebar-item">Loading...</li>
          ) : isAuthenticated && lists.length > 0 ? (
            lists.map((list, index) => (
              <li key={index} className="sidebar-item" onClick={() => handleListItemClick(list)}>
                <LabelIcon className="sidebar-icon" />
                {isOpen && <span>{list.name}</span>}
              </li>
            ))
          ) : (
            <li className="sidebar-item">No lists found</li>
          )}

          {/* Eğer yeni liste ekleme sürecindeysek input alanını göster */}
          {addingNewList && (
            <li className="sidebar-item">
              <LabelIcon className="sidebar-icon" />
              <input
                className="input-new-list"
                type="text"
                placeholder="New list name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)} // Input alanı
                onKeyDown={handleAddListEnter} // TODO: Cancel işlemi EKLE
                autoFocus
              />
              <button onClick={handleAddList}>
                <PlaylistAddIcon sx={{ fontSize: 'x-large' }} />
              </button>
            </li>
          )}
        </ul>

        {/* Yeni liste eklemek için buton */}
        <div className="add-list-btn">
          {!addingNewList && ( // Yeni liste ekle butonunu sadece yeni liste eklenmediğinde göster
            <button onClick={() => setAddingNewList(true)} >
              <PlaylistAddIcon sx={{ fontSize: 'x-large' }} />
            </button>
          )}
        </div>

        <div className="logout">
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
