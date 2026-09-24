// src/lib/validation.ts
//
// Shared server-side validation utilities for auth flows.
// All user-facing error messages in Indonesian.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_RE = /^[a-zA-ZÀ-ÿ\s'-]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}

export function isValidPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

export function isValidName(name: string): boolean {
  return name.length >= 2 && name.length <= 255 && NAME_RE.test(name);
}

export function sanitize(input: string): string {
  // Trim whitespace and strip control characters (keep newlines for text fields)
   
  return input.trim().replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}

export function validateRegisterInput(data: {
  name: string;
  email: string;
  password: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push("Nama harus diisi");
  } else if (!isValidName(data.name.trim())) {
    if (data.name.trim().length < 2) {
      errors.push("Nama harus minimal 2 karakter");
    } else {
      errors.push("Nama hanya boleh berisi huruf, spasi, atau tanda hubung");
    }
  }

  if (!data.email || data.email.trim().length === 0) {
    errors.push("Email harus diisi");
  } else if (!isValidEmail(data.email.trim())) {
    errors.push("Format email tidak valid");
  }

  if (!data.password) {
    errors.push("Kata sandi harus diisi");
  } else if (!isValidPassword(data.password)) {
    if (data.password.length < 8) {
      errors.push("Kata sandi harus minimal 8 karakter");
    } else {
      errors.push("Kata sandi harus mengandung huruf besar, huruf kecil, dan angka");
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateLoginInput(data: {
  email: string;
  password: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.email || data.email.trim().length === 0) {
    errors.push("Email harus diisi");
  } else if (!isValidEmail(data.email.trim())) {
    errors.push("Format email tidak valid");
  }

  if (!data.password) {
    errors.push("Kata sandi harus diisi");
  }

  return { valid: errors.length === 0, errors };
}
