import React, { useState } from "react";
import OnBoardingLayout from "../../components/onboardingLayout";
import Input from "../../components/input";
import { PASSWORD_VALIDATION_MESSAGE } from "../../utils/validation";
import Button from "../../components/button";
import { Link, useNavigate } from "react-router-dom";
import { toastMessage } from "../../utils/methods";
import { login } from "../../api/auth/auth";

const Sign = () => {
  const [authData, setAuthData] = useState({
    email: "",
    emailErrorMessage: "",
    password: "",
    passwordErrorMessage: "",
  });

  const [check, setCheck] = useState(false);

  const navigate = useNavigate();

  const handlerOnChange = (
    name: string,
    value: string,
    isvalidate: boolean
  ) => {
    const error = name + "ErrorMessage";

    if (name === "email") {
      setAuthData({
        ...authData,
        [name]: value,
        [error]: !value
          ? "Email is required"
          : isvalidate
          ? "Invalid email"
          : "",
      });
    }

    if (name === "password") {
      setAuthData({
        ...authData,
        [name]: value,
        [error]: !value
          ? "Password is required"
          : isvalidate
          ? PASSWORD_VALIDATION_MESSAGE
          : "",
      });
    }
  };

  const validateTesting = () => {
    if (
      authData.email === "" ||
      authData.emailErrorMessage !== "" ||
      authData.password === "" ||
      authData.passwordErrorMessage !== ""
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleSumbit = async () => {
    setCheck(true);
    const data = {
      email: authData.email,
      password: authData.password,
    };
    await login(data)
      .then((res) => {
        setCheck(false);
        localStorage.setItem("accessToken", res.data.access_token);
        navigate("/");
      })
      .catch((err) => {
        setCheck(false);
        toastMessage("error", "Something Wrong!");
      });
  };
  return (
    <div className="w-full h-screen max-h-screen flex items-center flex-col">
      <h1 className="text-3xl font-semibold font-serif text-center pt-4 pb-8 text-[#FF5674] cursor-pointer">
        Logo
      </h1>
      <h2 className="mt-10 text-center text-3xl font-bold tracking-tight text-[#FF5674] capitalize">
        Login
      </h2>
      <p className="text-md text-center text-black mt-2">Welcome back to Bid</p>
      <OnBoardingLayout>
        <div className=" py-10 px-4">
          <div>
            <Input
              name="email"
              type="email"
              value={authData.email}
              errorMessage={authData.emailErrorMessage}
              placeholder="Email"
              handlerChange={handlerOnChange}
            />
          </div>
          <div className="mt-6">
            <Input
              name="password"
              type="password"
              value={authData.password}
              errorMessage={authData.passwordErrorMessage}
              placeholder="Password"
              handlerChange={handlerOnChange}
            />
          </div>
          <div className="mt-6">
            <Button
              btnStyle={validateTesting() || check ? true : false}
              dissabled={validateTesting() || check ? true : false}
              callBack={handleSumbit}
            >
              {check ? "Loading...." : "login"}
            </Button>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <span className=" text-[#473D3E] font-medium text-base">
              Don't have an account
            </span>
            <Link to={"/signUp"}>
              <span className="text-[#FF5674] font-semibold text-base cursor-pointer hover:text-blue-500">
                {" "}
                Register
              </span>
            </Link>
          </div>
        </div>
      </OnBoardingLayout>
    </div>
  );
};

export default Sign;
