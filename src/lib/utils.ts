import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseSAID(idNumber: string): { birthDate: Date; age: number; gender: string; isValid: boolean } {
  if (!/^\d{13}$/.test(idNumber)) {
    return { birthDate: new Date(), age: 0, gender: "", isValid: false };
  }

  const yy = idNumber.substring(0, 2);
  const mm = idNumber.substring(2, 4);
  const dd = idNumber.substring(4, 6);
  const genderCode = parseInt(idNumber.substring(6, 10));

  // Guess century (simple heuristic: if yy < current year + 10, it's 2000s, else 1900s)
  // This is a rough estimation. For 18+ check in 2026:
  // 08 (2008) is 18.
  // 30 (1930) is 96.
  const currentYearShort = new Date().getFullYear() % 100;
  const century = parseInt(yy) <= currentYearShort ? 2000 : 1900;
  
  const fullYear = century + parseInt(yy);
  const birthDate = new Date(fullYear, parseInt(mm) - 1, parseInt(dd));
  
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  const gender = genderCode >= 5000 ? "Male" : "Female";

  return {
    birthDate,
    age,
    gender,
    isValid: true
  };
}
