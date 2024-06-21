import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(3, 'Imie musi składać się z minimum 3 znaków.')
    .max(20, 'Imie musi składać się z maksymalnie 20 znaków.')
    .required('Imie jest wymagane.'),
  lastName: yup
    .string()
    .min(3, 'Nazwisko musi składać się z minimum 3 znaków.')
    .max(30, 'Nazwisko musi składać się z maksymalnie 20 znaków.')
    .required('Nazwisko jest wymagane.'),
  pesel: yup
    .string()
    .length(11, 'PESEL musi składać się z 11 znaków.')
    .matches(/^\d{11}$/, 'PESEL składa się jedynie z liczb.')
    .required('PESEL jest wymagany.'),
  email: yup
    .string()
    .email('Podaj poprawny adres e-mail.')
    .max(40, 'E-mail może składać się maksymalnie z 40 znaków.')
    .required('E-mail jest wymagany.'),
  password: yup
    .string()
    .min(8, 'Hasło musi składać się z minimum 3 znaków.')
    .max(20, 'Hasło musi składać się maksymalnie z 20 znaków.')
    .required('Password is required.'),
  phoneNumber: yup
    .string()
    .length(9, 'Numer telefonu musi zawierać 9 znaków.')
    .matches(/^\d{9}$/, 'Numer telefonu zawiera jedynie cyfry.')
    .required('Numer telefonu jest wymagany.'),
});