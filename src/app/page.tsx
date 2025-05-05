import BlogSlider from "@/components/BlogSlider";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/layouts/AppLayout";
import db from "@/lib/db";
import Image from "next/image";
import moment from "moment";
import BlogCard from "@/components/BlogCard";

export default async function Page() {
  const slideBlogs = await db.blog.findMany({
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      coverImageUrl: true,
      metaTitle: true,
      metaDescription: true,
      categoryId: true,
      metaKeywords: true,
      views: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const latestBlogs = await db.blog.findMany({
    take: 5,
    skip: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      coverImageUrl: true,
      metaTitle: true,
      metaDescription: true,
      categoryId: true,
      metaKeywords: true,
      createdAt: true,
      views: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      tags: true,
    },
  });
  const mostPopularBlogs = await db.blog.findMany({
    take: 6,
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      coverImageUrl: true,
      metaTitle: true,
      metaDescription: true,
      categoryId: true,
      metaKeywords: true,
      views: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      views: "desc",
    },
  });
  const blogsCount = await db.blog.count();
  const skip = Math.max(0, Math.floor(Math.random() * blogsCount) - 6);
  const randomBlogs = await db.blog.findMany({
    take: 6,
    skip: skip,
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      coverImageUrl: true,
      metaTitle: true,
      metaDescription: true,
      categoryId: true,
      metaKeywords: true,
      createdAt: true,
      updatedAt: true,
      views: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  return (
    <AppLayout>
      <BlogSlider blogs={slideBlogs} />
      <div className="flex items-center mt-[100px] gap-[40px]">
        <div className="w-[60%]">
          <Image
            src={latestBlogs[0].coverImageUrl as string}
            alt={latestBlogs[0].title}
            width={100}
            className="w-full h-auto object-cover rounded-lg"
            height={100}
          />
          <p
            className="blog-content mt-[20px]"
            dangerouslySetInnerHTML={{
              __html: latestBlogs[0].content.substring(0, 300) + "...",
            }}
          />
          <div className="flex items-center gap-2 mt-5">
            <Image
              src={
                "https://img.freepik.com/premium-psd/happy-robot-3d-ai-character-chat-bot-mascot-gpt-chatbot-icon-artificial-intelligence_95505-482.jpg?semt=ais_hybrid&w=740"
              }
              alt=""
              className="w-[40px] h-[40px] rounded-lg"
              width={100}
              height={100}
            />
            <p className="text-sm font-bold">Ai</p>
            <Badge variant={"secondary"} className="bg-violet-400 text-white">
              {latestBlogs[0]?.category?.name}
            </Badge>
            <p className="text-sm text-secondary">
              {moment(latestBlogs[0].createdAt).format("MMM d, YYYY")}
            </p>
            <div className="w-[6px] h-[6px] bg-secondary rounded-full"></div>
            <div className="text-sm text-secondary">8min</div>
          </div>
        </div>
        <div className="w-[40%] flex flex-col gap-8">
          {latestBlogs.splice(1).map((blog) => (
            <div key={blog.id} className="flex items-center gap-5">
              <Image
                className="w-[45%] h-auto shrink-0 rounded-md"
                src={blog.coverImageUrl as string}
                alt={blog.title}
                width={100}
                height={100}
              />
              <div className="">
                <p className="text-xl font-bold line-clamp-2">{blog.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-sm text-secondary">
                    {moment(blog.createdAt).format("MMM D,YYYY")}
                  </p>
                  <div className="w-[6px] h-[6px] bg-secondary rounded-full"></div>
                  <p className="text-sm text-secondary">8min</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-[80px]">
        <p className="text-2xl font-black">Most Popular Blogs</p>
        <div className="mt-[60px] grid gap-y-8 grid-cols-3 gap-5">
          {mostPopularBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
      <div className="mt-[80px]">
        <p className="text-2xl font-black">Random Blogs</p>
        <div className="mt-[30px] grid gap-y-8 grid-cols-3 gap-5">
          {randomBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
