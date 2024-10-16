import { Injectable } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import axios from 'axios';
import { PlaceRankDto } from './dto/place-rank.dto';

@Injectable()
export class PlaceService {
  async getPlaceType(keyword: string): Promise<string> {
    const url = `https://m.search.naver.com/search.naver?sm=mtp_hty.top&where=m&query=${keyword}`;

    const response = await axios.get(url);
    const html = response.data;

    const regex = /naver\.search\.ext\.nmb\.salt\.nlu\s*=\s*'({.*})';/;
    const match = regex.exec(html);

    if (match) {
      const jsonString = match[1];
      const data = JSON.parse(jsonString);

      // 여기서 data는 JavaScript 객체로 파싱된 JSON 데이터입니다.
      try {
        const rootQueryString = JSON.stringify(data, null, 2);
        const type = rootQueryString.split('"queryType"')[1].split(',')[0];
        return type.replaceAll(':', '').replaceAll('"', '').trim();
      } catch (err) {
        console.log(err);
        return 'place';
      }
    } else {
      console.log('No match found for __APOLLO_STATE__');
      return 'place';
      // await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  async getPlaceData(type: string, keyword: string, page: number) {
    let data = null;
    if (type === 'hairshop') {
      data = [
        {
          operationName: 'getBeautyList',
          variables: {
            useReverseGeocode: true,
            input: {
              query: keyword,
              display: 100,
              start: page,
              filterBooking: false,
              filterCoupon: false,
              naverBenefit: false,
              sortingOrder: 'precision',
              x: '127.40347150000088',
              y: '37.30633970000004',
              bounds:
                '126.77038434179894;36.40199871026759;126.95165875586127;38.17834646356846',
              deviceType: 'pcmap',
            },
            businessType: 'hairshop',
            isNmap: true,
            isBounds: true,
            reverseGeocodingInput: { x: '126.965263', y: '37.475097' },
          },
          query:
            'query getBeautyList($input: BeautyListInput, $businessType: String, $isNmap: Boolean!, $isBounds: Boolean!, $reverseGeocodingInput: ReverseGeocodingInput, $useReverseGeocode: Boolean = false) {\n  businesses: hairshops(input: $input) {\n    total\n    userGender\n    items {\n      ...BeautyBusinessItems\n      imageMarker @include(if: $isNmap) {\n        marker\n        markerSelected\n        __typename\n      }\n      markerId @include(if: $isNmap)\n      markerLabel @include(if: $isNmap) {\n        text\n        style\n        __typename\n      }\n      __typename\n    }\n    nlu {\n      ...NluFields\n      __typename\n    }\n    optionsForMap @include(if: $isBounds) {\n      ...OptionsForMap\n      __typename\n    }\n    __typename\n  }\n  brands: beautyBrands(input: $input, businessType: $businessType) {\n    name\n    cid\n    __typename\n  }\n  reverseGeocodingAddr(input: $reverseGeocodingInput) @include(if: $useReverseGeocode) {\n    ...ReverseGeocodingAddr\n    __typename\n  }\n}\n\nfragment NluFields on Nlu {\n  queryType\n  user {\n    gender\n    __typename\n  }\n  queryResult {\n    ptn0\n    ptn1\n    region\n    spot\n    tradeName\n    service\n    selectedRegion {\n      name\n      index\n      x\n      y\n      __typename\n    }\n    selectedRegionIndex\n    otherRegions {\n      name\n      index\n      __typename\n    }\n    property\n    keyword\n    queryType\n    nluQuery\n    businessType\n    cid\n    branch\n    forYou\n    franchise\n    titleKeyword\n    location {\n      x\n      y\n      default\n      longitude\n      latitude\n      dong\n      si\n      __typename\n    }\n    noRegionQuery\n    priority\n    showLocationBarFlag\n    themeId\n    filterBooking\n    repRegion\n    repSpot\n    dbQuery {\n      isDefault\n      name\n      type\n      getType\n      useFilter\n      hasComponents\n      __typename\n    }\n    type\n    category\n    menu\n    context\n    __typename\n  }\n  __typename\n}\n\nfragment ReverseGeocodingAddr on ReverseGeocodingResult {\n  rcode\n  region\n  __typename\n}\n\nfragment OptionsForMap on OptionsForMap {\n  maxZoom\n  minZoom\n  includeMyLocation\n  maxIncludePoiCount\n  center\n  spotId\n  keepMapBounds\n  __typename\n}\n\nfragment CouponItems on Coupon {\n  total\n  promotions {\n    promotionSeq\n    couponSeq\n    conditionType\n    image {\n      url\n      __typename\n    }\n    title\n    description\n    type\n    couponUseType\n    __typename\n  }\n  __typename\n}\n\nfragment BeautyBusinessItemBase on BeautySummary {\n  id\n  apolloCacheId\n  name\n  hasBooking\n  hasNPay\n  blogCafeReviewCount\n  bookingReviewCount\n visitorReviewCount\n bookingReviewScore\n  description\n  roadAddress\n  address\n  imageUrl\n  talktalkUrl\n  distance\n  x\n  y\n  representativePrice {\n    isFiltered\n    priceName\n    price\n    __typename\n  }\n  promotionTitle\n  stylesCount\n  visitorReviewCount\n  visitorReviewScore\n  styleBookingCounts {\n    styleNum\n    name\n    count\n    isPopular\n    __typename\n  }\n  newOpening\n  coupon {\n    ...CouponItems\n    __typename\n  }\n  __typename\n}\n\nfragment BeautyBusinessItems on BeautySummary {\n  ...BeautyBusinessItemBase\n  styles {\n    desc\n    shortDesc\n    styleNum\n    isPopular\n    images {\n      imageUrl\n      __typename\n    }\n    styleOptions {\n      num\n      __typename\n    }\n    __typename\n  }\n  streetPanorama {\n    id\n    pan\n    tilt\n    lat\n    lon\n    __typename\n  }\n  __typename\n}',
        },
      ];
    } else if (type === 'restaurant') {
      data = [
        {
          operationName: 'getRestaurants',
          variables: {
            useReverseGeocode: true,
            isNmap: true,
            restaurantListInput: {
              query: keyword,
              x: '127.55080199999736',
              y: '37.436318000000924',
              start: page,
              display: 100,
              takeout: null,
              orderBenefit: null,
              isCurrentLocationSearch: null,
              filterOpening: null,
              deviceType: 'pcmap',
              bounds:
                '127.47389770312384;36.53352633771131;127.65517211718799;38.306800242230906',
              isPcmap: true,
            },
            restaurantListFilterInput: {
              x: '127.55080199999736',
              y: '37.436318000000924',
              display: 100,
              start: page,
              query: keyword,
              bounds:
                '127.47389770312384;36.53352633771131;127.65517211718799;38.306800242230906',
              isCurrentLocationSearch: null,
            },
            reverseGeocodingInput: { x: '126.965263', y: '37.475097' },
          },
          query:
            'query getRestaurants($restaurantListInput: RestaurantListInput, $restaurantListFilterInput: RestaurantListFilterInput, $reverseGeocodingInput: ReverseGeocodingInput, $useReverseGeocode: Boolean = false, $isNmap: Boolean = false) {\n  restaurants: restaurantList(input: $restaurantListInput) {\n    items {\n      apolloCacheId\n      coupon {\n        ...CouponItems\n        __typename\n      }\n      ...CommonBusinessItems\n      ...RestaurantBusinessItems\n      __typename\n    }\n    ...RestaurantCommonFields\n    optionsForMap {\n      ...OptionsForMap\n      __typename\n    }\n    nlu {\n      ...NluFields\n      __typename\n    }\n    searchGuide {\n      ...SearchGuide\n      __typename\n    }\n    __typename\n  }\n  filters: restaurantListFilter(input: $restaurantListFilterInput) {\n    ...RestaurantFilter\n    __typename\n  }\n  reverseGeocodingAddr(input: $reverseGeocodingInput) @include(if: $useReverseGeocode) {\n    ...ReverseGeocodingAddr\n    __typename\n  }\n}\n\nfragment OptionsForMap on OptionsForMap {\n  maxZoom\n  minZoom\n  includeMyLocation\n  maxIncludePoiCount\n  center\n  spotId\n  keepMapBounds\n  __typename\n}\n\nfragment NluFields on Nlu {\n  queryType\n  user {\n    gender\n    __typename\n  }\n  queryResult {\n    ptn0\n    ptn1\n    region\n    spot\n    tradeName\n    service\n    selectedRegion {\n      name\n      index\n      x\n      y\n      __typename\n    }\n    selectedRegionIndex\n    otherRegions {\n      name\n      index\n      __typename\n    }\n    property\n    keyword\n    queryType\n    nluQuery\n    businessType\n    cid\n    branch\n    forYou\n    franchise\n    titleKeyword\n    location {\n      x\n      y\n      default\n      longitude\n      latitude\n      dong\n      si\n      __typename\n    }\n    noRegionQuery\n    priority\n    showLocationBarFlag\n    themeId\n    filterBooking\n    repRegion\n    repSpot\n    dbQuery {\n      isDefault\n      name\n      type\n      getType\n      useFilter\n      hasComponents\n      __typename\n    }\n    type\n    category\n    menu\n    context\n    __typename\n  }\n  __typename\n}\n\nfragment SearchGuide on SearchGuide {\n  queryResults {\n    regions {\n      displayTitle\n      query\n      region {\n        rcode\n        __typename\n      }\n      __typename\n    }\n    isBusinessName\n    __typename\n  }\n  queryIndex\n  types\n  __typename\n}\n\nfragment ReverseGeocodingAddr on ReverseGeocodingResult {\n  rcode\n  region\n  __typename\n}\n\nfragment CouponItems on Coupon {\n  total\n  promotions {\n    promotionSeq\n    couponSeq\n    conditionType\n    image {\n      url\n      __typename\n    }\n    title\n    description\n    type\n    couponUseType\n    __typename\n  }\n  __typename\n}\n\nfragment CommonBusinessItems on BusinessSummary {\n  id\n  dbType\n  name\n  businessCategory\n  category\n  description\n  hasBooking\n  hasNPay\n  x\n  y\n  distance\n  imageUrl\n  imageCount\n  phone\n  virtualPhone\n  routeUrl\n  streetPanorama {\n    id\n    pan\n    tilt\n    lat\n    lon\n    __typename\n  }\n  roadAddress\n  address\n  commonAddress\n  blogCafeReviewCount\n  bookingReviewCount\n visitorReviewCount\n  totalReviewCount\n  bookingUrl\n  bookingBusinessId\n  talktalkUrl\n  detailCid {\n    c0\n    c1\n    c2\n    c3\n    __typename\n  }\n  options\n  promotionTitle\n  agencyId\n  businessHours\n  newOpening\n  markerId @include(if: $isNmap)\n  markerLabel @include(if: $isNmap) {\n    text\n    style\n    __typename\n  }\n  imageMarker @include(if: $isNmap) {\n    marker\n    markerSelected\n    __typename\n  }\n  __typename\n}\n\nfragment RestaurantFilter on RestaurantListFilterResult {\n  filters {\n    index\n    name\n    value\n    multiSelectable\n    defaultParams {\n      age\n      gender\n      day\n      time\n      __typename\n    }\n    items {\n      index\n      name\n      value\n      selected\n      representative\n      displayName\n      clickCode\n      laimCode\n      type\n      icon\n      __typename\n    }\n    __typename\n  }\n  votingKeywordList {\n    items {\n      name\n      value\n      icon\n      clickCode\n      __typename\n    }\n    menuItems {\n      name\n      value\n      icon\n      clickCode\n      __typename\n    }\n    total\n    __typename\n  }\n  optionKeywordList {\n    items {\n      name\n      value\n      icon\n      clickCode\n      __typename\n    }\n    total\n    __typename\n  }\n  __typename\n}\n\nfragment RestaurantCommonFields on RestaurantListResult {\n  restaurantCategory\n  queryString\n  siteSort\n  selectedFilter {\n    order\n    rank\n    tvProgram\n    region\n    brand\n    menu\n    food\n    mood\n    purpose\n    sortingOrder\n    takeout\n    orderBenefit\n    cafeFood\n    day\n    time\n    age\n    gender\n    myPreference\n    hasMyPreference\n    cafeMenu\n    cafeTheme\n    theme\n    voting\n    filterOpening\n    keywordFilter\n    property\n    realTimeBooking\n    hours\n    __typename\n  }\n  rcodes\n  location {\n    sasX\n    sasY\n    __typename\n  }\n  total\n  __typename\n}\n\nfragment RestaurantBusinessItems on RestaurantListSummary {\n  categoryCodeList\n  visitorReviewScore\n  imageUrls\n  bookingHubUrl\n  bookingHubButtonName\n  visitorImages {\n    id\n    reviewId\n    imageUrl\n    profileImageUrl\n    nickname\n    __typename\n  }\n  visitorReviews {\n    id\n    review\n    reviewId\n    __typename\n  }\n  foryouLabel\n  foryouTasteType\n  microReview\n  tags\n  priceCategory\n  broadcastInfo {\n    program\n    date\n    menu\n    __typename\n  }\n  michelinGuide {\n    year\n    star\n    comment\n    url\n    hasGrade\n    isBib\n    alternateText\n    hasExtraNew\n    region\n    __typename\n  }\n  broadcasts {\n    program\n    menu\n    episode\n    broadcast_date\n    __typename\n  }\n  tvcastId\n  naverBookingCategory\n  saveCount\n  uniqueBroadcasts\n  isDelivery\n  deliveryArea\n  isCvsDelivery\n  isTableOrder\n  isPreOrder\n  isTakeOut\n  bookingDisplayName\n  bookingVisitId\n  bookingPickupId\n  popularMenuImages {\n    name\n    price\n    bookingCount\n    menuUrl\n    menuListUrl\n    imageUrl\n    isPopular\n    usePanoramaImage\n    __typename\n  }\n  newBusinessHours {\n    status\n    description\n    __typename\n  }\n  baemin {\n    businessHours {\n      deliveryTime {\n        start\n        end\n        __typename\n      }\n      closeDate {\n        start\n        end\n        __typename\n      }\n      temporaryCloseDate {\n        start\n        end\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  yogiyo {\n    businessHours {\n      actualDeliveryTime {\n        start\n        end\n        __typename\n      }\n      bizHours {\n        start\n        end\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  realTimeBookingInfo {\n    description\n    hasMultipleBookingItems\n    bookingBusinessId\n    bookingUrl\n    itemId\n    itemName\n    timeSlots {\n      date\n      time\n      timeRaw\n      available\n      __typename\n    }\n    __typename\n  }\n  __typename\n}',
        },
      ];
    } else if (type === 'accommodation') {
      data = [
        {
          operationName: 'getAccommodationList',
          variables: {
            useReverseGeocode: true,
            input: {
              query: keyword,
              display: 100,
              start: page,
              x: '127.48724299999822',
              y: '34.95069800000229',
              bounds:
                '127.4680169257789;34.7187766136865;127.51333552929361;35.17635277980543',
              sortingOrder: 'precision',
              deviceType: 'pcmap',
              minPrice: null,
              maxPrice: null,
            },
            isNmap: true,
            isBounds: true,
            reverseGeocodingInput: { x: '126.965263', y: '37.475097' },
          },
          query:
            'query getAccommodationList($input: AccommodationListInput, $isNmap: Boolean!, $isBounds: Boolean!, $reverseGeocodingInput: ReverseGeocodingInput, $useReverseGeocode: Boolean = false) {\n  businesses: accommodations(input: $input) {\n    total\n    items {\n      ...CommonBusinessItems\n      ...AccommodationBusinessItems\n      apolloCacheId\n      categoryCode\n      bookingReviewScore\n      coupon {\n        ...CouponItems\n        __typename\n      }\n      __typename\n    }\n    nlu {\n      ...AccommodationNlu\n      __typename\n    }\n    optionsForMap @include(if: $isBounds) {\n      ...OptionsForMap\n      __typename\n    }\n    __typename\n  }\n  reverseGeocodingAddr(input: $reverseGeocodingInput) @include(if: $useReverseGeocode) {\n    ...ReverseGeocodingAddr\n    __typename\n  }\n}\n\nfragment CommonBusinessItems on BusinessSummary {\n  id\n  dbType\n  name\n  businessCategory\n  category\n  description\n  hasBooking\n  hasNPay\n  x\n  y\n  distance\n  imageUrl\n  imageCount\n  phone\n  virtualPhone\n  routeUrl\n  streetPanorama {\n    id\n    pan\n    tilt\n    lat\n    lon\n    __typename\n  }\n  roadAddress\n  address\n  commonAddress\n  blogCafeReviewCount\n  bookingReviewCount\n visitorReviewCount\n  totalReviewCount\n  bookingUrl\n  bookingBusinessId\n  talktalkUrl\n  detailCid {\n    c0\n    c1\n    c2\n    c3\n    __typename\n  }\n  options\n  promotionTitle\n  agencyId\n  businessHours\n  newOpening\n  markerId @include(if: $isNmap)\n  markerLabel @include(if: $isNmap) {\n    text\n    style\n    __typename\n  }\n  imageMarker @include(if: $isNmap) {\n    marker\n    markerSelected\n    __typename\n  }\n  __typename\n}\n\nfragment CouponItems on Coupon {\n  total\n  promotions {\n    promotionSeq\n    couponSeq\n    conditionType\n    image {\n      url\n      __typename\n    }\n    title\n    description\n    type\n    couponUseType\n    __typename\n  }\n  __typename\n}\n\nfragment OptionsForMap on OptionsForMap {\n  maxZoom\n  minZoom\n  includeMyLocation\n  maxIncludePoiCount\n  center\n  spotId\n  keepMapBounds\n  __typename\n}\n\nfragment ReverseGeocodingAddr on ReverseGeocodingResult {\n  rcode\n  region\n  __typename\n}\n\nfragment AccommodationBusinessItems on AccommodationSummary {\n  imageUrls\n  microReview\n  placeReviewCount\n  placeReviewScore\n  roomImages {\n    id\n    name\n    imageUrl\n    minPrice\n    maxPrice\n    avgPrice\n    __typename\n  }\n  visitorImages {\n    id\n    reviewId\n    imageUrl\n    profileImageUrl\n    nickname\n    __typename\n  }\n  visitorReviews {\n    id\n    reviewId\n    review\n    __typename\n  }\n  matchRoomMinPrice\n  avgPrice\n  interiorPanorama\n  matchSidRoomIds\n  bookingUserCount\n  facility\n  coupon {\n    total\n    promotions {\n      promotionSeq\n      couponSeq\n      conditionType\n      image {\n        url\n        __typename\n      }\n      title\n      description\n      type\n      couponUseType\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment AccommodationNlu on Nlu {\n  queryType\n  queryResult {\n    q\n    theme\n    ptn0\n    ptn1\n    region\n    spot\n    tradeName\n    service\n    selectedRegion {\n      name\n      index\n      x\n      y\n      __typename\n    }\n    selectedRegionIndex\n    otherRegions {\n      name\n      index\n      __typename\n    }\n    property\n    keyword\n    queryType\n    location {\n      x\n      y\n      default\n      longitude\n      latitude\n      dong\n      si\n      __typename\n    }\n    noRegionQuery\n    priority\n    showLocationBarFlag\n    themeId\n    filterBooking\n    dbQuery {\n      isDefault\n      name\n      type\n      getType\n      useFilter\n      hasComponents\n      __typename\n    }\n    type\n    __typename\n  }\n  __typename\n}',
        },
      ];
    } else if (type === 'nailshop') {
      data = [
        {
          operationName: 'getBeautyList',
          variables: {
            useReverseGeocode: true,
            input: {
              query: keyword,
              display: 100,
              start: page,
              filterBooking: false,
              filterCoupon: false,
              naverBenefit: false,
              sortingOrder: 'precision',
              x: '127.4872430000018',
              y: '34.950697999999335',
              bounds:
                '127.4680169257843;34.718776613682806;127.51333552930083;35.17635277980176',
              deviceType: 'pcmap',
            },
            businessType: 'nailshop',
            isNmap: true,
            isBounds: true,
            reverseGeocodingInput: { x: '126.965263', y: '37.475097' },
          },
          query:
            'query getBeautyList($input: BeautyListInput, $businessType: String, $isNmap: Boolean!, $isBounds: Boolean!, $reverseGeocodingInput: ReverseGeocodingInput, $useReverseGeocode: Boolean = false) {\n  businesses: nailshops(input: $input) {\n    total\n    userGender\n    items {\n      ...BeautyBusinessItems\n      imageMarker @include(if: $isNmap) {\n        marker\n        markerSelected\n        __typename\n      }\n      markerId @include(if: $isNmap)\n      markerLabel @include(if: $isNmap) {\n        text\n        style\n        __typename\n      }\n      __typename\n    }\n    nlu {\n      ...NluFields\n      __typename\n    }\n    optionsForMap @include(if: $isBounds) {\n      ...OptionsForMap\n      __typename\n    }\n    __typename\n  }\n  brands: beautyBrands(input: $input, businessType: $businessType) {\n    name\n    cid\n    __typename\n  }\n  reverseGeocodingAddr(input: $reverseGeocodingInput) @include(if: $useReverseGeocode) {\n    ...ReverseGeocodingAddr\n    __typename\n  }\n}\n\nfragment NluFields on Nlu {\n  queryType\n  user {\n    gender\n    __typename\n  }\n  queryResult {\n    ptn0\n    ptn1\n    region\n    spot\n    tradeName\n    service\n    selectedRegion {\n      name\n      index\n      x\n      y\n      __typename\n    }\n    selectedRegionIndex\n    otherRegions {\n      name\n      index\n      __typename\n    }\n    property\n    keyword\n    queryType\n    nluQuery\n    businessType\n    cid\n    branch\n    forYou\n    franchise\n    titleKeyword\n    location {\n      x\n      y\n      default\n      longitude\n      latitude\n      dong\n      si\n      __typename\n    }\n    noRegionQuery\n    priority\n    showLocationBarFlag\n    themeId\n    filterBooking\n    repRegion\n    repSpot\n    dbQuery {\n      isDefault\n      name\n      type\n      getType\n      useFilter\n      hasComponents\n      __typename\n    }\n    type\n    category\n    menu\n    context\n    __typename\n  }\n  __typename\n}\n\nfragment ReverseGeocodingAddr on ReverseGeocodingResult {\n  rcode\n  region\n  __typename\n}\n\nfragment OptionsForMap on OptionsForMap {\n  maxZoom\n  minZoom\n  includeMyLocation\n  maxIncludePoiCount\n  center\n  spotId\n  keepMapBounds\n  __typename\n}\n\nfragment CouponItems on Coupon {\n  total\n  promotions {\n    promotionSeq\n    couponSeq\n    conditionType\n    image {\n      url\n      __typename\n    }\n    title\n    description\n    type\n    couponUseType\n    __typename\n  }\n  __typename\n}\n\nfragment BeautyBusinessItemBase on BeautySummary {\n  id\n  apolloCacheId\n  name\n  hasBooking\n  hasNPay\n  blogCafeReviewCount\n  bookingReviewCount\n visitorReviewCount\n totalReviewCount\n bookingReviewScore\n  description\n  roadAddress\n  address\n  imageUrl\n  talktalkUrl\n  distance\n  x\n  y\n  representativePrice {\n    isFiltered\n    priceName\n    price\n    __typename\n  }\n  promotionTitle\n  stylesCount\n  visitorReviewScore\n  styleBookingCounts {\n    styleNum\n    name\n    count\n    isPopular\n    __typename\n  }\n  newOpening\n  coupon {\n    ...CouponItems\n    __typename\n  }\n  __typename\n}\n\nfragment BeautyBusinessItems on BeautySummary {\n  ...BeautyBusinessItemBase\n  styles {\n    desc\n    shortDesc\n    styleNum\n    isPopular\n    images {\n      imageUrl\n      __typename\n    }\n    styleOptions {\n      num\n      __typename\n    }\n    __typename\n  }\n  streetPanorama {\n    id\n    pan\n    tilt\n    lat\n    lon\n    __typename\n  }\n  __typename\n}',
        },
      ];
    } else if (type === 'place') {
      data = [
        {
          operationName: 'getPlacesList',
          variables: {
            useReverseGeocode: true,
            input: {
              query: keyword,
              start: page,
              display: 100,
              adult: false,
              spq: false,
              queryRank: '',
              x: '127.48724299999822',
              y: '34.95069800000229',
              deviceType: 'pcmap',
              bounds:
                '127.4680169257789;34.7187766136865;127.51333552929361;35.17635277980543',
            },
            isNmap: true,
            isBounds: true,
            reverseGeocodingInput: { x: '126.965263', y: '37.475097' },
          },
          query:
            'query getPlacesList($input: PlacesInput, $isNmap: Boolean!, $isBounds: Boolean!, $reverseGeocodingInput: ReverseGeocodingInput, $useReverseGeocode: Boolean = false) {\n  businesses: places(input: $input) {\n    total\n    items {\n      id\n      name\n      normalizedName\n      category\n      detailCid {\n        c0\n        c1\n        c2\n        c3\n        __typename\n      }\n      categoryCodeList\n      dbType\n      distance\n      roadAddress\n      address\n      fullAddress\n      commonAddress\n      bookingUrl\n      phone\n      virtualPhone\n      businessHours\n      daysOff\n      imageUrl\n      imageCount\n      x\n      y\n      poiInfo {\n        polyline {\n          shapeKey {\n            id\n            name\n            version\n            __typename\n          }\n          boundary {\n            minX\n            minY\n            maxX\n            maxY\n            __typename\n          }\n          details {\n            totalDistance\n            arrivalAddress\n            departureAddress\n            __typename\n          }\n          __typename\n        }\n        polygon {\n          shapeKey {\n            id\n            name\n            version\n            __typename\n          }\n          boundary {\n            minX\n            minY\n            maxX\n            maxY\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      subwayId\n      markerId @include(if: $isNmap)\n      markerLabel @include(if: $isNmap) {\n        text\n        style\n        stylePreset\n        __typename\n      }\n      imageMarker @include(if: $isNmap) {\n        marker\n        markerSelected\n        __typename\n      }\n      oilPrice @include(if: $isNmap) {\n        gasoline\n        diesel\n        lpg\n        __typename\n      }\n      isPublicGas\n      isDelivery\n      isTableOrder\n      isPreOrder\n      isTakeOut\n      isCvsDelivery\n      hasBooking\n      naverBookingCategory\n      bookingDisplayName\n      bookingBusinessId\n      bookingVisitId\n      bookingPickupId\n      baemin {\n        businessHours {\n          deliveryTime {\n            start\n            end\n            __typename\n          }\n          closeDate {\n            start\n            end\n            __typename\n          }\n          temporaryCloseDate {\n            start\n            end\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      yogiyo {\n        businessHours {\n          actualDeliveryTime {\n            start\n            end\n            __typename\n          }\n          bizHours {\n            start\n            end\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      isPollingStation\n      hasNPay\n      talktalkUrl\n      visitorReviewCount\n      visitorReviewScore\n      blogCafeReviewCount\n      bookingReviewCount\n      streetPanorama {\n        id\n        pan\n        tilt\n        lat\n        lon\n        __typename\n      }\n      naverBookingHubId\n      bookingHubUrl\n      bookingHubButtonName\n      newOpening\n      newBusinessHours {\n        status\n        description\n        dayOff\n        dayOffDescription\n        __typename\n      }\n      coupon {\n        total\n        promotions {\n          promotionSeq\n          couponSeq\n          conditionType\n          image {\n            url\n            __typename\n          }\n          title\n          description\n          type\n          couponUseType\n          __typename\n        }\n        __typename\n      }\n      mid\n      hasMobilePhoneNumber\n      hiking {\n        distance\n        startName\n        endName\n        __typename\n      }\n      __typename\n    }\n    optionsForMap @include(if: $isBounds) {\n      ...OptionsForMap\n      displayCorrectAnswer\n      correctAnswerPlaceId\n      __typename\n    }\n    searchGuide {\n      queryResults {\n        regions {\n          displayTitle\n          query\n          region {\n            rcode\n            __typename\n          }\n          __typename\n        }\n        isBusinessName\n        __typename\n      }\n      queryIndex\n      types\n      __typename\n    }\n    queryString\n    siteSort\n    __typename\n  }\n  reverseGeocodingAddr(input: $reverseGeocodingInput) @include(if: $useReverseGeocode) {\n    ...ReverseGeocodingAddr\n    __typename\n  }\n}\n\nfragment OptionsForMap on OptionsForMap {\n  maxZoom\n  minZoom\n  includeMyLocation\n  maxIncludePoiCount\n  center\n  spotId\n  keepMapBounds\n  __typename\n}\n\nfragment ReverseGeocodingAddr on ReverseGeocodingResult {\n  rcode\n  region\n  __typename\n}',
        },
      ];
    } else if (type === 'hospital') {
      data = [
        {
          operationName: 'getNxList',
          variables: {
            isNmap: true,
            isBounds: true,
            useReverseGeocode: true,
            input: {
              query: keyword,
              display: 100,
              start: page,
              filterBooking: false,
              filterOpentime: false,
              filterSpecialist: false,
              sortingOrder: 'precision',
              x: '127.48724299999998',
              y: '34.95069800000155',
              day: null,
              bounds:
                '127.46801692578077;34.7187766136865;127.51333552929543;35.17635277980543',
              deviceType: 'pcmap',
            },
            reverseGeocodingInput: { x: '126.965263', y: '37.475097' },
          },
          query:
            'query getNxList($input: HospitalListInput, $reverseGeocodingInput: ReverseGeocodingInput, $isNmap: Boolean = false, $isBounds: Boolean = false, $useReverseGeocode: Boolean = false) {\n  businesses: hospitals(input: $input) {\n    total\n    items {\n      ...HospitalItemFields\n      __typename\n    }\n    nlu {\n      ...HospitalNluFields\n      __typename\n    }\n    searchGuide {\n      queryResults {\n        regions {\n          displayTitle\n          query\n          region {\n            name\n            rcode\n            __typename\n          }\n          __typename\n        }\n        isBusinessName\n        __typename\n      }\n      queryIndex\n      types\n      __typename\n    }\n    optionsForMap @include(if: $isBounds) {\n      ...OptionsForMap\n      __typename\n    }\n    queryString\n    siteSort\n    examinationFilters {\n      name\n      count\n      __typename\n    }\n    isCacheForced\n    __typename\n  }\n  reverseGeocodingAddr(input: $reverseGeocodingInput) @include(if: $useReverseGeocode) {\n    ...ReverseGeocodingAddr\n    __typename\n  }\n}\n\nfragment HospitalItemFields on HospitalSummary {\n  id\n  name\n  hasBooking\n  bookingUrl\n  hasNPay\n  blogCafeReviewCount\n  bookingReviewCount\n  visitorReviewCount\n totalReviewCount\n  visitorReviewScore\n  description\n  commonAddress\n  roadAddress\n  address\n  fullAddress\n  imageCount\n  distance\n  category\n  imageUrl\n  talktalkUrl\n  promotionTitle\n  businessHours\n  x\n  y\n  businessCategory\n  phone\n  virtualPhone\n  markerId @include(if: $isNmap)\n  markerLabel @include(if: $isNmap) {\n    text\n    style\n    __typename\n  }\n  imageMarker @include(if: $isNmap) {\n    marker\n    markerSelected\n    __typename\n  }\n  detailCid {\n    c0\n    c1\n    c2\n    c3\n    __typename\n  }\n  streetPanorama {\n    id\n    pan\n    tilt\n    lat\n    lon\n    __typename\n  }\n  newBusinessHours {\n    status\n    description\n    __typename\n  }\n  apolloCacheId\n  hiraSpecialists {\n    name\n    count\n    __typename\n  }\n  __typename\n}\n\nfragment OptionsForMap on OptionsForMap {\n  maxZoom\n  minZoom\n  includeMyLocation\n  maxIncludePoiCount\n  center\n  spotId\n  keepMapBounds\n  __typename\n}\n\nfragment HospitalNluFields on Nlu {\n  queryType\n  queryResult {\n    ptn0\n    ptn1\n    region\n    spot\n    tradeName\n    service\n    selectedRegion {\n      name\n      index\n      x\n      y\n      __typename\n    }\n    selectedRegionIndex\n    otherRegions {\n      name\n      index\n      __typename\n    }\n    property\n    keyword\n    queryType\n    location {\n      x\n      y\n      default\n      longitude\n      latitude\n      dong\n      si\n      __typename\n    }\n    noRegionQuery\n    priority\n    showLocationBarFlag\n    themeId\n    filterBooking\n    dbQuery {\n      isDefault\n      name\n      type\n      getType\n      useFilter\n      hasComponents\n      __typename\n    }\n    hospitalQuery\n    department\n    disease\n    repRegion\n    repSpot\n    day\n    __typename\n  }\n  __typename\n}\n\nfragment ReverseGeocodingAddr on ReverseGeocodingResult {\n  rcode\n  region\n  __typename\n}',
        },
      ];
    }
    return data;
  }

  async getPlaceRanking(placeRankDto: PlaceRankDto) {
    const keyword = placeRankDto.keyword;
    const placeNumber = placeRankDto.placeNumber;
    let page = 1;
    const url = 'https://api.place.naver.com/graphql';

    // 요청 헤더 설정
    const headers = {
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'ko',
      'content-type': 'application/json',
      cookie: 'NNB=P6BSSQLDVVZGM;',
      origin: 'https://m.place.naver.com',
      'sec-ch-ua':
        '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
    };
    const type = await this.getPlaceType(keyword);
    console.log(type);

    let rank = -1;
    let totalReviewCount = 0;
    let visitorReviewCount = 0;

    try {
      // axios를 사용하여 POST 요청 보내기
      while (true) {
        const data = await this.getPlaceData(type, keyword, page);
        const response = await this.getPaceData(url, data, headers, type);
        if (response && response.length <= 0) {
          break;
        }
        if (response === null) {
          return rank;
        }
        rank = response.findIndex((item) => item.id === placeNumber);
        const placeInfo = response.find((item) => item.id === placeNumber);
        if (rank !== -1) {
          rank = page + rank;
          console.log(placeInfo);
          totalReviewCount = placeInfo.totalReviewCount;
          visitorReviewCount = placeInfo.visitorReviewCount;
          return { rank, totalReviewCount, visitorReviewCount };
        }
        page += 100;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // 요청 결과 반환
      return { rank, totalReviewCount, visitorReviewCount };
    } catch (error) {
      console.error('Error fetching place ranking:', error);
      throw new Error('Failed to fetch place ranking');
    }
  }

  async getPaceData(url, data, headers, type) {
    const res = await axios.post(url, data, { headers });
    if (
      type === 'hospital' ||
      type === 'nailshop' ||
      type === 'hairshop' ||
      type === 'accommodation' ||
      type === 'place'
    ) {
      return res.data[0].data.businesses.items;
    } else if (type === 'restaurant') {
      return res.data[0].data.restaurants.items;
    }
  }

  create(createPlaceDto: CreatePlaceDto) {
    return 'This action adds a new place';
  }

  findAll() {
    return `This action returns all place`;
  }

  findOne(id: number) {
    return `This action returns a #${id} place`;
  }

  update(id: number, updatePlaceDto: UpdatePlaceDto) {
    return `This action updates a #${id} place`;
  }

  remove(id: number) {
    return `This action removes a #${id} place`;
  }
}
