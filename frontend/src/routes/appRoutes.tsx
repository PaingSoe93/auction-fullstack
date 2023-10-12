import Sign from "../views/onboarding/sign";
import SignUp from "../views/onboarding/signUp";
import CreateItem from "../views/user/create";
import Dashboard from "../views/user/dashboard";
import Deposit from "../views/user/deposit";

const AppRoutes = [
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/signIn",
    element: <Sign />,
  },
  {
    path: "/signUp",
    element: <SignUp />,
  },
  {
    path: "/create",
    element: <CreateItem />,
  },
  {
    path: "/deposit",
    element: <Deposit />,
  },
];

export default AppRoutes;
