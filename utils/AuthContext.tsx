import type {
  Dispatch,
  ReactElement,
  SetStateAction} from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
// // import CognitoUser from "@aws-amplify/auth";
// import Auth from "aws-amplify";
// import Hub from "aws-amplify";
// import CognitoUser from "@aws-amplify/auth";

interface UserContextType {
  user: CognitoUser | null;
  setUser: Dispatch<SetStateAction<CognitoUser>>;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

interface Props {
  children: React.ReactElement;
}

export default function AuthContext({ children }: Props): ReactElement {
  const [user, setUser] = useState<CognitoUser | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const amplifyUser = undefined;
      setUser(amplifyUser);
    } catch (error) {
      // No current signed in user.
      console.error(error);
      setUser(null);
    }
  }

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

export const useUser = (): UserContextType => useContext(UserContext);
