import icon from './icon.svg';
import {badgen} from 'badgen';

export default async (req, res) =>
{
  //Parse query parameters
  const event = req.query.event;
  const scale = parseFloat(req.query.scale);

  //Validate query parameters
  if (event == null || event.length == 0)
  {
    return res.status(422).send('Parameter "event" must be defined and not empty!');
  }

  if (scale == Number.NaN || scale < 0.8 || scale > 5)
  {
    return res.status(422).send('Parameter "scale" must be defined and within 0.8-5!');
  }

  //Generate the shield SVG
  const svg = badgen({
    color: 'ff686b',
    icon: icon,
    label: 'Made for',
    scale,
    status: event,
    style: 'flat'
  });

  //Set the headers
  res.setHeader('Cache-Control', 'public, max-age 86400, proxy-revalidate');
  res.setHeader('Content-Type', 'image/svg+xml');

  //Send
  res.send(svg);
};