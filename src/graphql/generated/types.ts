export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type DateTime = string & { readonly __brand: unique symbol };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: DateTime; output: DateTime };
};

export type AccountRegistrationIncentive = {
  __typename: 'AccountRegistrationIncentive';
  incentive: Scalars['String']['output'];
  name: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type AddCouponInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  code: Scalars['String']['input'];
};

export type AddCouponPayload = {
  __typename: 'AddCouponPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  coupon: Coupon;
};

export type AddCourseMenuItemToCart = {
  cartId: Scalars['ID']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  courseMenuEntryId: Scalars['ID']['input'];
  courseMenuId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
};

export type AddCourseMenuItemToCartPayload = {
  __typename: 'AddCourseMenuItemToCartPayload';
  cart: Cart;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type AddCourseMenuToCartInput = {
  cartId: Scalars['ID']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  courseMenuId: Scalars['ID']['input'];
  entries: Array<CourseMenuEntryInput>;
};

export type AddCourseMenuToCartPayload = {
  __typename: 'AddCourseMenuToCartPayload';
  cart: Cart;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type AddDeliveryAddressInput = {
  addressLine: Scalars['String']['input'];
  buildingName: Scalars['String']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  latLng: LatLngInput;
  memo: Scalars['String']['input'];
  prefecture: Scalars['String']['input'];
};

export type AddDeliveryAddressPayload = {
  __typename: 'AddDeliveryAddressPayload';
  assignedFacilityId: Scalars['ID']['output'];
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deliveryAddress: DeliveryAddress;
};

export type AddMenuItemToCartInput = {
  cartId: Scalars['ID']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  menuItemId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
  selectedOptionItems: Array<SelectedOptionItemInput>;
};

export type AddMenuItemToCartPayload = {
  __typename: 'AddMenuItemToCartPayload';
  cart: Cart;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type AddPaymentInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  token: Scalars['String']['input'];
};

export type AddPaymentPayload = {
  __typename: 'AddPaymentPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  payment: Payment;
};

export enum AnswerType {
  Checkbox = 'CHECKBOX',
  NumberRadio = 'NUMBER_RADIO',
  Text = 'TEXT',
  TextRadio = 'TEXT_RADIO',
}

export type AvailableDate = {
  __typename: 'AvailableDate';
  days: Array<Scalars['Int']['output']>;
  month: Scalars['Int']['output'];
  year: Scalars['Int']['output'];
};

export type AvailableOrderType = {
  __typename: 'AvailableOrderType';
  label: Scalars['String']['output'];
  orderType: OrderType;
};

export type Banner = {
  __typename: 'Banner';
  behavior: BannerInteractionBehavior;
  image: Scalars['String']['output'];
  message: Scalars['String']['output'];
  title: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export enum BannerInteractionBehavior {
  ExternalLink = 'EXTERNAL_LINK',
  ShowOrderHistory = 'SHOW_ORDER_HISTORY',
}

export type BannerSection = {
  __typename: 'BannerSection';
  banners: Array<Banner>;
};

export type CancelUnsubscribeInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type CancelUnsubscribePayload = {
  __typename: 'CancelUnsubscribePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  subscription: UserSubscription;
};

export type Cart = Node & {
  __typename: 'Cart';
  availableCouponsCount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  item?: Maybe<OrderItem>;
  order?: Maybe<Order>;
  tableOrder?: Maybe<Order>;
  totalPrice: Scalars['Int']['output'];
  totalQuantity: Scalars['Int']['output'];
};

export type CartItemArgs = {
  id: Scalars['ID']['input'];
};

export type Charge = {
  __typename: 'Charge';
  amount: Scalars['Int']['output'];
  details: Array<ChargeDetail>;
};

export type ChargeDetail = {
  __typename: 'ChargeDetail';
  amount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type CheckInTableInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  customerAttributes: Array<CustomerAttributeInput>;
  facilityId: Scalars['ID']['input'];
  tableId: Scalars['ID']['input'];
};

export type CheckInTablePayload = {
  __typename: 'CheckInTablePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type CheckoutTableOrderInput = {
  amount: Scalars['Int']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  orderId: Scalars['ID']['input'];
};

export type CheckoutTableOrderPayload = {
  __typename: 'CheckoutTableOrderPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  order: Order;
  paymentIntent?: Maybe<PaymentIntent>;
};

export type CompletedSurveyInput = {
  answers: Array<Scalars['String']['input']>;
  question: Scalars['String']['input'];
};

export type CompletionStatus = {
  __typename: 'CompletionStatus';
  completedAt: Scalars['DateTime']['output'];
  statusLabel: Scalars['String']['output'];
};

export enum ContactType {
  Shop = 'SHOP',
  Support = 'SUPPORT',
}

export type Coupon = Node & {
  __typename: 'Coupon';
  canManualUse: Scalars['Boolean']['output'];
  details: Array<CouponDetail>;
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  statusLabel: Scalars['String']['output'];
  subTitle: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type CouponConnection = {
  __typename: 'CouponConnection';
  nodes: Array<Coupon>;
  pageInfo: PageInfo;
};

export type CouponDetail = {
  __typename: 'CouponDetail';
  name: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type CourseMenu = Node & {
  __typename: 'CourseMenu';
  category?: Maybe<CourseMenuCategory>;
  description?: Maybe<Scalars['String']['output']>;
  entries: Array<CourseMenuEntry>;
  id: Scalars['ID']['output'];
  minSelectCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  pricePerPerson?: Maybe<CourseMenuPricePerPerson>;
  ruleDescriptions: Array<Scalars['String']['output']>;
  suggestedCourses: Array<CourseMenu>;
};

export type CourseMenuCategoriesSection = {
  __typename: 'CourseMenuCategoriesSection';
  categories: Array<CourseMenuCategory>;
};

export type CourseMenuCategory = Node & {
  __typename: 'CourseMenuCategory';
  courses: Array<CourseMenu>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CourseMenuEntry = {
  __typename: 'CourseMenuEntry';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Int']['output'];
  priceExcludingTax: Scalars['Int']['output'];
};

export type CourseMenuEntryInput = {
  id: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
};

export type CourseMenuFixedPricePerPerson = {
  __typename: 'CourseMenuFixedPricePerPerson';
  price: Scalars['Int']['output'];
  priceExcludingTax: Scalars['Int']['output'];
};

export type CourseMenuPricePerPerson = CourseMenuFixedPricePerPerson | CourseMenuRangePricePerPerson;

export type CourseMenuRangePricePerPerson = {
  __typename: 'CourseMenuRangePricePerPerson';
  minPrice: Scalars['Int']['output'];
  minPriceExcludingTax: Scalars['Int']['output'];
};

export type CustomerAttribute = {
  __typename: 'CustomerAttribute';
  details: Array<CustomerAttributeDetail>;
  minSelectCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type CustomerAttributeDetail = {
  __typename: 'CustomerAttributeDetail';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CustomerAttributeInput = {
  customerAttributeDetailId: Scalars['ID']['input'];
  value: Scalars['Int']['input'];
};

export type DateInput = {
  day: Scalars['Int']['input'];
  month: Scalars['Int']['input'];
  year: Scalars['Int']['input'];
};

export type DeliveryAddress = {
  __typename: 'DeliveryAddress';
  addressLine: Scalars['String']['output'];
  buildingName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isUsing: Scalars['Boolean']['output'];
  latLng: LatLng;
  memo?: Maybe<Scalars['String']['output']>;
  prefecture: Scalars['String']['output'];
  roomNumber: Scalars['String']['output'];
};

export type DeliveryOrder = Node &
  Order & {
    __typename: 'DeliveryOrder';
    availablePayments: Array<Payment>;
    charge: Charge;
    completionStatus?: Maybe<CompletionStatus>;
    coupon?: Maybe<Coupon>;
    deliveryAddress: DeliveryAddress;
    disposableItems: Array<DisposableItem>;
    facility: Facility;
    id: Scalars['ID']['output'];
    items: Array<OrderItem>;
    memo?: Maybe<Scalars['String']['output']>;
    noContactDeliveryOption: NoContactDeliveryOption;
    paperReceiptRequest?: Maybe<PaperReceiptRequest>;
    payment?: Maybe<Payment>;
    progress?: Maybe<Progress>;
    /** @deprecated Use requirements field instead. */
    requirement?: Maybe<Scalars['String']['output']>;
    requirements?: Maybe<Requirements>;
    scheduledTime: Scalars['String']['output'];
    shortIds: Array<Scalars['String']['output']>;
    submittedAt?: Maybe<Scalars['DateTime']['output']>;
  };

export type DeliverySection = {
  __typename: 'DeliverySection';
  caution?: Maybe<Scalars['String']['output']>;
  deliveryFeeAmount: Scalars['String']['output'];
  isOutOfArea: Scalars['Boolean']['output'];
  notice?: Maybe<Scalars['String']['output']>;
  scheduledTime: Scalars['String']['output'];
};

export enum DeliveryType {
  OnDemand = 'ON_DEMAND',
  PreOrder = 'PRE_ORDER',
}

export type DisposableItem = {
  __typename: 'DisposableItem';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Int']['output'];
  selected: Scalars['Boolean']['output'];
};

export type Driver = {
  __typename: 'Driver';
  image: Scalars['String']['output'];
  name: Scalars['String']['output'];
  selfIntroduction: Scalars['String']['output'];
};

export type EatInOrder = Node &
  Order & {
    __typename: 'EatInOrder';
    charge: Charge;
    coupon?: Maybe<Coupon>;
    courseMenuItems: Array<OrderCourseMenuItem>;
    disposableItems: Array<DisposableItem>;
    facility: Facility;
    id: Scalars['ID']['output'];
    items: Array<OrderItem>;
    memo?: Maybe<Scalars['String']['output']>;
    payment?: Maybe<Payment>;
    progress?: Maybe<Progress>;
    seatNumber?: Maybe<Scalars['String']['output']>;
    shortIds: Array<Scalars['String']['output']>;
    submittedAt?: Maybe<Scalars['DateTime']['output']>;
  };

export type Facility = Node & {
  __typename: 'Facility';
  address1: Scalars['String']['output'];
  address2: Scalars['String']['output'];
  availableOrderTypes: Array<AvailableOrderType>;
  featureFlags: FeatureFlags;
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  isFavorite: Scalars['Boolean']['output'];
  latLng: LatLng;
  metaByLocation?: Maybe<FacilityMetaByLocation>;
  name: Scalars['String']['output'];
  ownerComment?: Maybe<OwnerComment>;
  phoneNumber: Scalars['String']['output'];
  postalCode: Scalars['String']['output'];
  shortName: Scalars['String']['output'];
};

export type FacilityMetaByLocationArgs = {
  location?: InputMaybe<LatLngInput>;
};

export type FacilityInfoSection = {
  __typename: 'FacilityInfoSection';
  facility: Facility;
  hasOtherFacilities: Scalars['Boolean']['output'];
};

export type FacilityInfoSectionHasOtherFacilitiesArgs = {
  orderType: OrderType;
};

export type FacilityMetaByLocation = {
  __typename: 'FacilityMetaByLocation';
  deliveryEstimatedArrivalTimeLabel: Scalars['String']['output'];
  distance: Scalars['Float']['output'];
};

export type FeatureFlags = {
  __typename: 'FeatureFlags';
  OnlinePaymentEnabled: Scalars['Boolean']['output'];
  eatInCourseMenuModeEnabled: Scalars['Boolean']['output'];
  itemCodeSearchEnabled: Scalars['Boolean']['output'];
  loyaltyProgramEnabled: Scalars['Boolean']['output'];
  showPriceExcludingTax: Scalars['Boolean']['output'];
};

export type InProgressOrderSection = {
  __typename: 'InProgressOrderSection';
  orders: Array<Order>;
};

export type LastOrderInput = {
  __typename: 'LastOrderInput';
  email: Scalars['String']['output'];
  lastNameKana: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
};

export type LatLng = {
  __typename: 'LatLng';
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

export type LatLngInput = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

export type Layout = {
  __typename: 'Layout';
  webHome: WebHome;
};

export type LayoutWebHomeArgs = {
  facilityID: Scalars['ID']['input'];
  orderType: OrderType;
};

export type LinkOrderInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  orderId: Scalars['ID']['input'];
};

export type LinkOrderPayload = {
  __typename: 'LinkOrderPayload';
  cautionText?: Maybe<Scalars['String']['output']>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
  resultMainText: Scalars['String']['output'];
  resultSubText?: Maybe<Scalars['String']['output']>;
};

export type LoyaltyCard = {
  __typename: 'LoyaltyCard';
  cautions: Array<Scalars['String']['output']>;
  hasRankUp: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  pointCondition: LoyaltyCardPointCondition;
  ranks: Array<LoyaltyCardRank>;
};

export type LoyaltyCardPointCondition = {
  __typename: 'LoyaltyCardPointCondition';
  caution?: Maybe<Scalars['String']['output']>;
  condition: Scalars['String']['output'];
};

export type LoyaltyCardRank = {
  __typename: 'LoyaltyCardRank';
  benefit?: Maybe<Scalars['String']['output']>;
  colorRGB: Scalars['String']['output'];
  name: Scalars['String']['output'];
  rankUpCondition: Scalars['String']['output'];
  stampCardRewards: Array<Scalars['String']['output']>;
};

export type MainVisualSection = {
  __typename: 'MainVisualSection';
  image: Scalars['String']['output'];
};

export type MembershipCard = {
  __typename: 'MembershipCard';
  membershipQRCodeData: Scalars['String']['output'];
};

export type MembershipCardSection = {
  __typename: 'MembershipCardSection';
  logo: Scalars['String']['output'];
  membershipQRCodeData: Scalars['String']['output'];
};

export type MenuCategoriesSection = {
  __typename: 'MenuCategoriesSection';
  categories: Array<MenuCategory>;
  title: Scalars['String']['output'];
};

export type MenuCategory = Node & {
  __typename: 'MenuCategory';
  id: Scalars['ID']['output'];
  items: MenuItemConnection;
  name: Scalars['String']['output'];
};

export type MenuCategoryItemsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderType: OrderType;
};

export type MenuItem = Node & {
  __typename: 'MenuItem';
  alcoholicBeverage: Scalars['Boolean']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  name: Scalars['String']['output'];
  options: Array<MenuItemOption>;
  orderStatus: MenuItemOrderStatus;
  ownerComment?: Maybe<OwnerComment>;
  price: Scalars['Int']['output'];
  priceExcludingTax: Scalars['Int']['output'];
  status: MenuItemStatus;
  taxRateType: TaxRateType;
};

export type MenuItemOrderStatusArgs = {
  orderType: OrderType;
};

export type MenuItemPriceArgs = {
  orderType: OrderType;
};

export type MenuItemPriceExcludingTaxArgs = {
  orderType: OrderType;
};

export type MenuItemConnection = {
  __typename: 'MenuItemConnection';
  nodes: Array<MenuItem>;
  pageInfo: PageInfo;
};

export type MenuItemOption = {
  __typename: 'MenuItemOption';
  id: Scalars['ID']['output'];
  items: Array<OptionItem>;
  maxSelectCount?: Maybe<Scalars['Int']['output']>;
  maxSelectCountPerItem?: Maybe<Scalars['Int']['output']>;
  minSelectCount?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
};

export type MenuItemOrderStatus = {
  __typename: 'MenuItemOrderStatus';
  reasonViewerCannotAddToCart?: Maybe<Scalars['String']['output']>;
  viewerCanAddToCart: Scalars['Boolean']['output'];
};

export type MenuItemStatus = {
  __typename: 'MenuItemStatus';
  available: Scalars['Boolean']['output'];
  labelUnavailable?: Maybe<Scalars['String']['output']>;
};

export type MenuItemsSection = {
  __typename: 'MenuItemsSection';
  items: Array<MenuItem>;
  title: Scalars['String']['output'];
};

export type ModifyCourseMenuOnCartInput = {
  cartId: Scalars['ID']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  courseMenuId: Scalars['ID']['input'];
  entries: Array<CourseMenuEntryInput>;
};

export type ModifyCourseMenuOnCartPayload = {
  __typename: 'ModifyCourseMenuOnCartPayload';
  cart: Cart;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type ModifyOrderItemInput = {
  cartId: Scalars['ID']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  orderItemId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
  selectedOptionItems: Array<SelectedOptionItemInput>;
};

export type ModifyOrderItemPayload = {
  __typename: 'ModifyOrderItemPayload';
  cart: Cart;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename: 'Mutation';
  addCoupon: AddCouponPayload;
  addCourseMenuToCart: AddCourseMenuToCartPayload;
  addDeliveryAddress: AddDeliveryAddressPayload;
  addMenuItemToCart: AddMenuItemToCartPayload;
  addPayment: AddPaymentPayload;
  cancelUnsubscribe: CancelUnsubscribePayload;
  checkInTable: CheckInTablePayload;
  checkoutTableOrder: CheckoutTableOrderPayload;
  linkOrder: LinkOrderPayload;
  modifyCourseMenuOnCart: ModifyCourseMenuOnCartPayload;
  modifyOrderItem: ModifyOrderItemPayload;
  receiveOrder: ReceiveOrderPayload;
  removeCourseMenuItemFromCart: RemoveCourseMenuItemFromCartPayload;
  removeDeliveryAddress: RemoveDeliveryAddressPayload;
  removeOrderItemFromCart: RemoveOrderItemFromCartPayload;
  removePayment: RemovePaymentPayload;
  requestAuthCodeByPhone: RequestAuthCodeByPhonePayload;
  requestAuthCodeBySMS: RequestAuthCodeBySmsPayload;
  requestProxyPhoneNumber: RequestProxyPhoneNumberPayload;
  selectCoupon: SelectCouponPayload;
  selectTableCoupon: SelectTableCouponPayload;
  sendCompletedSurvey: SendCompletedSurveyPayload;
  setSeatNumber: SetSeatNumberPayload;
  signIn: SignInPayload;
  signUp: SignUpPayload;
  submitCourseMenus: SubmitCourseMenusPayload;
  submitOrder: SubmitOrderPayload;
  submitTableOrder: SubmitTableOrderPayload;
  subscribe: SubscribePayload;
  unsubscribe: UnsubscribePayload;
  updateDefaultPayment: UpdateDefaultPaymentPayload;
  updateDeliveryAddressMemo: UpdateDeliveryAddressMemoPayload;
  updateDisposableItem: UpdateDisposableItemPayload;
  updateMemo: UpdateMemoPayload;
  updateNoContactDeliveryOption: UpdateNoContactDeliveryOptionPayload;
  updateProfile: UpdateProfilePayload;
  updateReceiptRequest: UpdatePaperReceiptPayload;
  updateScheduledOrderTime: UpdateScheduledOrderTimePayload;
  updateTenantUserLINEConfig: UpdateTenantUserLineConfigPayload;
  updateUserCourseMenuNoticeStatus: UpdateUserCourseMenuNoticeStatusPayload;
  updateUsingDeliveryAddress: UpdateUsingDeliveryAddressPayload;
  useCoupon: Coupon;
  useSubscriptionBenefit: UseSubscriptionBenefitPayload;
  verifySMSAuthCode: VerifySmsAuthCodePayload;
};

export type MutationAddCouponArgs = {
  input: AddCouponInput;
};

export type MutationAddCourseMenuToCartArgs = {
  input: AddCourseMenuToCartInput;
};

export type MutationAddDeliveryAddressArgs = {
  input: AddDeliveryAddressInput;
};

export type MutationAddMenuItemToCartArgs = {
  input: AddMenuItemToCartInput;
};

export type MutationAddPaymentArgs = {
  input: AddPaymentInput;
};

export type MutationCancelUnsubscribeArgs = {
  input: CancelUnsubscribeInput;
};

export type MutationCheckInTableArgs = {
  input: CheckInTableInput;
};

export type MutationCheckoutTableOrderArgs = {
  input: CheckoutTableOrderInput;
};

export type MutationLinkOrderArgs = {
  input: LinkOrderInput;
};

export type MutationModifyCourseMenuOnCartArgs = {
  input: ModifyCourseMenuOnCartInput;
};

export type MutationModifyOrderItemArgs = {
  input: ModifyOrderItemInput;
};

export type MutationReceiveOrderArgs = {
  input: ReceiveOrderInput;
};

export type MutationRemoveCourseMenuItemFromCartArgs = {
  input: RemoveCourseMenuItemFromCartInput;
};

export type MutationRemoveDeliveryAddressArgs = {
  input: RemoveDeliveryAddressInput;
};

export type MutationRemoveOrderItemFromCartArgs = {
  input: RemoveOrderItemFromCartInput;
};

export type MutationRemovePaymentArgs = {
  input: RemovePaymentInput;
};

export type MutationRequestAuthCodeByPhoneArgs = {
  input: RequestAuthCodeByPhoneInput;
};

export type MutationRequestAuthCodeBySmsArgs = {
  input: RequestAuthCodeBySmsInput;
};

export type MutationRequestProxyPhoneNumberArgs = {
  input: RequestProxyPhoneNumberInput;
};

export type MutationSelectCouponArgs = {
  input: SelectCouponInput;
};

export type MutationSelectTableCouponArgs = {
  input: SelectTableCouponInput;
};

export type MutationSendCompletedSurveyArgs = {
  input: SendCompletedSurveyInput;
};

export type MutationSetSeatNumberArgs = {
  input: SetSeatNumberInput;
};

export type MutationSignInArgs = {
  input: SignInInput;
};

export type MutationSignUpArgs = {
  input: SignUpInput;
};

export type MutationSuspendUserArgs = {
  input: SuspendUserInput;
};

export type MutationSubmitCourseMenusArgs = {
  input: SubmitCourseMenusInput;
};

export type MutationSubmitOrderArgs = {
  input: SubmitOrderInput;
};

export type MutationSubmitTableOrderArgs = {
  input: SubmitTableOrderInput;
};

export type MutationSubscribeArgs = {
  input: SubscribeInput;
};

export type MutationUnsubscribeArgs = {
  input: UnsubscribeInput;
};

export type MutationUpdateDefaultPaymentArgs = {
  input: UpdateDefaultPaymentInput;
};

export type MutationUpdateDeliveryAddressMemoArgs = {
  input: UpdateDeliveryAddressMemoInput;
};

export type MutationUpdateDisposableItemArgs = {
  input: UpdateDisposableItemInput;
};

export type MutationUpdateMemoArgs = {
  input: UpdateMemoInput;
};

export type MutationUpdateNoContactDeliveryOptionArgs = {
  input: UpdateNoContactDeliveryOptionInput;
};

export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};

export type MutationUpdateReceiptRequestArgs = {
  input: UpdatePaperReceiptRequestInput;
};

export type MutationUpdateScheduledOrderTimeArgs = {
  input: UpdateScheduledOrderTimeInput;
};

export type MutationUpdateTenantUserLineConfigArgs = {
  input: UpdateTenantUserLineConfigInput;
};

export type MutationUpdateUserCourseMenuNoticeStatusArgs = {
  input: UpdateUserCourseMenuNoticeStatusInput;
};

export type MutationUpdateUsingDeliveryAddressArgs = {
  input: UpdateUsingDeliveryAddressInput;
};

export type MutationUseCouponArgs = {
  input: UseCouponInput;
};

export type MutationUseSubscriptionBenefitArgs = {
  input: UseSubscriptionBenefitInput;
};

export type MutationVerifySmsAuthCodeArgs = {
  input: VerifySmsAuthCodeInput;
};

export type NoContactDeliveryOption = {
  __typename: 'NoContactDeliveryOption';
  requestNoContactDelivery: Scalars['Boolean']['output'];
};

export type Node = {
  id: Scalars['ID']['output'];
};

export enum NoticeReadStatus {
  NothingRead = 'NOTHING_READ',
  TenMinRead = 'TEN_MIN_READ',
  TimeOverRead = 'TIME_OVER_READ',
}

export type OptionItem = {
  __typename: 'OptionItem';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  price?: Maybe<Scalars['Int']['output']>;
  priceExcludingTax?: Maybe<Scalars['Int']['output']>;
  status: OptionItemStatus;
  subOptions: Array<MenuItemOption>;
  taxRateType: TaxRateType;
};

export type OptionItemPriceArgs = {
  orderType: OrderType;
};

export type OptionItemPriceExcludingTaxArgs = {
  orderType: OrderType;
};

export type OptionItemStatus = {
  __typename: 'OptionItemStatus';
  available: Scalars['Boolean']['output'];
  labelUnavailable?: Maybe<Scalars['String']['output']>;
};

export type Order = {
  charge: Charge;
  coupon?: Maybe<Coupon>;
  disposableItems: Array<DisposableItem>;
  facility: Facility;
  id: Scalars['ID']['output'];
  items: Array<OrderItem>;
  memo?: Maybe<Scalars['String']['output']>;
  payment?: Maybe<Payment>;
  progress?: Maybe<Progress>;
  shortIds: Array<Scalars['String']['output']>;
  submittedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type OrderConnection = {
  __typename: 'OrderConnection';
  nodes: Array<Order>;
  pageInfo: PageInfoTimeBased;
};

export type OrderCourseMenuItem = {
  __typename: 'OrderCourseMenuItem';
  courseMenu: CourseMenu;
  entry: CourseMenuEntry;
  id: Scalars['ID']['output'];
  quantity: Scalars['Int']['output'];
  totalPrice: Scalars['Int']['output'];
};

export type OrderInfo = {
  __typename: 'OrderInfo';
  customerCount?: Maybe<Scalars['Int']['output']>;
  orderId?: Maybe<Scalars['ID']['output']>;
  selectedCouponId?: Maybe<Scalars['ID']['output']>;
};

export type OrderItem = {
  __typename: 'OrderItem';
  id: Scalars['ID']['output'];
  menuItem: MenuItem;
  name: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  selectedOptionItems: Array<OrderOptionItem>;
  totalPrice: Scalars['Int']['output'];
};

export type OrderOptionItem = {
  __typename: 'OrderOptionItem';
  name: Scalars['String']['output'];
  optionId: Scalars['ID']['output'];
  optionItem: OptionItem;
  quantity: Scalars['Int']['output'];
  subOptionItems: Array<OrderOptionItem>;
};

export enum OrderType {
  Delivery = 'DELIVERY',
  EatIn = 'EAT_IN',
  Takeout = 'TAKEOUT',
}

export type Owner = {
  __typename: 'Owner';
  icon: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type OwnerComment = {
  __typename: 'OwnerComment';
  comment: Scalars['String']['output'];
  owner: Owner;
};

export type PageInfo = {
  __typename: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
};

export type PageInfoTimeBased = {
  __typename: 'PageInfoTimeBased';
  endCursor?: Maybe<Scalars['DateTime']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
};

export type PaperReceiptRequest = {
  __typename: 'PaperReceiptRequest';
  needsPaperReceipt: Scalars['Boolean']['output'];
  recipientName?: Maybe<Scalars['String']['output']>;
};

export type Payment = {
  __typename: 'Payment';
  brand: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isSelected: Scalars['Boolean']['output'];
  isSignInRequired: Scalars['Boolean']['output'];
  /** @deprecated use name instead */
  last4: Scalars['String']['output'];
  name: Scalars['String']['output'];
  paymentType: PaymentType;
};

export type PaymentIntent = {
  __typename: 'PaymentIntent';
  clientSecret?: Maybe<Scalars['String']['output']>;
  status: PaymentIntentStatus;
};

export enum PaymentIntentStatus {
  RequiresAction = 'REQUIRES_ACTION',
  RequiresCapture = 'REQUIRES_CAPTURE',
  Succeeded = 'SUCCEEDED',
}

export enum PaymentType {
  Card = 'CARD',
  NativePay = 'NATIVE_PAY',
  Register = 'REGISTER',
}

export type PlaceAddress = {
  __typename: 'PlaceAddress';
  addressLine: Scalars['String']['output'];
  country: Scalars['String']['output'];
  latLng: LatLng;
  placeId: Scalars['String']['output'];
  postalCode: Scalars['String']['output'];
  prefecture: Scalars['String']['output'];
};

export type PlacePrediction = {
  __typename: 'PlacePrediction';
  mainText: Scalars['String']['output'];
  placeId: Scalars['String']['output'];
  secondaryText: Scalars['String']['output'];
};

export type PostOrderMessage = {
  __typename: 'PostOrderMessage';
  message: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type Profile = {
  __typename: 'Profile';
  birthDate?: Maybe<UserProfileBirthDate>;
  displayName: Scalars['String']['output'];
  gender?: Maybe<Scalars['String']['output']>;
  imageUrl: Scalars['String']['output'];
  lastNameKana?: Maybe<Scalars['String']['output']>;
};

export type Progress = {
  __typename: 'Progress';
  caution: Scalars['String']['output'];
  contactType: ContactType;
  currentStep: Scalars['Int']['output'];
  driver?: Maybe<Driver>;
  lastStep: Scalars['Int']['output'];
  prepared: Scalars['Boolean']['output'];
  scheduledTime: Scalars['String']['output'];
  stepSubject: Scalars['String']['output'];
  tel: Scalars['String']['output'];
  waypointId?: Maybe<Scalars['ID']['output']>;
};

export type Promotion = {
  __typename: 'Promotion';
  items: Array<PromotionItem>;
  title: Scalars['String']['output'];
};

export type PromotionItem = {
  __typename: 'PromotionItem';
  description: Scalars['String']['output'];
  icon: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type Query = {
  __typename: 'Query';
  courseMenuCategories: Array<CourseMenuCategory>;
  customerAttributes: Array<CustomerAttribute>;
  deliveryAvailableFacilities: Array<Facility>;
  menuItemByItemCode: MenuItem;
  node?: Maybe<Node>;
  placeAddress: PlaceAddress;
  placePredictions: Array<PlacePrediction>;
  scheduleOrderAvailableDates: Array<AvailableDate>;
  scheduledOrderTimes: Array<ScheduledOrderTime>;
  scheduledOrderTimesByDate: Array<ScheduledOrderTimeItem>;
  tableWithMergeSupport: Table;
  viewer: User;
  viewing: Tenant;
};

export type QueryCourseMenuCategoriesArgs = {
  facilityId: Scalars['ID']['input'];
};

export type QueryCustomerAttributesArgs = {
  facilityId: Scalars['ID']['input'];
};

export type QueryDeliveryAvailableFacilitiesArgs = {
  location: LatLngInput;
};

export type QueryMenuItemByItemCodeArgs = {
  facilityId: Scalars['ID']['input'];
  itemCode: Scalars['String']['input'];
  orderType: OrderType;
};

export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};

export type QueryPlaceAddressArgs = {
  placeId: Scalars['String']['input'];
};

export type QueryPlacePredictionsArgs = {
  keyword: Scalars['String']['input'];
};

export type QueryScheduleOrderAvailableDatesArgs = {
  facilityId: Scalars['ID']['input'];
  orderType: OrderType;
};

export type QueryScheduledOrderTimesArgs = {
  facilityId: Scalars['ID']['input'];
  orderType: OrderType;
};

export type QueryScheduledOrderTimesByDateArgs = {
  date: DateInput;
  facilityId: Scalars['ID']['input'];
  orderType: OrderType;
};

export type QueryTableWithMergeSupportArgs = {
  tableId: Scalars['ID']['input'];
};

export type ReceiveOrderInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  orderId: Scalars['ID']['input'];
};

export type ReceiveOrderPayload = {
  __typename: 'ReceiveOrderPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  order: Order;
};

export type RemoveCourseMenuItemFromCartInput = {
  cartId: Scalars['ID']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  courseMenuItemId: Scalars['ID']['input'];
};

export type RemoveCourseMenuItemFromCartPayload = {
  __typename: 'RemoveCourseMenuItemFromCartPayload';
  cart: Cart;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type RemoveDeliveryAddressInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  deliveryAddressId: Scalars['ID']['input'];
};

export type RemoveDeliveryAddressPayload = {
  __typename: 'RemoveDeliveryAddressPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deliveryAddress: DeliveryAddress;
};

export type RemoveOrderItemFromCartInput = {
  cartId: Scalars['ID']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  orderItemId: Scalars['ID']['input'];
};

export type RemoveOrderItemFromCartPayload = {
  __typename: 'RemoveOrderItemFromCartPayload';
  cart: Cart;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type RemovePaymentInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  paymentId: Scalars['ID']['input'];
};

export type RemovePaymentPayload = {
  __typename: 'RemovePaymentPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  payment: Payment;
};

export type RequestAuthCodeByPhoneInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  phoneNumber: Scalars['String']['input'];
};

export type RequestAuthCodeByPhonePayload = {
  __typename: 'RequestAuthCodeByPhonePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type RequestAuthCodeBySmsInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  phoneNumber: Scalars['String']['input'];
};

export type RequestAuthCodeBySmsPayload = {
  __typename: 'RequestAuthCodeBySMSPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type RequestProxyPhoneNumberInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  waypointId: Scalars['ID']['input'];
};

export type RequestProxyPhoneNumberPayload = {
  __typename: 'RequestProxyPhoneNumberPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  phoneNumber: Scalars['String']['output'];
};

export type Requirements = {
  __typename: 'Requirements';
  requirement: Scalars['String']['output'];
  requirementLabel: Scalars['String']['output'];
};

export type ScheduledOrderTime = {
  __typename: 'ScheduledOrderTime';
  available: Scalars['Boolean']['output'];
  items: Array<ScheduledOrderTimeItem>;
  name: Scalars['String']['output'];
  orderType: OrderType;
  selected: Scalars['Boolean']['output'];
  type: ScheduledOrderTimeType;
};

export type ScheduledOrderTimeItem = {
  __typename: 'ScheduledOrderTimeItem';
  disabled: Scalars['Boolean']['output'];
  maxArrival: Scalars['String']['output'];
  minArrival: Scalars['String']['output'];
  name: Scalars['String']['output'];
  selected: Scalars['Boolean']['output'];
};

export enum ScheduledOrderTimeType {
  Now = 'NOW',
  Schedule = 'SCHEDULE',
  ScheduleDate = 'SCHEDULE_DATE',
}

export type SelectCouponInput = {
  cartId: Scalars['ID']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  couponId?: InputMaybe<Scalars['ID']['input']>;
};

export type SelectCouponPayload = {
  __typename: 'SelectCouponPayload';
  cart: Cart;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type SelectOrderTypeSection = {
  __typename: 'SelectOrderTypeSection';
  orderTypes: Array<OrderType>;
};

export type SelectTableCouponInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  couponId?: InputMaybe<Scalars['ID']['input']>;
};

export type SelectTableCouponPayload = {
  __typename: 'SelectTableCouponPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type SelectedOptionItemInput = {
  id: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
  subOptionItems: Array<SelectedOptionItemInput>;
};

export type SendCompletedSurveyInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  completedSurvey: Array<CompletedSurveyInput>;
  surveyID: Scalars['ID']['input'];
};

export type SendCompletedSurveyPayload = {
  __typename: 'SendCompletedSurveyPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type SetSeatNumberInput = {
  cartId: Scalars['ID']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  seatNumber: Scalars['String']['input'];
};

export type SetSeatNumberPayload = {
  __typename: 'SetSeatNumberPayload';
  cart: Cart;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type SignInInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type SignInPayload = {
  __typename: 'SignInPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type SignUpInput = {
  anonymousUserID: Scalars['String']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  firstNameKana: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  lastNameKana: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
};

export type SignUpPayload = {
  __typename: 'SignUpPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type SuspendUserInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type SuspendUserPayload = {
  __typename: 'SuspendUserPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type StampCard = {
  __typename: 'StampCard';
  currentPage: Scalars['Int']['output'];
  currentPoints: Scalars['Int']['output'];
  maxPointPerPage: Scalars['Int']['output'];
  reward: Scalars['String']['output'];
};

export type StatusSection = {
  __typename: 'StatusSection';
  title: Scalars['String']['output'];
};

export type SubmitCourseMenusInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  facilityId: Scalars['ID']['input'];
  items: Array<SubmitCourseMenusItemInput>;
  tableId: Scalars['ID']['input'];
};

export type SubmitCourseMenusItemInput = {
  courseMenuEntryId: Scalars['ID']['input'];
  courseMenuId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
};

export type SubmitCourseMenusPayload = {
  __typename: 'SubmitCourseMenusPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  postOrderMessage?: Maybe<PostOrderMessage>;
};

export type SubmitOrderInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  lastNameKana?: InputMaybe<Scalars['String']['input']>;
  liffAccessToken?: InputMaybe<Scalars['String']['input']>;
  orderId: Scalars['ID']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type SubmitOrderPayload = {
  __typename: 'SubmitOrderPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  order: Order;
  paymentIntent?: Maybe<PaymentIntent>;
};

export type SubmitTableOrderInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type SubmitTableOrderPayload = {
  __typename: 'SubmitTableOrderPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  order: Order;
  postOrderMessage?: Maybe<PostOrderMessage>;
};

export type SubscribeInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  planId: Scalars['ID']['input'];
};

export type SubscribePayload = {
  __typename: 'SubscribePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  paymentIntent: PaymentIntent;
  subscription: UserSubscription;
};

export type SubscriptionBenefit = {
  __typename: 'SubscriptionBenefit';
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type SubscriptionFeature = {
  __typename: 'SubscriptionFeature';
  description: Scalars['String']['output'];
  icon: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type SubscriptionPlan = {
  __typename: 'SubscriptionPlan';
  benefits: Array<SubscriptionBenefit>;
  id: Scalars['ID']['output'];
  price: Scalars['Int']['output'];
  recommendedComment: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type Survey = Node & {
  __typename: 'Survey';
  id: Scalars['ID']['output'];
  surveyConfig: SurveyConfig;
};

export type SurveyConfig = {
  __typename: 'SurveyConfig';
  availableAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  surveyForm: SurveyForm;
};

export type SurveyForm = {
  __typename: 'SurveyForm';
  id: Scalars['ID']['output'];
  rows: Array<SurveyFormRow>;
};

export type SurveyFormRow = {
  __typename: 'SurveyFormRow';
  answerType: AnswerType;
  answers: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
  question: Scalars['String']['output'];
  required: Scalars['Boolean']['output'];
};

export type Table = Node & {
  __typename: 'Table';
  cartRawId: Scalars['String']['output'];
  charge?: Maybe<Charge>;
  /** @deprecated テーブルに紐づく顧客属性を取得するとサーバーサイドでエラーになるため、代わりにisCustomerAttributesCollectedを使う。 */
  customerAttributeDetails: Array<CustomerAttributeDetail>;
  id: Scalars['ID']['output'];
  isCustomerAttributesCollected: Scalars['Boolean']['output'];
  mainCourseMenu?: Maybe<TableCourseMenu>;
  name: Scalars['String']['output'];
  order?: Maybe<OrderInfo>;
  orders: Array<TableOrder>;
  subCourseMenus: Array<TableCourseMenu>;
};

export type TableCourseMenu = {
  __typename: 'TableCourseMenu';
  courseMenu: CourseMenu;
  courseMenuItems: Array<OrderCourseMenuItem>;
  lastOrderAt?: Maybe<Scalars['DateTime']['output']>;
  noticeReadStatus: NoticeReadStatus;
};

export type TableOrder = Node &
  Order & {
    __typename: 'TableOrder';
    charge: Charge;
    coupon?: Maybe<Coupon>;
    disposableItems: Array<DisposableItem>;
    facility: Facility;
    id: Scalars['ID']['output'];
    items: Array<OrderItem>;
    memo?: Maybe<Scalars['String']['output']>;
    payment?: Maybe<Payment>;
    progress?: Maybe<Progress>;
    shortIds: Array<Scalars['String']['output']>;
    submittedAt?: Maybe<Scalars['DateTime']['output']>;
  };

export type TakeoutOrder = Node &
  Order & {
    __typename: 'TakeoutOrder';
    availablePayments: Array<Payment>;
    charge: Charge;
    completionStatus?: Maybe<CompletionStatus>;
    coupon?: Maybe<Coupon>;
    disposableItems: Array<DisposableItem>;
    facility: Facility;
    id: Scalars['ID']['output'];
    items: Array<OrderItem>;
    memo?: Maybe<Scalars['String']['output']>;
    paperReceiptRequest?: Maybe<PaperReceiptRequest>;
    payment?: Maybe<Payment>;
    progress?: Maybe<Progress>;
    scheduledTime: Scalars['String']['output'];
    shortIds: Array<Scalars['String']['output']>;
    submittedAt?: Maybe<Scalars['DateTime']['output']>;
  };

export type TakeoutSection = {
  __typename: 'TakeoutSection';
  selectedScheduledTime: Scalars['String']['output'];
};

export enum TaxRateType {
  Normal = 'NORMAL',
  Reduced = 'REDUCED',
}

export type Tenant = Node & {
  __typename: 'Tenant';
  accountRegistrationIncentives: Array<AccountRegistrationIncentive>;
  androidDownloadUrl: Scalars['String']['output'];
  appPromotion?: Maybe<Promotion>;
  companyAddress: Scalars['String']['output'];
  companyName: Scalars['String']['output'];
  contactUrl: Scalars['String']['output'];
  facilities: Array<Facility>;
  helpUrl: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  idProviderName: Scalars['String']['output'];
  iosDownloadUrl: Scalars['String']['output'];
  layout: Layout;
  lineAppName: Scalars['String']['output'];
  logo: Scalars['String']['output'];
  mainVisualImage: Scalars['String']['output'];
  name: Scalars['String']['output'];
  privacyPolicyUrl: Scalars['String']['output'];
  specifiedCommercialTransactionActUrl: Scalars['String']['output'];
  subscription?: Maybe<TenantSubscription>;
  tecAlignment: Scalars['Boolean']['output'];
  termsOfUseUrl: Scalars['String']['output'];
  topPageBannerSections?: Maybe<TopPageBannerSections>;
  userProfileInputFields: Array<UserProfileInputField>;
};

export type TenantFacilitiesArgs = {
  location?: InputMaybe<LatLngInput>;
};

export type TenantSubscription = {
  __typename: 'TenantSubscription';
  availableDays: Scalars['Int']['output'];
  contactUrl: Scalars['String']['output'];
  description: Scalars['String']['output'];
  features: Array<SubscriptionFeature>;
  helpUrl: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  plans: Array<SubscriptionPlan>;
  specialAgreementUrl: Scalars['String']['output'];
  termsOfUseUrl: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type TopPageBannerSections = {
  __typename: 'TopPageBannerSections';
  bannerSection: BannerSection;
  navigationItemsSection: BannerSection;
};

export type UnsubscribeInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type UnsubscribePayload = {
  __typename: 'UnsubscribePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  subscription: UserSubscription;
};

export type UpdateDefaultPaymentInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  paymentId: Scalars['ID']['input'];
};

export type UpdateDefaultPaymentPayload = {
  __typename: 'UpdateDefaultPaymentPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  payment: Payment;
};

export type UpdateDeliveryAddressMemoInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  deliveryAddressId: Scalars['ID']['input'];
  memo: Scalars['String']['input'];
};

export type UpdateDeliveryAddressMemoPayload = {
  __typename: 'UpdateDeliveryAddressMemoPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deliveryAddress: DeliveryAddress;
};

export type UpdateDisposableItemInput = {
  cartId: Scalars['ID']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  disposableItemId: Scalars['ID']['input'];
};

export type UpdateDisposableItemPayload = {
  __typename: 'UpdateDisposableItemPayload';
  cart: Cart;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type UpdateMemoInput = {
  cartId: Scalars['ID']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  memo: Scalars['String']['input'];
};

export type UpdateMemoPayload = {
  __typename: 'UpdateMemoPayload';
  cart: Cart;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type UpdateNoContactDeliveryOptionInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  requestNoContactDelivery: Scalars['Boolean']['input'];
};

export type UpdateNoContactDeliveryOptionPayload = {
  __typename: 'UpdateNoContactDeliveryOptionPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  noContactDeliveryOption: NoContactDeliveryOption;
};

export type UpdatePaperReceiptPayload = {
  __typename: 'UpdatePaperReceiptPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  paperReceiptRequest?: Maybe<PaperReceiptRequest>;
};

export type UpdatePaperReceiptRequestInput = {
  cartId: Scalars['ID']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  needsPaperReceipt: Scalars['Boolean']['input'];
  recipientName?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProfileBirthDateInput = {
  day: Scalars['Int']['input'];
  month: Scalars['Int']['input'];
  year: Scalars['Int']['input'];
};

export type UpdateProfileInput = {
  birthDate?: InputMaybe<UpdateProfileBirthDateInput>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  lastNameKana?: InputMaybe<Scalars['String']['input']>;
  occupation?: InputMaybe<Scalars['String']['input']>;
  prefecture?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProfilePayload = {
  __typename: 'UpdateProfilePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  profile: Profile;
};

export type UpdateScheduledOrderTimeInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<DateInput>;
  deliveryType?: InputMaybe<DeliveryType>;
  facilityId: Scalars['ID']['input'];
  maxArrival?: InputMaybe<Scalars['String']['input']>;
  minArrival?: InputMaybe<Scalars['String']['input']>;
  orderType: OrderType;
  type: ScheduledOrderTimeType;
};

export type UpdateScheduledOrderTimePayload = {
  __typename: 'UpdateScheduledOrderTimePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  scheduledOrderTime: ScheduledOrderTime;
};

export type UpdateTenantUserLineConfigInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  lineIdToken: Scalars['String']['input'];
};

export type UpdateTenantUserLineConfigPayload = {
  __typename: 'UpdateTenantUserLINEConfigPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type UpdateUserCourseMenuNoticeStatusInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  status: UserCourseMenuNoticeStatus;
};

export type UpdateUserCourseMenuNoticeStatusPayload = {
  __typename: 'UpdateUserCourseMenuNoticeStatusPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type UpdateUsingDeliveryAddressInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  deliveryAddressId: Scalars['ID']['input'];
};

export type UpdateUsingDeliveryAddressPayload = {
  __typename: 'UpdateUsingDeliveryAddressPayload';
  assignedFacilityId: Scalars['ID']['output'];
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deliveryAddress: DeliveryAddress;
};

export type UseCouponInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  couponId: Scalars['ID']['input'];
};

export type UseSubscriptionBenefitInput = {
  benefitId: Scalars['ID']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type UseSubscriptionBenefitPayload = {
  __typename: 'UseSubscriptionBenefitPayload';
  benefitUsage: UserSubscriptionBenefitUsage;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type UseSubscriptionInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type User = Node & {
  __typename: 'User';
  cart: Cart;
  coupons: CouponConnection;
  deliveryAddresses: Array<DeliveryAddress>;
  id: Scalars['ID']['output'];
  lastOrderInput?: Maybe<LastOrderInput>;
  loyaltyCard?: Maybe<UserLoyaltyCard>;
  membershipCard: MembershipCard;
  orders: OrderConnection;
  payments: Array<Payment>;
  profile?: Maybe<Profile>;
  subscription?: Maybe<UserSubscription>;
  table?: Maybe<Table>;
};

export type UserCartArgs = {
  facilityID: Scalars['ID']['input'];
  orderType: OrderType;
};

export type UserCouponsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  cartID?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isAvailable?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UserMembershipCardArgs = {
  facilityID: Scalars['ID']['input'];
};

export type UserOrdersArgs = {
  after?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type UserTableArgs = {
  facilityID: Scalars['ID']['input'];
};

export enum UserCourseMenuNoticeStatus {
  Read_10MinutesNotice = 'READ_10_MINUTES_NOTICE',
  ReadEndNotice = 'READ_END_NOTICE',
}

export type UserLoyaltyCard = {
  __typename: 'UserLoyaltyCard';
  activeStampCards: Array<StampCard>;
  currentRank: LoyaltyCardRank;
  expiration: UserLoyaltyCardExpiration;
  loyaltyCard: LoyaltyCard;
  nextRank?: Maybe<LoyaltyCardRank>;
};

export type UserLoyaltyCardExpiration = {
  __typename: 'UserLoyaltyCardExpiration';
  description?: Maybe<Scalars['String']['output']>;
  expiredAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UserProfileBirthDate = {
  __typename: 'UserProfileBirthDate';
  day: Scalars['Int']['output'];
  month: Scalars['Int']['output'];
  year: Scalars['Int']['output'];
};

export type UserProfileInputField = {
  __typename: 'UserProfileInputField';
  helpText?: Maybe<Scalars['String']['output']>;
  placeholder?: Maybe<Scalars['String']['output']>;
  required: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  type: UserProfileInputFieldType;
  values?: Maybe<Array<Scalars['String']['output']>>;
};

export enum UserProfileInputFieldType {
  BirthDate = 'BIRTH_DATE',
  DisplayName = 'DISPLAY_NAME',
  Gender = 'GENDER',
  LastNameKana = 'LAST_NAME_KANA',
  Occupation = 'OCCUPATION',
  Prefecture = 'PREFECTURE',
}

export type UserSubscription = {
  __typename: 'UserSubscription';
  currentPlan: UserSubscriptionPlan;
  payment: Payment;
  paymentHistories: Array<UserSubscriptionHistory>;
};

export type UserSubscriptionBenefitUsage = {
  __typename: 'UserSubscriptionBenefitUsage';
  benefit: SubscriptionBenefit;
  limit?: Maybe<Scalars['Int']['output']>;
  used: Scalars['Int']['output'];
};

export type UserSubscriptionHistory = {
  __typename: 'UserSubscriptionHistory';
  amount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  paidAt: Scalars['DateTime']['output'];
  planTitle: Scalars['String']['output'];
};

export type UserSubscriptionPlan = {
  __typename: 'UserSubscriptionPlan';
  benefitUsages: Array<UserSubscriptionBenefitUsage>;
  expiresAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  plan: SubscriptionPlan;
  startedAt: Scalars['DateTime']['output'];
  status: UserSubscriptionStatus;
  subscriptionMonth: Scalars['Int']['output'];
};

export enum UserSubscriptionStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  CancelCompleted = 'CANCEL_COMPLETED',
  PaymentFailed = 'PAYMENT_FAILED',
}

export type VerifySmsAuthCodeInput = {
  authCode: Scalars['String']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  phoneNumber: Scalars['String']['input'];
};

export type VerifySmsAuthCodePayload = {
  __typename: 'VerifySMSAuthCodePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type WebHome = {
  __typename: 'WebHome';
  sections: Array<WebHomeSection>;
};

export type WebHomeSection =
  | BannerSection
  | CourseMenuCategoriesSection
  | DeliverySection
  | FacilityInfoSection
  | InProgressOrderSection
  | MainVisualSection
  | MembershipCardSection
  | MenuCategoriesSection
  | MenuItemsSection
  | SelectOrderTypeSection
  | StatusSection
  | TakeoutSection;
