import React, { useState } from "react";
import OnBoardingLayout from "../../components/onboardingLayout";
import Input from "../../components/input";
import Button from "../../components/button";
import { useNavigate } from "react-router-dom";
import { toastMessage } from "../../utils/methods";
import { useAppHook } from "../../context/appContext";
import { deposit } from "../../api/user/user";

const Deposit = () => {
  const [authData, setAuthData] = useState({
    price: "",
    priceErrorMessage: "",
  });

  const { setUser, user } = useAppHook();

  const [check, setCheck] = useState(false);

  const navigate = useNavigate();

  const handlerOnChange = (
    name: string,
    value: string,
    isvalidate: boolean
  ) => {
    const error = name + "ErrorMessage";

    if (name === "price") {
      setAuthData({
        ...authData,
        [name]: value,
        [error]: !value
          ? "Price is required"
          : isvalidate
          ? "Price is greather than 0"
          : "",
      });
    }
  };

  const validateTesting = () => {
    if (authData.price === "" || authData.priceErrorMessage !== "") {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = async () => {
    setCheck(true);
    const data = {
      amount: Number(authData.price),
    };
    const token = localStorage.getItem("accessToken");
    await deposit(token, data)
      .then((res) => {
        setCheck(false);
        setUser({
          ...user,
          balance: user.balance + res.data.amount,
        });
        toastMessage("success", "Deposit successful!");
        navigate("/");
      })
      .catch((err) => {
        setCheck(false);
        toastMessage("error", "Something Wrong!");
      });
  };
  return (
    <div>
      <h3 className="mt-16 text-center text-4xl font-bold tracking-tight text-[#FF5674] capitalize">
        Deposit
      </h3>
      <div className="w-full flex justify-center py-10">
        <OnBoardingLayout>
          <div>
            <Input
              name="price"
              placeholder="Amount"
              type="number"
              value={authData.price}
              errorMessage={authData.priceErrorMessage}
              handlerChange={handlerOnChange}
            />
          </div>
          <div className="flex gap-4 mt-5">
            <Button
              btnStyle={true}
              dissabled={false}
              callBack={() => {
                navigate("/");
              }}
            >
              Cancel
            </Button>
            <Button
              btnStyle={false}
              dissabled={validateTesting() || check ? true : false}
              callBack={handleSubmit}
            >
              deposit
            </Button>
          </div>
        </OnBoardingLayout>
      </div>
    </div>
  );
};

export default Deposit;
