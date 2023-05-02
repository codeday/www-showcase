import { getSession } from 'next-auth/client';
import { mintToken } from '../../util/token';

export default async (req, res) => {
  const session = await getSession({ req });
  if (!session?.user?.admin) throw new Error('mint-token API is only available for admins');
  console.log(req.query)
  res.send(mintToken(session, req.query.programId, req.query.eventGroupId, req.query.eventId, req.query.regionId));
}