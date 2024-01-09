import { Button } from '@codeday/topo/Atom';
import React, { useState } from 'react';
import { UiDownload } from '@codeday/topocons/Icon';
import { downloadZip } from 'client-zip';

async function startDownload(photos) {
  const files = await Promise.allSettled(photos.map(async (p) => fetch(p.url)));
  const blob = await downloadZip(files.map((f) => f.value)).blob();
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${photos[0]?.region?.name} ${photos[0]?.eventGroup?.title} pictures.zip`;
  link.click();
  link.remove();
  URL.revokeObjectURL(blob);
}

export default function PhotoZipDownload({ photos }) {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      disabled={loading}
      isLoading={loading}
      onClick={async () => {
        setLoading(true);
        await startDownload(photos);
        setLoading(false);
      }}
    >
      Download All (.zip) &nbsp;<UiDownload />
    </Button>
  );
}
