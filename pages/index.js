import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { obfuscateVerifyId, deobfuscateVerifyId } from './api/obfuscation';
import '../src/app/globals.css';
import { main_url, linkvertise_ID } from '../config.js';

const IndexPage = ({ auth }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const btoa = (str) => {
    var buffer;

    if (str instanceof Buffer) {
      buffer = str;
    } else {
      buffer = Buffer.from(str.toString(), 'binary');
    }
    return buffer.toString('base64');
  };

  const linkvertise = (link, userid) => {
    var base_url = `https://link-to.net/${userid}/${Math.random() * 1000}/dynamic`;
    var href = base_url + '?r=' + btoa(encodeURI(link));
    return href;
  };

  const handleButtonClicklinkvertise = async (url) => {
    try {
      const response = await fetch('/api/verifyid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth,
        },
        body: JSON.stringify({
          provider: 'linkvertise',
        }),
      });

      if (response.ok) {
        setLoading(true);
        const responseData = await response.json();
        const { verifyid } = responseData.data;
        const deobfuscatedVerifyId = deobfuscateVerifyId(verifyid);
        const link = deobfuscatedVerifyId ? linkvertise(url + '?verifyid=' + deobfuscatedVerifyId, `${linkvertise_ID}`) : url;
        setLoading(false);
        window.open(link, '_blank');
      } else {
        const errorText = await response.text();
        console.error('Failed to add verify ID:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error occurred during verify ID creation:', error);
    }
  };

  useEffect(() => {
    const keyIdCookie = document.cookie.split(';').find((cookie) => cookie.trim().startsWith('keyId'));

    if (keyIdCookie) {
      router.push('/key');
    }
  }, []); 


  return (
    <>
      <Head>
        <title>Key System</title>
        <link href="/style.css"
        rel="stylesheet" type="text/css" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-main-950 text-white">
        <main className="btn-primary w-[1000px] container mx-auto p-8 bg-[#171727] rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-8">Key System</h1>
          <p className="text-lg text-center text-gray-300 mb-4">
            Please select what platform you would like to do the key system on.
          </p>

          <div className="flex justify-center">
            <button
              className="btn-primary hover:bg-[#434356] text-white py-3 px-6 rounded-lg text-lg mr-4"
              onClick={() => handleButtonClicklinkvertise(`${main_url}/keysys`)}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Linkvertise'}
            </button>
            <button
              className="btn-primary bg-[#424256] text-white py-3 px-6 rounded-lg text-lg cursor-not-allowed opacity-50"
              disabled
            >
              WorkInk (Coming Soon)
            </button>
          </div>

          <p className="text-center text-gray-300 mt-8">
            Tired of doing our key system?
            <br />
            Purchase Key Bypass today!
          </p>
        </main>
        <footer className="fixed bottom-0 w-full text-gray-400 text-center py-4">
          © 2023 SectScans Inc. All rights reserved
        </footer>
      </div>
    </>
  );
};


export async function getServerSideProps() {
  const auth = process.env.auth;

  return {
    props: {
      auth,
    },
  };
}

export default IndexPage;