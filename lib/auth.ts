import { supabase } from "./supabase";

// STEP 1 — Send OTP
export async function sendOtp(phone: string) {
  const { error } = await supabase.auth.signInWithOtp({ phone });
  if (error) throw error;
}

// STEP 2 — Verify OTP
export async function verifyOtp(phone: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });
  if (error) throw error;
  return data;
}

// STEP 3 — Check if profile exists (returning user or new?)
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) return null;
  return data;
}

// STEP 4 — Save profile + role after role selection
export async function createProfile(
  userId: string,
  fullName: string,
  phone: string,
  role: "lender" | "borrower",
) {
  const { error } = await supabase.from("profiles").insert({
    id: userId,
    full_name: fullName,
    phone_number: phone,
    role,
    role_locked: true,
  });
  if (error) throw error;
}

// STEP 5 — Save lender details
export async function saveLenderProfile(
  userId: string,
  upiId: string,
  maxAmount: number,
) {
  const { error } = await supabase.from("lender_profiles").insert({
    user_id: userId,
    upi_id: upiId,
    max_lending_amount: maxAmount,
  });
  if (error) throw error;
}

// STEP 6 — Save borrower details
export async function saveBorrowerProfile(
  userId: string,
  income: number,
  employmentType: string,
) {
  const { error } = await supabase.from("borrower_profiles").insert({
    user_id: userId,
    monthly_income: income,
    employment_type: employmentType,
  });
  if (error) throw error;
}
