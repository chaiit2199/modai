import { useState } from "react"
import { useRouter } from "next/router"
import { User, getToken } from "@/utils/auth"
import { updatePost, deletePost } from "@/api/handle_login"
import { cache } from "@/utils/cache"
import { CACHE_KEYS } from "@/constants/endpoint"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Loading from "@/components/Loading"
import { Pen, X, Trash2 } from "lucide-react"
import Link from "next/link"

interface PostsManagementProps {
  postsData: any[];
  user: User | null;
}

export default function PostsManagement({ postsData, user }: PostsManagementProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    search: '',
    content: '',
    category: '',
    image: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleEditClick = (post: any) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      search: post.search,
      content: post.content,
      category: post.category,
      image: post.image,
    });
    setShowEditModal(true);
    setError('');
  }

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedPost(null);
    setFormData({title: '', search: '', content: '', category: '', image: ''});
    setError('');
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();
    if (!selectedPost) return;

    setIsSubmitting(true);
    setError('');

    try {
      const token = getToken();
      const postId = selectedPost.id || selectedPost._id;
      const username = user?.username;
      const email = user?.email;
      
      const result = await updatePost(postId, formData, token || undefined, username, email);
      
      if (result.success) {
        // Clear cache and refresh data
        cache.clear(CACHE_KEYS.POSTS_ALL());
        // Refresh page to get updated data
        router.reload();
      } else {
        setError(result.message || 'Có lỗi xảy ra khi cập nhật');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi cập nhật bài viết');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDelete = async (post: any) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa bài viết "${post.title || post.id || post._id}"?`)) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = getToken();
      const postId = post.id || post._id;
      const username = user?.username;
      const email = user?.email;
      
      const result = await deletePost(postId, token || undefined, username, email);
      
      if (result.success) {
        // Clear cache and refresh data
        cache.clear(CACHE_KEYS.POSTS_ALL());
        // Refresh page to get updated data
        router.reload();
      } else {
        setError(result.message || 'Có lỗi xảy ra khi xóa');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi xóa bài viết');
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <Loading show={true} />
    )
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-line">
            <thead>
              <tr className="bg-background">
                <th className="px-4 py-2 text-left border border-line">ID</th>
                <th className="px-4 py-2 text-left border border-line">Tiêu đề</th>
                <th className="px-4 py-2 text-left border border-line">Ngày tạo</th>
                <th className="px-4 py-2 text-left border border-line"></th>
              </tr>
            </thead>
            <tbody>
              {postsData && postsData.length > 0 ? (
                postsData.map((post: any) => (
                  <tr key={post.id || post._id}>
                    <td className="px-4 py-2 border border-line">{post.id || post._id}</td>
                    <td className="px-4 py-2 border border-line">
                      <Link href={`/news/${post.search}`} className="text-blue-500 hover:text-blue-700">{post.title || 'N/A'}</Link>
                    </td>
                    <td className="px-4 py-2 border border-line">{post.create_date || post.created_at || 'N/A'}</td>
                    <td className="px-4 py-2 border border-line text-center">
                      <div className="flex gap-2 justify-center">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditClick(post)}
                        > 
                          <Pen className="w-5 h-5" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(post)}
                          className="text-red-600 hover:text-red-700 hover:border-red-600"
                        > 
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center">Không có bài viết nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="core_modal">
          <div className="core_modal_bg" onClick={handleCloseModal}></div>

          <div className="core_modal_content">
            <div className="core_modal_header">
              <h2 className="text-2xl font-semibold">Chỉnh sửa bài viết</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div> 

            <form onSubmit={handleSubmit} className="flex h-full flex-col flex-auto overflow-y-auto">
              <div className="core_modal_content_body">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2 mt-4">
                    Title
                  </label>
                  <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required className="w-full" />
                </div>

                <div>
                  <label htmlFor="search" className="block text-sm font-medium mb-2 mt-4">
                    Keywords
                  </label>
                  <Input id="search" name="search" value={formData.search} onChange={handleInputChange} required className="w-full" />
                </div>
                
                <div>
                  <label htmlFor="content" className="block text-sm font-medium mb-2 mt-4">
                    Content
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows={10}
                    className="w-full px-3 py-2 border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-2 mt-4">
                    Category
                  </label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-medium mb-2 mt-4">
                    Image URL
                  </label>
                  <Input
                    id="image" name="image" value={formData.image}
                    onChange={handleInputChange} className="w-full" />
                </div> 
              </div>

              <div className="core_modal_footer">
                <Button type="button" variant="outline" onClick={handleCloseModal} disabled={isSubmitting}>
                  Hủy
                </Button>
                <Button
                  type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loading show={true} /> : 'Cập nhật'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

