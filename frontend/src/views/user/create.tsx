import React, { useState } from "react";
import OnBoardingLayout from "../../components/onboardingLayout";
import Input from "../../components/input";
import { DownOne } from "@icon-park/react";
import { classNames, toastMessage } from "../../utils/methods";
import { motion } from "framer-motion";
import Button from "../../components/button";
import { useNavigate } from "react-router-dom";
import { createItem } from "../../api/user/user";

const CreateItem = () => {
  const navigate = useNavigate();
  const [check, setCheck] = useState(false);
  const [minute, setMinute] = useState(0);
  const [authData, setAuthData] = useState({
    name: "",
    nameErrorMessage: "",
    price: "",
    priceErrorMessage: "",
    duration: 1,
    totalDuration: 14,
    minute: 0,
  });
  const [durationCheck, setDurationCheck] = useState(false);
  const [duration, setDuration] = useState(1);

  const handlerPlusDuration = () => {
    setDuration(duration + 1);
  };

  const handlerMinDuration = () => {
    setDuration(duration - 1);
  };

  const handlerPlusFourDuration = () => {
    setDuration(duration + 4);
  };

  const handlerMinFourDuration = () => {
    setDuration(duration - 4);
  };

  const handlerAddDuration = () => {
    setAuthData({ ...authData, duration: duration, minute: minute });
    setDurationCheck(false);
  };

  const handlerMinMinute = () => {
    setMinute(minute - 5);
  };

  const handlerPlusMinute = () => {
    setMinute(minute + 5);
  };

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
          ? "Name of length is greather than 5"
          : "",
      });
    }

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
    if (
      authData.name === "" ||
      authData.nameErrorMessage !== "" ||
      authData.price === "" ||
      authData.priceErrorMessage !== ""
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = async () => {
    setCheck(true);
    const token = localStorage.getItem("accessToken");
    const hours =
      authData.duration > 9 ? authData.duration : `0${authData.duration}`;
    const minutes =
      authData.minute > 9 ? authData.minute : `0${authData.minute}`;
    const data = {
      name: authData.name,
      startingPrice: Number(authData.price),
      duration: `${hours}:${minutes}`,
    };
    await createItem(token, data)
      .then((res) => {
        setCheck(false);
        toastMessage("success", "Bid item create successful!");
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
        Create item
      </h3>
      <div className="w-full flex justify-center py-10">
        <OnBoardingLayout>
          <Input
            placeholder="Name"
            name="name"
            type="text"
            value={authData.name}
            errorMessage={authData.nameErrorMessage}
            handlerChange={handlerOnChange}
          />
          <div className="mt-5">
            <Input
              placeholder="Start Price"
              name="price"
              value={authData.price}
              type="number"
              errorMessage={authData.priceErrorMessage}
              handlerChange={handlerOnChange}
            />
          </div>
          <div className="relative mt-5">
            <div
              className="bg-white cursor-pointer border border-[#5F5F6D] px-4 py-1 rounded-md flex justify-between items-center w-full focus:outline-none"
              onClick={() => {
                setDurationCheck(!durationCheck);
              }}
            >
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-sm text-[#A2A2AE] capitalize font-medium">
                    Duration
                  </p>
                </div>
                <p className="text-base text-[#5F5F6D] font-medium capitalize">
                  {authData.duration} Hours : {authData.minute} Minutes
                </p>
              </div>
              <DownOne theme="filled" size="24" fill="#5F5F6D" />
            </div>
            {durationCheck && (
              <motion.div
                className=" absolute shadow-md mt-2 w-full rounded-md overflow-hidden"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "tween" }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <div className=" w-full bg-[#e3e2e2] py-4">
                  <div className="flex  items-center justify-between gap-3 pb-4 max-w-[40%] mx-auto lg:max-w-[50%]">
                    <button
                      disabled={minute === 0 ? true : false}
                      className={classNames(
                        minute === 0 ? "cursor-no-drop" : " cursor-pointer",
                        "py-0 px-3 text-[22px] text-center bg-white focus:outline-none border-none text-black rounded-md"
                      )}
                      onClick={handlerMinMinute}
                    >
                      -
                    </button>
                    <p className=" font-bold text-lg"> 5 Minute</p>
                    <button
                      disabled={minute === 55 ? true : false}
                      className={classNames(
                        minute === 55 ? "cursor-no-drop" : " cursor-pointer",
                        "py-0 px-3 bg-white focus:outline-none border-none text-black rounded-md"
                      )}
                      onClick={handlerPlusMinute}
                    >
                      +
                    </button>
                  </div>
                  <div className="flex  items-center justify-between gap-3 pb-4 max-w-[40%] mx-auto lg:max-w-[50%]">
                    <button
                      disabled={duration === 1 ? true : false}
                      className={classNames(
                        duration === 1 ? "cursor-no-drop" : " cursor-pointer",
                        "py-0 px-3 text-[22px] text-center bg-white focus:outline-none border-none text-black rounded-md"
                      )}
                      onClick={handlerMinDuration}
                    >
                      -
                    </button>
                    <p className=" font-bold text-lg"> 1 Hours</p>
                    <button
                      disabled={
                        duration === authData.totalDuration ||
                        authData.duration === 0
                          ? true
                          : false
                      }
                      className={classNames(
                        duration === authData.totalDuration ||
                          authData.duration === 0
                          ? "cursor-no-drop"
                          : " cursor-pointer",
                        "py-0 px-3 bg-white focus:outline-none border-none text-black rounded-md"
                      )}
                      onClick={handlerPlusDuration}
                    >
                      +
                    </button>
                  </div>
                  <div className="flex  items-center justify-between gap-3 pb-4 max-w-[40%] mx-auto lg:max-w-[50%]">
                    <button
                      disabled={duration - 4 < 1 ? true : false}
                      className={classNames(
                        duration - 4 < 1 ? "cursor-no-drop" : " cursor-pointer",
                        "py-0 px-3 text-[22px] text-center bg-white focus:outline-none border-none text-black rounded-md"
                      )}
                      onClick={handlerMinFourDuration}
                    >
                      -
                    </button>
                    <p className=" font-bold text-lg"> 4 Hours</p>
                    <button
                      disabled={
                        duration + 4 > authData.totalDuration ||
                        authData.duration === 0
                          ? true
                          : false
                      }
                      className={classNames(
                        duration + 4 > authData.totalDuration ||
                          authData.duration === 0
                          ? "cursor-no-drop"
                          : " cursor-pointer",
                        "py-0 px-3 bg-white focus:outline-none border-none text-black rounded-md"
                      )}
                      onClick={handlerPlusFourDuration}
                    >
                      +
                    </button>
                  </div>
                  <p className="text-center px-4 pt-3  border-t-2 border-white font-bold text-lg">
                    {duration} Hours : {minute} Minutes
                  </p>
                </div>
                <div className="py-3 px-4 flex justify-around">
                  <button
                    className="py-3 px-6 focus:outline-none rounded-md bg-white font-bold text-sm shadow-md capitalize"
                    onClick={() => {
                      setDuration(authData.duration);
                      setDurationCheck(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className=" bg-[#FF5674] py-3 px-6 focus:outline-none font-bold text-sm text-white shadow-md capitalize rounded-md"
                    onClick={handlerAddDuration}
                  >
                    OK
                  </button>
                </div>
              </motion.div>
            )}
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
              {check ? "Loading" : "Create"}
            </Button>
          </div>
        </OnBoardingLayout>
      </div>
    </div>
  );
};

export default CreateItem;
