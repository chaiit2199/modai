import Link from 'next/link' 

interface PostProps {
    data: any;
    isFirst?: boolean;
}

export default function Post({ data, isFirst = false }: PostProps) {
    if(data === null) return <p>Loading...</p>

    const styleClass = isFirst ? 'style1' : 'style2';

    if(isFirst){
        return (
            <Link href={`/news/${data.search}`} className="post style1 mb-8">
              <img src={data.image} alt="Slide Image" className='post-image'/>
              <h5  className='post-title'>{data.title}</h5>
              <p className="post-date">
              {data.published_ago}
              </p>
            </Link> 
        )
    } else {
        return (
            <Link href={`/news/${data.search}`} className="post style2">
                <img src={data.image} alt="Slide Image" className='post-image'/>
                <div className="post-content">
                  <h5  className='post-title'> {data.title} </h5>
                  <p className="post-date">
                  {data.create_date}
                  </p>
                </div>
            </Link>

            )
        }
}

