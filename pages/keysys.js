import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { obfuscateVerifyId, deobfuscateVerifyId } from './api/obfuscation';
import '../src/app/globals.css';
import Head from 'next/head';
import { FaSpinner } from 'react-icons/fa';
import { main_url, linkvertise_ID } from '../config.js';

const KeysysPage = () => {
  const router = useRouter();
  const { verifyid } = router.query;
  const [stage, setStage] = useState(0);
  const [provider, setProvider] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchStageAndProviderFromDatabase = async () => {
      try {
        const response = await fetch(`/api/verifyidcheck?verifyid=${verifyid}`);
        if (response.ok) {
          const responseData = await response.json();
          const { stage, provider } = responseData.data;
          setStage(stage);
          setProvider(provider);
        } else {
          setErrorMessage('Failed to fetch stage and provider. Please go to the main page and try again.');
          console.error('Failed to fetch stage and provider:', response.status, await response.text());
        }
      } catch (error) {
        setErrorMessage('Error occurred while fetching stage and provider. Please go to the main page and try again.');
        console.error('Error occurred while fetching stage and provider:', error);
      }
    };

    if (verifyid) {
      fetchStageAndProviderFromDatabase();
    } else {
      setErrorMessage('Error: Verify ID not found. Please try again.');
    }
  }, [verifyid]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (stage === 'stage3') {
        const deobfuscatedVerifyId = verifyid
        window.location.href = `${main_url}/key?verifyid=${deobfuscatedVerifyId}`;
      } else {
        createVerifyId();
      }
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [stage, provider]);

  const url = `${main_url}/keysys`;

  const createVerifyId = async () => {
    try {
      const response = await fetch('/api/verifyid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.auth,
          'verifyid': verifyid,
        },
        body: JSON.stringify({
          provider: router.query.provider,
        }),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        const { verifyid } = responseData.data;
        const deobfuscatedVerifyId = deobfuscateVerifyId(verifyid);
        const link = deobfuscatedVerifyId ? linkvertise(url + '?verifyid=' + deobfuscatedVerifyId, `${linkvertise_ID}`) : url;
        setTimeout(() => {
          window.location.href = link;
        }, 2000);
      } else {
        const errorText = await response.text();
        setErrorMessage('Failed to create verify ID. Please go to the main page and try again.');
        console.error('Failed to create verify ID:', response.status, errorText);
      }
    } catch (error) {
      setErrorMessage('Error occurred during verify ID creation. Please go to the main page and try again.');
      console.error('Error occurred during verify ID creation:', error);
    }
  };  

  function getRemainingStages(stage) {
    if (stage === 'stage1') {
      return '2';
    } else if (stage === 'stage2') {
      return '1';
    } else if (stage === 'stage3') {
      return '0';
    } else {
      return 'NaN';
    }
  }
  
  const capitalizeFirstLetter = (str) => {
    try {
      return str.toLowerCase().replace(/^\w|\s\w/g, (letter) => letter.toUpperCase());
    } catch (error) {
      return "NaN";
    }
  };

  return (
    <>
      <Head>
        <title>Key System</title>
      </Head>
  
      <div className="min-h-screen flex items-center justify-center bg-main-950 text-white">
        <main className="container mx-auto p-8 bg-[#171727] w-[1000px] rounded-3xl shadow-lg">
          {loading ? (
            <div className="flex items-center justify-center">
              <FaSpinner className="animate-spin text-blue-600 mr-2" />
              <span>Loading...</span>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-8">Key System</h1>
              {verifyid && (
                <>
                  <h2 className="font-semibold whitespace-nowrap mb-4">Redirecting to the next stage...</h2>
                  <div className="flex gap-3 font-bold items-center w-[max-content] text-medium px-3 py-2 mt-3.5 whitespace-nowrap rounded-md bg-[#2E2E3F]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                      <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                    </svg>
                    <span className="whitespace-nowrap">
                      Stage: {capitalizeFirstLetter(stage)}
                    </span>
                  </div>
                  <div className="flex gap-3 font-bold items-center w-[max-content] text-medium px-3 py-2 mt-3.5 whitespace-nowrap rounded-md bg-[#2E2E3F]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                    <span className="whitespace-nowrap">
                      Provider: {capitalizeFirstLetter(provider)}
                    </span>
                  </div>
                  <div className="mt-3.5 text-center">
                    You have {getRemainingStages(stage)} more stages to go to complete the key system
                  </div>
                </>
              )}
              {!verifyid && errorMessage && (
                <p className="text-red-500 mt-4">{errorMessage}</p>
              )}
            </>
          )}
        </main>
        <footer className="fixed bottom-0 w-full text-gray-400 text-center py-4">
          © 2023 SectScans Inc. All rights reserved      </footer>
      </div>
    </>
  );
};



export default KeysysPage;
