import React, { useState } from "react";
import OnBoardingLayout from "../../components/onboardingLayout";
import Input from "../../components/input";
import { PASSWORD_VALIDATION_MESSAGE } from "../../utils/validation";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/button";
import { toastMessage } from "../../utils/methods";
import { register } from "../../api/auth/auth";

const SignUp = () => {
  const [authData, setAuthData] = useState({
    name: "",
    nameErrorMessage: "",
    email: "",
    emailErrorMessage: "",
    password: "",
    passwordErrorMessage: "",
    confirmPassword: "",
    confirmPasswordErrorMessage: "",
  });

  const [check, setCheck] = useState(false);

  const navigate = useNavigate();

  const handlerOnChange = (
    name: string,
    value: string,
    isvalidate: boolean
  ) => {
    const error = name + "ErrorMessage";

    if (name === "name") {
      setAuthData({
        ...authData,
        [name]: value,
        [error]: !value
          ? "Name is required"
          : isvalidate
          ? "Name of lenght is greatherthan 5"
          : "",
      });
    }

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
        confirmPasswordErrorMessage:
          authData.confirmPassword !== value ? "Passwords must match" : "",
      });
    }

    if (name === "confirmPassword") {
      setAuthData({
        ...authData,
        [name]: value,
        [error]: !value
          ? "confirm password is a required field"
          : authData.password !== value
          ? "Passwords must match"
          : "",
      });
    }
  };

  const validateTesting = () => {
    if (
      authData.email === "" ||
      authData.emailErrorMessage !== "" ||
      authData.password === "" ||
      authData.passwordErrorMessage !== "" ||
      authData.confirmPassword === "" ||
      authData.confirmPasswordErrorMessage !== "" ||
      authData.name === "" ||
      authData.nameErrorMessage !== ""
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = async () => {
    setCheck(true);
    const data = {
      username: authData.name,
      email: authData.email,
      password: authData.password,
    };
    await register(data)
      .then((res) => {
        toastMessage("success", "Register successful!");
        setTimeout(() => {
          localStorage.setItem("accessToken", res.data.access_token);
          navigate("/");
        }, 2000);
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
      <h2 className="mt-16 text-center text-3xl font-bold tracking-tight text-[#FF5674] capitalize">
        Register
      </h2>
      <p className="text-md text-center text-black mt-2 font-normal">
        Create an account
      </p>
      <OnBoardingLayout>
        <div className=" py-10 px-4">
          <div>
            <Input
              name="name"
              type="text"
              value={authData.name}
              errorMessage={authData.nameErrorMessage}
              placeholder="Enter your name"
              handlerChange={handlerOnChange}
            />
          </div>
          <div className="mt-6">
            <Input
              name="email"
              type="email"
              value={authData.email}
              errorMessage={authData.emailErrorMessage}
              placeholder="Enter your email"
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
            <Input
              name="confirmPassword"
              type="password"
              value={authData.confirmPassword}
              errorMessage={authData.confirmPasswordErrorMessage}
              placeholder="Confirm password"
              handlerChange={handlerOnChange}
            />
          </div>
          <div className="mt-6">
            <Button
              btnStyle={validateTesting() || check ? true : false}
              dissabled={validateTesting() || check ? true : false}
              callBack={handleSubmit}
            >
              {check ? "Loading..." : " Create"}
            </Button>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <span className=" text-[#473D3E] font-medium text-base">
              Don't have an account
            </span>
            <Link to={"/signIn"}>
              <span className="text-[#FF5674] font-semibold text-base cursor-pointer hover:text-blue-500">
                {" "}
                Login
              </span>
            </Link>
          </div>
        </div>
      </OnBoardingLayout>
    </div>
  );
};

export default SignUp;
