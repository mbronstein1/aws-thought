import React, { useState, useRef } from 'react';

const ThoughtForm = ({ setThoughtList }) => {
  const [formState, setFormState] = useState({
    username: '',
    thought: '',
  });
  const [characterCount, setCharacterCount] = useState(0);

  const fileInput = useRef(null);

  // update state based on form input changes
  const handleChange = event => {
    if (event.target.value.length <= 280) {
      setFormState({ ...formState, [event.target.name]: event.target.value });
      setCharacterCount(event.target.value.length);
    }
  };

  // submit form
  const handleFormSubmit = event => {
    event.preventDefault();

    const postData = async () => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();
      console.log(data);
      setThoughtList(prev => [{ username: formState.username, thought: formState.thought, createdAt: new Date().toISOString() }, ...prev]);
    };

    postData();

    // clear form value
    setFormState({ username: '', thought: '' });
    setCharacterCount(0);
  };

  const handleImageUpload = e => {
    e.preventDefault();

    const data = new FormData();
    data.append('image', fileInput.current.files[0]);

    const postImage = async () => {
      try {
        const response = await fetch('/api/image-upload', {
          mode: 'cors',
          method: 'POST',
          body: data,
        });

        if (!response.ok) throw new Error(response.statusText);

        const postResponse = await response.json();
        setFormState(prev => ({ ...prev, image: postResponse.Location }));
        console.log('postImage: ', postResponse.Location);
        return postResponse.Location;
      } catch (err) {
        console.log(err);
      }
    };

    postImage();
  };

  return (
    <div>
      <p className={`m-0 ${characterCount === 280 ? 'text-error' : ''}`}>Character Count: {characterCount}/280</p>
      <form className='flex-row justify-center justify-space-between-md align-stretch' onSubmit={handleFormSubmit}>
        <input placeholder='Name' name='username' value={formState.username} className='form-input col-12 ' onChange={handleChange}></input>
        <textarea placeholder="Here's a new thought..." name='thought' value={formState.thought} className='form-input col-12 ' onChange={handleChange}></textarea>
        <label className='form-input col-12  p-1'>
          Add an image to your thought:
          <input type='file' ref={fileInput} className='form-input p-2' />
          <button className='btn' onClick={handleImageUpload} type='submit'>
            Upload
          </button>
        </label>
        <button className='btn col-12 ' type='submit'>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ThoughtForm;
