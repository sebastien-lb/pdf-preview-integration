import React, { ReactElement } from 'react';
import { BlobProvider } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

type OwnProps = {
  document: ReactElement | null;
  fileName: string;
  pdfId: string | null;
};

// Create Document Component
const PdfBlobProvider = ({ document, fileName, pdfId }: OwnProps) => {
  return (
    <>
      {document && pdfId && (
        <BlobProvider key={pdfId} document={document}>
          {({ blob, loading }) => {
            if (loading) {
              return null;
            }
            if (blob !== null) {
              saveAs(blob, fileName);
            }
            return null;
          }}
        </BlobProvider>
      )}
    </>
  );
};

export default React.memo(PdfBlobProvider);
