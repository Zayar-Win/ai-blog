import db from "@/lib/db";
import { TrendingSearch } from "@/lib/types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

const GEMINIAPIKEY = "AIzaSyCOn5ODX-ITFlwCn5TICjkH9zulIqwu5Wo";

const genAI = new GoogleGenerativeAI(GEMINIAPIKEY);

const getGoogleTrendTopic = async () => {
  const response = await fetch(
    "https://serpapi.com/search.json?engine=google_trends_trending_now&api_key=29f469c7820e0ea21a2261611194f70090092485821f8020116544da078d9ad2"
  );
  const responseJson = await response.json();

  // Get trending searches and find the one with highest search volume
  const trendingSearches = responseJson.trending_searches.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (search: any) => search.trend_breakdown && search.trend_breakdown.length > 0
  );
  const randomIndex = Math.floor(Math.random() * trendingSearches.length);
  return trendingSearches[randomIndex];
};
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getTitleForBlog = async (trend_breakdown: string[]) => {
  const prompt = `Give me the best blog post title based on these trending topics:\n${trend_breakdown.join(
    "\n"
  )}`;

  const completion = await model.generateContent([prompt]);
  const response = await completion.response;
  const text = response.text();
  const titles = Array.from(text.matchAll(/\* \*\*(.*?)\*\*/g)).map(
    (match) => match[1]
  );
  console.log(titles);
  return titles[Math.floor(Math.random() * titles.length)];
};

async function fetchImageFromPexels(description: string) {
  const query = encodeURIComponent(description);
  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${query}&per_page=1`,
    {
      headers: {
        Authorization:
          "URpQQfp06LQI9NYa82UlWpwWauwNRfcb6r88OIPoN222oK9phMZQE1kC",
      },
    }
  );

  if (!response.ok) {
    console.error(`Failed to fetch image for: ${description}`);
    return "";
  }

  const data = await response.json();
  if (data.photos && data.photos.length > 0) {
    return data.photos[0].src.landscape;
  }

  return "";
}

async function replaceImageDescriptionsWithURLs(htmlContent: string) {
  // Regular expression to match image description text within HTML
  const imageDescriptionRegex =
    /<p>(?:Image description:|Image Description:)\s*(.*?)\s*<\/p>/gi;

  // Function to fetch an image URL from Unsplash API based on description
  // async function fetchImageURL(description: string) {
  //   const apiKey = "HGIu7BWJa6234w0OWkTnHJULrCJio8LqmXeH-UdO-EQ"; // Replace with your Unsplash API key
  //   const query = encodeURIComponent(description);
  //   const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${apiKey}`;

  //   try {
  //     const response = await fetch(url);
  //     const data = await response.json();
  //     console.log(data.results[0].urls.regular);
  //     if (data) {
  //       return data.results[0].urls.regular; // Return the URL of the first image
  //     }
  //     return ""; // Return empty if no image found
  //   } catch (error) {
  //     console.error("Error fetching image:", error);
  //     return ""; // Return empty in case of error
  //   }
  // }

  // Replace all image descriptions with <img> tags
  let updatedHTML = htmlContent;

  const matches = [...htmlContent.matchAll(imageDescriptionRegex)];
  console.log(matches);
  for (const match of matches) {
    const description = match[1]; // Extract description
    const imageURL = await fetchImageFromPexels(description); // Fetch the image URL
    if (imageURL) {
      // Replace the image description with an <img> tag
      const imgTag = `<img src="${imageURL}" alt="${description}">`;
      updatedHTML = updatedHTML.replace(match[0], `<p>${imgTag}</p>`); // Replace in HTML
    }
  }

  return updatedHTML;
}

const generateBlog = async (topic: TrendingSearch, title: string) => {
  const prompt = `
        You are a professional blog writer.

      Write a full blog post based on this title: "${title}"

      The blog should include:

      1. A compelling introduction (hook the reader and set context)
      2. 3 to 5 detailed sections with clear subheadings and paragraphs should have at least 200 words each 
      3. And parapraph and header or subheading dont use placeholder text.
      4. An insightful conclusion that summarizes and adds value
      5. A call-to-action (CTA) to engage the reader (e.g., ask a question or suggest sharing)

      Tone:
      - Match the topic 
      - Keep it clear, engaging, and well-structured

      If helpful, feel free to include lists, tips, examples, or short bullet points.

      Make sure blog have to be SEO friendly and also just add image description to find image in each section that you need to add image.

      Most important:
      - Write in a professional tone
      - Blog have to be meaningful dont use placeholder text.
      - Dont add image tag i just need description to generate image.
      -Write image description in paragraph tag only do not add child tag for only image description text(follow this /<p>(?:Image description:|Image Description:)\s*(.*?)\s*<\/p>/gi).

      SEO:
      - Use relevant keywords in the title and subheadings
      - Use relevant headings and subheadings

      Output in HTML format.
  `;
  const blog = await model.generateContent([prompt]);
  const response = await blog.response;

  return response.text();
};

export async function GET() {
  const trendingTopic = await getGoogleTrendTopic();
  let title = await getTitleForBlog(trendingTopic.trend_breakdown);
  // If no title is generated, retry up to 3 times
  let retryCount = 0;
  while (!title && retryCount < 3) {
    const trendingTopic = await getGoogleTrendTopic();
    title = await getTitleForBlog(trendingTopic.trend_breakdown);
    retryCount++;
  }

  if (!title) {
    return NextResponse.json({
      error: "Failed to generate blog title after multiple attempts",
      status: 500,
    });
  }
  const blogData = await generateBlog(trendingTopic, title);
  const $ = cheerio.load(blogData);
  const metaTitle = $("title").text();
  const metaDescription = $('meta[name="description"]').attr("content");
  const bodyMatch = blogData.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : "";
  const updatedBlogWithImage = await replaceImageDescriptionsWithURLs(
    bodyContent
  );
  const category = trendingTopic.categories[0].name;
  const categorySlug = category.toLowerCase().replace(/\s+/g, "-");
  const createdCategory = await db.category.upsert({
    where: {
      slug: categorySlug,
    },
    create: {
      name: category,
      slug: categorySlug,
    },
    update: {
      name: category,
      slug: categorySlug,
    },
  });
  const coverImageUrl = await fetchImageFromPexels(title);
  const createdBlog = await db.blog.create({
    data: {
      title,
      content: updatedBlogWithImage,
      category: {
        connect: {
          id: createdCategory.id,
        },
      },
      coverImageUrl: coverImageUrl,
      metaTitle,
      metaDescription,
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      metaKeywords: trendingTopic.trend_breakdown.join(", "),
    },
  });

  return NextResponse.json({
    title: createdBlog.title,
    message: "Blog Created Successful",
  });
}
