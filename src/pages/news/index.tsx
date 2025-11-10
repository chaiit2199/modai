import { useEffect, useState } from "react"
import { GetServerSideProps } from "next"
import { handleGetAllPosts } from "@/api/handle_login"
import { cache } from "@/utils/cache"
import { CACHE_KEYS } from "@/constants/endpoint"
import Metadata from "@/components/Metadata" 
import Post from "@/components/News/Post"
import { Link } from "lucide-react"

interface NewsProps {
    postsData: any[];
} 

export default function News({ postsData: initialPostsData }: NewsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [postsData] = useState(initialPostsData);

  console.log(postsData);
  
  return (
    <div className="container my-8 px-0 bg-background3 rounded-2xl overflow-hidden border border-line">
        <Metadata title="News" />
        <a href="/" className="mb-6 flex items-center p-4 gap-3 border-line border-b bg-background3 rounded-t-xl overflow-hidden">
            <img src='/icons/back.svg' alt="Back" className="w-3 h-3 mr-[2px] mt-[2px]" />
            <h2 className="text-lg font-bold text-center">Trang chủ</h2>
        </a>

      <div className="grid grid-cols-4 md:grid-cols-1 gap-4 px-4">
        {postsData.map((item, index) => (
            <Post 
                data={item} 
                key={item.id} 
                isFirst={true}
            />
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch posts data
  const cacheKey = CACHE_KEYS.POSTS_ALL();
  let postsData = cache.get<any[]>(cacheKey);

  if (!postsData) {
    const result = await handleGetAllPosts();
    
    if (result.success && result.data) {
      const data = result.data?.data || result.data?.response || result.data || [];
      postsData = Array.isArray(data) ? data : [];
      // Cache for 1 minute (60000 milliseconds)
      cache.set(cacheKey, postsData, 60000);
    } else {
      postsData = [];
    }
  }

  return {
    props: {
      postsData: postsData || [],
    },
  };
}

