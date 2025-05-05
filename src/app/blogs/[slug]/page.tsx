import BlogCard from "@/components/BlogCard";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/layouts/AppLayout";
import db from "@/lib/db";
import { routes } from "@/lib/routes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const blogs = await db.blog.findMany({
    select: {
      slug: true,
    },
  });
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

const Page = async ({ params }: Props) => {
  const { slug } = await params;
  const blog = await db.blog.findUnique({
    where: {
      slug: decodeURIComponent(slug),
    },
  });

  const relatedPosts = await db.blog.findMany({
    where: {
      categoryId: blog?.categoryId,
      NOT: {
        id: blog?.id,
      },
    },
    orderBy: {
      // Get random posts using random ordering
      createdAt: "desc",
    },
    take: 3,
  });

  const count = await db.blog.count();
  const skip = Math.max(0, Math.floor(Math.random() * count) - 3);
  const randomBlogs = await db.blog.findMany({
    where: {
      NOT: {
        id: blog?.id,
      },
    },
    skip: skip,
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
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  if (!blog) {
    return <div>Blog Post not found</div>;
  }
  return (
    <AppLayout>
      <div className=" flex  gap-8 mt-10">
        <div className="w-[65%]">
          <h1 className="text-3xl font-bold">{blog.title}</h1>
          <Image
            className="w-full h-auto object-cover my-5"
            src={blog.coverImageUrl as string}
            width={100}
            height={100}
            alt={blog.title}
          />
          <p
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
        <div className="w-[35%] mt-10">
          {relatedPosts.length > 0 && (
            <>
              <h1 className="text-2xl font-bold">Related Posts</h1>
              <div className="flex flex-col gap-5 mt-5">
                {relatedPosts.map((post) => (
                  <div key={post.id} className="flex gap-5">
                    <Image
                      className="w-[45%] h-auto shrink-0 rounded-md"
                      src={post.coverImageUrl as string}
                      alt={post.title}
                      width={100}
                      height={100}
                    />
                    <div className="">
                      <p className="text-xl font-bold line-clamp-2">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-sm text-secondary">
                          {new Date(post.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                        <div className="w-[6px] h-[6px] bg-secondary rounded-full"></div>
                        <p className="text-sm text-secondary">8min</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {categories.length > 0 && (
            <>
              <h1 className="text-2xl font-bold mt-10">Categories</h1>
              <div className="flex flex-wrap gap-2 mt-5">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={routes.BLOGS + `?categories=${category.slug}`}
                  >
                    <Badge className="bg-violet-400 text-white">
                      {category.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="mt-10">
        <h1 className="text-2xl font-bold text-text">Blog You May Like</h1>
        <div className="mt-10 grid grid-cols-3 gap-5">
          {randomBlogs.map((blog) => (
            <BlogCard blog={blog} key={blog.id} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Page;
