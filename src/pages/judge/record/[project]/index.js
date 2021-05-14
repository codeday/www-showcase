import React from 'react';
import Button from '@codeday/topo/Atom/Button';
import Content from '@codeday/topo/Molecule/Content';
import RecordJudgingVideoClip from '../../../../components/RecordJudgingVideoClip';
import Page from '../../../../components/Page';

export default function JudgingRecord() {
  return (
    <Page>
      <Content>
        <RecordJudgingVideoClip />
      </Content>
    </Page>
  );
}
