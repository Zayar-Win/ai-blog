"use client";
import React from "react";
import { SwiperSlide as LibSwiperSlide } from "swiper/react";
import "swiper/css";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const SwiperSlide = ({ children, className = "" }: Props) => {
  return <LibSwiperSlide className={className}>{children}</LibSwiperSlide>;
};

export default SwiperSlide;
