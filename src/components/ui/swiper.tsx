"use client";
import React, { useMemo } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper as LibSwiper } from "swiper/react";

type Props = {
  children: React.ReactNode;
  spaceBetween?: number;
  slidesPerView?: number;
  navigation?: boolean;
  pagination?: boolean;
  className?: string;
};

const Swiper = ({
  children,
  navigation,
  pagination,
  className = "",
  slidesPerView = 3,
  spaceBetween = 50,
}: Props) => {
  const moduels = useMemo(() => {
    const moduels = [];
    if (navigation) {
      moduels.push(Navigation);
    }
    if (pagination) {
      moduels.push(Pagination);
    }
    return moduels;
  }, [navigation, pagination]);

  return (
    <LibSwiper
      spaceBetween={spaceBetween}
      modules={moduels}
      className={className}
      navigation={navigation}
      slidesPerView={slidesPerView}
    >
      {children}
    </LibSwiper>
  );
};

export default Swiper;
