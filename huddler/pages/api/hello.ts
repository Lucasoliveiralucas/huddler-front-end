// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withSSRContext } from 'aws-amplify';
import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {Auth} = withSSRContext()
  const username = await Auth.currentSession();
  console.log(username)

  res.status(200).send('hi')

}
