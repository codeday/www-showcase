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

  if (scale == Number.NaN || scale < 0 || scale > 10)
  {
    return res.status(422).send('Parameter "scale" must be defined and within 0-10!');
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

  //Set the content type
  res.setHeader('Content-Type', 'image/svg+xml');

  //Send
  res.send(svg);
};