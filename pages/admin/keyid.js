import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import '../../src/app/globals.css';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FaSpinner } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [verifyIds, setVerifyIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchVerifyIds();
      const interval = setInterval(fetchVerifyIds, 1000);
      return () => clearInterval(interval);
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status]);

  const fetchVerifyIds = async () => {
    try {
      const response = await fetch('/api/adminkeyid', {
        headers: {
          Authorization: process.env.auth,
        },
      });
      const json = await response.json();
      if (response.ok) {
        setVerifyIds(json.data);
      } else {
        console.error(json.message);
      }
    } catch (error) {
      console.error('An error occurred');
    }
  };

  const formatTimeLeft = (timeLeft) => {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const capitalizeFirstLetter = (str) => {
    try {
      return str.toLowerCase().replace(/^\w|\s\w/g, (letter) => letter.toUpperCase());
    } catch (error) {
      return "Error: Something went wrong";
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleBack = () => {
    router.push('/admin');
  };

  return (
    <>
      <Head>
        <title>KeyIds</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-main-950 text-white">
        {status === "authenticated" && (
          <button onClick={handleBack} className="absolute top-4 left-4 bg-[#2E2E3F] text-white py-2 px-4 rounded-lg">Back</button>
        )}
        {status === "authenticated" && (
          <main className="container mx-auto p-8 bg-[#171727] rounded-lg shadow-lg">
            {loading ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin text-blue-600 mr-2" />
                <span>Loading...</span>
              </div>
            ) : (
              <>
                <h1 className="text-4xl font-bold mb-8">KeyIds</h1>
                <div className="mb-4">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    placeholder="Search by keyId, IP"
                    className="p-2 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none"
                  />
                </div>
                {verifyIds.length === 0 ? (
                  <p>No key IDs found</p>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {verifyIds.map((verifyId) => {
                      const creationTime = new Date(verifyId.createdAt).getTime();
                      const currentTime = new Date().getTime();
                      const timeElapsed = Math.floor((currentTime - creationTime) / 1000);
                      const expiresIn = Math.max(0, 24 * 60 * 60 - timeElapsed);

                      return (
                        <div key={verifyId._id} className="border border-gray-600 p-4">
                          <h3>Verify ID: {verifyId.keyid}</h3>
                          <p>IP: {verifyId.ip}</p>
                          <p>Time Left: {formatTimeLeft(expiresIn)}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </main>
        )}
        <footer className="fixed bottom-0 w-full text-gray-400 text-center py-4">
          © 2023 SectScans Inc. All rights reserved
        </footer>
      </div>
    </>
  );
}
