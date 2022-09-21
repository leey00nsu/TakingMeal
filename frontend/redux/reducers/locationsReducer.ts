import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Location {
  id: number
  lat: number
  lng: number
  name?: string
  address?: string
  category?: string
}

interface Locations {
  goodInfluence: Location[]
  schoolLunch: Location[]
  sharedRefrigerator: Location[]
  [props: string]: Location[]
}

const initialState: Locations = {
  goodInfluence: [],
  schoolLunch: [],

  sharedRefrigerator: [
    {
      id: 1,
      lat: 37.2651897,
      lng: 127.0455615,
      address: '권선종합시장(권선구 세권로 185)',
    },
    {
      id: 2,
      lat: 37.2923471,
      lng: 127.034194,
      address: '바른생협 매탄점(영통구 매탄로168번길 2)',
    },
    {
      id: 3,
      lat: 37.2678946,
      lng: 126.9910921,
      address: '우만종합사회복지관(팔달구 창룡대로210번길 13, 주공아파트)',
    },
    {
      id: 4,
      lat: 37.2646752,
      lng: 127.0082785,
      address: '우리샘갈비(권선구 서호동로26번길 12)',
    },
    {
      id: 5,
      lat: 37.2410187,
      lng: 126.9637578,
      address: '수원역해모로아파트 커뮤니티센터(권선구 세류로60)',
    },
    {
      id: 6,
      lat: 37.2581796,
      lng: 127.0317248,
      address:
        '상송마을 주공아파트(권선구 오목천로 15, 상송마을 주공아파트 112동 4경비실)',
    },
    {
      id: 7,
      lat: 37.3273698,
      lng: 127.013534,
      address: '경기수원지역자활센터(팔달구 권선로 733, LD 그린토피아 401호)',
    },
    {
      id: 8,
      lat: 37.2975213,
      lng: 127.0281498,
      address: '수원로컬푸드직매장(장안구 광교산로  509번길 13)',
    },
    {
      id: 9,
      lat: 37.2708224,
      lng: 126.9842676,
      address: '진달래 삼겹살(장안구 창훈로 69)',
    },
    {
      id: 10,
      lat: 37.2771332,
      lng: 127.0370517,
      address: '밥이랑면이랑(권선구 상탑로 120)',
    },
    {
      id: 11,
      lat: 37.3033786,
      lng: 127.0015598,
      address: '꽃미경네 삼겹포차(팔달구 중부대로 189)',
    },
    {
      id: 12,
      lat: 37.2907982,
      lng: 127.000014,
      address: '힐스템테라피(장안구 정조로 1108-1)',
    },
    {
      id: 13,
      lat: 37.3056387,
      lng: 126.9958322,
      address: '정자애누리시장(장안구 장안로89번길 47)',
    },
    {
      id: 14,
      lat: 37.2440174,
      lng: 127.0341753,
      address: '삼거리부동산(장안구 파장로46번길 3)',
    },
    {
      id: 15,
      lat: 37.2753925,
      lng: 127.0674623,
      address: '용스카매직(권선구 동수원로146번길 149)',
    },
    {
      id: 16,
      lat: 37.2789696,
      lng: 126.9740907,
      address: '광교한양수자인아파트(영통구 광교호수로152번길 23)',
    },
    {
      id: 17,
      lat: 37.2594864,
      lng: 127.0079238,
      address: '아이세움 공부방(권선구 구운로64번길 24)',
    },
    {
      id: 18,
      lat: 37.2580787,
      lng: 127.0141685,
      address: '욜로32(권선구 세권로32, 센트럴프라자 107호)',
    },
    {
      id: 19,
      lat: 37.2449735,
      lng: 127.0602251,
      address: '버드내 삼일교회(권선구 세권로 92-2)',
    },
    {
      id: 20,
      lat: 37.2744419,
      lng: 127.0419661,
      address: '한살림 망포매장(영통구 덕영대로1556번길 16)',
    },
    {
      id: 21,
      lat: 37.3087315,
      lng: 126.9914141,
      address: 'S서울병원(영통구 중부대로 246번길 14)',
    },
    {
      id: 22,
      lat: 37.2801849,
      lng: 126.9707386,
      address: 'IGA마트편의점 파장점(장안구 경수대로1101번길 36)',
    },
    {
      id: 23,
      lat: 37.3021888,
      lng: 126.9909984,
      address: '꿈이있는 작은도서관(권선구 구운로85번길 47-15)',
    },
    {
      id: 24,
      lat: 37.2498535,
      lng: 127.0130127,
      address: '정자1동 녹색가게(장안구 정자로130번길 20)',
    },
    {
      id: 25,
      lat: 37.2617712,
      lng: 126.9812901,
      address: '세류2동 골목상권교류센터(권선구 덕영대로1126번길 52)',
    },
    {
      id: 26,
      lat: 37.2492377,
      lng: 127.034439,
      address: '수원탑동시민농장(권선구 서둔로255)',
    },
  ],
}

const locationsReducer = createSlice({
  name: 'locations',
  initialState: initialState,
  reducers: {
    setLocations: (state: Locations, action: PayloadAction<any>) => {
      state.goodInfluence = action.payload.goodInfluence
      state.schoolLunch = action.payload.schoolLunch
    },
  },
})

export type { Location, Locations }
export const { setLocations } = locationsReducer.actions
export default locationsReducer.reducer
