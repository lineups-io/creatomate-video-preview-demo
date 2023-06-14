import { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import { Template } from './PreviewEditor';

interface ColumnProps {
  loaded: boolean;
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: column;
`

const Column = styled.div<ColumnProps>`
  width: 200px;

  position: relative;

  ${ Container } {
    position: ${props => props.loaded ? 'relative' : 'absolute'};
  }

  &::before {
    content: '';
    display: ${props => props.loaded ? 'none' : 'block'};
    width: 100%;
    height: 0;
    padding-top: 100%;
  }
`

const Text = styled.h6`
  margin: 10px 0 0 0;
`

const Button = styled.div`
  display: flex;
  flex: 1;

  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  border-radius: 8px;

  cursor: pointer;
`

const PreviewThumbnail = ({ id, name }: Template) => {
  const [data, setData] = useState(null)

  const fetchPreview = () => {
    if (data) return

    fetch('/api/renders', {
      method: 'POST',
      body: id,
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data)
      })
      .catch(error => {
        console.error(error)
      })
  }

  return <Column loaded={data ? true : false}>
    <Container>
      {data ? <img src={data.url} /> : <Button onClick={fetchPreview}>Show Preview</Button>}
      <Link href={`/templates/${id}`}>
        <Text>{name}</Text>
      </Link>
    </Container>
  </Column>
}

export default PreviewThumbnail;
