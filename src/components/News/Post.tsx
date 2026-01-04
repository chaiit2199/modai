import Link from 'next/link' 

interface PostProps {
    data: any;
    isFirst?: boolean;
}

export default function Post({ data, isFirst = false }: PostProps) {
    // Kiểm tra data hợp lệ
    if (!data || data === null || typeof data !== 'object') {
        return null;
    }

    const styleClass = isFirst ? 'style1' : 'style2';
    
    // Format ngày từ data.create_date theo format DD/MM/YYYY
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString; // Nếu không parse được, trả về nguyên bản
            
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } catch (error) {
            return dateString; // Nếu có lỗi, trả về nguyên bản
        }
    };

    // Render image hoặc ngày từ data.create_date
    const renderImageOrDate = () => {
        if (!data?.image) {
            const displayDate = data?.create_date ? formatDate(data.create_date) : '';
            return (
                <div className='post-image-placeholder'>
                    <div className='post-date-card'>
                        <p className='post-date-label'>Tin tức</p>
                        <p className='post-date-main'>{displayDate}</p>
                        <div className='post-date-divider'></div>
                    </div>
                </div>
            );
        }
        return <img src={data.image} alt="Slide Image" className='post-image'/>;
    };

    const postUrl = data?.search ? `/news/${data.search}` : '#';
    const postTitle = data?.title || 'Không có tiêu đề';
    const publishedAgo = data?.published_ago || '';
    const createDate = data?.create_date || '';

    if(isFirst){
        return (
            <Link href={postUrl} className="post style1 mb-8">
              {renderImageOrDate()}
              <h5  className='post-title'>{postTitle}</h5>
              <p className="post-date">
              {publishedAgo}
              </p>
            </Link> 
        )
    } else {
        return (
            <Link href={postUrl} className="post style2">
                {renderImageOrDate()}
                <div className="post-content">
                  <h5  className='post-title'> {postTitle} </h5>
                  <p className="post-date">
                  {createDate}
                  </p>
                </div>
            </Link>

            )
        }
}

