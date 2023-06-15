import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return fetch('https://api.creatomate.com/v1/templates', {
    headers: {
      'Authorization': `Bearer ${process.env.CREATOMATE_API_KEY}`,
    },
  })
    .then(templates => templates.json())
    .then(json => res.status(200).json(json))
}
