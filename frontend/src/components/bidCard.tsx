import React, { useEffect, useState } from "react";
import { classNames, toastMessage } from "./../utils/methods";
import Button from "./button";
import { HammerAndAnvil } from "@icon-park/react";
import { useAppHook } from "../context/appContext";
import { buyBid } from "../api/user/user";
import DialogBox from "./dialogBox";
import { useNavigate } from "react-router-dom";

interface WorkerCardProps {
  card: any;
  setTimeChcek: any;
  timeCheck: boolean;
  bidCheck: boolean;
  setBidCheck: any;
  finalCheck: boolean;
  setFinalCheck: any;
}

const BidCard = ({
  card,
  setTimeChcek,
  timeCheck,
  setBidCheck,
  finalCheck,
  setFinalCheck,
}: WorkerCardProps) => {
  const navigate = useNavigate();
  const [number, setNumber] = useState("");

  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [disableDuration, setDisableDuration] = useState(0);

  const [countDown, setCountDown] = useState(5);

  const [countCheck, setCountCheck] = useState(false);

  const [open, setOpen] = useState(false);

  const { user, setUser } = useAppHook();

  useEffect(() => {
    let currentTime = new Date().getTime();
    const endTime = new Date(card?.endTime).getTime();
    let countdown = endTime - currentTime;

    const Interval = setInterval(() => {
      const hour = Math.floor(
        (countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      setHour(hour);
      const minute = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
      setMinute(minute);
      const second = Math.floor((countdown % (1000 * 60)) / 1000);
      setSecond(second);

      if (minute === 0 && hour === 0 && second === 0) {
        setTimeChcek(!timeCheck);
      }
      
      countdown -= 1000; // Decrement the countdown by 1 second
    }, 1000);

    return () => clearInterval(Interval);
  }, [card?.endTime, setTimeChcek, timeCheck]);

  const handleSubmit = async () => {
    if (user?.balance < Number(number)) {
      setOpen(true);
      setNumber("");
    } else {
      setBidCheck(true);
      const data = {
        itemId: card?.id,
        bidAmount: Number(number),
      };
      const token = localStorage.getItem("accessToken");
      await buyBid(token, data)
        .then((res) => {
          setBidCheck(false);
          setFinalCheck(!finalCheck);
          toastMessage("success", "success!");
          setNumber("");
          setUser({ ...user, balance: user.balance - Number(number) });
          const bidUpdateDataString: any =
            localStorage.getItem("countdownData");
          let bidUpdateData = JSON.parse(bidUpdateDataString);
          const bidData: any = {
            id: card?.id,
            time: new Date(res.data.updatedAt).getTime(),
          };
          if (bidUpdateData) {
            bidUpdateData.push(bidData);
          } else {
            bidUpdateData = [bidData];
          }
          const storeBidUpdateData = JSON.stringify(bidUpdateData);
          localStorage.setItem("countdownData", storeBidUpdateData);
          setDisableDuration(5);
        })
        .catch((err) => {
          setBidCheck(false);
          setFinalCheck(!finalCheck);
          toastMessage("error", "Something Wrong!");
        });
    }
  };

  useEffect(() => {
    const objectString: any = localStorage.getItem("countdownData");
    const objectArray = JSON.parse(objectString);
    
    const bidCheck = objectArray?.some((item: any) => item.id === card?.id);
    if (bidCheck) {
      const timer = setInterval(() => {
        if (countDown > 0) {
          setCountCheck(true);
          setCountDown(prev => prev - 1);
        } else {
          setCountCheck(false);
          clearInterval(timer);
          if (objectArray?.length === 1) {
            localStorage.removeItem("countdownData");
          } else {
            const newObjectArray = objectArray.filter(
              (item: any) => item.id !== card?.id
            );
            const newObjectString = JSON.stringify(newObjectArray);
            localStorage.setItem("countdownData", newObjectString);
          }
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [countDown, card?.id]);

  useEffect(() => {
    let timer: any;
    if (disableDuration > 0) {
      timer = setTimeout(() => {
        setDisableDuration(disableDuration - 1);
      }, 1000);
    }

    // Cleanup on unmount
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [disableDuration]);

  const MIN_BID_INCREMENT = 1;
  const isBidValid = () => {
    const currentMax = card?.maxBid ? card?.maxBid?.bidAmount : card?.startingPrice;
    return number > currentMax + MIN_BID_INCREMENT && user.id !== card?.user.id;
  };


  return (
    <>
      <div
        style={{
          background:
            card?.status === "COMPLETED" ? "rgba(255, 200, 161, 0.1)" : "white",
          borderWidth: "0.33px",
        }}
        className={classNames(
          card?.status === "COMPLETED"
            ? "bg-[rgba(255, 200, 161, 0.1)] border-[#FFC8A1]"
            : " border-[#A2A2AE]",
          " rounded-xl w-[449px] lg:min-w-[500px] min-w-[300px]"
        )}
      >
        <div className=" px-4 py-4">
          <div className="flex gap-4">
            <div className="w-full">
              <div className="flex justify-between items-center border-b-[0.33px] pb-2 border-[#A2A2AE] w-full">
                <div>
                  <div className="flex md:items-center items-start gap-2 md:flex-row flex-col">
                    <p className="text-[#202030] text-2xl font-bold opacity-70">
                      {card?.name}
                    </p>
                    <div className="flex items-center mt-1 gap-1">
                      <HammerAndAnvil theme="filled" size="16" fill="#A2A2AE" />
                      <p className="text-[#A2A2AE] text-base font-medium">
                        {card?.bidCount} Bids
                      </p>
                    </div>
                  </div>
                  <p className="text-[#A2A2AE] text-base font-medium">
                    By {card?.user?.username}
                  </p>
                </div>

                <p
                  style={{
                    background:
                      card?.status === "ONGOING"
                        ? "rgba(83, 203, 88, 0.1)"
                        : "rgba(241, 180, 23, 0.1)",
                  }}
                  className={classNames(
                    card?.status === "ONGOING"
                      ? " text-[#53CB58]"
                      : " text-[#F1B417]",
                    "text-[10px] px-3 leading-[20px]  rounded-2xl font-bold"
                  )}
                >
                  {card?.status}
                </p>
              </div>
              <div className="flex justify-between items-start mt-3">
                <div>
                  <p className=" text-xl text-[#202030]">Actual Price</p>
                  <div className="flex gap-2 mt-1">
                    <p className=" text-3xl text-[#202030] font-medium">
                      $ {card?.startingPrice}
                    </p>
                  </div>
                </div>
                <div>
                  <p className=" text-xl text-[#202030]">Leading Bid</p>
                  <div className="flex gap-2 mt-1">
                    <p className=" text-3xl text-[#202030] font-medium">
                      ${" "}
                      {card?.maxBid
                        ? card?.maxBid?.bidAmount
                        : card?.startingPrice}
                    </p>
                  </div>
                </div>
                {card?.status === "ONGOING" &&
                  (hour >= 0 || minute >= 0 || second >= 0) && (
                    <div>
                      <p className=" text-xl text-[#202030]">Duration</p>
                      <div className="flex gap-2 mt-1">
                        <p className=" text-3xl text-[#202030] font-medium">
                          {hour > 0
                            ? `${hour}h : ${minute} m`
                            : `${minute} m : ${second} s`}
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
          {card?.status === "ONGOING" && (
            <div className="mt-5 w-full flex justify-center">
              {/* <Input name="price" placeholder="Your bid" /> */}
              <div className="relative w-1/2">
                <input
                  type="number"
                  placeholder="Your Bid"
                  value={number}
                  onChange={(e) => {
                    setNumber(e.target.value);
                  }}
                  className="w-full pr-4 pl-6 py-2 border-b border-[#5F5F6D] outline-none text-3xl text-[#FF5674] font-bold text-center opacity-70"
                />
                <p className="absolute left-0 top-2 text-3xl text-[#FF5674] font-bold">
                  $
                </p>
              </div>
            </div>
          )}
          {card?.status === "ONGOING" && (
            <div className="mt-5 flex justify-center">
              <Button
                btnStyle={!isBidValid() || countCheck || disableDuration > 0}
                dissabled={!isBidValid() || countCheck || disableDuration > 0}
                callBack={handleSubmit}
              >
                {disableDuration > 0 ? disableDuration : (countCheck ? countDown : "PLACE A BID")}
              </Button>
            </div>
          )}
        </div>
      </div>
      <DialogBox
        size="md"
        title="Insufficient Balance"
        titlePlace={true}
        open={open}
        onClose={setOpen}
      >
        <h3 className="text-[#202030] text-lg text-center font-bold opacity-60 px-4">
          Your balance is low. Please deposit first!
        </h3>
        <div className="flex px-5 gap-4 pt-5">
          <Button
            btnStyle={true}
            dissabled={false}
            callBack={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            btnStyle={false}
            dissabled={false}
            callBack={() => {
              navigate("/deposit");
            }}
          >
            Deposit now
          </Button>
        </div>
      </DialogBox>
    </>
  );
};

export default BidCard;
