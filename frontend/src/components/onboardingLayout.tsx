import React from "react";

interface onBoardingLayoutProps {
  children: React.ReactNode;
}

const OnBoardingLayout = ({ children }: onBoardingLayoutProps) => {
  return (
    <div className="w-full h-auto md:w-2/3 lg:w-1/3 mx-4 md:mx-0">
      {children}
    </div>
  );
};

export default OnBoardingLayout;
