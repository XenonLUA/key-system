import { useState, useEffect } from 'react';
import { parseCookies, setCookie } from 'nookies';
import { useRouter } from 'next/router';
import Head from 'next/head';
import '../src/app/globals.css';
import { FaSpinner, FaCopy } from 'react-icons/fa';

const KeysPage = () => {
  const router = useRouter();
  const [keyId, setKeyId] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const storedKeyData = parseCookies();
    const storedKeyId = storedKeyData.keyId;
    const storedExpire = storedKeyData.expire;

    if (storedKeyId) {
      setKeyId(storedKeyId);
      const expirationTime = new Date(storedExpire).getTime();
      const updateRemainingTime = () => {
        const currentTime = new Date().getTime();
        const timeDifference = Math.max(0, expirationTime - currentTime);

        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        setTimeLeft({
          hours,
          minutes,
          seconds,
        });
      };

      updateRemainingTime();
      setTimeout(() => {
        setLoading(false);
      }, 500);
      const intervalId = setInterval(updateRemainingTime, 1000);

      return () => clearInterval(intervalId);
    } else {
      const verifyid = router.query.verifyid;
      if (verifyid) {
        fetch('/api/keys', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: process.env.auth,
            'verifyid': verifyid,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === 'success') {
              setKeyId(data.data.keyId);

              const expireDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
              setCookie(null, 'keyId', data.data.keyId, {
                maxAge: 24 * 60 * 60,
                expires: expireDate,
                path: '/',
              });
              setCookie(null, 'expire', expireDate.toISOString(), {
                maxAge: 24 * 60 * 60,
                expires: expireDate,
                path: '/',
              });

              setTimeLeft({
                hours: 24,
                minutes: 0,
                seconds: 0,
              });

              router.push('/key');
              setLoading(false);
            } else {
              console.error('Error generating key:', data.message);
            }
          })
          .catch((error) => {
            console.error('Error generating key:', error);
          });
      } else {
        console.error('Error: Internal Error 500');
      }
    }
  }, [router.query.verifyid]);

  setTimeout(() => {
    setLoading(false);
  }, 2000);

  const handleCopy = () => {
    navigator.clipboard.writeText(keyId);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <>
      <Head>
        <title>Key System</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-main-950 text-white relative">
        <main className="container mx-auto p-8 bg-[#171727] w-[1000px] rounded-lg shadow-lg">
          {loading ? (
            <div className="flex items-center justify-center">
              <FaSpinner className="animate-spin text-blue-600 mr-2" />
              <span>Loading...</span>
            </div>
          ) : (
            <div className="text-center">
              {keyId ? (
                <>
                  <div className="mb-4">
                    <h2 className="text-3xl font-bold">Key System</h2>
                    <p className="text-lg mb-4">Thanks for doing our key system! Here is your 24 hour key: </p>
                    <p className="flex gap-2 text-lg font-bold bg-[#2E2E3F] w-[max-content] py-3 px-6 rounded-lg mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 20 20" fill="#D5D5D5">
                      <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                      <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                    </svg>
                    {keyId}</p>
                    <button
                      className="flex gap-1 items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-lg"
                      onClick={handleCopy}
                    >
                      <FaCopy className="mr-2" /> Copy
                    </button>
                    {copied && <span className="ml-2 text-green-600">Key copied</span>}
                  </div>
                  <p className="text-lg mb-8">
                    Time left: {timeLeft.hours} hours, {timeLeft.minutes} minutes, {timeLeft.seconds} seconds
                  </p>
                </>
              ) : (
                <p className="text-red-500">Error: Please try again</p>
              )}
            </div>
          )}
        </main>
        <footer className="fixed bottom-0 w-full text-gray-400 text-center py-4">
          © 2023 SectScans Inc. All rights reserved
        </footer>
      </div>
    </>
  );
};



export default KeysPage;