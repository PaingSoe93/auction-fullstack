import { Dialog, Transition } from "@headlessui/react";
import { CloseSmall } from "@icon-park/react";
import { Fragment, useRef } from "react";
import { classNames } from "../utils/methods";

interface DialogProps {
  onClose: (val: boolean) => void;
  open?: boolean;
  title: string;
  children?: React.ReactNode;
  size: "md" | "lg" | "extra";
  titlePlace: boolean;
}

// eslint-disable-next-line complexity
export const DialogBox = ({
  onClose,
  open,
  title,
  children,
  size,
  titlePlace,
}: DialogProps) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        initialFocus={cancelButtonRef}
        onClose={() => onClose(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 z-20  transition-opacity"
            style={{
              backgroundColor: "rgba(255, 249, 250, 0.08)",
              backdropFilter: "blur(10px)",
            }}
          />
        </Transition.Child>

        <div className="fixed z-30 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={classNames(
                  size === "md" ? " max-w-sm" : "",
                  size === "lg" ? "max-w-xl" : "",
                  size === "extra" ? "max-w-4xl" : "",
                  "relative bg-white rounded-3xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8  w-full h-full border border-[#FF7F76]"
                )}
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-2 sm:pb-4">
                  <div className="">
                    <div className="mt-3 text-center sm:mt-0  sm:text-left">
                      {titlePlace ? (
                        <div className="flex pb-3 items-center justify-center">
                          <Dialog.Title
                            as="h3"
                            className={classNames(
                              size === "md" ? "text-xl" : "",
                              size === "lg" ? "text-2xl" : "",
                              size === "extra" ? "text-3xl" : "",
                              " leading-6 text-[#202030] font-bold text-center pt-4 "
                            )}
                          >
                            {title}
                          </Dialog.Title>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between px-2 py-3">
                          <Dialog.Title
                            as="h3"
                            className={classNames(
                              size === "md" ? "text-xl" : "",
                              size === "lg" ? "text-2xl" : "",
                              size === "extra" ? "text-3xl" : "",
                              " leading-6 text-[#202030] font-bold text-center capitalize"
                            )}
                          >
                            {title}
                          </Dialog.Title>
                          <Dialog.Panel onClick={() => onClose(false)}>
                            <CloseSmall
                              theme="outline"
                              size="24"
                              fill="#FF5674"
                            />
                          </Dialog.Panel>
                        </div>
                      )}
                      <div className="mt-2 pb-4">{children}</div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default DialogBox;
