import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const PreviewEditor = dynamic(() => import('../../components/PreviewEditor'), { ssr: false });

export default function Template() {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>Video Preview Demo</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {router.query.id
        ? <PreviewEditor templateId={router.query.id} />
        : <div>Missing template ID</div>
      }
    </div>
  );
}
