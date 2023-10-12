import React, { useEffect, useState } from "react";
import BidCard from "../../components/bidCard";
import Option from "../../components/option";
import { bidCardList } from "../../api/user/user";
import Button from "../../components/button";
import { useNavigate } from "react-router-dom";

const typeList = ["ONGOING", "COMPLETED"];

const Dashboard = () => {
  const [selectedType, setSelectedType] = useState("ONGOING");

  const [check, setCheck] = useState(false);

  const navigate = useNavigate();

  const [timeCheck, setTimeCheck] = useState(false);

  const [bidCheck, setBidCheck] = useState(false);

  const [finalCheck, setFinalCheck] = useState(false);

  const [cardList, setCardList] = useState<any>(null);

  const fetchItemList = async () => {
    setCheck(true);
    const token = localStorage.getItem("accessToken");
    await bidCardList(token, selectedType)
      .then((res) => {
        setCheck(false);
        setCardList(res.data);
      })
      .catch((err) => {
        setCheck(false);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchItemList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, timeCheck, finalCheck]);
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="py-10 relative flex justify-end gap-5">
        <Option
          name={selectedType}
          setSelectedName={setSelectedType}
          optionList={typeList}
        />
        <div>
          <Button
            dissabled={false}
            btnStyle={false}
            callBack={() => {
              navigate("/create");
            }}
          >
            Create new item
          </Button>
        </div>
      </div>
      <div className=" flex flex-wrap gap-5 lg:gap-8 pb-10 justify-center">
        {check || bidCheck ? (
          <p>Loading</p>
        ) : cardList?.length > 0 ? (
          cardList?.map((item: any, i: number) => (
            <BidCard
              card={item}
              key={i}
              setTimeChcek={setTimeCheck}
              timeCheck={timeCheck}
              bidCheck={bidCheck}
              setBidCheck={setBidCheck}
              finalCheck={finalCheck}
              setFinalCheck={setFinalCheck}
            />
          ))
        ) : (
          <p>No data</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
