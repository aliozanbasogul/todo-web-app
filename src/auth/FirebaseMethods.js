import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"; 
import { db } from "./firebaseConfig"; 
import User from "../entities/User";

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

      const userObj = new User(email, username, new Date());

      await setDoc(userDocRef, {
        email: userObj.email,
        username: userObj.username,
        createdAt: userObj.createdAt
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
}

export default FirebaseMethods;
