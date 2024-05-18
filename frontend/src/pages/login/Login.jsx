import React, { useState } from 'react'
import useLogin from '../../hooks/useLogin';

const Login = () => {
  const [username, setUsername] = useState("")

  const {loading, login} = useLogin()

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username);
  }

  return (
    <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
      <div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-30'>
        <h1 className='text-3xl font-semibold text-center text-gray-200'>
          Login <span className='text-blue-500'>ChatApp</span>
        </h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label className='label p-2'>
              <span className='text-lg label-text text-gray-800'>Username</span>
            </label>
            <input 
              type='text' 
              placeholder='Enter username' 
              className='w-full input input-bordered h-15'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <button className='btn btn-block btn-md mt-4'
            disable={`${loading}`}
          >
            {loading? <span className='loading loading-spinner'></span>: "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;