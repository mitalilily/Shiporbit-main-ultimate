// AppRoutes.tsx
import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import RequireAuth from '../components/auth/wrapper/RequireAuth'
import RequireMerchantReady from '../components/auth/wrapper/RequireMerchantReady'
import RequireOnboard from '../components/auth/wrapper/RequireOnboard'
import Layout from '../components/UI/Layout'
import FullScreenLoader from '../components/UI/loader/FullScreenLoader'
import NavigationLoader from '../components/UI/loader/NavigationLoader'
import Login from '../pages/auth/Login'
import Signup from '../pages/auth/Signup'
import ClientPreview from '../pages/preview/ClientPreview'
import LandingPage from '../pages/LandingPage'
import AppEntry from './AppEntry'
import GlobalRedirectHandler from './WalletRedirectHandler'

/* ---------- Lazy-loaded components ---------- */
// Onboarding & Dashboard
const UserOnboarding = lazy(() => import('../pages/onboarding/UserOnboarding'))
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'))

// Orders
const Orders = lazy(() => import('../pages/orders/Orders'))
const B2COrdersList = lazy(() => import('../components/orders/b2c/B2COrdersList'))
const B2bOrders = lazy(() => import('../pages/orders/B2bOrders'))
const CreateOrderWrapper = lazy(() => import('../components/orders/CreateOrderWrapper'))
const OrderTracking = lazy(() => import('../pages/orders/OrderTracking'))

// Settings
const Settings = lazy(() => import('../pages/settings/Settings'))
const LegacySettingsSections = lazy(() => import('../pages/settings/LegacySettingsSections'))
const PickupAddresses = lazy(() => import('../pages/pickup-addresses/PickupAddresses'))
const InvoicePreferences = lazy(() => import('../components/settings/InvoicePreference'))
const LabelSettingsPage = lazy(() => import('../components/settings/Label/LabelSettings'))
const UsersManagement = lazy(() => import('../pages/users-management/UsersManagement'))
const CourierPriorityPage = lazy(
  () => import('../components/settings/CourierPriority/CourierPriorityPage'),
)

// Billing
const WalletTransactions = lazy(() => import('../pages/billings/WalletTransactions'))
const Invoices = lazy(() => import('../pages/billings/Invoices'))
const BillingPreferences = lazy(() => import('../pages/billings/BillingPreferences'))

// Channels
const Channels = lazy(() => import('../pages/channels/Channels'))
const ChannelList = lazy(() => import('../pages/channels/ChannelList'))
const ChannelOrders = lazy(() => import('../pages/channels/ChannelOrders'))
const AddChannel = lazy(() => import('../pages/channels/AddChannel'))

// Policies
const PoliciesLayout = lazy(() => import('../pages/policy/PoliciesLayout'))
const AboutUs = lazy(() => import('../pages/policy/AboutUs'))
const CancellationPolicy = lazy(() => import('../pages/policy/CancellationPolicy'))
const CompanyDetails = lazy(() => import('../pages/policy/CompanyDetails'))
const PrivacyPolicy = lazy(() => import('../pages/policy/PrivacyPolicy'))
const TermsOfService = lazy(() => import('../pages/policy/TermsOfService'))

// Profile
const ProfileLayout = lazy(() => import('../pages/profile/Profile'))
const ProfileSettingsCenter = lazy(() => import('../pages/profile/ProfileSettingsCenter'))
const UserProfileSettings = lazy(() => import('../components/user/UserProfileSettings'))
const CompanyInfoForm = lazy(() => import('../components/user/profile/CompanyInfoForm'))
const BankAccountsSection = lazy(() =>
  import('../components/user/profile/bankAccounts/BankAccountsSection').then((m) => ({
    default: m.BankAccountsSection,
  })),
)
const KycSection = lazy(() => import('../components/user/profile/Kyc/KycSection'))

// Tools
const RateCard = lazy(() => import('../pages/tools/RateCard'))
const RateCalculator = lazy(() =>
  import('../pages/tools/RateCalculator').then((m) => ({ default: m.RateCalculator })),
)
const OrderTrackingForm = lazy(() => import('../pages/tools/OrderTrackingForm'))

// Support
const SupportTicketsPage = lazy(() =>
  import('../pages/support/SupportTicketsPage').then((m) => ({ default: m.SupportTicketsPage })),
)
const TicketDetailsPage = lazy(
  () => import('../pages/support/TicketDetailsPage').then((m) => ({ default: m.TicketDetailsPage })),
)

// Other
const Couriers = lazy(() => import('../pages/couriers/Couriers'))
const CodRemittancesList = lazy(() => import('../pages/cod-remittance/CodRemittancesList'))
const KeyboardShortcutsPage = lazy(() => import('../pages/KeyboardShortcutsPage'))
const Reports = lazy(() => import('../pages/reports/Reports'))

// Weight Reconciliation
const WeightReconciliation = lazy(
  () => import('../pages/weight-reconciliation/WeightReconciliation'),
)
const DiscrepancyDetails = lazy(() => import('../pages/weight-reconciliation/DiscrepancyDetails'))
const WeightReconciliationSettings = lazy(
  () => import('../pages/weight-reconciliation/WeightReconciliationSettings'),
)
// Ops (NDR/RTO)
const NdrList = lazy(() => import('../pages/ops/NdrList'))
const RtoList = lazy(() => import('../pages/ops/RtoList'))
// API Integration
const ApiIntegration = lazy(() => import('../pages/settings/ApiIntegration'))

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <NavigationLoader />
      <GlobalRedirectHandler />
      <Suspense fallback={<FullScreenLoader />}>
        <Routes>
          {/* public */}
          <Route path="/" element={<Login />} />
          <Route path="/auth" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/app" element={<AppEntry />} />
          <Route path="/preview" element={<ClientPreview />} />
          <Route path="/tracking" element={<OrderTracking />} /> {/* 👈 NEW ROUTE */}
          {/* onboarding */}
          <Route
            path="/onboarding-questions"
            element={
              <RequireOnboard>
                <UserOnboarding />
              </RequireOnboard>
            }
          />
          {/* private layout (requires auth) */}
          <Route
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            {/* ParcelX-style dashboard + shell */}
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/api-docs" element={<ApiIntegration />} />
            <Route path="/setting/apidocs" element={<LegacySettingsSections />} />
            <Route path="/apidocs" element={<ApiIntegration />} />
            <Route path="/setting/labelsetting" element={<LabelSettingsPage />} />
            <Route path="/setting/secureshipment" element={<LegacySettingsSections />} />
            <Route path="/setting/manageteam" element={<LegacySettingsSections />} />
            <Route path="/setting/uniqueqr" element={<LegacySettingsSections />} />
            <Route path="/settings/manage_pickups" element={<PickupAddresses />} />
            <Route path="/setting/invoicepage" element={<LegacySettingsSections />} />
            <Route path="/billing/wallet_transactions" element={<WalletTransactions />} />
            <Route path="/billingdetail" element={<WalletTransactions />} />
            <Route path="/wallet/wallet_deduction" element={<WalletTransactions />} />
            <Route path="/wallet/add-money" element={<WalletTransactions />} />
            <Route path="/wallet/addmoney" element={<WalletTransactions />} />
            <Route path="/wallet/recharge-history" element={<WalletTransactions />} />
            <Route path="/wallet/rechargehistory" element={<WalletTransactions />} />
            <Route path="/billing/invoice_management" element={<Invoices />} />
            <Route path="/invoicepage" element={<Invoices />} />
            <Route path="/invoiceprint" element={<Invoices />} />
            <Route path="/invoiceprints" element={<Invoices />} />
            <Route path="/shipment/invoiceprints" element={<Invoices />} />
            <Route path="/billing/communication-invoice" element={<Invoices />} />
            <Route path="/billing/communicationinvoice" element={<Invoices />} />
            <Route path="/billing/order-invoice" element={<Invoices />} />
            <Route path="/billing/orderinvoice" element={<Invoices />} />
            <Route path="/settings/billing_preferences" element={<BillingPreferences />} />
            <Route path="/orders/list" element={<Orders />} />
            <Route path="/shipment" element={<Orders />} />
            <Route path="/shipment/failed" element={<Orders />} />
            <Route
              path="/orders/create"
              element={
                <RequireMerchantReady>
                  <CreateOrderWrapper />
                </RequireMerchantReady>
              }
            />
            <Route
              path="/addorders/forward/AddOrder"
              element={
                <RequireMerchantReady>
                  <CreateOrderWrapper />
                </RequireMerchantReady>
              }
            />
            <Route
              path="/addorders/forward/BulkOrder"
              element={
                <RequireMerchantReady>
                  <CreateOrderWrapper />
                </RequireMerchantReady>
              }
            />
            <Route
              path="/addorders/reverse/SinglePickup"
              element={
                <RequireMerchantReady>
                  <CreateOrderWrapper />
                </RequireMerchantReady>
              }
            />
            <Route
              path="/addorders/reverse/QuickPickup"
              element={
                <RequireMerchantReady>
                  <CreateOrderWrapper />
                </RequireMerchantReady>
              }
            />
            <Route
              path="/addorders/reverse/BulkReturn"
              element={
                <RequireMerchantReady>
                  <CreateOrderWrapper />
                </RequireMerchantReady>
              }
            />
            <Route path="/orders/b2c/list" element={<B2COrdersList />} />
            <Route path="/channel/orders" element={<Orders />} />
            <Route path="/shipment/orders" element={<Orders />} />
            <Route path="/support/about_us" element={<AboutUs />} />
            <Route path="/support/contact-us" element={<CompanyDetails />} />
            <Route path="/orders/b2b/list" element={<B2bOrders />} />
            <Route path="/settings/invoice_preferences" element={<InvoicePreferences />} />
            <Route path="/settings/label_config" element={<LabelSettingsPage />} />
            <Route path="/settings/users_management" element={<UsersManagement />} />
            <Route path="/settings/courier_priority" element={<CourierPriorityPage />} />
            <Route path="/setting/courierpriority" element={<CourierPriorityPage />} />
            <Route path="/settings/courier-priority" element={<CourierPriorityPage />} />
            <Route path="/courierpriority" element={<CourierPriorityPage />} />
            <Route path="/settings/api-integration" element={<ApiIntegration />} />
            <Route path="/channels/connected" element={<Channels />} />
            <Route path="/channels" element={<Channels />} />
            <Route path="/channel/connected" element={<Channels />} />
            <Route path="/channel/pending" element={<ChannelOrders />} />
            <Route path="/channels/channel_list" element={<ChannelList />} />
            <Route path="/channel/available" element={<ChannelList />} />
            <Route path="/channel/addchannel" element={<AddChannel />} />
            <Route path="/policies/*" element={<PoliciesLayout />}>
              <Route path="refund_cancellation" element={<CancellationPolicy />} />
              <Route path="privacy_policy" element={<PrivacyPolicy />} />
              <Route path="terms_of_service" element={<TermsOfService />} />
              <Route path="contact_us" element={<CompanyDetails />} />
            </Route>
            <Route path="/help/shortcuts" element={<KeyboardShortcutsPage />} />
            <Route path="/profile/*" element={<ProfileLayout />}>
              <Route path="user_profile/*" element={<UserProfileSettings />} />
              <Route index element={<Navigate to="user_profile" replace />} />
              <Route path="user_profile" element={<UserProfileSettings />} />
              <Route path="company" element={<CompanyInfoForm />} />
              <Route path="password" element={<UserProfileSettings />} />
              <Route path="bank_details" element={<BankAccountsSection />} />
              <Route path="kyc_details" element={<KycSection />} />
            </Route>
            <Route path="/user/profile-details" element={<Navigate to="/my-profile" replace />} />
            <Route path="/my-profile" element={<ProfileSettingsCenter />} />
            <Route path="/profiles/billingdetail" element={<ProfileSettingsCenter />} />
            <Route path="/profiles/loginhistory" element={<ProfileSettingsCenter />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/date-wise-shipments" element={<Dashboard />} />
            <Route path="/dashboard/product-wise-shipments" element={<Dashboard />} />
            <Route path="/tools/rate_card" element={<RateCard />} />
            <Route path="/tools/rate_calculator" element={<RateCalculator />} />
            <Route path="/tools/order_tracking" element={<OrderTrackingForm />} />
            <Route path="/utility/ratecard" element={<RateCard />} />
            <Route path="/utility/ratecalculator" element={<RateCalculator />} />
            <Route path="/utility/pincode" element={<RateCalculator />} />
            <Route path="/trackingbill" element={<OrderTrackingForm />} />
            <Route path="/custom-tracking" element={<OrderTrackingForm />} />
            <Route path="/tickets" element={<SupportTicketsPage />} />
            <Route path="/support/tickets" element={<SupportTicketsPage />} />
            <Route path="/support" element={<CompanyDetails />} />
            <Route path="/support/tickets/:id" element={<TicketDetailsPage />} />
            <Route path="/home" element={<Navigate to="/dashboard" replace />} />
            <Route path="/couriers/partners" element={<Couriers />} />
            <Route path="/cod-remittance" element={<CodRemittancesList />} />
            <Route path="/cod" element={<CodRemittancesList />} />
            <Route path="/billing/cod" element={<CodRemittancesList />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/report/mis-report" element={<Reports />} />
            <Route path="/communication/credit_recharge" element={<WalletTransactions />} />
            <Route path="/communication/recharge_history" element={<WalletTransactions />} />
            <Route path="/communication/notificationsetting" element={<WalletTransactions />} />
            <Route path="/communication/notification-history" element={<WalletTransactions />} />
            <Route path="/communication/ladger" element={<WalletTransactions />} />
            <Route path="/communication/ndr" element={<NdrList />} />
            <Route path="/communication/channelpricing" element={<WalletTransactions />} />
            <Route path="/reconciliation/weight" element={<WeightReconciliation />} />
            <Route path="/reconciliation/weight/:id" element={<DiscrepancyDetails />} />
            <Route
              path="/reconciliation/weight/settings"
              element={<WeightReconciliationSettings />}
            />
            <Route path="/weight/discrepancy/list" element={<WeightReconciliation />} />
            <Route
              path="/weight/discrepancy/summary"
              element={<WeightReconciliation />}
            />
            {/* Ops */}
            <Route path="/ops/ndr" element={<NdrList />} />
            <Route path="/ndr" element={<NdrList />} />
            <Route path="/ndr/ndr-shipment" element={<NdrList />} />
            <Route path="/ndr-shipment" element={<NdrList />} />
            <Route path="/ndrreport" element={<NdrList />} />
            <Route path="/ndractive" element={<NdrList />} />
            <Route path="/ndrinitiated" element={<NdrList />} />
            <Route path="/ndrdelivered" element={<NdrList />} />
            <Route path="/ops/rto" element={<RtoList />} />
            <Route path="/rtoreport" element={<RtoList />} />
            <Route path="/ndrrto" element={<RtoList />} />
          </Route>
          {/* fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
