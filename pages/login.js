import { signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import '../src/app/globals.css';

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push('/admin');
    }
  }, [session, router]);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-main-950 text-white">
        <div className="container mx-auto p-8 bg-[#171727] rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-8">Login</h1>
          <button
            onClick={() => signIn('discord')}
            className="px-4 py-2 font-semibold bg-[#2E2E3F] text-white rounded-md"
          >
            Login with Discord
          </button>
        </div>
      </div>
    </>
  );
}