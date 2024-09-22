import React, { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import FirebaseMethods from "../auth/FirebaseMethods";
import { getAuth } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "../styles/List.css"; // Ensure you import the correct CSS

const List = ({
  list,
  handleAddItem,
  handleDeleteItem,
  handleEditItem,
  handleEditListName,
  handleDeleteList,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [completedItems, setCompletedItems] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [isEditingListName, setIsEditingListName] = useState(false); // Liste adı düzenleme durumu
  const [newListName, setNewListName] = useState(list.name); // Yeni liste adı

  // Handles the change in input when adding a new item
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Adds a new item to the list
  const onAddItemClick = () => {
    handleAddItem(inputValue);
    setInputValue(""); // Clears the input field
  };

  // Toggles the completion state of the list item
  const handleCheckboxClick = (index) => {
    setCompletedItems((prevState) =>
      prevState.includes(index)
        ? prevState.filter((itemIndex) => itemIndex !== index)
        : [...prevState, index]
    );
  };

  // Switches the list item into edit mode
  const handleEditClick = (index, item) => {
    setEditIndex(index);
    setEditValue(item);
  };

  // Saves the edited item
  const handleSaveEdit = async (index) => {
    const auth = getAuth();
    if (list && editValue.trim()) {
      try {
        const result = await FirebaseMethods.EditItem(
          auth,
          list.name,
          index,
          editValue
        );
        if (result.success) {
          toast.success("Item edited successfully");
          const updatedList = {
            ...list,
            items: list.items.map((item, i) =>
              i === index ? editValue : item
            ),
          };
          handleEditItem(editIndex, editValue);
          setEditIndex(null);
          setEditValue(""); // Düzenleme değerini sıfırla
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error("Error editing item:", error.message);
      }
    }
  };

  // Saves the edited list name
  const handleSaveListName = async () => {
    const auth = getAuth();
    if (newListName.trim()) {
      try {
        const result = await FirebaseMethods.EditListName(
          auth,
          list.name,
          newListName
        );
        if (result.success) {
          toast.success("List name edited successfully");
          handleEditListName(newListName); // Parent componenti güncelle
          setIsEditingListName(false); // Düzenleme modundan çık
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error("Error editing list name:", error.message);
      }
    }
  };

  // Cancels the edit mode
  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditValue("");
  };


  return (
    <>
      <div className="list-container">
        <div className="list-header">
          {isEditingListName ? (
            <div className="list-actions">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Enter new list name"
              />
              <CheckIcon
                className="edit-list-icon" // Düzenleme ve onay butonlarının sınıfını kullan
                onClick={handleSaveListName}
              />
              <CancelIcon
                className="delete-list-icon" // İptal butonunun sınıfını kullan
                onClick={() => setIsEditingListName(false)}
              />
            </div>
          ) : (
            <>
              <h1>{list.name}</h1>
              <div className="list-actions">
                <EditIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsEditingListName(true)} // Liste adı düzenleme moduna geç
                  className="edit-list-icon"
                />
                <DeleteIcon
                  style={{ cursor: "pointer" }}
                  className="delete-list-icon"
                  onClick={() => handleDeleteList(list.name)} 
                />
              </div>
            </>
          )}
        </div>
        <ul>
          {list.items.length > 0 ? (
            list.items.map((item, index) => (
              <li
                key={index}
                className={completedItems.includes(index) ? "completed" : ""}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <input
                    type="checkbox"
                    checked={completedItems.includes(index)}
                    onChange={() => handleCheckboxClick(index)}
                  />
                  {editIndex === index ? (
                    <input
                      type="text"
                      value={editValue}
                      placeholder={item}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                  ) : (
                    <span>{item}</span>
                  )}
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  {editIndex === index ? (
                    <>
                      <CheckIcon
                        style={{ cursor: "pointer" }}
                        onClick={() => handleSaveEdit(index)}
                      />
                      <CancelIcon
                        style={{ cursor: "pointer" }}
                        onClick={handleCancelEdit}
                      />
                    </>
                  ) : (
                    <>
                      <EditIcon
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEditClick(index, item)}
                      />
                      <DeleteIcon
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteItem(index)}
                        className="delete-icon"
                      />
                    </>
                  )}
                </div>
              </li>
            ))
          ) : (
            <li>No items in this list</li>
          )}
        </ul>

        <div className="list-input-container">
          <input
            className="input-new-list"
            type="text"
            placeholder="Add new item"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && onAddItemClick()}
          />
          <AddCircleOutlineIcon
            onClick={onAddItemClick}
            className="add-item-icon"
          />
        </div>
      </div>
    </>
  );
};

export default List;
