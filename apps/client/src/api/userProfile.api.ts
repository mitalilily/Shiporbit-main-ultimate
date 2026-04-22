import type { IUserProfileDB } from "../types/user.types";
import { emptyUserProfile } from "../utils/utility";

let demoProfile: IUserProfileDB = {
  ...emptyUserProfile,
  id: "demo-profile",
  userId: "demo-user",
  companyInfo: {
    ...emptyUserProfile.companyInfo,
    brandName: "ShipOrbit Demo",
    businessName: "ShipOrbit Demo",
    contactEmail: "demo@shiporbit.local",
  },
}

export const getDemoUserProfile = () => demoProfile

export const setDemoUserProfile = (nextProfile: IUserProfileDB) => {
  demoProfile = nextProfile
  return demoProfile
}

export const fetchUserProfile = async (): Promise<IUserProfileDB> => {
  return demoProfile;
};

/**
 * PATCH /api/v1/user-profiles/me
 * Update user profile (can be partial)
 */
export const updateUserProfile = async (
  payload: Partial<IUserProfileDB>
): Promise<{ message: string; user: IUserProfileDB }> => {
  demoProfile = {
    ...demoProfile,
    ...payload,
    companyInfo: {
      ...demoProfile.companyInfo,
      ...(payload.companyInfo ?? {}),
    },
  }

  return {
    message: "Demo profile updated",
    user: demoProfile,
  };
};

export const requestProfileEmailVerification = async (
  updatedEmail?: string
) => {
  demoProfile = {
    ...demoProfile,
    companyInfo: {
      ...demoProfile.companyInfo,
      contactEmail: updatedEmail ?? demoProfile.companyInfo.contactEmail,
    },
  }
  return {
    message: "Demo profile email verification sent",
    updatedEmail,
  };
};

export const verifyProfileEmail = async (updatedEmail: string, otp: string) => {
  return {
    message: "Demo profile email verified",
    email: updatedEmail,
    otp,
  };
};

export const requestProfilePhoneVerification = async (
  updatedPhone?: string
) => {
  demoProfile = {
    ...demoProfile,
    companyInfo: {
      ...demoProfile.companyInfo,
      contactNumber: updatedPhone ?? demoProfile.companyInfo.contactNumber,
    },
  }
  return {
    message: "Demo profile phone verification sent",
    updatedPhone,
  };
};

export const verifyProfilePhone = async (phone: string, otp: string) => {
  return {
    message: "Demo profile phone verified",
    phone,
    otp,
  };
};
