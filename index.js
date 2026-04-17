import express from "express";
import multer from "multer";
import { PDFDocument } from "pdf-lib";
import fs from "fs";

const app = express();

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
  res.send(`
    <h1>PDF Merge Tool</h1>
    <form action="/merge" method="post" enctype="multipart/form-data">
      <input type="file" name="pdfs" multiple required />
      <button type="submit">Merge</button>
    </form>
  `);
});

app.post("/merge", upload.array("pdfs"), async (req, res) => {
  const mergedPdf = await PDFDocument.create();

  for (let file of req.files) {
    const pdfBytes = fs.readFileSync(file.path);
    const pdf = await PDFDocument.load(pdfBytes);

    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedBytes = await mergedPdf.save();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=merged.pdf");

  res.send(Buffer.from(mergedBytes));
});

app.listen(5000, () => console.log("Server running on port 5000"));