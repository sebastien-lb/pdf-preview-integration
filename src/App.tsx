import React, { useState, useEffect } from "react";
import "./App.css";
import { v4 as uuid } from "uuid";
import pdfjs from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

import { PdfBlobProvider, Quixote } from "./components/PdfBlobProvider";

function App() {
  const [pdfId, setPdfId] = useState<string | null>(null);
  const [preview, setPreview] = useState<any>();
  const downloadPdf = () => {
    setPdfId(uuid());
  };

  const loadPdf = async (pdfData: any) => {
    //https://github.com/ansu5555/pdf-viewer-reactjs/blob/master/src/components/RenderPdf.js
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    const pdf = await pdfjs.getDocument({ data: pdfData }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1, rotation: 0 });

    // Prepare canvas using PDF page dimensions
    const canvas: any = document.getElementById("the-canvas");
    debugger;
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    let canvasContext = canvas.getContext("2d");
    const renderContext = {
      canvasContext,
      viewport,
    };
    const renderTask = await page.render(renderContext).promise;
    setPreview(canvas.toDataURL());
  };

  const onInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length) {
      const reader = new FileReader();
      const file = files[0];
      if (file.type === "application/pdf") {
        console.log("pdf document");
        reader.onload = function() {
          var pdfData = new Uint8Array(this.result as any);
          loadPdf(pdfData);
        };
        reader.readAsArrayBuffer(file);
      } else {
        reader.onload = function(e: ProgressEvent<FileReader>) {
          console.log("progess event", e);
          if (e && e.target) {
            setPreview(e.target.result);
          }
        };
        reader.readAsDataURL(file); // convert to base64 string
      }

      console.log(file);
    }
    console.log(event.target, event.target.value);
  };
  return (
    <div className="App">
      <div>Hello</div>
      <canvas id="the-canvas" style={{ border: "1px solid black" }}></canvas>

      <input type="file" onInput={onInput} />
      <img
        src={preview}
        alt="preview"
        style={{ maxHeight: "100px", maxWidth: "100px" }}
      />
      <button onClick={downloadPdf}>Download</button>
      <PdfBlobProvider
        document={<Quixote image={preview} />}
        pdfId={pdfId}
        fileName="your-pdf.pdf"
      />
    </div>
  );
}

export default App;
