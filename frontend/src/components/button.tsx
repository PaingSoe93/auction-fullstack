import React from "react";
import { classNames } from "./../utils/methods";

interface ButtonProps {
  children: React.ReactNode;
  dissabled: boolean;
  btnStyle: boolean;
  callBack?: () => void;
}

const Button = ({ children, dissabled, callBack, btnStyle }: ButtonProps) => {
  return (
    <button
      disabled={dissabled}
      style={{
        backgroundColor: btnStyle ? "rgba(255, 200, 161, 0.28)" : "#FF5674",
      }}
      className={classNames(
        "px-4 py-3 w-full rounded-full text-base font-medium uppercase",
        btnStyle
          ? "  border border-[#FF5674] text-[#FF5674]"
          : " text-[#FFF9FA]",
        dissabled ? "cursor-not-allowed" : "cursor-pointer"
      )}
      onClick={callBack}
    >
      {children}
    </button>
  );
};

export default Button;
