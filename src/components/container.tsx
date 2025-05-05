import React from "react";

type Props = {
  children: React.ReactNode;
};

const Container = ({ children }: Props) => {
  return <div className="px-[100px]">{children}</div>;
};

export default Container;
