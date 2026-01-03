import { GetServerSideProps } from "next"
import { handleGetPostById } from "@/api/handle_login"
import { cache } from "@/utils/cache"
import { CACHE_KEYS } from "@/constants/endpoint"
import Metadata from "@/components/Metadata" 
import Link from "next/link"
import Loading from "@/components/Loading"
import { fetchNewsLatest } from "@/api/fetchData";
import NewsLatest from "@/components/News/NewsLatest";

interface NewsDetailProps {
    postData: any;
    dataSource: 'cache' | 'api';
    cacheAge: number | null; 
    newsLatestData: any[];
} 

export default function NewsDetail({ postData, dataSource, cacheAge, newsLatestData }: NewsDetailProps) {

  console.log('Post data:', postData);
  console.log('Data source:', dataSource);
  console.log('Cache age:', cacheAge);
  
  if (!postData) {
    return (
      <Loading show={true} />
    );
  }
  
  return (
    <div className="container my-8">
      <div className="bg-background3 rounded-t-2xl overflow-hidden border border-line mb-6">
        <Metadata title={postData.title || "News"} />
        <Link href="/news" className="p-4 flex items-center gap-3 border-b-[0.5px] border-background bg-background3 rounded-t-xl overflow-hidden">
            <img src='/icons/back.svg' alt="Back" className="w-3 h-3 mr-[2px] mt-[2px]" />
            <h2 className="text-lg font-bold text-center">Quay lại</h2>
        </Link>
        {postData.image && (
          <img 
            src={postData.image} 
            alt={postData.title || "Post image"} 
            className="w-full overflow-hidden"
          />
        )}
      </div>
      <div className="flex gap-6 flex-col">
        <div className="main-content">  
          
          <div className="bg-background3 rounded-2xl overflow-hidden px-4 pb-8 border border-line"> 
            {/* Post Content - HTML */}
            {postData.content && (
              <div 
                className="post-detail-content"
                dangerouslySetInnerHTML={{ __html: postData.content }}
              />
            )}
          </div> 
        </div>
        <div className="nav-content">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Tin tức</h2>

            <Link href="/news" className="hover:underline">Xem tất cả</Link>
          </div>
          <NewsLatest newsLatestData={newsLatestData} />
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Lấy postId từ URL params: /news/123 -> id = "123"
  const newsCacheKey = CACHE_KEYS.NEWS_LATEST();
  const postId = context.params?.id as string;
  
  if (!postId) {
    return {
      notFound: true,
    };
  }

  // Tạo cache key dựa trên postId: "post-detail-123"
  const cacheKey = CACHE_KEYS.POST_DETAIL(postId);
  
  // Check cache first
  const cacheResult = cache.getWithInfo<any>(cacheKey);
  let postData: any | null = null;
  let dataSource: 'cache' | 'api' = 'api';
  let cacheAge: number | undefined;
  
  if (!cacheResult) {
    // Fetch from API if not in cache
    const result = await handleGetPostById(postId);
    
    if (result.success && result.data) {
      const data = result.data?.data || result.data?.response || result.data;
      postData = data;
      cache.set(cacheKey, postData, 60000); // Cache for 1 minute
      dataSource = 'api';
    } else {
      postData = null;
      dataSource = 'api';
    }
  } else {
    postData = cacheResult.data;
    cacheAge = Math.round(cacheResult.age / 1000); // Convert to seconds
    dataSource = 'cache';
  }

  let newsLatestData = cache.get<any[]>(newsCacheKey);
  
  if (!newsLatestData) {
    const result = await fetchNewsLatest();
    
    if (result.success && result.data) {
      // result.data đã được parse đúng từ fetchNewsLatest
      const data = result.data;
      newsLatestData = Array.isArray(data) ? data : [];
      // Cache for 1 minute (60000 milliseconds)
      cache.set(newsCacheKey, newsLatestData, 60000);
      console.log('✅ Fetched and cached NEWS_LATEST:', newsLatestData.length, 'items');
    } else {
      console.warn('⚠️ Failed to fetch NEWS_LATEST:', result.message || 'Unknown error');
      newsLatestData = [];
    }
  } else {
    console.log('✅ Using cached NEWS_LATEST:', newsLatestData.length, 'items');
  } 

  return {
    props: {
      postData: postData || null,
      dataSource,
      cacheAge: cacheAge ?? null,
      postId,
      newsLatestData: newsLatestData || [],
    },
  };
} 