import { useState, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

function App() {
  const [hasMore, setHasMore] = useState(true);
  const [result, setResult] = useState([]);
  const [skip, setSkip] = useState(0);
  const itemsPerPage = 15;

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`https://jsonplaceholder.typicode.com/posts?_skip=${skip}&_limit=${itemsPerPage}`);
      if (data.length > 0) {
        setResult((prev) => [...prev, ...data]);
        setSkip((skip) => skip + itemsPerPage)
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };

  const debouncedFetchData = hasMore && debounce(fetchData, 500);


  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 20 && hasMore) {
      
      debouncedFetchData();
    }
  };

  useEffect(() => {
    // Initial data fetching
    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore, skip]);

  return (
    <>
      <div>
        {result.map((item, i) => (
          <div key={i}>
            <h3>
              <span style={{ padding: '0px 10px' }}>{i + 1}</span>
              {item.title}
            </h3>
            <p style={{ padding: '0px 10px' }}>{item.body}</p>
          </div>
        ))}
      </div>
      {hasMore && <h4 style={{ textAlign: "center", fontWeight: "bolder", fontSize: "20px" }}>Loading...</h4>}
      {!hasMore && (
        <p style={{ textAlign: 'center' }}>
          <b>Yay! You have seen it all</b>
        </p>
      )}
    </>
  );
}

export default App;
