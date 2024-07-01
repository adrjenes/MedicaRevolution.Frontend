import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

interface ValidatedTextFieldProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  minLength: number;
  maxLength: number;
  fullWidth?: boolean;
  multiline?: boolean;
}

const ValidatedTextField: React.FC<ValidatedTextFieldProps> = ({
  label,
  value,
  onChange,
  minLength,
  maxLength,
  fullWidth = false,
  multiline = false,
}) => {
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length < minLength) {
      setError(`Opis musi zawierać co najmniej ${minLength} znaków.`);
    } else if (value.length > maxLength) {
      setError(`Opis nie może przekraczać ${maxLength} znaków.`);
    } else {
      setError('');
    }
    onChange(e);
  };

  return (
    <TextField
      label={label}
      variant="outlined"
      multiline={multiline}
      fullWidth={fullWidth}
      value={value}
      onChange={handleChange}
      error={!!error}
      helperText={error || `Opis musi zawierać od ${minLength} do ${maxLength} znaków.`}
      inputProps={{ minLength, maxLength }}
      sx={{
        '& .MuiOutlinedInput-root': {
          Height: '200px', // Ustal wysokość pola tekstowego
        },
        '& .MuiOutlinedInput-inputMultiline': {
          Height: '200px',
          overflow: 'auto', // Dodaj przewijanie
          fontSize: '0.875rem', // Zmniejsz rozmiar czcionki
        },
        '& .MuiInputBase-input': {
          fontSize: '0.875rem', // Zmniejsz rozmiar tekstu wpisywanego przez użytkownika
        },
        '& .MuiFormHelperText-root': {
          fontSize: '0.75rem', // Zmniejsz rozmiar czcionki dla tekstu pomocniczego
        },
      }}
    />
  );
};

export default ValidatedTextField;