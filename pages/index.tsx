import { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import Link from 'next/link';


const Column = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 20px;
  padding: 20px;

  a[href] {
    color: black;
  }
`

export default function Home() {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('/api/templates')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No templates</p>

  return (
    <div>
      <Head>
        <title>Video Preview Demo</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Column>
        {data.map(({ id, name }) =>
          <Link key={id} href={`/templates/${id}`}>
            {name}
            {/*<PreviewThumbnail templateId={id} />*/}
          </Link>
        )}
      </Column>
    </div>
  );
}
