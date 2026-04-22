import type { IUserProfileDB } from "../types/user.types";
import { emptyUserProfile } from "../utils/utility";

const createDefaultDemoProfile = (): IUserProfileDB => ({
  ...emptyUserProfile,
  id: 'demo-profile',
  userId: 'demo-user',
  onboardingStep: 2,
  onboardingComplete: true,
  profileComplete: true,
  monthlyOrderCount: '0-100',
  approved: true,
  approvedAt: new Date().toISOString(),
  rejectionReason: null,
  currentPlanId: 'basic-demo',
  currentPlanName: 'Basic Demo',
  submittedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  companyInfo: {
    ...emptyUserProfile.companyInfo,
    businessName: 'ShipOrbit Demo',
    contactPerson: 'Demo User',
    companyAddress: 'Demo Address',
    companyContactNumber: '9999999999',
    pincode: '110001',
    POCEmailVerified: true,
    POCPhoneVerified: true,
    state: 'Delhi',
    city: 'New Delhi',
    contactNumber: '9999999999',
    contactEmail: 'demo@shiporbit.local',
    brandName: 'ShipOrbit Demo',
    companyEmail: 'demo@shiporbit.local',
    website: 'https://demo.shiporbit.local',
    profilePicture: '',
    companyLogoUrl: '',
  },
  domesticKyc: {
    updatedAt: new Date(),
    status: 'verified',
  },
  bankDetails: {
    count: 1,
    primaryAccount: {
      accountHolder: 'Demo User',
      accountNumber: '000000000000',
      ifsc: 'DEMO0000001',
      bankName: 'Demo Bank',
      id: 'demo-bank',
      status: 'verified',
      isPrimary: true,
    },
  },
  gstDetails: {
    gstNumber: '07AAAAA0000A1Z5',
    legalName: 'ShipOrbit Demo',
    registrationDate: new Date().toISOString(),
    state: 'Delhi',
    documentUrl: '',
  },
  businessType: ['b2c'],
})

let demoProfile: IUserProfileDB = createDefaultDemoProfile()

export const getDemoUserProfile = () => demoProfile

export const setDemoUserProfile = (nextProfile: IUserProfileDB) => {
  demoProfile = nextProfile
  return demoProfile
}

export const resetDemoUserProfile = () => {
  demoProfile = createDefaultDemoProfile()
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
