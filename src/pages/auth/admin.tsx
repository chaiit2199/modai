import { useEffect, useState } from "react"
import { GetServerSideProps } from "next"
import { getUser, isAuthenticated, User } from "@/utils/auth"
import { handleGetAllPosts } from "@/api/handle_login"
import { cache } from "@/utils/cache"
import { CACHE_KEYS } from "@/constants/endpoint"
import Metadata from "@/components/Metadata"
import Loading from "@/components/Loading"
import Tabs from "@/components/Tabs"
import PostsManagement from "@/components/Admin/PostsManagement"
import CreatePost from "@/components/Admin/CreatePost"

const adminTabs = [
  {
    "id": "posts",
    "label": "Quản lý Bài viết"
  },
  {
    "id": "create",
    "label": "Thêm mới bài viết"
  }
];

interface AdminProps {
  user: User | null;
  postsData: any[];
}

export default function Admin({ user: serverUser, postsData: initialPostsData }: AdminProps) {
  const [user, setUser] = useState<User | null>(serverUser)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(adminTabs[0].id);
  const [postsData] = useState(initialPostsData);

  useEffect(() => {
    // Client-side check (fallback if server-side check failed)
    if (!serverUser) {
      if (!isAuthenticated()) {
        window.location.href = "/auth/login"
        return
      }

      const userData = getUser()
      if (userData) {
        if (userData.role !== "admin") {
          window.location.href = "/auth/profile"
          return
        }
        setUser(userData)
      } else {
        window.location.href = "/auth/login"
      }
    }
  }, [serverUser])


  if (isLoading) {
    return (
      <Loading show={true} />
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container my-8 bg-background3 rounded-2xl overflow-hidden p-4 border border-line h-full flex-auto">
      <Metadata title="Admin" />
      <Tabs tabs={adminTabs} switchTab={(id) => setActiveTab(id)} menuStyle="style-2" />

      <div className="mt-4">
        {activeTab === "posts" && (
          <PostsManagement postsData={postsData} user={user} />
        )}
        {activeTab === "create" && (
          <CreatePost user={user} />
        )}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get token from cookies (server-side)
  const cookies = context.req.headers.cookie || '';
  const tokenMatch = cookies.match(/access_token=([^;]+)/);
  const accessToken = tokenMatch ? tokenMatch[1] : null;

  // Check if user is authenticated
  if (!accessToken) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  // Decode token to check role (server-side)
  let user: User | null = null;
  try {
    const payload = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString());
    user = {
      id: parseInt(payload.sub) || payload.id,
      username: payload.username,
      role: payload.role,
      email: payload.email,
    };

    // Check if user role is "admin"
    if (user.role !== "admin") {
      return {
        redirect: {
          destination: '/auth/profile',
          permanent: false,
        },
      };
    }
  } catch (e) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

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
      user,
      postsData: postsData || [],
    },
  };
}

