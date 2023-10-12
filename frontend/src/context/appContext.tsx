import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../api/auth/auth";

interface UserType {
  username: string;
  balance: number | null;
  id: number | null;
  email: string;
}

interface AuthProps {
  user: UserType;
  setUser: Dispatch<SetStateAction<UserType>>;
}

const defaultState: AuthProps = {
  user: {
    username: "",
    balance: null,
    id: null,
    email: "",
  },
  setUser: () => {},
};

const AuthContext = createContext<AuthProps>(defaultState);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");

  const fetchUserData = async (token: any) => {
    getUserData(token)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
        navigate("/");
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  useEffect(() => {
    if (token) {
      setLoading(true);
      fetchUserData(token);
    } else {
      setLoading(false);
      navigate("/signIn");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {loading ? <p>Loading</p> : <>{children}</>}
    </AuthContext.Provider>
  );
};

const useAppHook: any = () => {
  const state = useContext(AuthContext);
  return state;
};

export { AuthProvider, useAppHook };
