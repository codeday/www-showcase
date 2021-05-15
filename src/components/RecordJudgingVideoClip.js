import React, { useEffect, useRef } from 'react';
import Button from '@codeday/topo/Atom/Button';
import Box from '@codeday/topo/Atom/Box';
import Skelly from '@codeday/topo/Atom/Skelly';
import { Heading } from '@codeday/topo/Atom/Text';
import { ReactMediaRecorder } from 'react-media-recorder';

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
        mediaBlobUrl,
        clearBlobUrl,
      }) => (
        // VERY dumb hack for video preview
        <ReactMediaRecorder
          video
          render={({ previewStream }) => {
            let statusHeading;
            switch (status) {
              case 'recording':
                statusHeading = <Heading m={4} size="lg">🔴 Recording...</Heading>;
                break;
              case 'idle':
                statusHeading = <Heading m={4} size="lg">✅ Ready to record!</Heading>;
                break;
              case 'stopped':
                statusHeading = (mediaBlobUrl)
                  ? <Heading m={4} size="lg">👀 Review your video:</Heading>
                  : <Heading m={4} size="lg">✅ Ready to record!</Heading>;
                break;
              default:
                break;
            }
            return (
              <Box textAlign="center" {...props}>
                {statusHeading}
                {(!mediaBlobUrl)
                  ? <VideoPreview height="xl" stream={previewStream} />
                // eslint-disable-next-line jsx-a11y/media-has-caption
                  : <video src={mediaBlobUrl} controls autoPlay />}
                <Button m={4} onClick={startRecording} variantColor="green">Start Recording</Button>
                <Button m={4} onClick={stopRecording} variantColor="red">Stop Recording</Button>
                <Button m={4} onClick={clearBlobUrl} variantColor="red">✖ Retry</Button>
                <Button m={4} variantColor="green">✔ Upload</Button>
              </Box>
            );
          }}
        />
      )}
    />
  );
}
