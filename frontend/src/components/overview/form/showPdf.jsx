import React from "react";
import { Box } from "@mui/material";
import { MyDialog } from "../..";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.js`;
const showPdf = ({ params }) => {
  const DialogContent = () => {
    console.log(params?.value);
    const base64Data = params?.value;
    return (
      <Box sx={{ maxWidth: "100%", height: "100%", overflow: "scroll" }}>
        <div>
          <Document
            file={`data:application/pdf;base64,${base64Data}`}
            // file={{
            //   url: blobUrl,
            // }}
            onLoadSuccess={() => {}}
            onLoadError={(error) =>
              alert("Error while loading document! " + error.message)
            }
          >
            <Page pageNumber={1} />
          </Document>
        </div>
      </Box>
    );
  };

  return params?.value !== "" && params?.value ? (
    <MyDialog
      Button={<ZoomInIcon />}
      DialogBody={DialogContent}
      defaultWH={[710, 550]}
    />
  ) : (
    <>...</>
  );
};

export default showPdf;
