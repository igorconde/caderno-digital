import { createUserWithEmailAndPassword, Auth, UserCredential, getAuth } from "firebase/auth";
import firebaseApp from "../configs/firebaseConfig";

const auth: Auth = getAuth(firebaseApp);

export default async function signUp(email: string, password: string): Promise<{ result: UserCredential | null, error: any }> {
  let result: UserCredential | null = null,
    error: any = null;
  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e;
  }

  return { result, error };
}
