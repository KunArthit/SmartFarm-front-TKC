import BlogDetails from "@/components/blogs/BlogDetails";
import Footer1 from "@/components/footers/Footer1";
import Header7 from "@/components/headers/Header7";
import Nav from "@/components/headers/Nav";
import React from "react";

export const metadata = {
  title: "Blog Details || TKC FarmSuk - Ecommerce",
  description: "TKC FarmSuk - Ecommerce",
};

const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default async function Page({ params }) {
  const { id } = params;
  
  // You can optionally fetch the blog data server-side for SEO benefits
  // This is optional as BlogDetails will also fetch data client-side if needed
  let blog = null;
  try {
    const response = await fetch(`${apiEndpoint}/blog/${id}`);
    if (response.ok) {
      blog = await response.json();
    }

    console.log("Fetched blog data:", blog);
  if (!blog) {
      throw new Error("Blog not found");
    }
  } catch (error) {
    console.error("Error fetching blog data:", error);
    // Will let the client-side component handle the error
  }

  return (
    <>
      <Header7 />
      <Nav />
      <BlogDetails blog={blog} postId={id} />
      {/* <RelatedBlogs /> */}
      <Footer1 />
    </>
  );
}