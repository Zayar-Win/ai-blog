"use client";
import React from "react";
import Swiper from "./ui/swiper";
import { SwiperSlide } from "swiper/react";
import { Badge } from "./ui/badge";
import Image from "next/image";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { Blog } from "@/generated/prisma";

type Props = {
  blogs: (Blog & {
    category: {
      id: number;
      name: string;
    } | null;
  })[];
};

const BlogSlider = ({ blogs }: Props) => {
  return (
    <div>
      <Swiper className="h-[80vh]" navigation pagination slidesPerView={1}>
        {blogs.map((blog) => (
          <SwiperSlide key={blog.id}>
            <div
              className={`h-full relative bg-cover`}
              style={{ backgroundImage: `url(${blog.coverImageUrl})` }}
            >
              <div className="absolute z-[1] top-0 left-0 right-0 w-full h-full bg-[rgba(0,0,0,0.2)]"></div>
              <div className="relative w-[50%] h-full flex flex-col justify-center pl-[80px] z-[10]">
                <Badge
                  variant={"secondary"}
                  className="bg-violet-400 text-white"
                >
                  {blog?.category?.name}
                </Badge>
                <Link
                  href={routes.BLOG_DETAIL(encodeURIComponent(blog.slug))}
                  className="text-4xl mt-5 text-white leading-[1.3] font-semibold"
                >
                  {blog.title}
                </Link>
                <div className="mt-5 flex text-white items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Image
                      src={
                        "https://img.freepik.com/premium-psd/happy-robot-3d-ai-character-chat-bot-mascot-gpt-chatbot-icon-artificial-intelligence_95505-482.jpg?semt=ais_hybrid&w=740"
                      }
                      alt="Bot"
                      width={100}
                      height={100}
                      className="w-[40px] rounded-md object-cover"
                    />
                    <p
                      className="font-medium
                  "
                    >
                      AI
                    </p>
                  </div>
                  <p>-</p>
                  <p className="font-medium text-sm">Feb 22 , 2024</p>
                  <div className="w-[5px] h-[5px] bg-white/80  rounded-full"></div>
                  <p className="text-sm">10 min</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BlogSlider;
