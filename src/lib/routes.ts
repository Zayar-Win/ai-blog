export const routes = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  BLOGS: "/blogs",
  BLOG_DETAIL: (slug: string) => `/blogs/${slug}`,
};
