import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const PreviewEditor = dynamic(() => import('../../components/PreviewEditor'), { ssr: false });

export default function Template() {
  const router = useRouter();
  const query = router.query as { id: string };

  return (
    <div>
      <Head>
        <title>Video Preview Demo</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {query.id
        ? <PreviewEditor id={query.id} />
        : <div>Missing template ID</div>
      }
    </div>
  );
}
