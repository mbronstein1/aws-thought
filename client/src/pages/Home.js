import React, { useState, useEffect } from 'react';
import ThoughtList from '../components/ThoughtList';
import ThoughtForm from '../components/ThoughtForm';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [thoughts, setThoughts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        const _data = data.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        setThoughts([..._data]);
        setIsLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [thoughts]);

  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className='col-12 mb-3'>
          <ThoughtForm setThoughtList={setThoughts} />
        </div>
        <div className={`col-12 mb-3 `}>
          {!isLoaded ? <div>Loading...</div> : <ThoughtList thoughts={thoughts} setThoughts={setThoughts} title='Some Feed for Thought(s)...' />}
        </div>
      </div>
    </main>
  );
};

export default Home;
