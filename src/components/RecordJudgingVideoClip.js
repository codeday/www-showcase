import React, { useEffect, useRef } from 'react';
import Button from '@codeday/topo/Atom/Button';
import Box from '@codeday/topo/Atom/Box';
import Skelly from '@codeday/topo/Atom/Skelly';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import { useReactMediaRecorder } from 'react-media-recorder';
import Spinner from '@codeday/topo/Atom/spinner';

function VideoPreview({ stream, ...props }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  if (!stream) {
    return <Skelly width="100%" height="xl" />;
  }
  return (
    <Box {...props}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video ref={videoRef} autoPlay />
    </Box>
  );
}
export default function RecordJudgingVideoClip({ ...props }) {
  return (
    <ReactMediaRecorder
      video
      render={({
        status,
        startRecording,
        stopRecording,
        previewStream,
        mediaBlobUrl,
        clearBlobUrl,
        pauseRecording,
      }) => (
        <Box textAlign="center" {...props}>
          {(status === 'recording')
            ? <Heading m={4} size="lg" color="red">Recording...</Heading>
            : (status === 'idle')
              ? <Heading m={4} size="lg" color="green">Ready to record!</Heading>
              : (status === 'stopped')
                ? <Heading m={4} size="lg" color="green">Review your video:</Heading>
                : (status === 'acquiring_media')
                  ? <Heading m={4} size="lg" color="yellow">Please allow CodeDay to use your webcam</Heading>
                  : <Heading m={4} size="lg">Status: {status}</Heading>}
          { (status !== 'stopped')
            ? <VideoPreview height="xl" stream={previewStream} />
            // eslint-disable-next-line jsx-a11y/media-has-caption
            : <video src={mediaBlobUrl} controls autoPlay />
          }
          {(status === 'recording')
            ? <Button m={4} onClick={stopRecording} variantColor="red">Stop Recording</Button>
            : (status === 'idle')
              ? <Button m={4} onClick={startRecording} variantColor="green">Start Recording</Button>
              : (status === 'stopped')
                ? (<Box><Button m={4} onClick={() => {clearBlobUrl(); startRecording(); pauseRecording() } } variantColor="red">❌ Retry</Button> <Button m={4}>✔ Upload</Button></Box>)
                : null}
        </Box>
      )}
    />
  );
}
