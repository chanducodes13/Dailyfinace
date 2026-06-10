/**
 * Validation utilities for user data
 */

export interface ValidationError {
  field: string;
  message: string;
}

// Phone number validation (Indian format: 10 digits)
export const validatePhoneNumber = (
  phone: string,
): { valid: boolean; error?: string } => {
  const cleanPhone = phone.replace(/\D/g, "");

  if (!phone.trim()) {
    return { valid: false, error: "Mobile number is required" };
  }

  if (cleanPhone.length !== 10) {
    return { valid: false, error: "Mobile number must be 10 digits" };
  }

  if (!/^\d{10}$/.test(cleanPhone)) {
    return { valid: false, error: "Mobile number must contain only digits" };
  }

  return { valid: true };
};

// Full name validation
export const validateFullName = (
  name: string,
): { valid: boolean; error?: string } => {
  if (!name.trim()) {
    return { valid: false, error: "Full name is required" };
  }

  if (name.trim().length < 3) {
    return { valid: false, error: "Name must be at least 3 characters" };
  }

  if (name.trim().length > 50) {
    return { valid: false, error: "Name must not exceed 50 characters" };
  }

  if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
    return {
      valid: false,
      error: "Name can only contain letters, spaces, hyphens, and apostrophes",
    };
  }

  return { valid: true };
};

// Password validation
export const validatePassword = (
  password: string,
): { valid: boolean; error?: string } => {
  if (!password) {
    return { valid: false, error: "Password is required" };
  }

  if (password.length < 6) {
    return { valid: false, error: "Password must be at least 6 characters" };
  }

  if (password.length > 50) {
    return { valid: false, error: "Password must not exceed 50 characters" };
  }

  return { valid: true };
};

// Email validation
export const validateEmail = (
  email: string,
): { valid: boolean; error?: string } => {
  if (!email.trim()) {
    return { valid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: "Please enter a valid email address" };
  }

  return { valid: true };
};

// Address validation
export const validateAddress = (
  address: string,
): { valid: boolean; error?: string } => {
  if (!address.trim()) {
    return { valid: false, error: "Address is required" };
  }

  if (address.trim().length < 5) {
    return { valid: false, error: "Address must be at least 5 characters" };
  }

  if (address.trim().length > 200) {
    return { valid: false, error: "Address must not exceed 200 characters" };
  }

  return { valid: true };
};

// City validation
export const validateCity = (
  city: string,
): { valid: boolean; error?: string } => {
  if (!city.trim()) {
    return { valid: false, error: "City is required" };
  }

  if (city.trim().length < 2) {
    return { valid: false, error: "City must be at least 2 characters" };
  }

  if (!/^[a-zA-Z\s-]+$/.test(city.trim())) {
    return { valid: false, error: "City can only contain letters and spaces" };
  }

  return { valid: true };
};

// Pincode validation (Indian format: 6 digits)
export const validatePincode = (
  pincode: string,
): { valid: boolean; error?: string } => {
  const cleanPincode = pincode.replace(/\D/g, "");

  if (!pincode.trim()) {
    return { valid: false, error: "Pincode is required" };
  }

  if (cleanPincode.length !== 6) {
    return { valid: false, error: "Pincode must be 6 digits" };
  }

  if (!/^\d{6}$/.test(cleanPincode)) {
    return { valid: false, error: "Pincode must contain only digits" };
  }

  return { valid: true };
};

// Comprehensive registration validation
export const validateRegistration = (data: {
  fullName: string;
  mobile: string;
  password: string;
}): { valid: boolean; errors: ValidationError[] } => {
  const errors: ValidationError[] = [];

  const nameValidation = validateFullName(data.fullName);
  if (!nameValidation.valid) {
    errors.push({ field: "fullName", message: nameValidation.error! });
  }

  const phoneValidation = validatePhoneNumber(data.mobile);
  if (!phoneValidation.valid) {
    errors.push({ field: "mobile", message: phoneValidation.error! });
  }

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.valid) {
    errors.push({ field: "password", message: passwordValidation.error! });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Comprehensive login validation
export const validateLogin = (data: {
  mobile: string;
  password: string;
}): { valid: boolean; errors: ValidationError[] } => {
  const errors: ValidationError[] = [];

  if (!data.mobile.trim()) {
    errors.push({ field: "mobile", message: "Mobile number is required" });
  }

  if (!data.password) {
    errors.push({ field: "password", message: "Password is required" });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Profile completion validation
export const validateProfileCompletion = (data: {
  address: string;
  city: string;
  state: string;
  pincode: string;
}): { valid: boolean; errors: ValidationError[] } => {
  const errors: ValidationError[] = [];

  const addressValidation = validateAddress(data.address);
  if (!addressValidation.valid) {
    errors.push({ field: "address", message: addressValidation.error! });
  }

  const cityValidation = validateCity(data.city);
  if (!cityValidation.valid) {
    errors.push({ field: "city", message: cityValidation.error! });
  }

  if (!data.state.trim()) {
    errors.push({ field: "state", message: "State is required" });
  }

  const pincodeValidation = validatePincode(data.pincode);
  if (!pincodeValidation.valid) {
    errors.push({ field: "pincode", message: pincodeValidation.error! });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
