import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";

interface BlotterData {
  complainant: string;
  respondent: string;
  natureOfComplaint: string;
  formalSummary: string;
  incidentDate: string;
  incidentLocation: string;
}

interface TemplateData {
  barangayName: string;
  city: string;
  province: string;
}

export const generateBlotterDoc = async (data: BlotterData, template: TemplateData) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Republic of the Philippines", size: 24 }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `Province of ${template.province}`, size: 24 }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `City/Municipality of ${template.city}`, size: 24 }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `BARANGAY ${template.barangayName.toUpperCase()}`, bold: true, size: 28 }),
            ],
          }),
          new Paragraph({ text: "", spacing: { after: 400 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "OFFICE OF THE LUPONG TAGAPAMAYAPA", bold: true, size: 32, underline: {} }),
            ],
          }),
          new Paragraph({ text: "", spacing: { after: 400 } }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: "KP FORM #1: BLOTTER REPORT", bold: true })],
          }),
          new Paragraph({ text: "", spacing: { after: 200 } }),
          new Paragraph({
            children: [
              new TextRun({ text: "COMPLAINANT: ", bold: true }),
              new TextRun({ text: data.complainant }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "RESPONDENT: ", bold: true }),
              new TextRun({ text: data.respondent }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "NATURE OF COMPLAINT: ", bold: true }),
              new TextRun({ text: data.natureOfComplaint }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "DATE OF INCIDENT: ", bold: true }),
              new TextRun({ text: data.incidentDate }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "LOCATION OF INCIDENT: ", bold: true }),
              new TextRun({ text: data.incidentLocation }),
            ],
          }),
          new Paragraph({ text: "", spacing: { after: 400 } }),
          new Paragraph({
            children: [new TextRun({ text: "FORMAL SUMMARY / NARRATIVE:", bold: true })],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [new TextRun({ text: data.formalSummary })],
            spacing: { before: 200 },
          }),
          new Paragraph({ text: "", spacing: { after: 800 } }),
          new Paragraph({
            children: [
              new TextRun({ text: "__________________________", bold: true }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Barangay Secretary / Clerk", size: 20 }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Blotter_${data.complainant.replace(/\s+/g, "_")}.docx`);
};
