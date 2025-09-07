export function generateOtp(): string {
  return Math.floor(Math.random() * 99999 + 10000).toString();
}

export function generateOtpExpiry(time: number): Date {
  // treat `time` as minutes for a usable OTP expiry window
  return new Date(Date.now() + time * 60 * 1000);
}
