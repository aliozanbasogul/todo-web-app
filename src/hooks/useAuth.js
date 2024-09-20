import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import FirebaseMethods from "../auth/FirebaseMethods";
import { auth } from "../auth/firebaseConfig";

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await FirebaseMethods.GetUserFromFirestore(auth);
        if (userData.success) {
          setCurrentUser(userData.user);
          setLoading(false);
        } else {
          console.log("Error fetching user data:", userData.message);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);

  return { currentUser, loading };
};

export default useAuth;