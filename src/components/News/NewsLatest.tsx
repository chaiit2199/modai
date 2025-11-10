import Loading from '../Loading';
import Post from './Post';

interface NewsLatestProps {
    newsLatestData: any[];
}

export default function NewsLatest({ newsLatestData }: NewsLatestProps) {
    if (!newsLatestData || newsLatestData.length === 0) {
        return <Loading show={true} />;
    }

    return (
        <div className='flex flex-col gap-4'>
            {newsLatestData.map((item, index) => (
                <Post 
                    data={item} 
                    key={item.id || item._id || Math.random()} 
                    isFirst={index === 0}
                />
            ))}
        </div>
    );
}
