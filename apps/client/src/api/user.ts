import { getDemoUserProfile, setDemoUserProfile } from "./userProfile.api";

export const getUserInfo = async () => {
  return getDemoUserProfile();
};

export const completeUserOnboarding = async (
  step: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>
) => {
  const current = getDemoUserProfile()
  const nextStep = Math.max(step, 1)
  const isFinalStep = nextStep >= 3

  const fullName = `${data?.basicInfo?.firstName ?? ''} ${data?.basicInfo?.lastName ?? ''}`.trim()

  const nextProfile = setDemoUserProfile({
    ...current,
    onboardingStep: isFinalStep ? 2 : nextStep,
    onboardingComplete: isFinalStep,
    monthlyOrderCount: data?.businessLegal?.monthlyShipments ?? current.monthlyOrderCount,
    businessType: Array.isArray(data?.businessLegal?.businessCategory)
      ? data.businessLegal.businessCategory
      : current.businessType,
    salesChannels: data?.platformIntegration ?? current.salesChannels,
    companyInfo: {
      ...current.companyInfo,
      contactPerson: fullName || current.companyInfo.contactPerson,
      businessName: data?.basicInfo?.companyName ?? current.companyInfo.businessName,
      contactEmail: data?.basicInfo?.email ?? current.companyInfo.contactEmail,
      contactNumber: data?.basicInfo?.phone ?? current.companyInfo.contactNumber,
      pincode: data?.basicInfo?.pincode ?? current.companyInfo.pincode,
      state: data?.basicInfo?.state ?? current.companyInfo.state,
      city: data?.basicInfo?.city ?? current.companyInfo.city,
      website: data?.basicInfo?.personalWebsite ?? current.companyInfo.website,
      brandName: data?.businessLegal?.brandName ?? current.companyInfo.brandName,
    },
  })

  return {
    message: isFinalStep ? "Demo onboarding completed" : "Demo onboarding step saved",
    user: nextProfile,
  };
};

export async function extractTextFromFile(
  fileUrl: string,
  type?: string
): Promise<string> {
  const res = await axiosInstance.post(
    "/profile/extract-text",
    {
      fileUrl,
      ...(type && { type }),
    },
    {
      timeout: 60000, // ✅ 60 seconds
    }
  );

  return res?.data?.text;
}
