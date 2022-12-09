import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import SVGtoPDF from 'svg-to-pdfkit';
import { getSession } from 'next-auth/client';
import { mintToken } from '../../../util/token';
import { tryAuthenticatedApiQuery } from '../../../util/api';
import { GetProjectByIdQuery } from './index.gql';

export default async (req, res) => {
  // https://vercel.com/guides/loading-static-file-nextjs-api-route
  const templateDirectory = path.join(process.cwd(), 'public', 'certificate');
  const fontsDirectory = path.join(templateDirectory, 'fonts');
  const template = fs.readFileSync(`${templateDirectory}/template.svg`).toString();
  const session = await getSession({ req });
  const { params } = req.query;
  const projectId = params[0];
  const overrideParticipantName = params[1] || undefined;
  const token = session ? mintToken(session) : null;
  const {
    result,
    error,
  } = await tryAuthenticatedApiQuery(GetProjectByIdQuery, { id: projectId }, token);
  if (error) {
    res.statusCode = 404;
    throw error;
  }
  if (!result.showcase.project.members.map((m) => m.username).includes(session.user.nickname) && !session.user.admin) {
    res.status(401);
    res.send('Unauthorized');
    return;
  }
  const participantName = overrideParticipantName || `${session.user.given_name} ${session.user.family_name}`;
  const eventName = `${result.showcase.project.eventGroup.title}${result.showcase.project.region?.name ? `, ${result.showcase.project.region?.name}` : ''}`;
  const projectName = result.showcase.project.name;
  const doc = new PDFDocument({
    layout: 'landscape',
    size: 'LETTER',
  });
  doc.registerFont('AvenirNext-Regular', `${fontsDirectory}/AvenirNext-Regular.ttf`);
  doc.registerFont('AvenirNext-Bold', `${fontsDirectory}/AvenirNext-Bold.ttf`);
  doc.registerFont('AvenirNext-Italic', `${fontsDirectory}/AvenirNext-Italic.ttf`);
  doc.registerFont('UpheavalTT-BRK-', `${fontsDirectory}/upheavtt.ttf`);
  doc.registerFont('ProximaNova-Bold', `${fontsDirectory}/Proxima Nova Bold.ttf`);

  const renderedTemplate = template
    .replace(/\{\{participant_name\}\}/g, participantName)
    .replace(/\{\{event_name\}\}/g, eventName)
    .replace(/\{\{project_name\}\}/g, projectName)
    .replace(/\{\{id\}\}/g, projectId);

  SVGtoPDF(doc, renderedTemplate, 0, 0, {
    fontCallback: (family) => family.split(',')[0],
  });
  doc.pipe(res);
  doc.end();
};
