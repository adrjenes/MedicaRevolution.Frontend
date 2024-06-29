import jsPDF from 'jspdf';
import { PatientForm } from '../types/types';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../interfaces/DecodedToken';

export const generatePDFFile = async (
  patient: PatientForm,
  diagnosis: string,
  doctorConclusions: string,
  token: string
): Promise<File | null> => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const img = new Image();
  img.src = "https://medicalovesadev.blob.core.windows.net/logos-public/zasw_lek.png";

  return new Promise<File>((resolve, reject) => {
    img.onload = () => {
      const imgWidth = 210;
      const imgHeight = (imgWidth * 798) / 1140; 
      doc.addImage(img, 'PNG', 0, 0, imgWidth, imgHeight);
      const firstName = patient.firstName ? patient.firstName.toString() : '';
      const lastName = patient.lastName ? patient.lastName.toString() : '';
      const createdAt = patient.createdAt ? patient.createdAt.toString().slice(0, -17) : '';
      const PESEL = patient.pesel ? patient.pesel.toString() : '';
      const diagnosisText = diagnosis ? diagnosis.toString() : '';
      const doctorConclusionsText = doctorConclusions ? doctorConclusions.toString() : '';

      if (!token) {
        reject(new Error('Token is null'));
        return;
      }
      const decodedToken = jwtDecode<DecodedToken>(token);
      const doctorLastName = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"];

      doc.setFontSize(12);
      doc.text(`${firstName} ${lastName}`, 44, 49); 
      doc.text(createdAt, 175, 8); 
      doc.text(PESEL, 22, 64.6);
      doc.text(diagnosisText, 32, 82.6);
      doc.text(doctorLastName, 155, 113.5);
      const uniqueId = new Date().getTime();
      const pdfFileName = `${firstName}-${lastName}-${uniqueId}.pdf`;
      const pdfBlob = doc.output('blob');
      const pdfFile = new File([pdfBlob], pdfFileName, { type: 'application/pdf' });
      resolve(pdfFile);
    };
    img.onerror = (error) => {
      console.error('Error loading image:', error);
      reject(error);
    };
  });
};