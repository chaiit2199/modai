import { useState } from "react"
import { useRouter } from "next/router"
import { User, getToken } from "@/utils/auth"
import { createPost, handleGetAllPosts } from "@/api/handle_login"
import { fetchNewsLatest } from "@/api/fetchData"
import { cache } from "@/utils/cache"
import { CACHE_KEYS } from "@/constants/endpoint"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Loading from "@/components/Loading"

interface CreatePostProps {
  user: User | null;
}

export default function CreatePost({ user }: CreatePostProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '', 
    category: '', 
    image: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = getToken();
      const username = user?.username;
      const email = user?.email;
      
      const result = await createPost(formData, token || undefined, username, email);
      
      if (result.success) {
        setSuccess(result.message || 'Tạo bài viết thành công');
        // Clear form
        setFormData({
          title: '', 
          category: '', 
          image: '',
        });
        
        // Xóa tất cả cache liên quan đến tin tức trước
        cache.clear(CACHE_KEYS.POSTS_ALL());
        cache.clear(CACHE_KEYS.NEWS_LATEST());
        
        // Fetch lại và cập nhật cache ngay lập tức
        try {
          // Fetch lại danh sách posts từ handleGetAllPosts và cập nhật cache
          const postsResult = await handleGetAllPosts();
          if (postsResult.success && postsResult.data) {
            const data = postsResult.data?.data || postsResult.data?.response || postsResult.data || [];
            const postsList = Array.isArray(data) ? data : [];
            // Cập nhật cache với danh sách mới ngay lập tức (TTL 1 phút)
            cache.set(CACHE_KEYS.POSTS_ALL(), postsList, 60000);
          } 
          
          // Fetch lại tin tức mới nhất và cập nhật cache
          const newsResult = await fetchNewsLatest();
          if (newsResult.success && newsResult.data) {
            // newsResult.data đã được parse đúng từ fetchNewsLatest
            const newsData = newsResult.data;
            const newsList = Array.isArray(newsData) ? newsData : [];
            // Cập nhật cache tin tức mới nhất ngay lập tức (TTL 1 phút)
            cache.set(CACHE_KEYS.NEWS_LATEST(), newsList, 60000);
          } 
        } catch (cacheError) {
          console.error('❌ Error updating cache:', cacheError);
        }
        
        // Refresh page after 1 second to show new post
        setTimeout(() => {
          router.reload();
        }, 1000);
      } else {
        setError(result.message || 'Có lỗi xảy ra khi tạo bài viết');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tạo bài viết');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 relative">
      {isSubmitting && (
        <Loading show={true} />
      )}
      {error && (
        <Loading show={true} />
      )} 
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label htmlFor="create-title" className="block text-sm font-medium mb-2">
            Tiêu đề
          </label>
          <Input 
            id="create-title" 
            name="title" 
            value={formData.title} 
            onChange={handleInputChange} 
            required 
            className="w-full" 
          />
        </div>

        <div>
          <label htmlFor="create-category" className="block text-sm font-medium mb-2">
            Danh mục
          </label>
          <Input
            id="create-category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="create-image" className="block text-sm font-medium mb-2">
            Hình ảnh (URL)
          </label>
          <Input
            id="create-image"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            className="w-full"
            placeholder="Nhập URL hình ảnh"
          />
        </div>

        <div className="flex gap-4 justify-end">
          <Button
            type="submit" 
            disabled={isSubmitting}
            className="min-w-[120px] cursor-pointer"
          >
            {isSubmitting ? <Loading show={true} /> : 'Tạo bài viết'}
          </Button>
        </div>
      </form>
    </div>
  )
}

