import { useMutation } from "@tanstack/react-query";
import {
  googleLoginApi,
  loginWithEmailOnlyApi,
  requestOtpApi,
  verifyOtpApi,
} from "../api/auth";

export const useEmailOnlyLogin = () =>
  useMutation({
    mutationFn: loginWithEmailOnlyApi,
  });

export const useRequestOtp = () =>
  useMutation({
    mutationFn: requestOtpApi,
  });

export const useVerifyOtp = () =>
  useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      verifyOtpApi(email, otp),
  });

export const useGoogleLoginMutation = () =>
  useMutation({
    mutationFn: (code: string) => googleLoginApi(code),
  });
