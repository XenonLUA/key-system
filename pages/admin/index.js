import Head from 'next/head';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import '../../src/app/globals.css';
import { FaSpinner } from 'react-icons/fa';

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <>
        <Head>
          <title>Loading</title>
        </Head>

        <div className="min-h-screen flex items-center justify-center bg-main-950 text-white">
          <main className="container mx-auto p-8 bg-[#171727] w-[1000px] rounded-3xl shadow-lg">
            <h1 className="text-4xl font-bold mb-8">Loading</h1>
            <div className="flex items-center justify-center">
              <FaSpinner className="animate-spin text-blue-600 mr-2" />
              <span>Loading...</span>
            </div>
          </main>
          <footer className="fixed bottom-0 w-full text-gray-400 text-center py-4">
            © 2023 SectScans Inc. All rights reserved
          </footer>
        </div>
      </>
    );
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  if (status === 'authenticated') {
    const handleButtonClick = (type) => {
      if (type === 'verifyIds') {
        router.push('admin/verifyid');
      } else if (type === 'keyIds') {
        router.push('admin/keyid');
      }
    };

    const handleLogout = async () => {
      await signOut();
      router.push('/login');
    };

    return (
      <>
        <Head>
          <title>Admin Panel</title>
        </Head>
    
        <div className="min-h-screen flex items-center bg-main-950 text-white">
          <main className="container flex flex-col items-start mx-auto gap-2.5 pr-4 mt-7 mb-8 w-[1000px] max-w-full p-8 bg-[#171727] rounded-3xl shadow-lg">
            <button
              onClick={handleLogout}
              className="absolute top-4 right-5 font-semibold bg-[#2E2E3F] text-white py-2 px-6 rounded-lg"
            >
              Logout
            </button>
            <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>
            <div className="flex justify-center mb-4">
            <button
              onClick={() => handleButtonClick('verifyIds')}
              className="flex flex-col items-center justify-center w-full px-4 py-2 bg-[#2E2E3F] text-base font-bold text-white rounded-md mr-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#D5D5D5" class="w-10 h-10">
                <path fill-rule="evenodd" d="M2.25 4.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875V17.25a4.5 4.5 0 1 1-9 0V4.125Zm4.5 14.25a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clip-rule="evenodd" />
                <path d="M10.719 21.75h9.156c1.036 0 1.875-.84 1.875-1.875v-5.25c0-1.036-.84-1.875-1.875-1.875h-.14l-8.742 8.743c-.09.089-.18.175-.274.257ZM12.738 17.625l6.474-6.474a1.875 1.875 0 0 0 0-2.651L15.5 4.787a1.875 1.875 0 0 0-2.651 0l-.1.099V17.25c0 .126-.003.251-.01.375Z" />
              </svg>
              <span class="mt-2">VerifyIds</span>
            </button>
              <button
                onClick={() => handleButtonClick('keyIds')}
                className="flex flex-col items-center justify-center w-full px-4 py-2 bg-[#2E2E3F] text-base font-bold text-white rounded-md mr-4"
              >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#D5D5D5" class="w-8 h-8">
                <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z" />
                <path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z" />
              </svg>
              <span class="mt-2">KeyIds</span>
              </button>
            </div>
          </main>
          <footer className="fixed bottom-0 w-full text-gray-400 text-center py-4">
            © 2023 SectScans Inc. All rights reserved
          </footer>
        </div>
      </>
    );
  }
}