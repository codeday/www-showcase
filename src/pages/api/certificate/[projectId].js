import fs from 'fs';
import PDFDocument from 'pdfkit';
import SVGtoPDF from 'svg-to-pdfkit';
import { getSession } from 'next-auth/client';
import { mintToken } from '../../../util/token';
import { tryAuthenticatedApiQuery } from '../../../util/api';
import { GetProjectByIdQuery } from './index.gql';

const template = fs
  .readFileSync('public/certificate/template.svg')
  .toString();

export default async (req, res) => {
  const session = await getSession({ req });
  const { projectId } = req.query;

  const token = session ? mintToken(session) : null;
  const {
    result,
    error,
  } = await tryAuthenticatedApiQuery(GetProjectByIdQuery, { id: projectId }, token);
  if (error) {
    res.statusCode = 404;
    throw error;
  }
  if (!result.showcase.project.members.map((m) => m.username).includes(session.user.nickname)) {
    res.status(401);
    res.send('Unauthorized');
    return;
  }
  const participantName = `${session.user.given_name} ${session.user.family_name}`;
  const eventName = `${result.showcase.project.eventGroup.title}${result.showcase.project.region?.name? ` in ${result.showcase.project.region?.name}`:''}`;
  const doc = new PDFDocument({
    layout: 'landscape',
    size: 'LETTER',
  });
  doc.registerFont('AvenirNext-Regular', 'public/certificate/fonts/AvenirNext-Regular.ttf');
  doc.registerFont('AvenirNext-Bold', 'public/certificate/fonts/AvenirNext-Bold.ttf');
  doc.registerFont('AvenirNext-Italic', 'public/certificate/fonts/AvenirNext-Italic.ttf');
  doc.registerFont('UpheavalTT-BRK-', 'public/certificate/fonts/upheavtt.ttf');
  doc.registerFont('ProximaNova-Bold', 'public/certificate/fonts/Proxima Nova Bold.ttf');

  SVGtoPDF(doc, template.replace('{{participant_name}}', participantName)
    .replace('{{event_name}}', eventName), 0, 0, {
    fontCallback: (family) => family.split(',')[0],
  });
  doc.pipe(res);
  doc.end();
};
