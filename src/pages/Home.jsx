import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import List from "../components/List";
import FirebaseMethods from "../auth/FirebaseMethods";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const [selectedList, setSelectedList] = useState(null);
  const [lists, setLists] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/authpage");
      }
    });
    return () => unsubscribe(); 
  }, [navigate]);

  useEffect(() => {
    const fetchUserLists = async () => {
      const auth = getAuth();
      const result = await FirebaseMethods.GetListsFromUser(auth);
      if (result.success) {
        setLists(result.lists); 
      } else {
        console.error("Error fetching lists: ", result.message);
      }
    };
    fetchUserLists();
  }, []);

  const handleAddItem = async (item) => {
    const auth = getAuth();
    if (selectedList && item.trim()) {
      try {
        const result = await FirebaseMethods.AddItemToList(
          auth,
          selectedList.name,
          item
        );
        if (result.success) {
          console.log("Item added successfully");

          const updatedList = {
            ...selectedList,
            items: [...selectedList.items, item],
          };
          setSelectedList(updatedList); 
          setLists(
            lists.map((list) =>
              list.name === updatedList.name ? updatedList : list
            )
          ); 
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error("Error adding item: ", error.message);
      }
    } else {
      console.error("No list selected or item is empty.");
    }
  };

  const handleEditItem = async (index, newValue) => {
    const auth = getAuth();
    if (selectedList && newValue.trim()) {
      try {
        const result = await FirebaseMethods.EditItem(
          auth,
          selectedList.name,
          index,
          newValue
        );
        if (result.success) {
          console.log("Item edited successfully");

          const updatedList = {
            ...selectedList,
            items: selectedList.items.map((item, i) =>
              i === index ? newValue : item
            ),
          };
          setSelectedList(updatedList); 
          setLists(
            lists.map((list) =>
              list.name === updatedList.name ? updatedList : list
            )
          ); 
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error("Error editing item: ", error.message);
      }
    } else {
      console.error("Edit value is empty or no list selected.");
    }
  };

  const handleEditListName = async (newName) => {
    const auth = getAuth();
    if (selectedList && newName.trim()) {
      try {
        const result = await FirebaseMethods.EditListName(
          auth,
          selectedList.name,
          newName
        );
        if (result.success) {
          console.log("List name edited successfully");
          const updatedList = { ...selectedList, name: newName };
          setSelectedList(updatedList); 
          setLists(
            lists.map((list) =>
              list.name === selectedList.name ? updatedList : list
            )
          ); 
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error("Error editing list name: ", error.message);
      }
    } else {
      console.error("New list name is empty or no list selected.");
    }
  };

  const handleDeleteList = async () => {
    const auth = getAuth();
    if (selectedList) {
      try {
        const result = await FirebaseMethods.DeleteList(
          auth,
          selectedList.name
        );
        if (result.success) {
          console.log("List deleted successfully");
          setLists(lists.filter((list) => list.name !== selectedList.name)); 
          setSelectedList(null); 
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error("Error deleting list: ", error.message);
      }
    }
  };

  const handleDeleteItem = async (index) => {
    const auth = getAuth();
    if (selectedList) {
      try {
        const result = await FirebaseMethods.DeleteItemFromList(
          auth,
          selectedList.name,
          index
        );
        if (result.success) {
          console.log("Item deleted successfully");
          const updatedList = {
            ...selectedList,
            items: selectedList.items.filter((_, i) => i !== index),
          };
          setSelectedList(updatedList); 
          setLists(
            lists.map((list) =>
              list.name === updatedList.name ? updatedList : list
            )
          ); 
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error("Error deleting item: ", error.message);
      }
    }
  };

  return (
    <div className="home">
      <Sidebar
        lists={lists}
        onSelectList={setSelectedList}
        setLists={setLists}
      />
      <div className="home-content">
        {selectedList ? (
          <List
            list={selectedList}
            handleAddItem={handleAddItem}
            handleEditItem={handleEditItem}
            handleDeleteItem={handleDeleteItem}
            handleEditListName={handleEditListName}
            handleDeleteList={handleDeleteList}
          />
        ) : (
          <h1>Home</h1>
        )}
      </div>
    </div>
  );
}
