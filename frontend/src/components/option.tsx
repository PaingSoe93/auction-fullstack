import { Correct, DownOne } from "@icon-park/react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { classNames } from "../utils/methods";

export interface OptionProps {
  name: string;
  optionList: any;
  setSelectedName: any;
}

const Option = ({ name, optionList, setSelectedName }: OptionProps) => {
  const [check, setCheck] = useState(false);

  return (
    <div className="relative">
      <div
        onClick={() => {
          setCheck(!check);
        }}
        className="flex justify-between items-center lg:w-[176px] lg:max-w-[176px] w-full max-w-[150px] border py-3 px-3 rounded text-sm cursor-pointer bg-slate-50 border-gray-100 shadow-md"
      >
        <p className=" font-medium uppercase text-gray-800">{name}</p>
        <DownOne theme="filled" size="14" fill={"#A2A2AE"} />
      </div>
      {check && (
        <motion.ul
          initial={{ opacity: 0, scale: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "tween" }}
          exit={{ opacity: 0, scale: 0 }}
          className="absolute top-12 left-0 w-full border rounded-md overflow-hidden z-20 bg-slate-50"
        >
          {optionList.map((item: any, i: number) => (
            <li
              key={i}
              style={{
                background: item === name ? "#FF5674" : "white",
              }}
              className={classNames(
                "flex justify-between items-center py-2 px-3 text-sm w-full cursor-pointer uppercase",
                item === name ? "text-gray-100" : "text-gray-800"
              )}
              onClick={() => {
                setSelectedName(item);
                setCheck(false);
              }}
            >
              <span>{item}</span>
              {item === name && (
                <Correct theme="filled" size="12" fill="#ffff" />
              )}
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default Option;
