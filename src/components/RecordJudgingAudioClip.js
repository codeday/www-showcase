import React from 'react';
import { Box, Button, Heading } from '@codeday/topo/Atom';

import H5AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import * as Icon from '@codeday/topocons/Icon';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

const { ReactMediaRecorder } = dynamic(() => import('react-media-recorder'), { ssr: false });

let statusHeading;
export default function RecordJudgingAudioClip({ onUpload, ...props }) {
  return (
    <ReactMediaRecorder
      render={({
        status,
        startRecording,
        stopRecording,
        mediaBlobUrl,
        clearBlobUrl,
      }) => {
        switch (status) {
          case 'recording':
            statusHeading = <Heading m={4} size="lg">🔴 Recording...</Heading>;
            break;
          case 'idle':
            statusHeading = <Heading m={4} size="lg">✅ Ready to record!</Heading>;
            break;
          case 'stopped':
            statusHeading = (mediaBlobUrl)
              ? <Heading m={4} size="lg">👀 Review your audio:</Heading>
              : <Heading m={4} size="lg">✅ Ready to record!</Heading>;
            break;
          default:
            break;
        }
        return (
          <Box textAlign="center" {...props}>
            {statusHeading}
            <H5AudioPlayer
              src={(mediaBlobUrl) || ''}
              autoPlay
              showJumpControls={false}
              customAdditionalControls={[]}
              customIcons={
                {
                  play: <Icon.MediaPlay />,
                  pause: <Icon.MediaPause />,
                  volume: <Icon.UiVolume />,
                  volumeMute: <Icon.UiVolumeMute />,
                }
              }
            />
            <Button m={4} onClick={startRecording} disabled={(status === 'recording')} colorScheme="green">
              Start Recording
            </Button>
            <Button m={4} onClick={stopRecording} disabled={(status !== 'recording')} colorScheme="red">
              Stop Recording
            </Button>
            {(mediaBlobUrl)
              ? (
                <Box>
                  <Button m={4} onClick={() => onUpload(mediaBlobUrl)} colorScheme="green">
                    <Icon.UiUpload />&nbsp;Upload
                  </Button>
                  <Button m={4} onClick={clearBlobUrl} colorScheme="red"><Icon.UiTrash />&nbsp;Retry</Button>
                </Box>
              )
              : null}
          </Box>
        );
      }}
    />
  );
}

RecordJudgingAudioClip.propTypes = {
  onUpload: PropTypes.func,
};

RecordJudgingAudioClip.defaultProps = {
  onUpload: () => {},
};
