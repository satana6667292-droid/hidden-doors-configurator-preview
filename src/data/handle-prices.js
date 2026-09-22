// Stage 1 handle price import from Hidden_Doors_B24_Ревизия_фурнитуры_v1.xlsx.
// Scope: category "Ручки" only. DATA + AUDIT ONLY.
// v54 intentionally does not connect these prices to UI/order calculations yet; that is Stage 2.
const BITRIX_HANDLE_BASE_PRICES=Object.freeze([
  {
    "name": "Ручка дверная Morelli \"Maglev\", на квадратной розетке 6 мм, MH-52-S6 SC NEW, цвет - мат.хром (квадрат 105 мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 25580,
    "offerId": 25582,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная \"Maglev\", на квадратной розетке 6 мм, MH-52-S6 W, цвет - белый (квадрат 105 мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 25584,
    "offerId": 25586,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная \"Колонна\", MH-03 SN/BN, цвет - бел.никель/черн.никель (квадрат 105 мм)",
    "price": 2122,
    "sourceBase": 2122,
    "parentId": 25536,
    "offerId": 25538,
    "priceOverride": false
  },
  {
    "name": "(НЕТ НА САЙТЕ ПОСТАВЩИКА) Дверная ручка MORELLI \"Bridge\" MH-25 SC/CP, цвет матовый хром/хром (квадрат 105 мм)",
    "price": 2440,
    "sourceBase": 2440,
    "parentId": 29396,
    "offerId": 29398,
    "priceOverride": false
  },
  {
    "name": "Bonaiti Art 937 Механизм вж мат.хром (замок, ручка, накладка мдф, ответка)(B-No ha mini) + регулируемая ответка 992/ замок с фиксатором (фиксатор покупается отдельно)",
    "price": 26600,
    "sourceBase": 26600,
    "parentId": 34316,
    "offerId": 34318,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка MORELLI \"MART\"MH-42-CLASSIC PG/W, цвет - золото/белый  (квадрат 105 мм)",
    "price": 2825,
    "sourceBase": 2825,
    "parentId": 25544,
    "offerId": 25546,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка  MORELLI GARAK на круглой розетке 6 мм, MH-59-R6 BL, цвет - чёрный (квадрат 105 мм)",
    "price": 2530,
    "sourceBase": 2530,
    "parentId": 27758,
    "offerId": 27760,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка ABRIS R50.177, цвет черный (квадрат 110 мм)",
    "price": 3000,
    "sourceBase": 3000,
    "parentId": 27086,
    "offerId": 27088,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка ABRISS R21.150 MBP, черный матовый (квадрат 110 мм)",
    "price": 1500,
    "sourceBase": 1500,
    "parentId": 25190,
    "offerId": 25192,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка ABRISS R21.150 MCP, Матовый хром (квадрат 110 мм)",
    "price": 1500,
    "sourceBase": 1500,
    "parentId": 25336,
    "offerId": 25338,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка ABRISS R21.180 MCP, матовый хром (квадрат  110 мм)",
    "price": 1500,
    "sourceBase": 1500,
    "parentId": 29462,
    "offerId": 29464,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка ABRISS R50.122 CP/WH, Хром/Белая вставка  (квадрат 110мм)",
    "price": 3880,
    "sourceBase": 3880,
    "parentId": 37384,
    "offerId": 37386,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка ABRISS R50.177 GR, цвет графит (квадрат 110мм)",
    "price": 3570,
    "sourceBase": 3570,
    "parentId": 34326,
    "offerId": 34328,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Ajax K.JS51.UNITY (UNITY JS) SN-3, матовый никель",
    "price": 850,
    "sourceBase": 850,
    "parentId": 35696,
    "offerId": 35698,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка APRILE TILIA Q 5S US PVD Цвет - антрацит (квадрат 100мм*)",
    "price": 9420,
    "sourceBase": 9420,
    "parentId": 25946,
    "offerId": 25948,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Archie SILLUR BARRERA M.BLACK, цвет матовый черный/платиново-серый",
    "price": 6850,
    "sourceBase": 6850,
    "parentId": 40394,
    "offerId": 40396,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo \"GRAND\" USS BL-26, черный (квадрат 100 мм)",
    "price": 3740,
    "sourceBase": 3740,
    "parentId": 25028,
    "offerId": 25030,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo Aqua URS BL-26 чёрная (квадрат 100 мм)",
    "price": 3740,
    "sourceBase": 3740,
    "parentId": 21508,
    "offerId": 21510,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка ARMADILLO BRICK K.UCS36.BRICK (BRICK UCS) MWSC-33 Итальянский тисненый (квадрат 105 мм)",
    "price": 7800,
    "sourceBase": 7800,
    "parentId": 18144,
    "offerId": 18146,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка ARMADILLO GRAND K.USS52.GRAND (GRAND USS) FSG-39 Флорентийское золото (квадрат 100мм)",
    "price": 3740,
    "sourceBase": 3740,
    "parentId": 28304,
    "offerId": 28306,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo K.ART30.CLARITY FSG-39, цвет флорентийское золото (квадрат 105 мм/нестандарт монтаж, цену предварительно уточнить)",
    "price": 4900,
    "sourceBase": 4900,
    "parentId": 29286,
    "offerId": 29288,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo K.SQ52.CORSICA (CORSICA SQ003) SN-3, цвет матовый никель (квадрат 105 мм)",
    "price": 3300,
    "sourceBase": 3300,
    "parentId": 30308,
    "offerId": 30310,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo K.SQ52.TRINITY (TRINITY SQ005) SN/CP-3, цвет матовый никель/хром (квадрат 105 мм)",
    "price": 3600,
    "sourceBase": 3600,
    "parentId": 25348,
    "offerId": 25350,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo K.USS52.GRAND (GRAND USS) BPVD-77, цвет вороненый никель (квадрат 100 мм)",
    "price": 3740,
    "sourceBase": 3740,
    "parentId": 30054,
    "offerId": 30056,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo K.USS52.GRAND (GRAND USS) WH-19, цвет белый  (квадрат 100 мм)",
    "price": 3740,
    "sourceBase": 3740,
    "parentId": 29642,
    "offerId": 29644,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo K.USS52.MORI (MORI USS) AB-7 бронза (квадрат 100)",
    "price": 3500,
    "sourceBase": 3500,
    "parentId": 40432,
    "offerId": 40434,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo K.USS52.MORI (MORI USS) FSG-39 флорентийское золото (квадрат 100 мм)",
    "price": 3740,
    "sourceBase": 3740,
    "parentId": 27180,
    "offerId": 27182,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo K.USS52.MORI BPVD-77, цвет вороненый никель (квадрат 100мм)",
    "price": 3740,
    "sourceBase": 3740,
    "parentId": 38072,
    "offerId": 38074,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo K.USS52.TORSO (TORSO USS) BL-26, цвет черный (квадрат 100 мм)",
    "price": 3740,
    "sourceBase": 3740,
    "parentId": 30064,
    "offerId": 30066,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo K.YM.CANNOLI FSG-39, цвет флор. золото",
    "price": 4350,
    "sourceBase": 4350,
    "parentId": 40354,
    "offerId": 40356,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo R.ART30.LACONY BL-26, цвет черный (квадрат 105 мм)",
    "price": 4000,
    "sourceBase": 4000,
    "parentId": 29526,
    "offerId": 29528,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка ARMADILLO R.LD54.Pava (Pava LD42) GP/SG-5, цвет золото/матовое золото (квадрат 105 мм)",
    "price": 3050,
    "sourceBase": 3050,
    "parentId": 29200,
    "offerId": 29202,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo R.URB52.EXCALIBUR (EXCALIBUR URB4) BPVD-77, цвет вороненый никель (квадрат 105 мм)",
    "price": 5500,
    "sourceBase": 5500,
    "parentId": 34372,
    "offerId": 34374,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo R.URB52.LINE (LINE URB6) BL-26, цвет черный (квадрат  105мм)",
    "price": 4850,
    "sourceBase": 4850,
    "parentId": 29500,
    "offerId": 29502,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo R.URB52.LINE (LINE URB6) BPVD-77, цвет вороненый никель (квадрат 105 мм.)",
    "price": 5450,
    "sourceBase": 5450,
    "parentId": 39482,
    "offerId": 39484,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo R.URB52.SQUID (SQUID URB9) BL-26, цвет черный (квадрат 105 мм)",
    "price": 4000,
    "sourceBase": 4000,
    "parentId": 30038,
    "offerId": 30040,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo R.URS52.AQUA MWSC-33, цвет итальянский тисненый (квадрат 100 мм)",
    "price": 3740,
    "sourceBase": 3740,
    "parentId": 28962,
    "offerId": 28964,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo R.YM.SAVOIARDI BL-26, цвет черный",
    "price": 4350,
    "sourceBase": 4350,
    "parentId": 40262,
    "offerId": 40264,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка ARMADILLO Urban Collection \"MORI\" K.USS52 SN-3, Матовый никель (Квадрат 100 мм)",
    "price": 3500,
    "sourceBase": 3500,
    "parentId": 15954,
    "offerId": 21428,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo Urban Collection BRICK UCS BL-26 чёрная (квадрат  105 мм)",
    "price": 7800,
    "sourceBase": 7800,
    "parentId": 16278,
    "offerId": 16280,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo Urban Collection BRICK UCS SN-3 Матовый никель (квадрат 105 мм)",
    "price": 7800,
    "sourceBase": 7800,
    "parentId": 15962,
    "offerId": 21432,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo Urban Collection CUBE R.URB52.CUBE (CUBE URB3) SN/CP-3, мат. никель/ хром  (квадрат 105 мм)",
    "price": 5500,
    "sourceBase": 5500,
    "parentId": 24212,
    "offerId": 24214,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo Urban Collection FLAME URS BL-26 чёрная (квадрат 100 мм)",
    "price": 3730,
    "sourceBase": 3730,
    "parentId": 16028,
    "offerId": 21372,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo Urban Collection IRON UCS BPVD-77  Вороненый никель (квадрат 105 мм)",
    "price": 5400,
    "sourceBase": 5400,
    "parentId": 18884,
    "offerId": 18886,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo Urban Collection IRON UCS MWSC-33, Итальянский тиснённый (квадрат 105 мм)",
    "price": 7800,
    "sourceBase": 7800,
    "parentId": 25332,
    "offerId": 25334,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo Urban Collection K.UCS36.IRON (IRON UCS) SN-3 матовый никель (квадрат 105 мм)",
    "price": 7800,
    "sourceBase": 7800,
    "parentId": 16332,
    "offerId": 16334,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo Urban Collection K.UCS36.STONE (STONE UCS) BL-26, Черный (квадрат 105 мм)",
    "price": 5400,
    "sourceBase": 5400,
    "parentId": 18846,
    "offerId": 18848,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo Urban Collection LINE URB6 CP-8 Хром (квадрат 105 мм)",
    "price": 4930,
    "sourceBase": 4930,
    "parentId": 26996,
    "offerId": 26998,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo Urban Collection LINE USQ6 SN-3 цвет матовый никель (Квадрат 105 мм)",
    "price": 4930,
    "sourceBase": 4930,
    "parentId": 26914,
    "offerId": 26916,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo Urban Collection Mirage (K.USS52.) BPVD-77, цвет вороненый никель (квадрат 80 мм)",
    "price": 3730,
    "sourceBase": 3730,
    "parentId": 29180,
    "offerId": 29182,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo Urban Collection Mirage (K.USS52.) USS-BL-26 чёрная (квадрат 80 мм)",
    "price": 3730,
    "sourceBase": 3730,
    "parentId": 15948,
    "offerId": 21408,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo Urban Collection Mirage USS CP-8 Хром (квадрат 80 мм)",
    "price": 3730,
    "sourceBase": 3730,
    "parentId": 25120,
    "offerId": 25122,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo Urban Collection Mirage USS MWSC-33, итальянский тисненный (квадрат  80мм)",
    "price": 3730,
    "sourceBase": 3730,
    "parentId": 25466,
    "offerId": 25468,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo Urban Collection MORI K.USS52. (MORI USS)BL-26, чёрный цвет (квадрат 100 мм)",
    "price": 3740,
    "sourceBase": 3740,
    "parentId": 25398,
    "offerId": 25400,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка ARMADILLO Urban Collection MORI K.USS52.(MORI USS) MWSC-33, цвет итальянский тисненый (квадрат 100мм)",
    "price": 3740,
    "sourceBase": 3740,
    "parentId": 29686,
    "offerId": 29688,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo Urban Collection SKY USS BL-26 чёрный цвет ( квадрат 100мм)",
    "price": 3740,
    "sourceBase": 3740,
    "parentId": 16162,
    "offerId": 16164,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo Urban Collection SKY USS CP-8, хром (квадрат 100 мм)",
    "price": 3800,
    "sourceBase": 3800,
    "parentId": 25170,
    "offerId": 25172,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo Urban Collection SKY USS FSG-39 Флорентийское золото (квадрат 100 мм)",
    "price": 3740,
    "sourceBase": 3740,
    "parentId": 24140,
    "offerId": 24142,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo Urban Collection SKY USS MWSC-33, итальянский тисненый (квадрат 100 мм)",
    "price": 3740,
    "sourceBase": 3740,
    "parentId": 25174,
    "offerId": 25176,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo Urban Collection SKY USS SN-3 матовый никель (квадрат 100 мм)",
    "price": 3740,
    "sourceBase": 3740,
    "parentId": 16024,
    "offerId": 21374,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo Urban Collection SKY USS WH-19 цвет белый (квадрат 100 мм)",
    "price": 3740,
    "sourceBase": 3740,
    "parentId": 18808,
    "offerId": 18810,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo Urban Collection STONE K.UCS36.STONE (STONE UCS) СР-8 хром (Квадрат 105 мм)",
    "price": 5200,
    "sourceBase": 5200,
    "parentId": 25516,
    "offerId": 25518,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo Urban Collection TWIN URS BPVD-77  Вороненый никель (квадрат 100 мм)",
    "price": 3740,
    "sourceBase": 3740,
    "parentId": 27036,
    "offerId": 27038,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo Urban Collection WAVE URS MWSC-33 Итальянский тисненый (квадрат 100мм)",
    "price": 3740,
    "sourceBase": 3740,
    "parentId": 16174,
    "offerId": 16176,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo для раздвижных дверей  SH.LD152.010 (SH010) SG-1, цвет матовое золото",
    "price": 1300,
    "sourceBase": 1300,
    "parentId": 36582,
    "offerId": 36584,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Armadillo для раздвижных дверей SH010 URB CP-8, цвет хром",
    "price": 1990,
    "sourceBase": 1990,
    "parentId": 28536,
    "offerId": 28538,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка BRIDGE R6 OSA, цвет матовое золото, латунь (квадрат 105 мм)",
    "price": 23450,
    "sourceBase": 23450,
    "parentId": 40448,
    "offerId": 40450,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Code Deco Slim H-40137-A-NISM, цвет никель супер матовый (квадрат 105 мм)",
    "price": 1275,
    "sourceBase": 1275,
    "parentId": 29766,
    "offerId": 29768,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Fantom \"София\" FM 115-50 22K STATIN, цвет золото матовое",
    "price": 3300,
    "sourceBase": 3300,
    "parentId": 37538,
    "offerId": 37540,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Fantom Фабиана FM 112-30 22K SATIN Матовое золото",
    "price": 3600,
    "sourceBase": 3600,
    "parentId": 36762,
    "offerId": 36764,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная FIORD-SM NERO",
    "price": 6320,
    "sourceBase": 6320,
    "parentId": 40444,
    "offerId": 40446,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Formani Basics 1501D150NMXXO LB7-19 NM, цвет черный",
    "price": 8060,
    "sourceBase": 8060,
    "parentId": 36800,
    "offerId": 36802,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Forme 212R Solis, цвет матовый хром",
    "price": 4300,
    "sourceBase": 4300,
    "parentId": 37366,
    "offerId": 37368,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка FUARO FLOW K.DM51, цвет сатинированное золото (квадрат 105 мм)",
    "price": 3000,
    "sourceBase": 3000,
    "parentId": 27078,
    "offerId": 27080,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Fuaro INOX 201 R.DSS201-0203/19, цвет нержавеющая сталь",
    "price": 920,
    "sourceBase": 920,
    "parentId": 42310,
    "offerId": 42312,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка FUARO K.DM51.FLOW BL-24, цвет черный (квадрат 105 мм)",
    "price": 3000,
    "sourceBase": 3000,
    "parentId": 29122,
    "offerId": 29124,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка FUARO K.DM51.Straight BL-24, цвет черный (квадрат 105 мм.)",
    "price": 3000,
    "sourceBase": 3000,
    "parentId": 39174,
    "offerId": 39176,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка FUARO K.DM51.Straight SSG-39, сатинированное золото (квадрат 105 мм)",
    "price": 3800,
    "sourceBase": 3800,
    "parentId": 27420,
    "offerId": 27422,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка FUARO K.DM51.Straight WH-19, цвет белый (квадрат 105 мм.)",
    "price": 3000,
    "sourceBase": 3000,
    "parentId": 39802,
    "offerId": 39804,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Fuaro K.KM52.SAMPLE (SAMPLE KM) GR-23, цвет графит",
    "price": 2800,
    "sourceBase": 2800,
    "parentId": 37682,
    "offerId": 37684,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка FUARO K.RL52 REDLINE SSG-39, цвет сатинированное золото (квадрат 105мм)",
    "price": 1500,
    "sourceBase": 1500,
    "parentId": 28424,
    "offerId": 28426,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка FUARO K.RL52.REDLINE (RED LINE RL) SSC-16, цвет сатинированный хром (квадрат 105 мм)",
    "price": 1500,
    "sourceBase": 1500,
    "parentId": 29884,
    "offerId": 29886,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка FUARO K.SL52. PRIZMA BL-24, цвет черный (квадрат 105 мм)",
    "price": 1550,
    "sourceBase": 1550,
    "parentId": 29076,
    "offerId": 29078,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Fuaro K.SL52.FLY BL-24, цвет черный",
    "price": 1550,
    "sourceBase": 1550,
    "parentId": 37144,
    "offerId": 37146,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка FUARO K.SL52.PHANTOM (PHANTOM SL) CP-8, цвет  хром (квадрат 105 мм)",
    "price": 1800,
    "sourceBase": 1800,
    "parentId": 28860,
    "offerId": 28862,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка FUARO K.SL52.PRIZMA (PRIZMA SL) GR-23, цвет графит",
    "price": 1550,
    "sourceBase": 1550,
    "parentId": 38602,
    "offerId": 38604,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка FUARO K.SL52.REDLINE (RED LINE SL) BL-24, цвет черный",
    "price": 1500,
    "sourceBase": 1500,
    "parentId": 38460,
    "offerId": 38462,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Fuaro K.SLR52.PRIDE SSC-16, цвет  сатинированный хром (квадрат 140 мм)",
    "price": 1550,
    "sourceBase": 1550,
    "parentId": 27642,
    "offerId": 27644,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Fuaro K.XM52.BIO (BIO XM) BL-24, цвет черный (квадрат 105 мм)",
    "price": 3000,
    "sourceBase": 3000,
    "parentId": 30042,
    "offerId": 30044,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка FUARO PRIME SL K.SL52 BL-24, цвет черный (квадрат 105 мм)",
    "price": 1800,
    "sourceBase": 1800,
    "parentId": 28820,
    "offerId": 28822,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка FUARO PRIME SL SSC-16, сатинированный хром  (квадрат 105 мм)",
    "price": 1800,
    "sourceBase": 1800,
    "parentId": 26070,
    "offerId": 26072,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка FUARO R.SLR52.BARREL CP-8, цвет хром (квадрат 140 мм)",
    "price": 1550,
    "sourceBase": 1550,
    "parentId": 39796,
    "offerId": 39798,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Fuaro R.SLR52.BARREL GR-23, цвет графит (квадрат 140)",
    "price": 1200,
    "sourceBase": 1200,
    "parentId": 40420,
    "offerId": 40422,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка FUARO R.SLR52.BARREL SSC-16, цвет сатинированный хром (квадрат 140 мм)",
    "price": 1550,
    "sourceBase": 1550,
    "parentId": 38648,
    "offerId": 38650,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка FUARO R.SLR52.BARREL SSG-39, цвет сатинированное золото (квадрат 140 мм)",
    "price": 1550,
    "sourceBase": 1550,
    "parentId": 28582,
    "offerId": 28584,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Fuaro R.SLR52.PRIDE BL-24, цвет черный (квадрат 140 мм)",
    "price": 1550,
    "sourceBase": 1550,
    "parentId": 42620,
    "offerId": 42622,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка FUARO R.SLR52.PRIDE SSG-39, цвет сатинированное золото (квадрат 140 мм)",
    "price": 1550,
    "sourceBase": 1550,
    "parentId": 28944,
    "offerId": 28946,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка FUARO R.SLR52.PRIZMA SSG-39, цвет сатинированное золото (квадрат 105 мм)",
    "price": 1550,
    "sourceBase": 1550,
    "parentId": 28958,
    "offerId": 28960,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка INTERTA FZ14-233 WR, цвет белый (квадрат 105 мм)",
    "price": 630,
    "sourceBase": 630,
    "parentId": 29112,
    "offerId": 29114,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Morelli  MH-35 BL-S, \"Pants\", на квадратной накладке, цвет - черный (квадрат 105 мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 23992,
    "offerId": 23994,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Morelli \"AZRIELI\" на круглой розетке 6 мм, MH-57-R6T BL, цвет - чёрный (квадрат 105 мм)",
    "price": 3417,
    "sourceBase": 3417,
    "parentId": 28762,
    "offerId": 28764,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Morelli \"Mira\", на квадратной розетке 6 мм, MH-54-S6 BL, цвет - черный (квадрат 105мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 25592,
    "offerId": 25594,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка MORELLI \"OAKA\" MH-61-R6 BL, цвет чёрный (квадрат 105 мм)",
    "price": 2530,
    "sourceBase": 2530,
    "parentId": 30358,
    "offerId": 30360,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка MORELLI \"OAKA\" MH-61-R6 MSC, цвет - мат. сатинированный хром (квадрат 105 мм)",
    "price": 2530,
    "sourceBase": 2530,
    "parentId": 36600,
    "offerId": 36602,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Morelli \"Pierres\" MH-49-S6 BL Цвет - Чёрный (квадрат 105 мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 25890,
    "offerId": 25892,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Morelli \"PLATEAU\" MH-51-S6 SC, матовый хром (квадрат 105 мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 24930,
    "offerId": 24932,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Morelli \"Plateau\", на квадратной розетке 6 мм, MH-51-S6 BL, цвет - черный (квадрат 105 мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 25572,
    "offerId": 25574,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка MORELLI \"SULLA\" MH-48-S6 SC/BL, мат.никель/черный (квадрат 105мм )",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 25268,
    "offerId": 25270,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Morelli \"Sulla\", на квадратной розетке 6 мм, MH-48-S6 BL, цвет - чёрный (квадрат 105 мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 25276,
    "offerId": 25278,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Morelli \"Колонна\" MH-03 BL, черный  (квадрат 105 мм)",
    "price": 2122,
    "sourceBase": 2122,
    "parentId": 24894,
    "offerId": 24896,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Morelli \"Колонна\" MH-03 SG/GP, цвет мат. золото/золото (квадрат 105 мм)",
    "price": 2336,
    "sourceBase": 2336,
    "parentId": 32816,
    "offerId": 32818,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Morelli AULA R5 NERO, цвет - черный (квадрат 105 мм)",
    "price": 6763,
    "sourceBase": 6763,
    "parentId": 29330,
    "offerId": 29332,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка MORELLI CAYAN на круглой розетке 6 мм, MH-58-R6 BL, цвет чёрный (квадрат 105 мм)",
    "price": 2530,
    "sourceBase": 2530,
    "parentId": 29030,
    "offerId": 29032,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка MORELLI Fukoku MH-28 BL-S, цвет черный (квадрат 105 мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 28384,
    "offerId": 28386,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка MORELLI GARAK MH-59-R6 MSC на круглой розетке 6 мм, цвет мат. сатин. хром (квадрат 105 мм)",
    "price": 2530,
    "sourceBase": 2530,
    "parentId": 30544,
    "offerId": 30546,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка MORELLI GARAK MH-59-R6 SC, цвет матовый хром (квадрат 105)",
    "price": 2530,
    "sourceBase": 2530,
    "parentId": 39030,
    "offerId": 39032,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка MORELLI HORIZONT-SM BIA без розетки, цвет белый (квадрат 105 мм)",
    "price": 6446,
    "sourceBase": 6446,
    "parentId": 29732,
    "offerId": 29734,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Morelli Horizont-SM Nero, черный цвет (квадрат 105 мм)",
    "price": 6446,
    "sourceBase": 6446,
    "parentId": 21512,
    "offerId": 21514,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Morelli Kaffee MH 50 S-6 SC матовый хром (квадрат 105 мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 25206,
    "offerId": 25208,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Morelli Kaffee MH 50 S-6 W белая (квадрат 105 мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 25210,
    "offerId": 25212,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Morelli Kaffee MH 50 S6 BL, черная (квадрат 105 мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 27452,
    "offerId": 27454,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Morelli LAND MH-60-R6 BL на круглой розетке 6 мм, цвет черный (квадрат 105 мм)",
    "price": 2530,
    "sourceBase": 2530,
    "parentId": 29776,
    "offerId": 29778,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Morelli Luxury FIORD-SQ CAFFE Цвет - кофе (квадрат 105 мм)",
    "price": 6497,
    "sourceBase": 6497,
    "parentId": 25874,
    "offerId": 25876,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка MORELLI Luxury HORIZONT-SM CSA, цвет матовый хром (квадрат 105мм)",
    "price": 6446,
    "sourceBase": 6446,
    "parentId": 29242,
    "offerId": 29244,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Morelli Luxury HORIZONT-SQ CRO хром (квадрат 105 мм)",
    "price": 7099,
    "sourceBase": 7099,
    "parentId": 21538,
    "offerId": 21540,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Morelli luxury HORIZONT-SQ CSA, цвет - мат. хром (квадрат 105 мм)",
    "price": 6497,
    "sourceBase": 6497,
    "parentId": 25974,
    "offerId": 25976,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Morelli LUXURY THE FORCE CSA, цвет матовый хром (квадрат 105 мм)",
    "price": 6763,
    "sourceBase": 6763,
    "parentId": 28610,
    "offerId": 28612,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Morelli Luxury VOSTOK-RM CSA Цвет - Матовый хром (квадрат 105 мм)",
    "price": 5160,
    "sourceBase": 5160,
    "parentId": 25762,
    "offerId": 25764,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка MORELLI MARACANA MH-62-R50 BL на скрытой овальной розетке с фиксатором, цвет черный",
    "price": 4202,
    "sourceBase": 4202,
    "parentId": 40206,
    "offerId": 40208,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка MORELLI MARACANA MH-62-R50 WD BL на скрытой овальной розетке с фиксатором, для дверей толщиной 50-65мм, цвет черный",
    "price": 4202,
    "sourceBase": 4202,
    "parentId": 40216,
    "offerId": 40218,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Morelli MH-47- S6 W, цвет белый (квадрат 105 мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 26162,
    "offerId": 26164,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка MORELLI MH-65-R6 R6 SEMPIONE BL, цвет черный",
    "price": 2530,
    "sourceBase": 2530,
    "parentId": 42306,
    "offerId": 42308,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка MORELLI MH-65-R6 SEMPIONE MSG, цвет матовое сатинированное золото",
    "price": 2630,
    "sourceBase": 2630,
    "parentId": 42388,
    "offerId": 42390,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка MORELLI MIRA MH-54-S6 GR, цвет графит (квадрат 105 мм.)",
    "price": 2725,
    "sourceBase": 2725,
    "parentId": 42544,
    "offerId": 42546,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка MORELLI MIRA MH-54-S6 W, цвет белый (квадрат 105 мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 34352,
    "offerId": 34354,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Morelli MIRA на квадратной розетке 6 мм, MH-54-S6 SSC, цвет супер матовый хром (квадрат 105 мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 29834,
    "offerId": 29836,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка MORELLI NEW ENGLAND MH-63-S50 BL, цвет черный (квадрат 105 мм)",
    "price": 4202,
    "sourceBase": 4202,
    "parentId": 35960,
    "offerId": 35962,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка MORELLI SHELL MH-45 GR/CP-S55, цвет графит/хром (квадрат 105 мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 35868,
    "offerId": 35870,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка MORELLI SHUTTLE BIA без розетки, цвет белый (квадрат 105 мм)",
    "price": 11353,
    "sourceBase": 11353,
    "parentId": 29728,
    "offerId": 29730,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Morelli SPUTNIK S5 NERO на квадратной розетке 7 мм, цвет черный ( квадрат 105 мм)",
    "price": 7171,
    "sourceBase": 7171,
    "parentId": 29784,
    "offerId": 29786,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Morelli SPUTNIK-SM NERO без розетки, цвет черный (квадрат 105 мм)",
    "price": 6803,
    "sourceBase": 6803,
    "parentId": 29578,
    "offerId": 29580,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка MORELLI THE FORCE R5 ANT, цвет антрацит (квадрат 105 мм)",
    "price": 8395,
    "sourceBase": 8395,
    "parentId": 37824,
    "offerId": 37826,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка MORELLI TOMORROW R5 CSA, цвет матовый хром (квадрат 105 мм)",
    "price": 7650,
    "sourceBase": 7650,
    "parentId": 37968,
    "offerId": 37970,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка MORELLI TOMORROW R5 NERO, цвет черный ( квадрат 105 мм)",
    "price": 7650,
    "sourceBase": 7650,
    "parentId": 30354,
    "offerId": 30356,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка MORELLI WATERFALL S2 OSA, цвет матовое золото (квадрат 105 мм.)",
    "price": 19180,
    "sourceBase": 19180,
    "parentId": 38416,
    "offerId": 38418,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PALLINI \"Андромеда\" PAL-COS-01-S MATT BLACK, матовый черный (квадрат 90 мм)",
    "price": 1595,
    "sourceBase": 1595,
    "parentId": 25962,
    "offerId": 25964,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PALLINI \"Андромеда\" PAL-COS-01-S SC, матовый хром (квадрат 90 мм)",
    "price": 1595,
    "sourceBase": 1595,
    "parentId": 25954,
    "offerId": 25956,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PALLINI \"Андромеда\" PAL-COS-01-S WHITE, белая  (квадрат 90 мм)",
    "price": 1595,
    "sourceBase": 1595,
    "parentId": 25958,
    "offerId": 25960,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PALLINI \"Капелла\" PAL-COS-04-S MATT BLACK, черный матовый (квадрат 90мм)",
    "price": 1925,
    "sourceBase": 1925,
    "parentId": 26288,
    "offerId": 26290,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PALLINI COSMO  \"Лира\" PAL-COS-08 MatBlack, Чёрный матовый (квадрат 90 мм)",
    "price": 2035,
    "sourceBase": 2035,
    "parentId": 21520,
    "offerId": 21522,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PALLINI COSMO \"Лира\" PAL-COS-08 SC Матовый хром  (квадрат 90 мм)",
    "price": 2035,
    "sourceBase": 2035,
    "parentId": 21530,
    "offerId": 21532,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PALLINI COSMO \"Мира\" PAL-COS-12-S MatBlack, цвет черный (квадрат 90 мм)",
    "price": 1485,
    "sourceBase": 1485,
    "parentId": 29966,
    "offerId": 29968,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PALLINI COSMO Дорадо PAL-COS-05 WHITE, белая (квадрат 90 мм)",
    "price": 2035,
    "sourceBase": 2035,
    "parentId": 25692,
    "offerId": 25694,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PALLINI «Капелла» PAL-COS-04-S SC, цвет матовый хром (квадрат 90 мм)",
    "price": 2244,
    "sourceBase": 2244,
    "parentId": 29754,
    "offerId": 29756,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PORTA DI PARMA PUNTO 102.06, цвет полированное золото PVD",
    "price": 3900,
    "sourceBase": 3900,
    "parentId": 39594,
    "offerId": 39596,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUERTO \"Бискотти\" INAL 540-03 slim B, цвет черный (квадрат 100 мм)",
    "price": 1420,
    "sourceBase": 1420,
    "parentId": 29064,
    "offerId": 29066,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUERTO \"Гляссе\" INAL 555-03 slim SSG, цвет золото матовое сатинированное (квадрат 100 мм)",
    "price": 1550,
    "sourceBase": 1550,
    "parentId": 28980,
    "offerId": 28982,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUERTO \"Куббаито\" 541-03 slim B, цвет черный (квадрат 105 мм)",
    "price": 1375,
    "sourceBase": 1375,
    "parentId": 30368,
    "offerId": 30370,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUERTO \"Куббаито\" серия ZERO INAL 541-11 B, цвет черный (квадрат 105 мм)",
    "price": 1570,
    "sourceBase": 1570,
    "parentId": 28344,
    "offerId": 28346,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUERTO \"Куббаито\" серия ZERO INAL 541-11 SSC, цвет супер сатин хром (квадрат 100 мм)",
    "price": 1375,
    "sourceBase": 1375,
    "parentId": 29072,
    "offerId": 29074,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUERTO \"Латте\" INAL 543-03 slim MSN, цвет никель супер матовый (квадрат 100 мм)",
    "price": 1350,
    "sourceBase": 1350,
    "parentId": 29510,
    "offerId": 29512,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUERTO \"Макиато\" INAL 544-06 slim B, цвет черный (квадрат  105 мм)",
    "price": 1405,
    "sourceBase": 1405,
    "parentId": 30050,
    "offerId": 30052,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUERTO \"Макиато\" INAL 544-06 slim MSN, цвет никель супер матовый (квадрат 105 мм)",
    "price": 1405,
    "sourceBase": 1405,
    "parentId": 39292,
    "offerId": 39294,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Puerto \"Мокка\" inal 548-09 zero, супер сатин хром (квадрат 105 мм)",
    "price": 1310,
    "sourceBase": 1310,
    "parentId": 25778,
    "offerId": 25780,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUERTO \"Пастьера\" INAL 535-03 B, цвет - черный (В ПОДАРОК), (квадрат 100 мм)",
    "price": 1340,
    "sourceBase": 1,
    "purchasePrice": 725,
    "purchasePriceSource": "ИнтерДизайн / Ирбис, прайс апрель 2026; подтверждено счетами по серии Пастьера",
    "parentId": 25906,
    "offerId": 25908,
    "priceOverride": true,
    "priceOverrideReason": "Согласовано 19.09.2026: рабочая цена 1 340 ₽/шт. (РРЦ), закуп 725 ₽/шт.; исходный BASE Bitrix24 = 1 ₽"
  },
  {
    "name": "Дверная ручка PUERTO \"Пастьера\" INAL 535-03 B, цвет - черный (квадрат 100 мм)",
    "price": 1200,
    "sourceBase": 1200,
    "parentId": 25910,
    "offerId": 25912,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUERTO \"Пастьера\" INAL 535-03 MBN, цвет - матовый черный никель (В ПОДАРОК) (квадрат 100 мм)",
    "price": 1340,
    "sourceBase": 1,
    "purchasePrice": 725,
    "purchasePriceSource": "ИнтерДизайн / Ирбис, прайс апрель 2026; подтверждено счетами по серии Пастьера",
    "parentId": 25922,
    "offerId": 25924,
    "priceOverride": true,
    "priceOverrideReason": "Согласовано 19.09.2026: рабочая цена 1 340 ₽/шт. (РРЦ), закуп 725 ₽/шт.; исходный BASE Bitrix24 = 1 ₽"
  },
  {
    "name": "Дверная ручка PUERTO \"Пастьера\" INAL 535-03 MBN, цвет - матовый черный никель (квадрат 100 мм)",
    "price": 1200,
    "sourceBase": 1200,
    "parentId": 25926,
    "offerId": 25928,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUERTO \"Пастьера\" INAL 535-03 MSN, цвет - матовый супер никель (В ПОДАРОК) (квадрат 100 мм)",
    "price": 1340,
    "sourceBase": 1,
    "purchasePrice": 725,
    "purchasePriceSource": "ИнтерДизайн / Ирбис, прайс апрель 2026; подтверждено счетами по серии Пастьера",
    "parentId": 25930,
    "offerId": 25932,
    "priceOverride": true,
    "priceOverrideReason": "Согласовано 19.09.2026: рабочая цена 1 340 ₽/шт. (РРЦ), закуп 725 ₽/шт.; исходный BASE Bitrix24 = 1 ₽"
  },
  {
    "name": "Дверная ручка PUERTO \"Пастьера\" INAL 535-03 MSN, цвет - матовый супер никель (квадрат 105мм)",
    "price": 1200,
    "sourceBase": 1200,
    "parentId": 25934,
    "offerId": 25936,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUERTO \"Пастьера\" INAL 535-03 MSW, цвет - матовый супер белый (В ПОДАРОК) (квадрат 100 мм)",
    "price": 1340,
    "sourceBase": 1,
    "purchasePrice": 725,
    "purchasePriceSource": "ИнтерДизайн / Ирбис, прайс апрель 2026; подтверждено счетами по серии Пастьера",
    "parentId": 25914,
    "offerId": 25916,
    "priceOverride": true,
    "priceOverrideReason": "Согласовано 19.09.2026: рабочая цена 1 340 ₽/шт. (РРЦ), закуп 725 ₽/шт.; исходный BASE Bitrix24 = 1 ₽"
  },
  {
    "name": "Дверная ручка PUERTO \"Пастьера\" INAL 535-03 MSW, цвет - матовый супер белый (квадрат 100мм)",
    "price": 1200,
    "sourceBase": 1200,
    "parentId": 25918,
    "offerId": 25920,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUERTO \"Пастьера\" INAL 535-03 slim MSN, цвет матовый супер никель (квадрат 100 мм)",
    "price": 1350,
    "sourceBase": 1350,
    "parentId": 29518,
    "offerId": 29520,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUERTO \"Пастьера\" INAL 535-03 SN, цвет - матовый никель (В ПОДАРОК) (квадрат  105 мм)",
    "price": 1340,
    "sourceBase": 1,
    "purchasePrice": 725,
    "purchasePriceSource": "ИнтерДизайн / Ирбис, прайс апрель 2026; подтверждено счетами по серии Пастьера",
    "parentId": 25938,
    "offerId": 25940,
    "priceOverride": true,
    "priceOverrideReason": "Согласовано 19.09.2026: рабочая цена 1 340 ₽/шт. (РРЦ), закуп 725 ₽/шт.; исходный BASE Bitrix24 = 1 ₽"
  },
  {
    "name": "Дверная ручка PUERTO \"Пастьера\" INAL 535-03 SN, цвет - матовый никель (квадрат 105 мм)",
    "price": 1200,
    "sourceBase": 1200,
    "parentId": 25942,
    "offerId": 25944,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUERTO \"Пиката\" INAL 519-08 SN, цвет никель матовый (квадрат 105 мм)",
    "price": 1475,
    "sourceBase": 1475,
    "parentId": 28688,
    "offerId": 28690,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUERTO \"Ристретто\" INAL 546-06 slim B, цвет черный (квадрат 105 мм)",
    "price": 1310,
    "sourceBase": 1310,
    "parentId": 28010,
    "offerId": 28012,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Puerto \"Соффиони\" INAL 547-06 slim, чёрная (квадрат 105 мм)",
    "price": 1330,
    "sourceBase": 1330,
    "parentId": 25822,
    "offerId": 25824,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUERTO \"Фрапе\" INAL 545-06 slim MSN, цвет никель супер матовый (квадрат 105 мм)",
    "price": 1385,
    "sourceBase": 1385,
    "parentId": 42582,
    "offerId": 42584,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUERTO \"Фрапе\" INAL 545-06 slim В, цвет - черный (квадрат 105 мм)",
    "price": 1385,
    "sourceBase": 1385,
    "parentId": 28094,
    "offerId": 28096,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUERTO \"Фрапе\" INAL 545-06 slim, цвет - Супер сатин хром (квадрат 100 мм)",
    "price": 1210,
    "sourceBase": 1210,
    "parentId": 27638,
    "offerId": 27640,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUERTO \"Эспрессо\" INAL 542-03 slim B, цвет - черный (квадрат 100 мм)",
    "price": 1355,
    "sourceBase": 1355,
    "parentId": 29458,
    "offerId": 29460,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUERTO \"Эспрессо\" INAL 542-03 slim MSN, цвет - Никель супер матовый (квадрат 100 мм)",
    "price": 1355,
    "sourceBase": 1355,
    "parentId": 27784,
    "offerId": 27786,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUERTO \"Эспрессо\" INAL 542-03 slim MSW, матовый супер белый (квадрат 110мм)",
    "price": 1550,
    "sourceBase": 1550,
    "parentId": 28218,
    "offerId": 28220,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUERTO B2B 521-02 SN/CP, цвет никель матовый/хром блестящий",
    "price": 485,
    "sourceBase": 485,
    "parentId": 40296,
    "offerId": 40298,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Puerto MOKKA Zero INAL 548-09 B, цвет черный (квадрат 85мм)",
    "price": 1500,
    "sourceBase": 1500,
    "parentId": 28932,
    "offerId": 28934,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUERTO Тирамису INAL 524-03 MBN, цвет матовый черный никель (квадрат 100 мм)",
    "price": 1580,
    "sourceBase": 1580,
    "parentId": 29044,
    "offerId": 29046,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUNTO K.QL52. STYLE(STYLE QL) BL-24, цвет черный (квадрат 105 мм)",
    "price": 1400,
    "sourceBase": 1400,
    "parentId": 25700,
    "offerId": 25702,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUNTO K.QL52.BLADE BL-24, черный цвет (квадрат 105 мм)",
    "price": 1400,
    "sourceBase": 1400,
    "parentId": 25244,
    "offerId": 25246,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUNTO K.QL52.STYLE (STYLE QL) GR/CP-23, цвет графит/хром (квадрат 105 мм.)",
    "price": 1400,
    "sourceBase": 1400,
    "parentId": 38530,
    "offerId": 38532,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUNTO K.QL52.STYLE (STYLE QL) SN/CP-3 матовый никель/хром (квадрат 105 мм)",
    "price": 1400,
    "sourceBase": 1400,
    "parentId": 25248,
    "offerId": 25250,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUNTO K.QSL52. TITAN SN/BL-3, мат.никель/черный (квадрат 105 мм)",
    "price": 1600,
    "sourceBase": 1600,
    "parentId": 25272,
    "offerId": 25274,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUNTO VECTOR K.QL52.VECTOR (VECTOR QL) BL-24 Черный (квадрат 105 мм)",
    "price": 1050,
    "sourceBase": 1050,
    "parentId": 28272,
    "offerId": 28274,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка PUNTO Vector QL SN/CP-3 SSC-16, цвет Сатин Хром (квадрат 105 мм)",
    "price": 1050,
    "sourceBase": 1050,
    "parentId": 28252,
    "offerId": 28254,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Renz Равенна INDH 302-03 MBN, Черный матовый никель (квадрат 105 мм)",
    "price": 2900,
    "sourceBase": 2900,
    "parentId": 26080,
    "offerId": 26082,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Rucceti RAP 21-S BL, черный  (квадрат 105мм)",
    "price": 1100,
    "sourceBase": 1100,
    "parentId": 21666,
    "offerId": 21668,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка RAP 20 SN/CP, цвет - бел. никель/хром (квадрат 105 мм)",
    "price": 1105,
    "sourceBase": 1105,
    "parentId": 25628,
    "offerId": 25630,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Rucetti RAP 14-S SN/CP Белый никель/хром (квадрат 105 мм)",
    "price": 1170,
    "sourceBase": 1170,
    "parentId": 16362,
    "offerId": 16364,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Rucetti RAP 16 s-bl чёрная (квадрат 105 мм)",
    "price": 1220,
    "sourceBase": 1220,
    "parentId": 16256,
    "offerId": 16258,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Rucetti RAP 16-S SC /CP матовый хром (квадрат 105 мм)",
    "price": 1220,
    "sourceBase": 1220,
    "parentId": 16320,
    "offerId": 16322,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Rucetti RAP 22-S BL чёрного цвета (квадрат 105 мм)",
    "price": 1220,
    "sourceBase": 1220,
    "parentId": 25298,
    "offerId": 25300,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Rucetti RAP 24-S BL, черная (квадрат 105 мм)",
    "price": 1220,
    "sourceBase": 1220,
    "parentId": 24028,
    "offerId": 24030,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Rucetti RAP 24-S SC/CP матовый хром/хром (квадрат 105 мм)",
    "price": 1200,
    "sourceBase": 1200,
    "parentId": 24906,
    "offerId": 24908,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка RUCETTI RAP 30 SLIM-S BL, цвет черный (квадрат 105 мм.)",
    "price": 1440,
    "sourceBase": 1440,
    "parentId": 39444,
    "offerId": 39446,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Vantage v52l-2/bl al, черный/мат хром (квадрат 100 мм)",
    "price": 1200,
    "sourceBase": 1200,
    "parentId": 25804,
    "offerId": 25806,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка Vantage V53BL-2 AL, цвет черный (квадрат 100 мм)",
    "price": 950,
    "sourceBase": 950,
    "parentId": 29616,
    "offerId": 29618,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка АЛЛЮР АРТ \"КОЛОМБО\" SB (2370), цвет мат. золото (квадрат 105мм)",
    "price": 1190,
    "sourceBase": 1190,
    "parentId": 29660,
    "offerId": 29662,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка на круглом основании Fratelli Cattini \"NEVADA\" 7FS-CS, цвет матовый хром",
    "price": 6100,
    "sourceBase": 6100,
    "parentId": 37350,
    "offerId": 37352,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка РЕНЦ \"Антонио\" INDH 99-12 MSN, цвет никель супер матовый",
    "price": 4042,
    "sourceBase": 4042,
    "parentId": 39982,
    "offerId": 39984,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка РЕНЦ \"Кроне\" INDH 320-03 slim B, цвет черный (квадрат 105 мм)",
    "price": 3500,
    "sourceBase": 3500,
    "parentId": 30094,
    "offerId": 30096,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка РЕНЦ \"Кроне\" INDH 320-03 slim SN, цвет никель матовый (квадрат 105 мм.)",
    "price": 3500,
    "sourceBase": 3500,
    "parentId": 39474,
    "offerId": 39476,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка РЕНЦ \"Лана\" INDH 95-03 B, черный цвет (квадрат 105 мм)",
    "price": 2800,
    "sourceBase": 2800,
    "parentId": 26656,
    "offerId": 26658,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка РЕНЦ \"Лана\" INDH 95-03 MSN, супер матовый никель  (квадрат 105 мм)",
    "price": 2800,
    "sourceBase": 2800,
    "parentId": 26706,
    "offerId": 26708,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка РЕНЦ \"Лана\" INDH 95-03 SW, супер белый цвет (квадрат 105 мм)",
    "price": 2800,
    "sourceBase": 2800,
    "parentId": 26660,
    "offerId": 26662,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка РЕНЦ \"Латина\" INDH 322-03 slim B, цвет черный (квадрат 105 мм)",
    "price": 3075,
    "sourceBase": 3075,
    "parentId": 30424,
    "offerId": 30426,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка РЕНЦ Люкс \"HOTO\" INDH 317-01 B, цвет черный  (квадрат 105 мм)",
    "price": 3750,
    "sourceBase": 3750,
    "parentId": 26874,
    "offerId": 26876,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка РЕНЦ Люкс \"Арко\" INDH 315-01 B, цвет черный (квадрат 105 мм)",
    "price": 3420,
    "sourceBase": 3420,
    "parentId": 29414,
    "offerId": 29416,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка РЕНЦ Люкс \"Ното\" IDNH 317-01 SSC, супер сатин хром (квадрат 105 мм)",
    "price": 3750,
    "sourceBase": 3750,
    "parentId": 27430,
    "offerId": 27432,
    "priceOverride": false
  },
  {
    "name": "Дверная ручка-защелка VETTORE A8581 ET MBP (ключ-поворотник), цвет черный матовый",
    "price": 2800,
    "sourceBase": 2800,
    "parentId": 42256,
    "offerId": 42258,
    "priceOverride": false
  },
  {
    "name": "Дверные ручки Morelli \"Lot\" MH-56-S6 BL, цвет черный (квадрат 105мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 39710,
    "offerId": 39712,
    "priceOverride": false
  },
  {
    "name": "Дверные ручки Morelli \"Lot\" MH-56-S6 SSC Цвет - Супер матовый хром (квадрат  105мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 28044,
    "offerId": 28046,
    "priceOverride": false
  },
  {
    "name": "Дверные ручки Morelli Luxury COMETA CRO Цвет - Хром (квадрат 105 мм)",
    "price": 10910,
    "sourceBase": 10910,
    "parentId": 21542,
    "offerId": 21544,
    "priceOverride": false
  },
  {
    "name": "Завертка Armadillo BKW8.K.USS52 (BKW8/USS) BL-26, цвет черный",
    "price": 900,
    "sourceBase": 900,
    "parentId": 29900,
    "offerId": 29902,
    "priceOverride": false
  },
  {
    "name": "Нажимная дверная ручка Hafele 903.93.556 (квадрат 100 мм)",
    "price": 1600,
    "sourceBase": 1600,
    "parentId": 25800,
    "offerId": 25802,
    "priceOverride": false
  },
  {
    "name": "Ручка Armadillo (Армадилло) раздельная R.URB52.CUBE (CUBE URB3) BPVD/Black-77 вороненый никель/черный",
    "price": 5200,
    "sourceBase": 5200,
    "parentId": 25060,
    "offerId": 25062,
    "priceOverride": false
  },
  {
    "name": "Ручка Armadillo K.YM.TOFFEE BL-26 черный",
    "price": 4400,
    "sourceBase": 4400,
    "parentId": 40496,
    "offerId": 40498,
    "priceOverride": false
  },
  {
    "name": "Ручка Armadillo R.URS52.TWIN (TWIN URS) MWSC-33,  итальянский тисненый (квадрат 100 мм)",
    "price": 3740,
    "sourceBase": 3740,
    "parentId": 28280,
    "offerId": 28282,
    "priceOverride": false
  },
  {
    "name": "Ручка Armadillo для раздвижных дверей SH.URB153.010 (SH010 URB) MWSC-33 итальянский тисненый",
    "price": 1990,
    "sourceBase": 1990,
    "parentId": 27774,
    "offerId": 27776,
    "priceOverride": false
  },
  {
    "name": "Ручка Armadillo (поворотная BK6.K.YM BL-26 черный",
    "price": 1600,
    "sourceBase": 1600,
    "parentId": 40502,
    "offerId": 40504,
    "priceOverride": false
  },
  {
    "name": "Ручка Fuaro K.DM51.FLOW WH-19, цвет белый (квадрат 105 мм)",
    "price": 3000,
    "sourceBase": 3000,
    "parentId": 24996,
    "offerId": 24998,
    "priceOverride": false
  },
  {
    "name": "Ручка lверная Armadillo R.URS52.TWIN (TWIN URS) BL-26, цвет черный, Черный (квадрат 100 мм)",
    "price": 3740,
    "sourceBase": 3740,
    "parentId": 28276,
    "offerId": 28278,
    "priceOverride": false
  },
  {
    "name": "Ручка Morelli Fukoku MH-28 SC/CP-S хром  (квадрат 105 мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 25072,
    "offerId": 25074,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная Abriss R21.150 MCP, матовый хром (квадрат 110 мм)",
    "price": 1500,
    "sourceBase": 1500,
    "parentId": 25312,
    "offerId": 25314,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная Ajax K.JS51.OPTIMAL SSC-16, цвет сатинированный хром",
    "price": 850,
    "sourceBase": 850,
    "parentId": 37464,
    "offerId": 37466,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная FUARO K.DM51 \"FLOW\" (FLOW DM) SSC-16, цвет сатинированный хром (квадрат 105 мм)",
    "price": 3000,
    "sourceBase": 3000,
    "parentId": 28746,
    "offerId": 28748,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная Fuaro K.RL52.REDLINE (RED LINE RL) BL-24, цвет черный",
    "price": 1500,
    "sourceBase": 1500,
    "parentId": 37460,
    "offerId": 37462,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная FUARO K.SL52.FLY (FLY SL) SSC-16, цвет сатинированный хром",
    "price": 1500,
    "sourceBase": 1500,
    "parentId": 40704,
    "offerId": 40706,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная Fuaro K.SL52.PHANTOM (PHANTOM SL) BL-24, цвет черный (квадрат 105 мм)",
    "price": 1800,
    "sourceBase": 1800,
    "parentId": 37480,
    "offerId": 37482,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная Fuaro Phantom SL SSC-16, сатиновый хром (квадрат 105 мм)",
    "price": 1800,
    "sourceBase": 1800,
    "parentId": 25364,
    "offerId": 25366,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная \"Eon\", MH-46 SC/W-S55, цвет - мат.хром/белый (квадрат 105 мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 25552,
    "offerId": 25554,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная \"Jura\" на квадратной накладке, MH-43 SC/CP-S, цвет - мат.хром/хром (Квадрат 105мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 25548,
    "offerId": 25550,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная Morelli \"Mercury\", на квадратной розетке 6 мм, MH-53-S6 BL, цвет - черный (квадрат 105 мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 27528,
    "offerId": 27530,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная Morelli \"Mercury\", на квадратной розетке 6 мм, MH-53-S6 SC NEW, цвет - мат.хром (квадрат 105 мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 25588,
    "offerId": 25590,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная \"Pierres\", на квадратной розетке 6 мм, MH-49-S6 SC, цвет - мат.хром (квадрат 105 мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 25568,
    "offerId": 25570,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная Morelli \"Plateau\", на квадратной розетке 6 мм, MH-51-S6 W, цвет - белый (квадрат 105 мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 25576,
    "offerId": 25578,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная \"Shape\", MH-38 SN/BN-S, на квадратной накладке, цвет - бел.никель/черн.никель (квадрат 105 мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 25540,
    "offerId": 25542,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная \"Sulla\", на квадратной розетке 6 мм, MH-48-S6 SC/BL NEW, цвет - мат.хром/черный (квадрат 105 мм)",
    "price": 2219,
    "sourceBase": 2219,
    "parentId": 25560,
    "offerId": 25562,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная \"Sulla\", на квадратной розетке 6 мм, MH-48-S6 SC/W NEW, цвет - мат.хром/белый",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 25564,
    "offerId": 25566,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная MORELLI \"Ystad\", на квадратной розетке 6 мм, MH-47-S6 BL, цвет - черный (квадрат 105 мм)",
    "price": 2377,
    "sourceBase": 2377,
    "parentId": 25556,
    "offerId": 25558,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная MORELLI \"Ystad\", на квадратной розетке 6 мм, MH-47-S6 SSC, цвет - суперматовый хром (квадрат 105 мм)",
    "price": 1285,
    "sourceBase": 1285,
    "parentId": 39696,
    "offerId": 39698,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная \"Песто\",  INAL 521-03 SC/CP хром матовый/хром блестящий, INAL 521-03 SC/CP (квадрат 105 мм)",
    "price": 1200,
    "sourceBase": 1200,
    "parentId": 24988,
    "offerId": 24990,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная PUERTO \"Пиньолата\" INAL 536-03 MSW, матовый супер белый (квадрат 105 мм)",
    "price": 1200,
    "sourceBase": 1200,
    "parentId": 29336,
    "offerId": 29338,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная PUNTO R.ARC.R52.FORTUNA SSC-16, цвет сатин.хром",
    "price": 953,
    "sourceBase": 953,
    "parentId": 40678,
    "offerId": 40680,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная Rucetti RAP 11-S SN/CP, цвет - бел. никель/хром (квадрат 105 мм)",
    "price": 1170,
    "sourceBase": 1170,
    "parentId": 25600,
    "offerId": 25602,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная RAP 1 SG, цвет - мат.золото (квадрат 105 мм)",
    "price": 1025,
    "sourceBase": 1025,
    "parentId": 25596,
    "offerId": 25598,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная RAP 14-S AB, цвет - бронза (квадрат 105 мм)",
    "price": 1170,
    "sourceBase": 1170,
    "parentId": 25604,
    "offerId": 25606,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная RAP 15-S SN/CP -IND, цвет - бел. никель/хром (квадрат 105 мм)",
    "price": 1170,
    "sourceBase": 1170,
    "parentId": 25612,
    "offerId": 25614,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная RAP 17-S SN/CP -IND, цвет - бел. никель/хром (квадрат 105мм)",
    "price": 1170,
    "sourceBase": 1170,
    "parentId": 25616,
    "offerId": 25618,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная RAP 18 SN/CP, цвет - белый никель (квадрат 105 мм)",
    "price": 1150,
    "sourceBase": 1150,
    "parentId": 25620,
    "offerId": 25622,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная RAP 2 SG/GP, цвет - мат.золото/золото (квадрат 105 мм)",
    "price": 1025,
    "sourceBase": 1025,
    "parentId": 25624,
    "offerId": 25626,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная RAP 21-S SC/CP, цвет - мат.хром/хром (квадрат 105 мм)",
    "price": 1220,
    "sourceBase": 1220,
    "parentId": 25632,
    "offerId": 25634,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная RAP 22-S SC/CP, цвет - мат.хром/хром (квадрат 105 мм)",
    "price": 1220,
    "sourceBase": 1220,
    "parentId": 25636,
    "offerId": 25638,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная Rucetti RAP 23-S BL, цвет - чёрный (квадрат 105 мм)",
    "price": 1220,
    "sourceBase": 1220,
    "parentId": 25640,
    "offerId": 25642,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная RAP 23-S SC/CP, цвет - мат.хром/хром (квадрат 105 мм)",
    "price": 1220,
    "sourceBase": 1220,
    "parentId": 25644,
    "offerId": 25646,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная Rucetti RAP 25-S SC/CP, цвет - мат.хром/хром (квадрат 105 мм)",
    "price": 1220,
    "sourceBase": 1220,
    "parentId": 25648,
    "offerId": 25650,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная Rucceti RAP-CLASSIC-L 5 OMB цвет - старая матовая бронза (квадрат 105 мм)",
    "price": 1200,
    "sourceBase": 1200,
    "parentId": 25660,
    "offerId": 25662,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная Rucetti RAP-CLASSIC-L 8 OMB, цвет - старая матовая бронза (квадрат 105 мм)",
    "price": 1350,
    "sourceBase": 1350,
    "parentId": 25664,
    "offerId": 25666,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная Vantage V51D AL матовый никель (квадрат 110 мм)",
    "price": 1200,
    "sourceBase": 1200,
    "parentId": 25356,
    "offerId": 25358,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная Vantage V51L-2 AL матовый хром/чёрный (квадрат 110 мм)",
    "price": 1200,
    "sourceBase": 1200,
    "parentId": 25360,
    "offerId": 25362,
    "priceOverride": false
  },
  {
    "name": "Ручка дверная РЕНЦ \"Милан\" INDH 51-03 SW, цвет - супер белый (квадрат 105 мм)",
    "price": 2860,
    "sourceBase": 2860,
    "parentId": 27852,
    "offerId": 27854,
    "priceOverride": false
  },
  {
    "name": "Ручка для раздвижной двери РЕНЦ INSDH 604 W, цвет белый",
    "price": 510,
    "sourceBase": 510,
    "parentId": 28016,
    "offerId": 28018,
    "priceOverride": false
  },
  {
    "name": "Ручка для раздвижных дверей ARMADILLO SH.URB153.010 (SH010 URB) BL-26, цвет - черный",
    "price": 1990,
    "sourceBase": 1990,
    "parentId": 25302,
    "offerId": 25304,
    "priceOverride": false
  },
  {
    "name": "Ручка для раздвижных дверей sh010 urb sn-3, матовый никель",
    "price": 1990,
    "sourceBase": 1990,
    "parentId": 24008,
    "offerId": 24010,
    "priceOverride": false
  },
  {
    "name": "Ручка для раздвижных дверей MORELLI MHS128 SC, цвет мат.хром",
    "price": 1428,
    "sourceBase": 1428,
    "parentId": 37960,
    "offerId": 37962,
    "priceOverride": false
  },
  {
    "name": "Ручка для раздвижных дверей MORELLI MHS150 BL, цвет черный",
    "price": 632,
    "sourceBase": 632,
    "parentId": 28988,
    "offerId": 28990,
    "priceOverride": false
  },
  {
    "name": "Ручка для раздвижных дверей MORELLI MHS150 BN, цвет черный никель",
    "price": 632,
    "sourceBase": 632,
    "parentId": 40378,
    "offerId": 40380,
    "priceOverride": false
  },
  {
    "name": "Ручка для раздвижных дверей MORELLI MHS150 SC, цвет матовый хром",
    "price": 632,
    "sourceBase": 632,
    "parentId": 29538,
    "offerId": 29540,
    "priceOverride": false
  },
  {
    "name": "Ручка для раздвижных дверей MORELLI MHS150 W, цвет белый",
    "price": 632,
    "sourceBase": 632,
    "parentId": 25138,
    "offerId": 25140,
    "priceOverride": false
  },
  {
    "name": "Ручка-скоба Sicma Art 450, матовая латунь",
    "price": 31500,
    "sourceBase": 31500,
    "parentId": 24154,
    "offerId": 24156,
    "priceOverride": false
  },
  {
    "name": "Ручку Morelli Luxury HORIZONT-SM NERO Цвет - Черный (квадрат 105 мм)",
    "price": 6446,
    "sourceBase": 6446,
    "parentId": 25512,
    "offerId": 25514,
    "priceOverride": false
  },
  {
    "name": "Скрытая дверная ручка AGB ZERO, цвет бесцветный (под покраску)",
    "price": 22800,
    "sourceBase": 22800,
    "parentId": 40344,
    "offerId": 40346,
    "priceOverride": false
  },
  {
    "name": "Скрытая дверная ручка с закрытием AGB ZERO CLOSE, цвет бесцветный (под покраску)",
    "price": 25250,
    "sourceBase": 25250,
    "parentId": 40340,
    "offerId": 40342,
    "priceOverride": false
  },
  {
    "name": "Скрытая дверная ручка с закрытием AGB ZERO CLOSE, цвет черный",
    "price": 25250,
    "sourceBase": 25250,
    "parentId": 42288,
    "offerId": 42290,
    "priceOverride": false
  },
  {
    "name": "Скрытая ручка B-Double ANOHAN S 200 (полотно 38-43мм) есть особенности врезки/монтажа, утонить заранее",
    "price": 23600,
    "sourceBase": 23600,
    "parentId": 24000,
    "offerId": 24002,
    "priceOverride": false
  },
  {
    "name": "Скрытая ручка Bonaiti Art 938 Механизм мат.хром (B-No ha mini) + регулируемая ответка 992",
    "price": 24073,
    "sourceBase": 24073,
    "parentId": 24910,
    "offerId": 24912,
    "priceOverride": false
  },
  {
    "name": "Скрытая ручка Bonaiti Art 938 Механизм (замок, ручка, накладка мдф, ответка),  черный (B-No ha mini) + регулируемая ответка 992",
    "price": 24073,
    "sourceBase": 24073,
    "parentId": 37866,
    "offerId": 37868,
    "priceOverride": false
  }
]);

const HANDLE_PRICE_AUDIT=Object.freeze({
  "imported": 286,
  "missing": 0,
  "zero": 0,
  "sourceSuspiciousLow": 5,
  "unresolvedSuspiciousLow": 0,
  "minSourceBase": 1,
  "maxBase": 31500,
  "suspiciousThreshold": 100,
  "resolvedByManualPrice": 5
});

const HANDLE_PRICE_REVIEW=Object.freeze([
  {
    "family": "PUERTO Пастьера INAL 535-03",
    "positions": 5,
    "sourceBase": 1,
    "purchasePrice": 725,
    "workingPrice": 1340,
    "status": "resolved",
    "note": "Все пять цветовых исполнений согласованы по одной цене: закуп 725 ₽/шт., рабочая РРЦ 1 340 ₽/шт.; исходный BASE 1 ₽ сохранен для аудита."
  }
]);
