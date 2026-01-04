import Loading from '../Loading';
import Post from './Post';

interface NewsLatestProps {
    newsLatestData: any[];
}

export default function NewsLatest({ newsLatestData }: NewsLatestProps) {
    if (!newsLatestData || newsLatestData.length === 0) {
        return <Loading show={true} />;
    }

    // Lọc bỏ các item null/undefined trước khi render
    const validNewsData = newsLatestData.filter(item => item && typeof item === 'object');

    if (validNewsData.length === 0) {
        return <Loading show={true} />;
    }

    return (
        <div className='flex flex-col gap-4'>
            {validNewsData.map((item, index) => (
                <Post 
                    data={item} 
                    key={item?.id || item?._id || `news-${index}`} 
                    isFirst={index === 0}
                />
            ))}
        </div>
    );
}
