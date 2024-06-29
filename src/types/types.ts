export interface RegisterPatientCommand {
    firstName: string;
    lastName: string;
    pesel: string;
    email: string;
    password: string;
    phoneNumber: string;
  }
  export interface PatientForm {
    id: string;
    firstName: string;
    lastName: string;
    pesel: string;
    email: string;
    phoneNumber: string;
    diagnosis: string;
    doctorConclusions: string;
    pdfFileName: string;
    createdAt: string;
    responseDateDoctor: string | null;
  }
  export interface RegisterPatientResponse {
    token: string;
  }
  
  export interface LoginUserCommand {
    email: string;
    password: string;
  }
  
  export interface LoginUserResponse {
    token: string;
  }
  export interface ErrorResponse {
    message: string;
  }

