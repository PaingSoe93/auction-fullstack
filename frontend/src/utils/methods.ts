import { toast } from "react-toastify";
import { T00000, toastObj } from "./initData";

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function validateFormat(value: string, format: RegExp) {
  return value?.match(format);
}

export const toastMessage = (type: string, message: string, position = "") => {
  if (type === "error") {
    return toast.error(message, {
      ...toastObj,
      position: position ? position : "top-right",
    });
  }
  if (type === "success") {
    return toast.success(message, {
      ...toastObj,
      position: position ? position : "top-right",
    });
  }
  if (type === "info") {
    return toast.info(message, {
      ...toastObj,
      position: position ? position : "top-right",
    });
  } else {
    return null;
  }
};

export const convertIOSResetTimeZone = (iso: string, time: string | number) => {
  return `${iso.split("T")[0]}T${time}:00${T00000}Z`;
};

export const convert24Time = (time: string) => {
  return time.split(" ")[1] === "AM"
    ? Number(time.split(" ")[0].split(":")[0]) <= 9
      ? `0${time.split(" ")[0].split(":")[0]}`
      : time.split(" ")[0].split(":")[0]
    : Number(time.split(" ")[0].split(":")[0]) === 12
    ? time.split(" ")[0].split(":")[0]
    : 12 + Number(time.split(" ")[0].split(":")[0]);
};
