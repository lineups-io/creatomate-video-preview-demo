import Head from 'next/head';
import dynamic from 'next/dynamic';

const PreviewEditor = dynamic(() => import('../components/PreviewEditor'), { ssr: false });

export default function Home() {
  return (
    <div>
      <Head>
        <title>Video Preview Demo</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <PreviewEditor templateId='99e7a6ab-70cf-46be-b6fe-70efcc206206' />
    </div>
  );
}
