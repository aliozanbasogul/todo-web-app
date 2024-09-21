import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"; 
import { db } from "./firebaseConfig"; 
import User from "../entities/User";
import List from "../entities/List";

class FirebaseMethods {
  static async AddAuthUserToFirestore(auth, email, username) {
    try {
      const user = auth.currentUser;
      const userUid = user ? user.uid : null;

      if (!userUid) {
        console.error("User is not authenticated, cannot add to Firestore.");
        return { success: false, message: "User is not authenticated" };
      }

      const userDocRef = doc(db, "users", userUid);

      console.log(`Saving user to Firestore: ${email}, UID: ${userUid}`);

      const userObj = new User(email, username, new Date(), []);

      await setDoc(userDocRef, {
        email: userObj.email,
        username: userObj.username,
        createdAt: userObj.createdAt,
        lists: userObj.lists
      });

      console.log("User added to Firestore successfully.");
      return { success: true, message: "User added to Firestore successfully" };
    } catch (error) {
      console.error("Error adding user to Firestore: ", error.message);
      return { success: false, message: error.message }; 
    }
  }

  static async GetUserFromFirestore(auth) {
    try {
      const user = auth.currentUser;
      const userUid = user ? user.uid : null;

      if (!userUid) {
        console.error("User is not authenticated, cannot get from Firestore.");
        return { success: false, message: "User is not authenticated" };
      }

      const userDocRef = doc(db, "users", userUid);

      console.log(`Getting user from Firestore: UID: ${userUid}`);

      const userDoc = await getDoc(userDocRef); 

      if (userDoc.exists()) {
        console.log("User found in Firestore.");
        return { success: true, message: "User found in Firestore", user: userDoc.data() };
      } else {
        console.error("User not found in Firestore.");
        return { success: false, message: "User not found in Firestore" };
      }
    } catch (error) {
      console.error("Error getting user from Firestore: ", error.message);
      return { success: false, message: error.message }; 
    }
  }

  static async SaveListToUser(auth, listName, listItems) {
    try {
      const user = auth.currentUser;
      const userUid = user ? user.uid : null;

      if (!userUid) {
        console.error("User is not authenticated, cannot save list to Firestore.");
        return { success: false, message: "User is not authenticated" };
      }

      const userDocRef = doc(db, "users", userUid);
      const userDoc = await getDoc(userDocRef); 

      let currentLists = [];

      if (userDoc.exists() && userDoc.data().lists) {
        currentLists = userDoc.data().lists;
      }

      const newList = new List(listName, listItems);

      const updatedLists = [...currentLists, { name: newList.name, items: newList.items }];

      await setDoc(
        userDocRef,
        {
          lists: updatedLists,
        },
        { merge: true }
      );

      console.log("List saved to user in Firestore successfully.");
      return { success: true, message: "List saved to user in Firestore successfully" };
    } catch (error) {
      console.error("Error saving list to user in Firestore: ", error.message);
      return { success: false, message: error.message };
    }
  }
  

  static async GetListsFromUser(auth) {
    try {
      const user = auth.currentUser;
      const userUid = user ? user.uid : null;

      if (!userUid) {
        console.error("User is not authenticated, cannot get lists from Firestore.");
        return { success: false, message: "User is not authenticated" };
      }

      const userDocRef = doc(db, "users", userUid);

      console.log(`Getting lists from user in Firestore: UID: ${userUid}`);

      const userDoc = await getDoc(userDocRef); 

      if (userDoc.exists()) {
        console.log("Lists found in Firestore.");
        return { success: true, message: "Lists found in Firestore", lists: userDoc.data().lists };
      } else {
        console.error("Lists not found in Firestore.");
        return { success: false, message: "Lists not found in Firestore" };
      }
    } catch (error) {
      console.error("Error getting lists from Firestore: ", error.message);
      return { success: false, message: error.message }; 
    }
  };

  static async DeleteListFromUser(auth, listName) {
    try {
      const user = auth.currentUser;
      const userUid = user ? user.uid : null;

      if (!userUid) {
        console.error("User is not authenticated, cannot delete list from Firestore.");
        return { success: false, message: "User is not authenticated" };
      }

      const userDocRef = doc(db, "users", userUid);

      const userDoc = await getDoc(userDocRef);
      let currentLists = [];

      if (userDoc.exists() && userDoc.data().lists) {
        currentLists = userDoc.data().lists;
      }

      const updatedLists = currentLists.filter((list) => list.name !== listName);

      await setDoc(userDocRef, {
        lists: updatedLists
      }, { merge: true });

      console.log("List deleted from user in Firestore successfully.");
      return { success: true, message: "List deleted from user in Firestore successfully" };
    } catch (error) {
      console.error("Error deleting list from user in Firestore: ", error.message);
      return { success: false, message: error.message };
    }
  };

  static async AddItemToList(auth, listName, item) {  
    try {
      const user = auth.currentUser;
      const userUid = user ? user.uid : null;

      if (!userUid) {
        console.error("User is not authenticated, cannot add item to list in Firestore.");
        return { success: false, message: "User is not authenticated" };
      }

      const userDocRef = doc(db, "users", userUid);

      const userDoc = await getDoc(userDocRef);
      let currentLists = [];

      if (userDoc.exists() && userDoc.data().lists) {
        currentLists = userDoc.data().lists;
      }

      const updatedLists = currentLists.map((list) => {
        if (list.name === listName) {
          return { name: list.name, items: [...list.items, item] };
        } else {
          return list;
        }
      });

      await setDoc(userDocRef, {
        lists: updatedLists
      }, { merge: true });

      console.log("Item added to list in Firestore successfully.");
      return { success: true, message: "Item added to list in Firestore successfully" };
    } catch (error) {
      console.error("Error adding item to list in Firestore: ", error.message);
      return { success: false, message: error.message };
    }
  };

}

export default FirebaseMethods;
