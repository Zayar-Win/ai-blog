import { Blog } from "@/generated/prisma";
import Image from "next/image";
import React from "react";
import { Badge } from "./ui/badge";
import moment from "moment";
import Link from "next/link";
import { routes } from "@/lib/routes";

type Props = {
  blog: Blog & {
    category: {
      name: string;
      id: number;
    } | null;
  };
};

const BlogCard = ({ blog }: Props) => {
  return (
    <Link href={routes.BLOG_DETAIL(encodeURIComponent(blog.slug))}>
      <div className="w-full h-full">
        <Image
          src={blog.coverImageUrl as string}
          className="w-full h-auto object-cover rounded-lg"
          alt={blog.title}
          width={100}
          height={100}
        />
        <div className="flex mt-3 items-center justify-between">
          <Badge className="bg-violet-400 text-white">
            {blog?.category?.name}
          </Badge>
          <div className="flex items-center gap-2 text-xs text-secondary">
            <p>{moment(blog.createdAt).format("MMM DD, YYYY")}</p>
            <div className="w-[5px] h-[5px] bg-secondary rounded-full"></div>
            <p>10 min</p>
          </div>
        </div>
        <p className="blog-content text-lg font-bold mt-[20px] line-clamp-4">
          {blog.title}
        </p>
      </div>
    </Link>
  );
};

export default BlogCard;
