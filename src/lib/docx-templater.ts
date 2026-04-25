import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
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

export const fillBlotterTemplate = async (
  templateBuffer: ArrayBuffer,
  data: BlotterData,
  template: TemplateData
) => {
  const zip = new PizZip(templateBuffer);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  // Render the document (replace {placeholder} with data)
  doc.render({
    ...data,
    ...template,
    // Add uppercase versions for headers
    BARANGAY: template.barangayName.toUpperCase(),
    CITY: template.city.toUpperCase(),
    PROVINCE: template.province.toUpperCase(),
    DATE: new Date().toLocaleDateString('en-PH', { dateStyle: 'long' }),
  });

  const out = doc.getZip().generate({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  saveAs(out, `Blotter_${data.complainant.replace(/\s+/g, "_")}.docx`);
};
