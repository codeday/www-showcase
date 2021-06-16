import Box from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import Codeblock from '@codeday/topo/Atom/CodeBlock';
import Image from '@codeday/topo/Atom/Image';
import NumericInput from '@codeday/topo/Atom/Input/Numeric';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import Text, {Heading, Link} from '@codeday/topo/Atom/Text';
import {Code as InlineCode, Flex, Slider, SliderTrack, SliderFilledTrack, SliderThumb} from '@chakra-ui/core';
import {Modal} from 'react-responsive-modal';

//Scale options
const minScale = 0.8;
const maxScale = 5;
const scaleStep = 0.2;

//Get the origin
const origin = typeof window != 'undefined' ? window.location.origin : 'https://showcase.codeday.org';

export default function Shield({project})
{
  //Modal state
  const [open, setOpen] = useState(false);

  //Modal open handler
  const onOpen = () => setOpen(true);

  //Modal close handler
  const onClose = () => setOpen(false);

  //Scale state
  const [scale, setScale] = useState(1.2);

  //Scale input handler
  const onScale = raw =>
  {
    //Parse value
    let parsed = typeof raw == 'number' ? raw : parseFloat(raw);

    //Clamp the scale
    parsed = Math.min(Math.max(parsed, minScale), maxScale);

    //Update state
    setScale(parsed);
  };

  //Generate links 
  const shieldImage = new URL(origin);
  shieldImage.pathname = `/api/shield/${project.id}`;
  const shieldImagesParams = new URLSearchParams();
  shieldImagesParams.set('scale', scale);
  shieldImage.search = shieldImagesParams.toString();

  const shieldLink = new URL(origin);
  shieldLink.pathname = `/project/${project.id}`;

  //Generate markdown
  const markdown = `[![Made for ${project.eventGroup.title}](${shieldImage})](${shieldLink})`;

  //Copy state
  const [copied, setCopied] = useState(false);

  //Copy event handler
  const onCopy = async () =>
  {
    //Copy markdown to clipboard
    await navigator.clipboard.writeText(markdown);

    //Set copied state
    setCopied(true);

    //Clear copied state
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <>
      <Button onClick={onOpen} variant="outline" variantColor="brand">View Shield</Button>
      <Modal open={open} onClose={onClose}>
        <Box w="60vw">
          <Box textAlign="center">
            <Heading>Shield</Heading>
          </Box>

          <Text>Want a pretty looking shield to add to your project to let people
            know you made it for CodeDay? Well you came to the right place.</Text>

          <Heading as="h3" fontSize="xl" mt={2}>Scale</Heading>

          <Flex>
            <Slider color="brand" min={minScale} max={maxScale} step={scaleStep} onChange={onScale} value={scale}>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>

              <SliderThumb />
            </Slider>

            <NumericInput min={minScale} max={maxScale} step={scaleStep} precision={1} onChange={onScale} value={scale} w={80} ml={4} />
          </Flex>

          <Heading as="h3" fontSize="xl" mt={3}>Preview</Heading>
          <Image m="4px auto" src={shieldImage} />

          <Heading as="h3" fontSize="xl" mt={2}>Markdown</Heading>
          <Text>Add the below code to your <Link
            href="https://makeareadme.com/#what-is-it"
          ><InlineCode>README.md</InlineCode></Link>:</Text>

          <Flex>
            <Codeblock lang="markdown">{markdown}</Codeblock>
            <Button onClick={onCopy} variantColor={copied ? 'green' : 'brand'} w={140} ml={4}>{copied ? 'Copied' : 'Copy'}</Button>
          </Flex>
        </Box>
      </Modal>
    </>
  );
}

Shield.propTypes = {
  project: PropTypes.object.isRequired
};