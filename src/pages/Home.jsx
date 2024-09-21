import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import List from "../components/List"; // List bileşeni
import FirebaseMethods from "../auth/FirebaseMethods"; // Firebase methods
import { getAuth } from "firebase/auth"; // Firebase auth

export default function Home() {
  const [selectedList, setSelectedList] = useState(null); // Seçilen listeyi takip etmek için state
  const [newItem, setNewItem] = useState(""); // Yeni item için state

  // Listeye yeni item eklemek için fonksiyon
  const handleAddItemClicked = async (item) => {
    const auth = getAuth();
    if (selectedList && item.trim()) { // Eğer liste seçiliyse ve yeni item boş değilse
      try {
        const result = await FirebaseMethods.AddItemToList(auth, selectedList.name, item);
        if (result.success) {
          console.log("Item added successfully");

          // Yeni item eklendiğinde listeyi güncelleme
          const updatedList = { ...selectedList, items: [...selectedList.items, item] };
          setSelectedList(updatedList); // Seçili listeyi güncelle

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

  return (
    <>
      <div className="home">
        <Sidebar className="sidebar" onSelectList={setSelectedList} />
        <div className="home-content">
          {selectedList ? (
            <>
              {/* List componentine props olarak selectedList ve handleAddItem'i geçiriyoruz */}
              <List list={selectedList} handleAddItem={handleAddItemClicked}/>
            </>
          ) : (
            <h1>Home</h1>
          )}
        </div>
      </div>
    </>
  );
}
