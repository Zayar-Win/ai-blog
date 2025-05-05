import Container from "@/components/container";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import Link from "next/link";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const AppLayout = ({ children }: Props) => {
  return (
    <div>
      <Container>
        <div className="flex py-5 items-center justify-between ">
          <div>
            <p className="text-xl font-bold tracking-[1px]">TrendForge</p>
          </div>
          <div>
            <ul className="flex items-center gap-12">
              <li className="hover:underline">
                <Link href={routes.HOME}>Home</Link>
              </li>
              <li className="hover:underline">
                <Link href={routes.BLOGS}>Blogs</Link>
              </li>
              <li className="hover:underline">
                <Link href={routes.ABOUT}>About</Link>
              </li>
              <li className="hover:underline">
                <Link href={routes.CONTACT}>Contact</Link>
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-4">
            <Button variant={"outline"}>Login</Button>
            <Button>Sign Up</Button>
            <ModeToggle />
          </div>
        </div>
        {children}
        <footer className="mt-[100px]   py-16">
          <div className="">
            <div className="grid grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">About Us</h3>
                <p className="text-text">
                  Your trusted source for the latest insights and news in
                  artificial intelligence, technology, and digital innovation.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/" className="text-text hover:text-violet-500">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="/blog" className="text-text hover:text-violet-500">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="/about"
                      className="text-text hover:text-violet-500"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact"
                      className="text-text hover:text-violet-500"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Categories</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/category/ai"
                      className="text-text hover:text-violet-500"
                    >
                      Artificial Intelligence
                    </a>
                  </li>
                  <li>
                    <a
                      href="/category/tech"
                      className="text-text hover:text-violet-500"
                    >
                      Technology
                    </a>
                  </li>
                  <li>
                    <a
                      href="/category/digital"
                      className="text-text hover:text-violet-500"
                    >
                      Digital
                    </a>
                  </li>
                  <li>
                    <a
                      href="/category/innovation"
                      className="text-text hover:text-violet-500"
                    >
                      Innovation
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Newsletter</h3>
                <p className="text-text mb-4">
                  Subscribe to our newsletter for updates
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-4 py-2 rounded-lg border border-gray-300 flex-1"
                  />
                  <button className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-center text-text">
                © {new Date().getFullYear()} AI Blog. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </Container>
    </div>
  );
};

export default AppLayout;
