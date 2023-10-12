import React, { useEffect, useState } from "react";
import { classNames, toastMessage } from "./../utils/methods";
import Button from "./button";
import { HammerAndAnvil } from "@icon-park/react";
import { useAppHook } from "../context/appContext";
import { buyBid } from "../api/user/user";

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
  bidCheck,
  setBidCheck,
  finalCheck,
  setFinalCheck,
}: WorkerCardProps) => {
  const [number, setNumber] = useState("");

  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  const { user, setUser } = useAppHook();

  useEffect(() => {
    const createTime = new Date(card?.endTime).getTime();
    const NewDate = new Date().getTime();

    const countdown = createTime - NewDate;

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
    }, 1000);
    return () => clearInterval(Interval);
  });

  const handleSubmit = async () => {
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
        setUser({ ...user, balance: user.balance - Number(number) });
      })
      .catch((err) => {
        setBidCheck(false);
        setFinalCheck(!finalCheck);
        toastMessage("error", "Something Wrong!");
      });
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
                    {card?.user?.username}
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
              {/* <Link to={`/appointmentDetail/${card.id}`}>
                        <a className=" text-sm text-[#FF5674] font-bold cursor-pointer">
                          View Request
                        </a>
                      </Link> */}
              <Button
                btnStyle={
                  card?.maxBid
                    ? number > card?.maxBid?.bidAmount &&
                      user.id !== card?.user.id &&
                      user?.balance >= number
                      ? false
                      : true
                    : number > card?.startingPrice &&
                      user?.id !== card?.user.id &&
                      user?.balance >= number
                    ? false
                    : true
                }
                dissabled={
                  card?.maxBid
                    ? number > card?.maxBid?.bidAmount &&
                      user?.id !== card?.user.id &&
                      user?.balance >= number
                      ? false
                      : true
                    : number > card?.startingPrice &&
                      user?.id !== card?.user.id &&
                      user?.balance >= number
                    ? false
                    : true
                }
                callBack={handleSubmit}
              >
                PLACE A BID
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BidCard;
