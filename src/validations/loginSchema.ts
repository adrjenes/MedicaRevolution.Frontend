import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Podaj poprawny adres e-mail.')
    .required('E-mail jest polem wymaganym.'),
  password: yup
    .string()
    .required('Hasło jest polem wymaganym.')
});