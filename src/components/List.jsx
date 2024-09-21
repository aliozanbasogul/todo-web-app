import React, { useState } from "react";
import "../styles/Sidebar.css";

const List = ({ list, handleAddItem }) => {
  const [inputValue, setInputValue] = useState(""); // Input alanı için state

  const handleInputChange = (e) => {
    setInputValue(e.target.value); // Input alanındaki metni güncelleme
  };

  const onAddItemClick = () => {
    handleAddItem(inputValue); // Parent bileşene metni gönder
    setInputValue(""); // Input alanını temizle
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onAddItemClick(); // Enter'a basıldığında öğe ekle
    }
  };

  return (
    <div>
      <h1>{list.name}</h1>
      <ul>
        {list.items.length > 0 ? (
          list.items.map((item, index) => <li key={index}>{item}</li>)
        ) : (
          <li>No items in this list</li>
        )}
      </ul>
      <input
        className="nput-new-list"
        type="text"
        placeholder="Add new item"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
      />
      <button onClick={onAddItemClick}>Add item</button>
    </div>
  );
};

export default List;
