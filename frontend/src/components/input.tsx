import React, { ChangeEvent, useRef, useState } from "react";
import { PreviewCloseOne, PreviewOpen } from "@icon-park/react";
import { validateFormat } from "./../utils/methods";
import {
  EMAIL_REGEX_FORMAR,
  PASSWORD_REGEX_FORMAT,
} from "./../utils/validation";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  register?: any;
  errors?: any;
  errorMessage?: string;
  value?: string | number;
  refType?: HTMLInputElement | null;
  onBoarding?: boolean;
  handlerChange?: (name: string, value: any, isvalidate: boolean) => void;
}

let isvalidate: any = false;

const Input = ({
  name,
  register,
  errors = {},
  value = "",
  errorMessage = "",
  refType = null,
  onBoarding,
  handlerChange,
  ...rest
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(refType);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const iType = showPassword ? "text" : rest.type;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;

    const value = e.target.value;
    if (handlerChange) {
      switch (name) {
        case "email":
          isvalidate = validateFormat(value, EMAIL_REGEX_FORMAR) ? false : true;
          break;
        case "name":
          isvalidate = value.length > 5 ? false : true;
          break;
        case "password":
          isvalidate = validateFormat(value, PASSWORD_REGEX_FORMAT)
            ? false
            : true;
          break;
        case "confirmPassword":
          isvalidate = validateFormat(value, PASSWORD_REGEX_FORMAT)
            ? false
            : true;
          break;
        case "price":
          isvalidate = Number(value) > 0 ? false : true;
      }

      handlerChange(name, value, isvalidate);
    }
  };
  return (
    <div className="relative">
      <input
        value={value}
        name={name}
        {...rest}
        ref={inputRef}
        type={iType}
        onChange={handleChange}
        className="px-3 py-3 w-full bg-transparent  text-base text-[#5F5F6D] font-medium outline-none rounded-md border border-[#5F5F6D]"
      />
      {rest.type === "password" && (
        <span className=" cursor-pointer absolute right-4 top-3">
          {showPassword ? (
            <PreviewCloseOne
              theme="outline"
              size="20"
              fill={value ? "#000000" : "#AEAEAE"}
              onClick={toggleShowPassword}
            />
          ) : (
            <PreviewOpen
              theme="outline"
              size="20"
              fill={value ? "#000000" : "#AEAEAE"}
              onClick={toggleShowPassword}
            />
          )}
        </span>
      )}

      <p className="text-sm text-red-500  mx-1 mt-1" role="alert">
        {errorMessage}
      </p>
    </div>
  );
};

export default Input;
