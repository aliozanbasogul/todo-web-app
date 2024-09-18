import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; 
import { db } from "./firebaseConfig"; 

class FirebaseMethods {
  static async AddAuthUserToFirestore(auth, email, password) {
    try {

      const user = auth.currentUser;
      const userUid = user ? user.uid : null;

      if (!userUid) {
        console.error("User is not authenticated, cannot add to Firestore.");
        return { success: false, message: "User is not authenticated" };
      }

      const userDocRef = doc(db, "users", userUid);

      console.log(`Saving user to Firestore: ${email}, UID: ${userUid}`);

      await setDoc(userDocRef, {
        email: email,
        lists: [],
        createdAt: new Date(),
      });

      console.log("User added to Firestore successfully.");
      return { success: true, message: "User added to Firestore successfully" };
    } catch (error) {
      console.error("Error adding user to Firestore: ", error.message);
      return { success: false, message: error.message }; 
    }
  }
}

export default FirebaseMethods;
