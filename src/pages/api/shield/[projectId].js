import icon from './icon.svg';
import {ProjectByIdQuery} from './projectId.gql';
import {apiFetch} from '@codeday/topo/utils';
import {badgen} from 'badgen';

export default async (req, res) =>
{
  //Parse query parameters
  const projectId = req.query.projectId;
  const scale = parseFloat(req.query.scale);

  //Validate query parameters
  if (projectId == null || !/^c[a-z0-9]{19,29}$/.test(projectId))
  {
    return res.status(422).send('Route parameter "projectId" must be defined and be a CUID!');
  }

  if (scale == Number.NaN || scale < 0.8 || scale > 5)
  {
    return res.status(422).send('Parameter "scale" must be defined and within 0.8-5!');
  }

  //Query project info
  let info;
  try
  {
    info = await apiFetch(ProjectByIdQuery, {id: projectId}, {}); 
  }
  catch (err)
  {
    //Log the error
    console.error(err);

    //Return a 404 (Since it's likely the project ID is invalid)
    return res.status(404).send('Invalid project ID!');
  }

  //Generate the shield SVG
  const svg = badgen({
    color: 'ff686b',
    icon: icon,
    label: 'Made for',
    scale,
    status: info.showcase.project.eventGroup.title,
    style: 'flat'
  });

  //Set the headers
  res.setHeader('Cache-Control', 'public, max-age 86400, proxy-revalidate');
  res.setHeader('Content-Type', 'image/svg+xml');

  //Send
  res.send(svg);
};