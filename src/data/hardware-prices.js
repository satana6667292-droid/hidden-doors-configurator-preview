// Hardware price source imported from the current Hidden Doors Bitrix24 hardware review.
// Business meaning from v106: every current working hardware price is Retail.
// Only explicitly approved partner rows derive Opt 2; sourceBase is retained for audit.
// Manual agreed overrides remain explicitly marked.
const BITRIX_HINGE_BASE_PRICES=Object.freeze([
  {name:"AGB (АГБ) Петля ввертная 3-D серия (бихром)",price:575,sourceBase:575,parentId:36780,offerId:36782,priceOverride:false},
  {name:"Дверная петля двусторонняя ALDEGHI CODE 87 AO 155-50, матовая латунь",price:2500,sourceBase:2500,parentId:25082,offerId:25084,priceOverride:false},
  {name:"Колпачки для петель К8060 глянец золото",price:990,sourceBase:0,parentId:28674,offerId:28676,priceOverride:true,priceOverrideReason:"Согласовано 19.09.2026: временно 990 ₽/шт.; исходный BASE Bitrix24 = 0"},
  {name:"Колпачки для петель К8060 мат хром",price:660,sourceBase:660,parentId:28678,offerId:28680,priceOverride:false},
  {name:"Колпачки для петель К8060 черный",price:990,sourceBase:990,parentId:29582,offerId:29584,priceOverride:false},
  {name:"Петля Fuaro (Фуаро) универсальная IN4200U SB (2BB 100x75x2,5) мат. золото",price:295,sourceBase:295,parentId:36758,offerId:36760,priceOverride:false},
  {name:"Петля Fuaro универсальная IN4200U SN (2BB 100x75x2,5), цвет мат. никель",price:295,sourceBase:295,parentId:36478,offerId:36480,priceOverride:false},
  {name:"Петля Fuaro универсальная IN4400U SSC (4BB 100x75x2,5), цвет сатинированный хром",price:350,sourceBase:350,parentId:42520,offerId:42522,priceOverride:false},
  {name:"Петля Fuaro универсальная IN4400U SSG (4BB 100x75x2,5), цвет сатинированное золото",price:350,sourceBase:350,parentId:42526,offerId:42528,priceOverride:false},
  {name:"Петля Fuaro универсальная IN4400U WH (4BB 100x75x2,5), цвет белый",price:350,sourceBase:350,parentId:39806,offerId:39808,priceOverride:false},
  {name:"Петля Fuaro универсальная без врезки IN4500W-BL SB (500-2BB/BL 100x2,5), цвет мат. золото",price:320,sourceBase:320,parentId:40284,offerId:40286,priceOverride:false},
  {name:"Петля Punto универсальная IN4100U AB (4B 100х70х2.5), цвет бронза",price:205,sourceBase:205,parentId:37124,offerId:37126,priceOverride:false},
  {name:"Петля Punto универсальная IN4100U AC (4B 100х70х2.5), цвет медь",price:205,sourceBase:205,parentId:37120,offerId:37122,priceOverride:false},
  {name:"Петля Punto универсальная IN4100U BL (4B 100х70х2.5), цвет черный",price:205,sourceBase:205,parentId:37026,offerId:37028,priceOverride:false},
  {name:"Петля Punto универсальная IN4100U CP (4B 100х70х2.5), цвет хром",price:205,sourceBase:205,parentId:37068,offerId:37070,priceOverride:false},
  {name:"Петля Punto универсальная IN4100U PB (4B 100х70х2.5), цвет латунь",price:205,sourceBase:205,parentId:37132,offerId:37134,priceOverride:false},
  {name:"Петля Punto универсальная IN4100U PN (4B 100х70х2.5), цвет мат. никель",price:205,sourceBase:205,parentId:37128,offerId:37130,priceOverride:false},
  {name:"Петля Punto универсальная IN4100U SB (4B 100х70х2.5), цвет мат. золото",price:205,sourceBase:205,parentId:37116,offerId:37118,priceOverride:false},
  {name:"Петля Punto универсальная IN4100U SSG (4B 100х70х2.5), цвет сатин.золото",price:235,sourceBase:235,parentId:42612,offerId:42614,priceOverride:false},
  {name:"Петля барная реверсная Armadillo Urban Collection Aldeghi ALH.125.5 BL - чёрный",price:2550,sourceBase:2550,parentId:24208,offerId:24210,priceOverride:false},
  {name:"Петля барная реверсная Armadillo Urban Collection Aldeghi ALH.125.5 SC, цвет мат хром",price:2550,sourceBase:2550,parentId:28606,offerId:28608,priceOverride:false},
  {name:"петля врезная apecs 115*23-3D-Z-BLM (R11,5) (B2B)",price:1500,sourceBase:1500,parentId:25048,offerId:25050,priceOverride:false},
  {name:"Петля скрытая AGB Eclipse 2.0, с накладками (40 кг), белый",price:3100,sourceBase:3100,parentId:38836,offerId:38838,priceOverride:false},
  {name:"Петля скрытая AGB Eclipse 2.0, с накладками (40 кг), бронза",price:3000,sourceBase:3000,parentId:38862,offerId:38864,priceOverride:false},
  {name:"Петля скрытая AGB Eclipse 2.0, с накладками (40 кг), латунь",price:3000,sourceBase:3000,parentId:38848,offerId:38850,priceOverride:false},
  {name:"Петля скрытая AGB Eclipse 2.0, с накладками (40 кг), мат. латунь",price:3000,sourceBase:3000,parentId:38852,offerId:38854,priceOverride:false},
  {name:"Петля скрытая AGB Eclipse 2.0, с накладками (40 кг), матовый хром",price:3000,sourceBase:3000,parentId:38844,offerId:38846,priceOverride:false},
  {name:"Петля скрытая AGB Eclipse 2.0, с накладками (40 кг), хром",price:3000,sourceBase:3000,parentId:38840,offerId:38842,priceOverride:false},
  {name:"Петля скрытая AGB Eclipse 2.0, с накладками (40 кг), черные",price:3350,sourceBase:3350,parentId:620,offerId:21384,priceOverride:false},
  {name:"Петля скрытая AGB Eclipse 3.0, с накладками (40 кг), мат хром",price:2400,sourceBase:2400,parentId:28682,offerId:28684,priceOverride:false},
  {name:"Петля скрытая AGB Eclipse 3.0, с накладками (40 кг), черные",price:2650,sourceBase:2650,parentId:622,offerId:21414,priceOverride:false},
  {name:"Петля скрытая Armadillo U3D3000.VPG AB, цвет бронза",price:2050,sourceBase:2050,parentId:38090,offerId:38092,priceOverride:false},
  {name:"Петля скрытая Armadillo U3D3000.VPG BL, цвет черный",price:1850,sourceBase:1850,parentId:38078,offerId:38080,priceOverride:false},
  {name:"Петля скрытая Armadillo U3D3000.VPG FSG, цвет флор. золото",price:2050,sourceBase:2050,parentId:38094,offerId:38096,priceOverride:false},
  {name:"Петля скрытая Armadillo U3D3000.VPG SC, цвет мат. хром",price:1850,sourceBase:1850,parentId:38086,offerId:38088,priceOverride:false},
  {name:"Петля скрытая Armadillo U3D3000.VPG WH, цвет белый",price:2050,sourceBase:2050,parentId:38082,offerId:38084,priceOverride:false},
  {name:"Петля скрытая KUBICA K1019 Atomika Slim OS, с накладками (40 кг)",price:2500,sourceBase:2500,parentId:626,offerId:21386,priceOverride:false},
  {name:"Петля скрытая KUBICA K1019 Atomika Slim мат. хром, с накладками (40 кг)",price:2500,sourceBase:2500,parentId:24918,offerId:24920,priceOverride:false},
  {name:"Петля скрытая KUBICA K2760 Atomika CS, с накладками (60 кг) цвет - хром мат",price:3500,sourceBase:3500,parentId:628,offerId:21394,priceOverride:false},
  {name:"Петля скрытая KUBICA K2760 Atomika NO , с накладками (60 кг), цвет - черный",price:3500,sourceBase:3500,parentId:24020,offerId:24022,priceOverride:false},
  {name:"Петля скрытая KUBICA K2760 Atomika OS , с накладками (60 кг), цвет - матовое золото",price:3700,sourceBase:3700,parentId:29176,offerId:29178,priceOverride:false},
  {name:"Петля скрытая KUBICA K2760 OS CM, с накладками (60 кг), цвет - матовое золото",price:3700,sourceBase:3700,parentId:39248,offerId:39250,priceOverride:false},
  {name:"Петля скрытая KUBICA K2760 BI, с накладками (60 кг), цвет - белый",price:3500,sourceBase:3500,parentId:27958,offerId:27960,priceOverride:false},
  {name:"Петля скрытая KUBICA K6360/38 BI, с накладками (60 кг), цвет белый",price:3450,sourceBase:3450,parentId:18778,offerId:21402,priceOverride:false},
  {name:"Петля скрытая KUBICA K6360/38 CS, с накладками (60 кг), цвет - хром мат",price:3260,sourceBase:3260,parentId:16142,offerId:21406,priceOverride:false},
  {name:"Петля скрытая KUBICA K6360/38 NR, с накладками (60 кг), цвет - черный",price:3450,sourceBase:3450,parentId:19090,offerId:21396,priceOverride:false},
  {name:"Петля скрытая KUBICA K8060 Atomika Slim BL, с накладками (60 кг), цвет белый",price:2560,sourceBase:2560,parentId:24072,offerId:null,priceOverride:false},
  {name:"Петля скрытая KUBICA K8060 Atomika Slim CS HD, с накладками (60 кг), цвет - матовый хром",price:2280,sourceBase:2280,parentId:25714,offerId:25716,priceOverride:false},
  {name:"Петля скрытая KUBICA K8060 Atomika Slim NO HD, с накладками (60 кг), цвет - черный",price:2560,sourceBase:2560,parentId:25710,offerId:25712,priceOverride:false},
  {name:"Петля скрытая KUBICA K8060 Atomika Slim NS HD, с накладками (60 кг), цвет - матовый никель",price:2560,sourceBase:2560,parentId:38348,offerId:38350,priceOverride:false},
  {name:"Петля скрытая KUBICA К8060 Atomika Slim OL HD глянец золото, с накладками (60 кг)",price:2560,sourceBase:0,parentId:24200,offerId:24202,priceOverride:true},
  {name:"Петля скрытая KUBICA К8060 Atomika Slim OS HD цвет матово золото, с накладками (60 кг)",price:2560,sourceBase:2560,parentId:37552,offerId:37554,priceOverride:false},
  {name:"Петля скрытая MORELLI CH-01 B с накладками (60 кг.), цвет черный",price:2900,sourceBase:2900,parentId:42350,offerId:42352,priceOverride:false},
  {name:"Петля скрытая MORELLI CH-01 FTG с накладками (60 кг.), цвет итал. мат. золото",price:3000,sourceBase:3000,parentId:42362,offerId:42364,priceOverride:false},
  {name:"Петля скрытая MORELLI CH-01 MSG с накладками (60 кг.), цвет мат. сатин. золото",price:3000,sourceBase:3000,parentId:42358,offerId:42360,priceOverride:false},
  {name:"Петля скрытая MORELLI CH-01 SC с накладками (60 кг.), цвет мат. хром",price:2900,sourceBase:2900,parentId:42354,offerId:42356,priceOverride:false},
  {name:"Петля скрытая MORELLI CH-02 B с накладками (60 кг.), цвет черный",price:2900,sourceBase:2900,parentId:42366,offerId:42368,priceOverride:false},
  {name:"Петля скрытая MORELLI CH-02 FTG с накладками (60 кг.), цвет итал. мат. золото",price:3000,sourceBase:3000,parentId:42378,offerId:42380,priceOverride:false},
  {name:"Петля скрытая MORELLI CH-02 MSG с накладками (60 кг.), цвет мат. сатин. золото",price:3000,sourceBase:3000,parentId:42374,offerId:42376,priceOverride:false},
  {name:"Петля скрытая MORELLI CH-02 SC с накладками (60 кг.), цвет мат. хром",price:2900,sourceBase:2900,parentId:42370,offerId:42372,priceOverride:false},
  {name:"Петля скрытая К6360/38 AV, с накладками (60 кг), цвет - сатин. золото",price:4100,sourceBase:4100,parentId:39646,offerId:39648,priceOverride:false},
  {name:"Петля скрытая К6360/38 OS, с накладками (60 кг), цвет - матовое золото",price:4100,sourceBase:4100,parentId:24116,offerId:24118,priceOverride:false},
  {name:"Петля скрытая к6360/38 золото глянец",price:4100,sourceBase:4100,parentId:25052,offerId:25054,priceOverride:false},
  {name:"Петля универсальная Apecs 100*70-B4-Steel CRM, хром матовый",price:450,sourceBase:450,parentId:34642,offerId:34644,priceOverride:false}
]);

const BITRIX_LOCK_BASE_PRICES=Object.freeze([
  {name:"Гардиан магнитный замок Soft 1 M MCR, матовый алюминий",price:1150,sourceBase:1150,parentId:788,offerId:21410,priceOverride:false},
  {name:"Задвижка врезная MORELLI B6-45 SC, цвет матовый хром",price:340,sourceBase:340,parentId:39850,offerId:39852,priceOverride:false},
  {name:"Замок антипаника SVP 6000",price:48000,sourceBase:48000,parentId:25812,offerId:25814,priceOverride:false},
  {name:"Замок врезной Крит MINILOCK ЗВ-П24 без ЦМ , б/о,арт.05690, цвет хром",price:960,sourceBase:960,parentId:30210,offerId:30212,priceOverride:false},
  {name:"Замок магнитный AGB MEDIANA POLARIS (B06103.50.93.640) под цилиндр, цвет черный",price:3050,sourceBase:3050,parentId:42646,offerId:42648,priceOverride:false},
  {name:"Замок магнитный AGB Touch (AGB B01120.30.78) с отв. и декор. планкой, цвет серый",price:9400,sourceBase:9400,parentId:39274,offerId:39276,priceOverride:false},
  {name:"Замок магнитный AGB Touch (AGB B01120.31.93) с отв. и декор. планкой, цвет черный",price:9500,sourceBase:9500,parentId:42292,offerId:42294,priceOverride:false},
  {name:"Замок магнитный Morelli M1885 BL под ключевой цилиндр, черный",price:1295,sourceBase:1295,parentId:24078,offerId:24080,priceOverride:false},
  {name:"Замок магнитный Morelli M1885 W под ключевой цилиндр, белый",price:1295,sourceBase:1295,parentId:24074,offerId:24076,priceOverride:false},
  {name:"Замок магнитный Morelli M1885SC под ключевой цилиндр, матовый хром",price:1295,sourceBase:1295,parentId:24082,offerId:24084,priceOverride:false},
  {name:"Замок магнитный MORELLI M1895BL, черный",price:1295,sourceBase:1295,parentId:18828,offerId:21364,priceOverride:false},
  {name:"Замок магнитный MORELLI M1895PG, золото",price:1295,sourceBase:1295,parentId:24120,offerId:24122,priceOverride:false},
  {name:"Замок магнитный MORELLI M1895SC, мат хром",price:1295,sourceBase:1295,parentId:16134,offerId:16136,priceOverride:false},
  {name:"Замок магнитный MORELLI M1895W, белый",price:1295,sourceBase:1295,parentId:18784,offerId:21370,priceOverride:false},
  {name:"Замок магнитный MORELLI под ключевой цилиндр M1885 MSG, цвет мат. сатинированное золото",price:1357,sourceBase:1357,parentId:37038,offerId:37040,priceOverride:false},
  {name:"Замок магнитный MORELLI под ключевой цилиндр M1885 PG, цвет золото",price:1295,sourceBase:1295,parentId:37042,offerId:37044,priceOverride:false},
  {name:"Замок магнитный Vantage MC 85 SС - хром",price:910,sourceBase:910,parentId:25292,offerId:25294,priceOverride:false},
  {name:"Замок магнитный Vantage MC96BL Черный",price:910,sourceBase:910,parentId:25284,offerId:25286,priceOverride:false},
  {name:"Замок магнитный Vantage MC96CP Хром",price:910,sourceBase:910,parentId:24196,offerId:24198,priceOverride:false},
  {name:"Замок магнитный Vantage MC96GR Графит",price:910,sourceBase:910,parentId:38644,offerId:38646,priceOverride:false},
  {name:"Замок магнитный Vantage MC96SC Матовый хром",price:910,sourceBase:910,parentId:26922,offerId:26924,priceOverride:false},
  {name:"Замок магнитный Vantage MC96SG, сатин. золото",price:950,sourceBase:950,parentId:39108,offerId:39110,priceOverride:false},
  {name:"Замок магнитный Vantage MC96SN Матовый никель",price:910,sourceBase:910,parentId:28668,offerId:28670,priceOverride:false},
  {name:"Замок магнитный Vantage МС96 SB, цвет матовое золото",price:910,sourceBase:910,parentId:27376,offerId:27378,priceOverride:false},
  {name:"Замок гардиан \"SOFT 1M\" BL-чёрный",price:1150,sourceBase:1150,parentId:24184,offerId:24186,priceOverride:false},
  {name:"Замок гардиан \"SOFT 1M\" G-глянцевое золото",price:1400,sourceBase:1400,parentId:24188,offerId:24190,priceOverride:false},
  {name:"Замок магнитный под цилиндр Vantage MC85 SB, цвет матовое золото",price:910,sourceBase:910,parentId:30436,offerId:30438,priceOverride:false},
  {name:"Замок магнитный под цилиндр Vantage MC85 SG, цвет сатин. золото",price:910,sourceBase:910,parentId:39654,offerId:39656,priceOverride:false},
  {name:"Замок магнитный под цилиндр Vantage MC85BL черный",price:910,sourceBase:910,parentId:25288,offerId:25290,priceOverride:false},
  {name:"Замок магнитный под цилиндр Vantage MC 85 SC -мат хром",price:910,sourceBase:910,parentId:26926,offerId:26928,priceOverride:false},
  {name:"Замок межкомнатный MORELLI IP WC B бесшумный, цвет черный",price:1720,sourceBase:1720,parentId:38412,offerId:38414,priceOverride:false},
  {name:"Замок электромагнитный  СКУД«Орион Болид»",price:15500,sourceBase:15500,parentId:24158,offerId:24160,priceOverride:false},
  {name:"Замок электромеханический ALeko ALM-561EM",price:47200,sourceBase:47200,parentId:34448,offerId:34450,priceOverride:false},
  {name:"Защелка межкомнатная MORELLI LP6-45 BL, цвет черный",price:340,sourceBase:340,parentId:42300,offerId:42302,priceOverride:false},
  {name:"Корпус Ajax врезного замка c защёлкой PLASTLP85-50 SN, цвет матовый никель",price:263,sourceBase:263,parentId:40288,offerId:40290,priceOverride:false},
  {name:"Магнитный замок KRONA KOBLENZ KM 003 CM A для м/к дверей с доводсиком под сант. завертку полный комплект, под пустотелый алюм. профиль (замок база, ответная планка база, дек. отв. планка, дек. штульп), цвет черный",price:2560,sourceBase:2560,parentId:34638,offerId:34640,priceOverride:false},
  {name:"Ответная планка MORELLI MSP-1 BL магнитная, цвет черный",price:185,sourceBase:185,parentId:42458,offerId:42460,priceOverride:false}
]);


// v58 — Stage 2: category "Завертки" is live in catalog/door/order pricing; v57 audit data is preserved below.
const BITRIX_TURN_BASE_PRICES=Object.freeze([
  {
    "name": "Вертушка FUARO на шток цилиндра T.Knob-D-PRO (CB-D-PRO) BL-24, цвет черный",
    "price": 250,
    "sourceBase": 250,
    "parentId": 29934,
    "offerId": 29936,
    "priceOverride": false
  },
  {
    "name": "Вертушка под шток, цвет вороненный никель",
    "price": 270,
    "sourceBase": 270,
    "parentId": 30102,
    "offerId": 30104,
    "priceOverride": false
  },
  {
    "name": "Вставка Armadillo под шток ET.TANG.UNI (CYLINDER) BL-26, цвет черный",
    "price": 255,
    "sourceBase": 255,
    "parentId": 29938,
    "offerId": 29940,
    "priceOverride": false
  },
  {
    "name": "Вставка под шток, цвет матовый никель",
    "price": 120,
    "sourceBase": 120,
    "parentId": 30106,
    "offerId": 30108,
    "priceOverride": false
  },
  {
    "name": "Декоративная накладка под цилиндр  VETTORE ET 2101 MCP, матовый хром",
    "price": 690,
    "sourceBase": 690,
    "parentId": 25340,
    "offerId": 25342,
    "priceOverride": false
  },
  {
    "name": "Завертка ABRISS BK 2105 CP, хром (квадрат 80 мм)",
    "price": 950,
    "sourceBase": 950,
    "parentId": 37388,
    "offerId": 37390,
    "priceOverride": false
  },
  {
    "name": "Завертка ABRISS BK 2105 MCP, матовый хром (квадрат 80 мм)",
    "price": 855,
    "sourceBase": 855,
    "parentId": 29466,
    "offerId": 29468,
    "priceOverride": false
  },
  {
    "name": "Завертка ABRISS BK 2505 MBP цвет черный матовый  (квадра 80 мм)",
    "price": 855,
    "sourceBase": 855,
    "parentId": 28004,
    "offerId": 28006,
    "priceOverride": false
  },
  {
    "name": "Завертка ABRISS BK 5005 CP, хром (квадрат 80 мм)",
    "price": 950,
    "sourceBase": 950,
    "parentId": 37392,
    "offerId": 37394,
    "priceOverride": false
  },
  {
    "name": "Завертка ABRISS BK 5005 MBP, черный матовый (квадрат 80 мм)",
    "price": 950,
    "sourceBase": 950,
    "parentId": 25194,
    "offerId": 25196,
    "priceOverride": false
  },
  {
    "name": "Завертка Ajax BK6.K.JS51 (BK6 JS) SSC-16, цвет сатинированный хром",
    "price": 500,
    "sourceBase": 500,
    "parentId": 37468,
    "offerId": 37470,
    "priceOverride": false
  },
  {
    "name": "Завертка AJAX BK6.K.JS51 (BK6 JS) SSG-39 Сатинированное золото (квадрат 80 мм)",
    "price": 500,
    "sourceBase": 500,
    "parentId": 28664,
    "offerId": 28666,
    "priceOverride": false
  },
  {
    "name": "Завертка APRILE Q 5S WC US PVD , цвет антрацит полированный (квадрат ***)",
    "price": 3970,
    "sourceBase": 3970,
    "parentId": 26944,
    "offerId": 26946,
    "priceOverride": false
  },
  {
    "name": "Завертка Armadillo BK6.K.ART30 FSG-39, цвет флорентийское золото (припаянный к заглушке квадрат 68 мм)",
    "price": 2150,
    "sourceBase": 2150,
    "parentId": 29290,
    "offerId": 29292,
    "priceOverride": false
  },
  {
    "name": "Завертка Armadillo BK6.K.UCS36 (BK6 UCS) BL-26, цвет черный (квадрат 80 мм)",
    "price": 1800,
    "sourceBase": 1800,
    "parentId": 29430,
    "offerId": 29432,
    "priceOverride": false
  },
  {
    "name": "Завертка Armadillo BK6.K.UCS36 (BK6 UCS) MWSC-33 итальянский тисненый (квадрат 80 мм)",
    "price": 1800,
    "sourceBase": 1800,
    "parentId": 18148,
    "offerId": 18150,
    "priceOverride": false
  },
  {
    "name": "Завертка ARMADILLO BK6.K.USS52  BL -26 (WC-BOLT BK6 USS), цвет - черный  (квадрат 80 мм)",
    "price": 1530,
    "sourceBase": 1530,
    "parentId": 24086,
    "offerId": 24088,
    "priceOverride": false
  },
  {
    "name": "Завертка Armadillo BK6.K.USS52 (WC-BOLT BK6 USS) AB-7 бронза (квадрат 80)",
    "price": 1300,
    "sourceBase": 1300,
    "parentId": 40436,
    "offerId": 40438,
    "priceOverride": false
  },
  {
    "name": "Завертка ARMADILLO BK6.K.USS52 SN-3 (WC-BOLT BK6 USS), цвет - матовый никель (квадрат 80 мм)",
    "price": 1300,
    "sourceBase": 1300,
    "parentId": 40112,
    "offerId": 40114,
    "priceOverride": false
  },
  {
    "name": "Завертка Armadillo BK6.K.YM FSG-39, цвет флор. золото",
    "price": 1770,
    "sourceBase": 1770,
    "parentId": 40358,
    "offerId": 40360,
    "priceOverride": false
  },
  {
    "name": "Завертка Armadillo BK6.R.ART30 BL-26, цвет черный (припаянный к заглушке квадрат 68 мм)",
    "price": 2030,
    "sourceBase": 2030,
    "parentId": 29530,
    "offerId": 29532,
    "priceOverride": false
  },
  {
    "name": "Завертка Armadillo BK6.R.LD54 (BK6) SG/GP-4, цвет матовое золото/золото (квадрат 80 мм)",
    "price": 1380,
    "sourceBase": 1380,
    "parentId": 29204,
    "offerId": 29206,
    "priceOverride": false
  },
  {
    "name": "Завертка Armadillo BK6.R.URB52 (WC-BOLT BK6/URB) BL-26, цвет черный (квадрат 80 мм)",
    "price": 1680,
    "sourceBase": 1680,
    "parentId": 29504,
    "offerId": 29506,
    "priceOverride": false
  },
  {
    "name": "Завертка Armadillo BK6.R.URB52 (WC-BOLT BK6/URB) BPVD-77 вороненый никель (квадрат 80 мм)",
    "price": 1600,
    "sourceBase": 1600,
    "parentId": 25064,
    "offerId": 25066,
    "priceOverride": false
  },
  {
    "name": "Завертка ARMADILLO BK6.R.URS 52 BL-26 (WC-BOLT BK6 URS), цвет - черный (квадрат 80 мм)",
    "price": 1530,
    "sourceBase": 1530,
    "parentId": 24232,
    "offerId": 24234,
    "priceOverride": false
  },
  {
    "name": "Завертка Armadillo BK6.R.URS52 (WC-BOLT BK6 URS) BPVD-77 вороненый никель (квадрат 80 мм)",
    "price": 1530,
    "sourceBase": 1530,
    "parentId": 39876,
    "offerId": 39878,
    "priceOverride": false
  },
  {
    "name": "Завертка Armadillo BK6.R.URS52 (WC-BOLT BK6 URS) MWSC-33 итальянский тисненый (квадрат 80 мм)",
    "price": 1530,
    "sourceBase": 1530,
    "parentId": 28284,
    "offerId": 28286,
    "priceOverride": false
  },
  {
    "name": "Завертка Armadillo Urban Collection BK6.R.URS52 (WC-BOLT BK6 URS) CP-8, хром (квадрат 80 мм)",
    "price": 1530,
    "sourceBase": 1530,
    "parentId": 24236,
    "offerId": 24238,
    "priceOverride": false
  },
  {
    "name": "Завертка Armadillo Urban Collection WC BOLT BK6 USS WH-19, белый (квадрат 80 мм)",
    "price": 1530,
    "sourceBase": 1530,
    "parentId": 24224,
    "offerId": 24226,
    "priceOverride": false
  },
  {
    "name": "Завертка Armadillo Urban Collection WC-BOLT BK6 URS BPVD-26, вороненый никель (квадрат 80 мм)",
    "price": 1530,
    "sourceBase": 1530,
    "parentId": 27040,
    "offerId": 27042,
    "priceOverride": false
  },
  {
    "name": "Завертка Armadillo Urban Collection WC-BOLT BK6 USS, MWSC-33, итальянский тисненый (квадрат 80 мм)",
    "price": 1530,
    "sourceBase": 1530,
    "parentId": 25178,
    "offerId": 25180,
    "priceOverride": false
  },
  {
    "name": "Завертка ARMADILLO WC-BOLT BK6/SQ-21CP-8 хром (квадрат 80 мм)",
    "price": 1550,
    "sourceBase": 1550,
    "parentId": 25352,
    "offerId": 25354,
    "priceOverride": false
  },
  {
    "name": "Завертка BK6.K.JS51 (BK6 JS) SN-3, матовый никель",
    "price": 383,
    "sourceBase": 383,
    "parentId": 35700,
    "offerId": 35702,
    "priceOverride": false
  },
  {
    "name": "Завертка Code Deco Slim WC-4020-NISM, цвет матовый никель (квадрат 75 мм)",
    "price": 700,
    "sourceBase": 700,
    "parentId": 29770,
    "offerId": 29772,
    "priceOverride": false
  },
  {
    "name": "Завертка FANTOM WC-50 22K STATIN, цвет золото матовое",
    "price": 1250,
    "sourceBase": 1250,
    "parentId": 37548,
    "offerId": 37550,
    "priceOverride": false
  },
  {
    "name": "Завертка Formani Basic 1501T020NMXXUZI LBWC50-ZI NM, цвет черный",
    "price": 6890,
    "sourceBase": 6890,
    "parentId": 36796,
    "offerId": 36798,
    "priceOverride": false
  },
  {
    "name": "Завертка Forme R WC, цвет матовый хром",
    "price": 1700,
    "sourceBase": 1700,
    "parentId": 37370,
    "offerId": 37372,
    "priceOverride": false
  },
  {
    "name": "Завертка FUARO BK6 SL SSC-16, сатинированный хром  (квадрат 75 мм)",
    "price": 1000,
    "sourceBase": 1000,
    "parentId": 26066,
    "offerId": 26068,
    "priceOverride": false
  },
  {
    "name": "Завертка FUARO BK6.K.DM51 (BK6 DM) SSC-16, цвет сатинированный хром (квадрат 75 мм)",
    "price": 1250,
    "sourceBase": 1250,
    "parentId": 28750,
    "offerId": 28752,
    "priceOverride": false
  },
  {
    "name": "Завертка FUARO BK6.K.DM51 (BK6 DM) SSG-39 сатинированное золото (квадрат 75 мм)",
    "price": 1250,
    "sourceBase": 1250,
    "parentId": 27082,
    "offerId": 27084,
    "priceOverride": false
  },
  {
    "name": "Завертка FUARO BK6.K.DM51 BL-24, цвет черный (квадрат 75 мм)",
    "price": 1250,
    "sourceBase": 1250,
    "parentId": 29126,
    "offerId": 29128,
    "priceOverride": false
  },
  {
    "name": "Завертка Fuaro (Фуаро) BK6.K.DM51 WH-19, цвет белый (квадрат 75 мм)",
    "price": 1250,
    "sourceBase": 1250,
    "parentId": 24992,
    "offerId": 24994,
    "priceOverride": false
  },
  {
    "name": "Завертка FUARO BK6.K.SL52 (BK6 SL) BL-24, цвет черный (квадрат 75 мм)",
    "price": 1000,
    "sourceBase": 1000,
    "parentId": 28824,
    "offerId": 28826,
    "priceOverride": false
  },
  {
    "name": "Завертка FUARO BK6.K.SL52 (BK6 SL) CP-8, цвет хром (квадрат 75 мм)",
    "price": 1000,
    "sourceBase": 1000,
    "parentId": 28864,
    "offerId": 28866,
    "priceOverride": false
  },
  {
    "name": "Завертка FUARO BK6.K.SL52 (BK6 SL) GR-23, цвет графит",
    "price": 1000,
    "sourceBase": 1000,
    "parentId": 38606,
    "offerId": 38608,
    "priceOverride": false
  },
  {
    "name": "Завертка FUARO BK6.K.SL52 (BK6 SL) SSC-16, цвет сатинированный хром",
    "price": 1000,
    "sourceBase": 1000,
    "parentId": 40700,
    "offerId": 40702,
    "priceOverride": false
  },
  {
    "name": "Завертка Fuaro BK6.K.XM52 (BK6 XM) BL-24, цвет черный (квадрат 75 мм)",
    "price": 1000,
    "sourceBase": 1000,
    "parentId": 30046,
    "offerId": 30048,
    "priceOverride": false
  },
  {
    "name": "Завертка Fuaro BK6.R.SLR52 (BK6 SLR) BL-24, цвет черный (квадрат 75 мм)",
    "price": 750,
    "sourceBase": 750,
    "parentId": 42624,
    "offerId": 42626,
    "priceOverride": false
  },
  {
    "name": "Завертка Fuaro BK6.R.SLR52 (BK6 SLR) SSC-16, цвет сатинированный хром (квадрат 75 мм)",
    "price": 750,
    "sourceBase": 750,
    "parentId": 27646,
    "offerId": 27648,
    "priceOverride": false
  },
  {
    "name": "Завертка FUARO BK6.R.SLR52 SSG-39 (BK6 SLR), цвет сатинированное золото (квадрат 75 мм)",
    "price": 750,
    "sourceBase": 750,
    "parentId": 28586,
    "offerId": 28588,
    "priceOverride": false
  },
  {
    "name": "Завертка FUARO BKW8x75.K.RL52 SSG, цвет сатинированное золото (квадрат 75 мм)",
    "price": 800,
    "sourceBase": 800,
    "parentId": 28428,
    "offerId": 28430,
    "priceOverride": false
  },
  {
    "name": "Завертка FUARO INOX 304 BK6.R.DSS304-02 (DSS-02-BK6), цвет нержавеющая сталь",
    "price": 1220,
    "sourceBase": 1220,
    "parentId": 42314,
    "offerId": 42316,
    "priceOverride": false
  },
  {
    "name": "Завертка Morelli LUX-WC-R ANT, цвет антрацит (квадрат 70 мм)",
    "price": 3641,
    "sourceBase": 3641,
    "parentId": 37828,
    "offerId": 37830,
    "priceOverride": false
  },
  {
    "name": "Завертка MORELLI LUX-WC-R5 NERO, цвет черный (припаянный к заглушке квадрат 70 мм)",
    "price": 3029,
    "sourceBase": 3029,
    "parentId": 29034,
    "offerId": 29036,
    "priceOverride": false
  },
  {
    "name": "Завертка Morelli LUX-WC-RM CSA- мат хром (припаянный к заглушке квадрат 70 мм)",
    "price": 2730,
    "sourceBase": 2730,
    "parentId": 25770,
    "offerId": 25772,
    "priceOverride": false
  },
  {
    "name": "Завертка Morelli LUX-WC-S2 OSA, цвет матовое золото (квадрат  мм.)",
    "price": 8960,
    "sourceBase": 8960,
    "parentId": 38420,
    "offerId": 38422,
    "priceOverride": false
  },
  {
    "name": "Завертка Morelli LUX-WC-S5 NERO на квадратной розетке, цвет черный (припаянный к заглушке квадрат 70 мм)",
    "price": 2948,
    "sourceBase": 2948,
    "parentId": 29788,
    "offerId": 29790,
    "priceOverride": false
  },
  {
    "name": "Завертка Morelli LUX-WC-SM Nero, цвет черный (припаянный к заглушке квадрат 70 мм)",
    "price": 3366,
    "sourceBase": 3366,
    "parentId": 21516,
    "offerId": 21518,
    "priceOverride": false
  },
  {
    "name": "Завертка Morelli Luxury LUX-WC-R CRO, Хром (припаянный к заглушке квадрат 70 мм)",
    "price": 3071,
    "sourceBase": 0,
    "purchasePrice": 1770,
    "rrp": 3071,
    "parentId": 21546,
    "offerId": 21548,
    "priceOverride": true,
    "priceOverrideReason": "Согласовано 19.09.2026 по прайсу MORELLI Luxury с РРЦ 01.12.25: закупочная/базовая 1770 ₽, РРЦ 3071 ₽; рабочая цена каталога = РРЦ 3071 ₽; исходный BASE Bitrix24 = 0",
    "priceSource": "2025_MORELLI Luxury_прайс с РРЦ 01.12.25.xls"
  },
  {
    "name": "Завертка Morelli LUXURY LUX-WC-R5 CSA, цвет матовый хром (квадрат 70 мм)",
    "price": 2948,
    "sourceBase": 2948,
    "parentId": 28614,
    "offerId": 28616,
    "priceOverride": false
  },
  {
    "name": "Завертка Morelli Luxury LUX-WC-SM CSA Цвет - матовый хром (припаянный к заглушке квадрат 70 мм)",
    "price": 3366,
    "sourceBase": 3366,
    "parentId": 25766,
    "offerId": 25768,
    "priceOverride": false
  },
  {
    "name": "Завертка MORELLI MH-WC SC/CP, цвет матовый хром/хром (квадрат 80 мм)",
    "price": 1020,
    "sourceBase": 1020,
    "parentId": 29400,
    "offerId": 29402,
    "priceOverride": false
  },
  {
    "name": "Завертка Morelli MH-WC SN/BN, цвет бел. никель/черн. никель",
    "price": 1020,
    "sourceBase": 1020,
    "parentId": 38450,
    "offerId": 38452,
    "priceOverride": false
  },
  {
    "name": "Завертка MORELLI MH-WC-R6 BL цвет - чёрный (квадрат 80 мм)",
    "price": 1000,
    "sourceBase": 1000,
    "parentId": 27762,
    "offerId": 27764,
    "priceOverride": false
  },
  {
    "name": "Завертка MORELLI MH-WC-R6 MSC на круглой розетке 6мм, цвет мат. сатин. хром (квадрат 80 мм)",
    "price": 1030,
    "sourceBase": 1030,
    "parentId": 30548,
    "offerId": 30550,
    "priceOverride": false
  },
  {
    "name": "Завертка MORELLI MH-WC-R6 SC, цвет матовый хром (квадрат 80 мм.)",
    "price": 1000,
    "sourceBase": 1000,
    "parentId": 39038,
    "offerId": 39040,
    "priceOverride": false
  },
  {
    "name": "Завертка Morelli MH-WC-R6T BL, на круглой розетке 6 мм, цвет - чёрный (квадрат 75 мм)",
    "price": 1703,
    "sourceBase": 1703,
    "parentId": 28766,
    "offerId": 28768,
    "priceOverride": false
  },
  {
    "name": "Завертка Morelli MH-WC-S BL, цвет - черный (квадрат 80 мм)",
    "price": 1040,
    "sourceBase": 1040,
    "parentId": 23996,
    "offerId": 23998,
    "priceOverride": false
  },
  {
    "name": "Завертка Morelli MH-WC-S SC/CP  хром (квадрат 80 мм)",
    "price": 1040,
    "sourceBase": 1040,
    "parentId": 25076,
    "offerId": 25078,
    "priceOverride": false
  },
  {
    "name": "Завертка Morelli MH-WC-S55 GR/PC, цвет графит/хром (квадрат 80 мм)",
    "price": 1040,
    "sourceBase": 1040,
    "parentId": 35872,
    "offerId": 35874,
    "priceOverride": false
  },
  {
    "name": "Завертка MORELLI MH-WC-S6 GR, цвет графит (квадрат 80 мм)",
    "price": 1090,
    "sourceBase": 1090,
    "parentId": 42548,
    "offerId": 42550,
    "priceOverride": false
  },
  {
    "name": "Завертка Morelli MH-WC-S6 SC на квадратной розетке, цвет матовый хром (квадрат 80 мм)",
    "price": 1040,
    "sourceBase": 1040,
    "parentId": 24934,
    "offerId": 24936,
    "priceOverride": false
  },
  {
    "name": "Завертка MORELLI MH-WC-S6 SSC,  на квадратной розетке 6 мм, цвет супер матовый хром (Квадрат 80 мм)",
    "price": 1040,
    "sourceBase": 1040,
    "parentId": 28048,
    "offerId": 28050,
    "priceOverride": false
  },
  {
    "name": "Завертка Morelli MH-WC-S6 W, белая (квадрат 80 мм)",
    "price": 1040,
    "sourceBase": 1040,
    "parentId": 25202,
    "offerId": 25204,
    "priceOverride": false
  },
  {
    "name": "Завертка PALLINI COSMO PAL-COS-WC MatBlack, Чёрный матовый (квадрат 80 мм)",
    "price": 1045,
    "sourceBase": 1045,
    "parentId": 21524,
    "offerId": 21526,
    "priceOverride": false
  },
  {
    "name": "Завертка PALLINI COSMO PAL-COS-WC Матовый хром (квадрат 80 мм)",
    "price": 1045,
    "sourceBase": 1045,
    "parentId": 21534,
    "offerId": 21536,
    "priceOverride": false
  },
  {
    "name": "Завертка PALLINI COSMO PAL-COS-WC-SC, цвет хром матовый (квадрат 80 мм)",
    "price": 1180,
    "sourceBase": 1180,
    "parentId": 29758,
    "offerId": 29760,
    "priceOverride": false
  },
  {
    "name": "Завертка PORTA DI PARMA WC.011.06 PVD, цвет Полированное золото",
    "price": 1620,
    "sourceBase": 1620,
    "parentId": 39600,
    "offerId": 39602,
    "priceOverride": false
  },
  {
    "name": "Завертка PEURTO INBK AL 03, цвет черный (квадрат 65 мм)",
    "price": 945,
    "sourceBase": 945,
    "parentId": 25978,
    "offerId": 25980,
    "priceOverride": false
  },
  {
    "name": "Завертка PUERTO INBK AL 03 MBN, Матовый черный никель (квадрат 65 мм)",
    "price": 945,
    "sourceBase": 945,
    "parentId": 25990,
    "offerId": 25992,
    "priceOverride": false
  },
  {
    "name": "Завертка PUERTO INBK AL 03 MSN, Никель супер матовый (квадрат 65 мм)",
    "price": 945,
    "sourceBase": 945,
    "parentId": 25986,
    "offerId": 25988,
    "priceOverride": false
  },
  {
    "name": "Завертка PUERTO INBK AL 03, Матовый супер белый (квадрат 65 мм)",
    "price": 945,
    "sourceBase": 945,
    "parentId": 25998,
    "offerId": 26000,
    "priceOverride": false
  },
  {
    "name": "Завертка PUERTO INBK AL 03 slim B, цвет черный (квадрат 65 мм)",
    "price": 1035,
    "sourceBase": 1035,
    "parentId": 29068,
    "offerId": 29070,
    "priceOverride": false
  },
  {
    "name": "Завертка PUERTO INBK AL 03 slim MSN, цвет никель супер матовый (квадрат 65 мм)",
    "price": 1035,
    "sourceBase": 1035,
    "parentId": 29542,
    "offerId": 29544,
    "priceOverride": false
  },
  {
    "name": "Завертка PUERTO INBK AL 03 slim MSW, Матовый супер белый (квадрат 65 мм)",
    "price": 1035,
    "sourceBase": 1035,
    "parentId": 28222,
    "offerId": 28224,
    "priceOverride": false
  },
  {
    "name": "Завертка PUERTO INBK AL 03 slim SSG, цвет золото матовое сатинированное (квадрат 65 мм)",
    "price": 1035,
    "sourceBase": 1035,
    "parentId": 28984,
    "offerId": 28986,
    "priceOverride": false
  },
  {
    "name": "Завертка PUERTO INBK AL 03 SN, Никель матовый (квадрат 65 мм)",
    "price": 945,
    "sourceBase": 945,
    "parentId": 25994,
    "offerId": 25996,
    "priceOverride": false
  },
  {
    "name": "Завертка Puerto INBK AL 06 slim B, цвет черный (квадрат 65 мм)",
    "price": 945,
    "sourceBase": 945,
    "parentId": 25826,
    "offerId": 25828,
    "priceOverride": false
  },
  {
    "name": "Завертка Puerto INBK AL 06 slim MBN, цвет матовый черный никель (квадрат 65 мм)",
    "price": 945,
    "sourceBase": 945,
    "parentId": 38656,
    "offerId": 38658,
    "priceOverride": false
  },
  {
    "name": "Завертка PUERTO INBK AL 06 slim MSN, цвет никель супер матовый (квадрат 65 мм)",
    "price": 945,
    "sourceBase": 945,
    "parentId": 39296,
    "offerId": 39298,
    "priceOverride": false
  },
  {
    "name": "Завертка PUERTO INBK AL 06 slim SSC, цвет супер сатин хром (квадрат 65 мм)",
    "price": 945,
    "sourceBase": 945,
    "parentId": 29486,
    "offerId": 29488,
    "priceOverride": false
  },
  {
    "name": "Завертка PUERTO INBK AL 08 SN/NP, цвет никель матовый/никель блестящий  (квадрат 80 мм)",
    "price": 745,
    "sourceBase": 745,
    "parentId": 28692,
    "offerId": 28694,
    "priceOverride": false
  },
  {
    "name": "Завертка Puerto INBK AL 09 zero, цвет черный (квадрат 72 мм)",
    "price": 1050,
    "sourceBase": 1050,
    "parentId": 28936,
    "offerId": 28938,
    "priceOverride": false
  },
  {
    "name": "Завертка Puerto INBK AL 11 zero B, цвет черный (квадрат 72 мм)",
    "price": 1050,
    "sourceBase": 1050,
    "parentId": 29008,
    "offerId": 29010,
    "priceOverride": false
  },
  {
    "name": "Завертка Puerto INBK AL 11 zero SSC, цвет супер сатин хром (квадрат 72 мм)",
    "price": 1050,
    "sourceBase": 1050,
    "parentId": 25782,
    "offerId": 25784,
    "priceOverride": false
  },
  {
    "name": "Завертка PUNTO BK6 QL SN/CP-3, матовый никель/хром (квадрат 80 мм)",
    "price": 750,
    "sourceBase": 750,
    "parentId": 25256,
    "offerId": 25258,
    "priceOverride": false
  },
  {
    "name": "Завертка PUNTO BK6.K.QL52 (BK6 QL) BL-24 Черный (квадрат 80 мм)",
    "price": 750,
    "sourceBase": 750,
    "parentId": 25252,
    "offerId": 25254,
    "priceOverride": false
  },
  {
    "name": "Завертка PUNTO BK6.K.QL52 (BK6 QL) GR/CP-23, графит/хром (квадрат 80 мм.)",
    "price": 750,
    "sourceBase": 750,
    "parentId": 38534,
    "offerId": 38536,
    "priceOverride": false
  },
  {
    "name": "Завертка PUNTO BK6.R.ARC.R52 (BK6 ARC) SSC-16, цвет сатин.хром",
    "price": 550,
    "sourceBase": 550,
    "parentId": 40674,
    "offerId": 40676,
    "priceOverride": false
  },
  {
    "name": "Завертка Ruccetti RAP WC-S BL, черная  (квадрат 80 мм)",
    "price": 615,
    "sourceBase": 615,
    "parentId": 25524,
    "offerId": 25526,
    "priceOverride": false
  },
  {
    "name": "Завертка RUCETTI RAP WC SLIM-S BL, цвет черный",
    "price": 690,
    "sourceBase": 690,
    "parentId": 42296,
    "offerId": 42298,
    "priceOverride": false
  },
  {
    "name": "Завертка SILLUR BARRERA OL M.BLACK, цвет матовый черный",
    "price": 2550,
    "sourceBase": 2550,
    "parentId": 40398,
    "offerId": 40400,
    "priceOverride": false
  },
  {
    "name": "Завертка Vantage BK02BL, цвет черный( квадрат 70 мм)",
    "price": 700,
    "sourceBase": 700,
    "parentId": 29620,
    "offerId": 29622,
    "priceOverride": false
  },
  {
    "name": "Завертка АЛЛЮР АРТ BK-S1 SB/PB(4176), цвет мат. золото (квадрата 55 мм)",
    "price": 670,
    "sourceBase": 670,
    "parentId": 29668,
    "offerId": 29670,
    "priceOverride": false
  },
  {
    "name": "Завертка квадратная PALLINI Cosmo PAL-COS-WC-S MatBlack, черный матовый (квадрат 80 мм)",
    "price": 1045,
    "sourceBase": 1045,
    "parentId": 26292,
    "offerId": 26294,
    "priceOverride": false
  },
  {
    "name": "Завертка РЕНЦ INBK 01 B, цвет черный (квадрат 72 мм)",
    "price": 1180,
    "sourceBase": 1180,
    "parentId": 29418,
    "offerId": 29420,
    "priceOverride": false
  },
  {
    "name": "Завертка Ренц INBK 01 SSC,супер сатин хром  (квадрат 72 мм)",
    "price": 1180,
    "sourceBase": 1180,
    "parentId": 27434,
    "offerId": 27436,
    "priceOverride": false
  },
  {
    "name": "Завертка РЕНЦ INBK 03 B, цвет черный (квадрат  75 мм)",
    "price": 1150,
    "sourceBase": 1150,
    "parentId": 26664,
    "offerId": 26666,
    "priceOverride": false
  },
  {
    "name": "Завертка РЕНЦ INBK 03 slim B, цвет черный  (квадрат 72 мм)",
    "price": 1425,
    "sourceBase": 1425,
    "parentId": 30432,
    "offerId": 30434,
    "priceOverride": false
  },
  {
    "name": "Завертка РЕНЦ INBK 03 slim SN, цвет никель матовый (квадрат 72 мм.)",
    "price": 1425,
    "sourceBase": 1425,
    "parentId": 39478,
    "offerId": 39480,
    "priceOverride": false
  },
  {
    "name": "Завертка РЕНЦ INBK 03, цвет - супер белый (длина квадрата 75 мм)",
    "price": 1150,
    "sourceBase": 1150,
    "parentId": 27856,
    "offerId": 27858,
    "priceOverride": false
  },
  {
    "name": "Завертка РЕНЦ INBK 08 SN, цвет никель матовый (квадрат 80 мм)",
    "price": 1075,
    "sourceBase": 1075,
    "parentId": 28574,
    "offerId": 28576,
    "priceOverride": false
  },
  {
    "name": "Завертка РЕНЦ INBK 95-03 MSN, цвет супер матовый никель (квадрат 75 мм)",
    "price": 1150,
    "sourceBase": 1150,
    "parentId": 26710,
    "offerId": 26712,
    "priceOverride": false
  },
  {
    "name": "Завертка РЕНЦ INBK 95-03 SW, цвет супер белый (квадрат 75 мм)",
    "price": 1150,
    "sourceBase": 1150,
    "parentId": 26668,
    "offerId": 26670,
    "priceOverride": false
  },
  {
    "name": "Завертка сантехническая MORELLI LUX-WC-BRIDGE-R6 OSA, цвет матовое золото, латунь",
    "price": 8400,
    "sourceBase": 8400,
    "parentId": 40452,
    "offerId": 40454,
    "priceOverride": false
  },
  {
    "name": "Завертка сантехническая Morelli Luxury LUX-WС-S5 CAFFE Цвет - кофе (квадрат 70 мм)",
    "price": 2948,
    "sourceBase": 2948,
    "parentId": 25878,
    "offerId": 25880,
    "priceOverride": false
  },
  {
    "name": "Завертка сантехническая MORELLI MH-WC BL, Цвет – Черный (квадрат 80 мм)",
    "price": 1040,
    "sourceBase": 1040,
    "parentId": 24898,
    "offerId": 24900,
    "priceOverride": false
  },
  {
    "name": "Завертку Morelli Luxury LUX-WC-SQ NERO, Цвет - Черный (припаянный к заглушке квадрат 70 мм)",
    "price": 2948,
    "sourceBase": 0,
    "purchasePrice": 1704,
    "rrp": 2948,
    "parentId": 25508,
    "offerId": 25510,
    "priceOverride": true,
    "priceOverrideReason": "Согласовано 19.09.2026 по прайсу MORELLI Luxury с РРЦ 01.12.25: закупочная/базовая 1704 ₽, РРЦ 2948 ₽; рабочая цена каталога = РРЦ 2948 ₽; исходный BASE Bitrix24 = 0",
    "priceSource": "2025_MORELLI Luxury_прайс с РРЦ 01.12.25.xls"
  },
  {
    "name": "Завёртка ABRISS BK 5005 MСP, матовый хром (квадрат 80 мм)",
    "price": 950,
    "sourceBase": 950,
    "parentId": 25316,
    "offerId": 25318,
    "priceOverride": false
  },
  {
    "name": "Завёртка Armadillo Urban Collection WC-BOLT BK6 UCS BL-26 чёрный (квадрат 80 мм)",
    "price": 1800,
    "sourceBase": 1800,
    "parentId": 18888,
    "offerId": 18890,
    "priceOverride": false
  },
  {
    "name": "Завёртка Armadillo Urban Collection WC-BOLT BK6 UCS BPVD-77 Вороненый никель (квадрат 80 мм)",
    "price": 1530,
    "sourceBase": 1530,
    "parentId": 21338,
    "offerId": 21340,
    "priceOverride": false
  },
  {
    "name": "Завёртка Armadillo Urban Collection WC-BOLT BK6 UCS SN-3 Матовый никель (квадрат 80 мм)",
    "price": 1750,
    "sourceBase": 1750,
    "parentId": 15964,
    "offerId": 21376,
    "priceOverride": false
  },
  {
    "name": "Завёртка Armadillo Urban Collection WC-BOLT BK6 USS  MWSC-33 , итальянский тисненый (квадрат 80 мм)",
    "price": 1530,
    "sourceBase": 1530,
    "parentId": 24220,
    "offerId": 24222,
    "priceOverride": false
  },
  {
    "name": "Завёртка Armadillo Urban Collection WC-BOLT BK6 USS BPVD-77, цвет вороненый никель (квадрат 80 мм)",
    "price": 1530,
    "sourceBase": 1530,
    "parentId": 29184,
    "offerId": 29186,
    "priceOverride": false
  },
  {
    "name": "Завёртка Armadillo Urban Collection WC-BOLT BK6 USS CP-8 Хром (квадрат 80 мм)",
    "price": 1530,
    "sourceBase": 1530,
    "parentId": 15960,
    "offerId": 21430,
    "priceOverride": false
  },
  {
    "name": "Завёртка Armadillo Urban Collection WC-BOLT BK6 USS SN-3 мат никель (квадрат 80 мм)",
    "price": 1530,
    "sourceBase": 1530,
    "parentId": 15956,
    "offerId": 21418,
    "priceOverride": false
  },
  {
    "name": "Завёртка Armadillo Urban Collection WC-BOLT BK6/USQ SN-3 цвет матовый никель (квадрат  80 мм)",
    "price": 1860,
    "sourceBase": 1860,
    "parentId": 26910,
    "offerId": 26912,
    "priceOverride": false
  },
  {
    "name": "Завёртка WC-BOLT BK6 USS FSG-39 Флорентийское золото (квадрат 80 мм)",
    "price": 1530,
    "sourceBase": 1530,
    "parentId": 24110,
    "offerId": 24112,
    "priceOverride": false
  },
  {
    "name": "Завёртка Morelli Luxury LUX-WC-SQ CRO, Хром (припаянный к заглушке квадрат 70 мм)",
    "price": 2989,
    "sourceBase": 0,
    "purchasePrice": 1718,
    "rrp": 2989,
    "parentId": 21550,
    "offerId": 21552,
    "priceOverride": true,
    "priceOverrideReason": "Согласовано 19.09.2026 по прайсу MORELLI Luxury с РРЦ 01.12.25: закупочная/базовая 1718 ₽, РРЦ 2989 ₽; рабочая цена каталога = РРЦ 2989 ₽; исходный BASE Bitrix24 = 0",
    "priceSource": "2025_MORELLI Luxury_прайс с РРЦ 01.12.25.xls"
  },
  {
    "name": "Завёртка Morelli MH-WC-S55 SC/CP матовый хром (квадрат 80 мм)",
    "price": 1040,
    "sourceBase": 1040,
    "parentId": 16324,
    "offerId": 16326,
    "priceOverride": false
  },
  {
    "name": "Завёртка Morelli MH-WC-S6 BL, чёрная (квадрат 80 мм)",
    "price": 1040,
    "sourceBase": 1040,
    "parentId": 25280,
    "offerId": 25282,
    "priceOverride": false
  },
  {
    "name": "Завёртка PALLINI COSMO PAL-COS-WS WHITE, белая (квадрат 80 мм)",
    "price": 1045,
    "sourceBase": 1045,
    "parentId": 25696,
    "offerId": 25698,
    "priceOverride": false
  },
  {
    "name": "Завёртка RUCETTI RAP WC-S SC/CP матовый хром/полированный хром (квадрат 80 мм)",
    "price": 620,
    "sourceBase": 620,
    "parentId": 24016,
    "offerId": 24018,
    "priceOverride": false
  },
  {
    "name": "Завёртка сантехническая RAP WC-S SN/CP, цвет - бел. никель/хром",
    "price": 630,
    "sourceBase": 630,
    "parentId": 25656,
    "offerId": 25658,
    "priceOverride": false
  },
  {
    "name": "Накладка Ajax под цилиндр ET.K.JS51 (ET JS) SSC-16, цвет сатинированный хром",
    "price": 450,
    "sourceBase": 450,
    "parentId": 37472,
    "offerId": 37474,
    "priceOverride": false
  },
  {
    "name": "Накладка Armadillo (Армадилло) под цилиндр ET.K.USS52 (ET USS) SN-3, цвет матовый никель",
    "price": 900,
    "sourceBase": 900,
    "parentId": 42338,
    "offerId": 42340,
    "priceOverride": false
  },
  {
    "name": "Накладка Armadillo под цилиндр ET.K.USS52 (ET USS) BL-26, цвет черный",
    "price": 900,
    "sourceBase": 900,
    "parentId": 21352,
    "offerId": 21354,
    "priceOverride": false
  },
  {
    "name": "Накладка Armadillo под цилиндр ET.K.USS52 (ET USS) FSG-39, цвет флорентийское золото",
    "price": 900,
    "sourceBase": 900,
    "parentId": 30166,
    "offerId": 30168,
    "priceOverride": false
  },
  {
    "name": "Накладка Armadillo под цилиндр ET.K.USS52 (ET USS) SN-3, цвет матовый никель",
    "price": 900,
    "sourceBase": 900,
    "parentId": 18816,
    "offerId": 18818,
    "priceOverride": false
  },
  {
    "name": "Накладка Armadillo под цилиндр ET.K.USS52 (ET USS) WH-19, цвет  белый",
    "price": 900,
    "sourceBase": 900,
    "parentId": 26006,
    "offerId": 26008,
    "priceOverride": false
  },
  {
    "name": "Накладка Armadillo под цилиндр ET.K.USS52 (ET USS) WH-19, цвет белый",
    "price": 900,
    "sourceBase": 900,
    "parentId": 26006,
    "offerId": 26008,
    "priceOverride": false
  },
  {
    "name": "Накладка Armadillo под цилиндр ET.K.USS52 BPVD-77, цвет вороненый никель",
    "price": 900,
    "sourceBase": 900,
    "parentId": 30384,
    "offerId": 30386,
    "priceOverride": false
  },
  {
    "name": "Накладка Armadillo под цилиндр ET.K.USS52 MWSC-33 итальянский тисненый",
    "price": 900,
    "sourceBase": 900,
    "parentId": 25470,
    "offerId": 25472,
    "priceOverride": false
  },
  {
    "name": "Накладка FUARO под цилиндр ET.K.SL52 (ET SL) BL-24 черный",
    "price": 700,
    "sourceBase": 700,
    "parentId": 38736,
    "offerId": 38738,
    "priceOverride": false
  },
  {
    "name": "Накладка MORELLI LUX-KH-SM CS, цвет матовый хром",
    "price": 3101,
    "sourceBase": 3101,
    "parentId": 29246,
    "offerId": 29248,
    "priceOverride": false
  },
  {
    "name": "Накладка MORELLI MH-KH-S6 SC, цвет матовый хром",
    "price": 775,
    "sourceBase": 775,
    "parentId": 37574,
    "offerId": 37576,
    "priceOverride": false
  },
  {
    "name": "Накладка MORELLI MH-KH-S6 SSC, цвет супер матовый хром",
    "price": 775,
    "sourceBase": 775,
    "parentId": 30244,
    "offerId": 30246,
    "priceOverride": false
  },
  {
    "name": "Накладка для евроцилиндра Ruccetti RAP KH SN/CP, цвет белый никель/хром",
    "price": 450,
    "sourceBase": 450,
    "parentId": 26062,
    "offerId": 26064,
    "priceOverride": false
  },
  {
    "name": "Накладка для цилиндра APRILE Q 5S PZ US PVD, цвет антрацит полированный",
    "price": 2320,
    "sourceBase": 2320,
    "parentId": 26940,
    "offerId": 26942,
    "priceOverride": false
  },
  {
    "name": "Накладка квадратная для цилиндра PUERTO INET AL 03 B, цвет черный",
    "price": 700,
    "sourceBase": 700,
    "parentId": 27932,
    "offerId": 27934,
    "priceOverride": false
  },
  {
    "name": "Накладка квадратная для цилиндра PUERTO INET AL 03 MSN, Никель супер матовый",
    "price": 700,
    "sourceBase": 700,
    "parentId": 26816,
    "offerId": 26818,
    "priceOverride": false
  },
  {
    "name": "Накладка на евроцилиндр RAP KH-S SN/CP, цвет - бел. никель/хром",
    "price": 430,
    "sourceBase": 430,
    "parentId": 25652,
    "offerId": 25654,
    "priceOverride": false
  },
  {
    "name": "Накладка на ключевой цилиндр MORELLI MH-KH-S6 BL Цвет - Чёрный",
    "price": 775,
    "sourceBase": 775,
    "parentId": 27808,
    "offerId": 27810,
    "priceOverride": false
  },
  {
    "name": "Накладка на ключевой цилиндр MORELLI MH-KH-S6 MSG, цвет мат. сатинированное золото",
    "price": 908,
    "sourceBase": 908,
    "parentId": 37056,
    "offerId": 37058,
    "priceOverride": false
  },
  {
    "name": "Накладка на цилиндр PALLINI Cosmo PAL-COS-KH-S MatBlack, цвет черный",
    "price": 650,
    "sourceBase": 650,
    "parentId": 39344,
    "offerId": 39346,
    "priceOverride": false
  },
  {
    "name": "Накладка на цилиндр PALLINI PAL-COS-KH MatBlack, цвет черный",
    "price": 650,
    "sourceBase": 650,
    "parentId": 39544,
    "offerId": 39546,
    "priceOverride": false
  },
  {
    "name": "Накладка на цилиндр PUERTO B2B ET AL 02 SN/CP, цвет никель матовый/хром блестящий",
    "price": 265,
    "sourceBase": 265,
    "parentId": 40300,
    "offerId": 40302,
    "priceOverride": false
  },
  {
    "name": "Накладка под цилиндр ET.K.SL52 SSG-39 сатинированное золото",
    "price": 700,
    "sourceBase": 700,
    "parentId": 25218,
    "offerId": 25220,
    "priceOverride": false
  },
  {
    "name": "Накладка под цилиндр Fuaro ET.R.SLR52 CP-8, цвет хром",
    "price": 800,
    "sourceBase": 800,
    "parentId": 39416,
    "offerId": 39418,
    "priceOverride": false
  },
  {
    "name": "Накладка под цилиндр Fuaro ET.R.SLR52 SSC-16, цвет сатинированный хром",
    "price": 800,
    "sourceBase": 800,
    "parentId": 39400,
    "offerId": 39402,
    "priceOverride": false
  },
  {
    "name": "Накладка под цилиндр PUNTO ET.R.ARC.R52 (ET ARC) SSC-16 цвет сатин.хром",
    "price": 400,
    "sourceBase": 400,
    "parentId": 40670,
    "offerId": 40672,
    "priceOverride": false
  },
  {
    "name": "Фиксатор сантехнический Fantom круглый WC-30 22K SATIN (золото матовое)",
    "price": 1284,
    "sourceBase": 1284,
    "parentId": 36766,
    "offerId": 36768,
    "priceOverride": false
  }
]);

const TURN_PRICE_AUDIT=Object.freeze({
  "category": "Завертки",
  "source": "Hidden Doors — Ревизия фурнитуры — бренды v1 / Bitrix24 BASE",
  "sourceRows": 164,
  "catalogRows": 162,
  "imported": 162,
  "exactMatched": 162,
  "missing": 0,
  "zero": 3,
  "suspiciousLow": 0,
  "suspiciousThreshold": 100,
  "minSourceBase": 0,
  "minPositiveBase": 120,
  "maxBase": 8960,
  "resolvedOverrides": 3,
  "removedUnresolved": 2,
  "sourceOnly": 0
});

const TURN_PRICE_REVIEW=Object.freeze([]);

const TURN_PRICE_SOURCE_ONLY=Object.freeze([]);

const BITRIX_CYLINDER_BASE_PRICES=Object.freeze([
  {"name":"Евроцилиндр GUARDIAN GB со штоком мм (46/31/60SH) Ni 5 ключей, цвет никель","price":1950,"sourceBase":1950,"parentId":30098,"offerId":30100,"priceOverride":false},
  {"name":"Евроцилиндр Rucetti R 60 C SN 60 мм ключ/завертка, цвет мат никель","price":650,"sourceBase":650,"parentId":26058,"offerId":26060,"priceOverride":false},
  {"name":"Евроцилиндр ключ-завертка MORELLI 60CK SN, никель 3ключа","price":1173,"sourceBase":1173,"parentId":21482,"offerId":21484,"priceOverride":false},
  {"name":"Ключевой цилиндр MORELLI 60CK PC с заверткой (60 мм), цвет - хром","price":1122,"sourceBase":1122,"parentId":37374,"offerId":37376,"priceOverride":false},
  {"name":"Ключевой цилиндр MORELLI 60CK W 60 мм с заверткой, цвет белый","price":1173,"sourceBase":1173,"parentId":29646,"offerId":29648,"priceOverride":false},
  {"name":"Ключевой цилиндр MORELLI HS 60CK PG ключ/вертушка, цвет золото","price":1071,"sourceBase":1071,"parentId":37052,"offerId":37054,"priceOverride":false},
  {"name":"Ключевой цилиндр MORELLI 60CK BL с заверткой (60мм), цвет - черный","price":1173,"sourceBase":1173,"parentId":27936,"offerId":27938,"priceOverride":false},
  {"name":"Ключевой цилиндр MORELLI ключ/ключ (60 мм) 60C BL Цвет - Черный","price":898,"sourceBase":898,"parentId":27812,"offerId":27814,"priceOverride":false},
  {"name":"Ключевой цилиндр MORELLI ключ/ключ (60мм) 60C PC , цвет хром","price":836,"sourceBase":836,"parentId":29040,"offerId":29042,"priceOverride":false},
  {"name":"Механизм цилиндровый Vantage PC80 (35Cх45) SВ 5 ключей, цвет мат. золото","price":1550,"sourceBase":1550,"parentId":42566,"offerId":42568,"priceOverride":false},
  {"name":"Механизм цилиндровый Vantage PC80 (45Cх35) SВ 5 ключей, цвет мат. золото (для полотна 59 мм)","price":1530,"sourceBase":1530,"parentId":39772,"offerId":39774,"priceOverride":false},
  {"name":"Механизм цилиндровый с перфо ключом (Серия Z) Vantage Z80 (35x45) CP, цвет хром","price":1130,"sourceBase":1130,"parentId":37354,"offerId":37356,"priceOverride":false},
  {"name":"Механизм цилиндровый с перфо ключом Vantage ZC80 (35Cx45) CP ключ/вертушка, цвет хром","price":1130,"sourceBase":1130,"parentId":37358,"offerId":37360,"priceOverride":false},
  {"name":"Цилиндр FORTAUR FT-CKZ60-PC ключ/вертушка, цвет хром","price":470,"sourceBase":470,"parentId":26642,"offerId":26644,"priceOverride":false},
  {"name":"Цилиндр механический STD AL ЛПВ 80 (45-35в)ключ/вертушка, цвет хром (со смещением, для полотна 59мм, вертушка со стороны без четверти)","price":750,"sourceBase":750,"parentId":26808,"offerId":26810,"priceOverride":false},
  {"name":"Цилиндр механический STD AL ЛПВ 80 (45-35в)ключ/вертушка, цвет черный (со смещением, для полотна 59мм, вертушка со стороны без четверти)","price":750,"sourceBase":750,"parentId":26804,"offerId":26806,"priceOverride":false},
  {"name":"Цилиндрический механизм (Польша), цвет антрацит","price":3360,"sourceBase":3360,"parentId":26932,"offerId":26934,"priceOverride":false},
  {"name":"Цилиндрический механизм (Россия), цвет антрацит","price":2100,"sourceBase":2100,"parentId":26936,"offerId":26938,"priceOverride":false},
  {"name":"Цилиндровый Fuaro (Фуаро) механизм (200 ZM/80) 2000ZM Knob 80 (30+10+40В) 5Key с вертушкой BL-24, цвет черный","price":800,"sourceBase":800,"parentId":38584,"offerId":38586,"priceOverride":false},
  {"name":"Цилиндровый Fuaro (Фуаро) механизм(200 ZM/80) 2000ZM Knob 80 (40+10+30В) 5Key с вертушкой BL-24, цвет черный","price":900,"sourceBase":900,"parentId":38588,"offerId":38590,"priceOverride":false},
  {"name":"Цилиндровый механизм VЕTTORE ZN M80 ZC NI (35T*45), ключ/вертушка, 5 ключей, цвет никель (со смещением, для полотна 59мм, вертушка со стороны без четверти)","price":600,"sourceBase":600,"parentId":26812,"offerId":26814,"priceOverride":false},
  {"name":"Цилиндровый механизм  VЕTTORE ключ/вертушка ZN M60 ZC MBP (30T*30), 5 ключей  (Чёрный Матовый)","price":470,"sourceBase":470,"parentId":27940,"offerId":27942,"priceOverride":false},
  {"name":"Цилиндровый механизм Ajax (AX200/60) AX2000Key60 (25+10+25) CP, цвет хром","price":300,"sourceBase":300,"parentId":37476,"offerId":37478,"priceOverride":false},
  {"name":"Цилиндровый механизм Avers JM-80(35/45)-G, ключ/ключ, золотой (со смещением, для полотна 59мм)","price":750,"sourceBase":750,"parentId":39658,"offerId":39660,"priceOverride":false},
  {"name":"Цилиндровый механизм Avers ZM-80(35/45)-BL, ключ/ключ, черный (со смещением, для полотна 59мм)","price":650,"sourceBase":650,"parentId":29096,"offerId":29098,"priceOverride":false},
  {"name":"Цилиндровый механизм Avers ZM-80(35/45)-CR, ключ/ключ, хром (со смещением, для полотна 59мм)","price":650,"sourceBase":650,"parentId":27438,"offerId":27440,"priceOverride":false},
  {"name":"Цилиндровый механизм Avers ключ/вертушка ZM-60-C-CR, хром","price":470,"sourceBase":470,"parentId":25344,"offerId":25346,"priceOverride":false},
  {"name":"Цилиндровый механизм Code Deco ZM-80(35/45)-BLM, цвет матовый черный (со смещением, для полотна 59 мм)","price":973,"sourceBase":973,"parentId":30290,"offerId":30292,"priceOverride":false},
  {"name":"Цилиндровый механизм Fuaro (D-PRO500/80) D-PRO5000Key80(30+10+40) PB, цвет латунь 5Key","price":1350,"sourceBase":1350,"parentId":30180,"offerId":30182,"priceOverride":false},
  {"name":"Цилиндровый механизм Fuaro (Фуаро) (200 ZA/80) 2000ZAKey80(30+10+40) 5Key BL, цвет черный","price":750,"sourceBase":750,"parentId":38598,"offerId":38600,"priceOverride":false},
  {"name":"Цилиндровый механизм Fuaro D-PRO5007 Tang 90 w/k (55+10+25) без верт. BL-24, цвет черный","price":1800,"sourceBase":1800,"parentId":29942,"offerId":29944,"priceOverride":false},
  {"name":"Цилиндровый механизм PALLINI Р 60СК SN ключ/вертушка 5 ключей, цвет матовый никель","price":700,"sourceBase":700,"parentId":42334,"offerId":42336,"priceOverride":false},
  {"name":"Цилиндровый механизм Punto MaxPro7000Key65mm(25+10+30) SN, цвет никель (для 42 полотен REVERSE/7 ключей)","price":1000,"sourceBase":1000,"parentId":39960,"offerId":39962,"priceOverride":false},
  {"name":"Цилиндровый механизм Vantage VC-80 (35+10+35) ключ/ключ SB, цвет золото матовое","price":407,"sourceBase":407,"parentId":40292,"offerId":40294,"priceOverride":false},
  {"name":"Цилиндровый механизм Vantage ZC 80 мм (45с/35) CP, цвет хром (5 ключей)","price":1130,"sourceBase":1130,"parentId":39404,"offerId":39406,"priceOverride":false},
  {"name":"Цилиндровый механизм VETTORE ZN M60 ZC MBP (30T*30), 5 ключей, цвет чёрный матовый","price":740,"sourceBase":740,"parentId":42452,"offerId":42454,"priceOverride":false},
  {"name":"Цилиндровый механизм НОРА-М ЕСО Z ЛПВ-80 (45*35в) ключ/повортник, цвет черный (со смещением, для полотная 59 мм, вертушка со стороны без четверти)","price":1220,"sourceBase":1220,"parentId":29208,"offerId":29210,"priceOverride":false},
  {"name":"Цилиндровый механизм Р 60C MatBlack PALLINI 60 мм, 5 ключей, кл/кл, цвет черный матовый","price":650,"sourceBase":650,"parentId":39352,"offerId":39354,"priceOverride":false},
  {"name":"Цилиндровый механизм Р 60CK MatBlack PALLINI 60 мм, 5 ключей, кл/бр, цвет черный матовый","price":740,"sourceBase":740,"parentId":39356,"offerId":39358,"priceOverride":false},
  {"name":"Цилиндровый механизм с повышенной секретностью ключ/вертушка серия P 80 (40Сх40), матовое золото","price":850,"sourceBase":850,"parentId":25222,"offerId":25224,"priceOverride":false}
]);

const CYLINDER_PRICE_AUDIT=Object.freeze({
  category:"Цилиндровые механизмы",
  source:"Hidden Doors — Ревизия фурнитуры — бренды v1 / Bitrix24 BASE",
  sourceRows:41,
  catalogRows:40,
  imported:40,
  exactMatched:40,
  missing:0,
  zero:0,
  suspiciousLow:0,
  suspiciousThreshold:100,
  minSourceBase:1,
  minWorkingBase:300,
  maxBase:3360,
  removedUnresolved:1
});

const CYLINDER_PRICE_REVIEW=Object.freeze([]);

const BITRIX_STOPPER_BASE_PRICES=Object.freeze([
  {"name":"Дверной ограничитель MORELLI DS1 BL, цвет черный","price":377,"sourceBase":377,"parentId":29012,"offerId":29014,"priceOverride":false},
  {"name":"Дверной ограничитель MORELLI DS3 SC, цвет матовый хром","price":592,"sourceBase":592,"parentId":29250,"offerId":29252,"priceOverride":false},
  {"name":"Дверной упор Punto DFIX/F50 (DS PF-50) BL-24, цвет черный","price":200,"sourceBase":200,"parentId":39548,"offerId":39550,"priceOverride":false},
  {"name":"Магнитный скрытый стопор \"FANTOM\" MAGNETIC DOOR STOP, прозрачный","price":3600,"sourceBase":3600,"parentId":34312,"offerId":34314,"priceOverride":false},
  {"name":"Магнитный скрытый стопор \"FANTOM\" PREMIUM HGT001, белый","price":3600,"sourceBase":3600,"parentId":16716,"offerId":16718,"priceOverride":false},
  {"name":"Магнитный скрытый стопор \"FANTOM\" PREMIUM HGT001, прозрачный","price":3600,"sourceBase":3600,"parentId":16232,"offerId":16234,"priceOverride":false,"purchasePrice":1812},
  {"name":"Магнитный скрытый стопор \"FANTOM\" PREMIUM HGT004, чёрный","price":3600,"sourceBase":3600,"parentId":16704,"offerId":16706,"priceOverride":false},
  {"name":"Магнитный скрытый стопор \"FANTOM\" PREMIUM HGT005, полированный хром","price":3600,"sourceBase":3600,"parentId":16712,"offerId":16714,"priceOverride":false},
  {"name":"Магнитный скрытый стопор \"FANTOM\" PREMIUM HGT006, матовый хром","price":3600,"sourceBase":3600,"parentId":16708,"offerId":16710,"priceOverride":false,"purchasePrice":1435.42},
  {"name":"Магнитный скрытый стопор \"FANTOM\" STANDART, прозрачный","price":2800,"sourceBase":2800,"parentId":25394,"offerId":25396,"priceOverride":false},
  {"name":"Магнитный скрытый стопор \"FANTOM\" STANDART, черный","price":2800,"sourceBase":2800,"parentId":29406,"offerId":29408,"priceOverride":false},
  {"name":"Ограничитель двери SECRET DS SC скрытый магнитный, цвет матовый хром (на клеевой основе)","price":2285,"sourceBase":2285,"parentId":28396,"offerId":28398,"priceOverride":false},
  {"name":"Ограничитель дверной MORELLI SECRET DS BL магнитный скрытый, цвет чёрный (на клеевой основе)","price":2285,"sourceBase":2285,"parentId":34456,"offerId":34458,"priceOverride":false},
  {"name":"Стопор магнитный, цвет - никель","price":2250,"sourceBase":2250,"parentId":28624,"offerId":28626,"priceOverride":false},
  {"name":"Стоппер скрытый магнитный STANG, белый","price":1500,"sourceBase":1500,"parentId":25680,"offerId":25682,"priceOverride":false},
  {"name":"Стоппер скрытый магнитный STANG, прозрачный","price":1500,"sourceBase":1500,"parentId":25672,"offerId":25674,"priceOverride":false},
  {"name":"Стоппер скрытый магнитный STANG, черный","price":1500,"sourceBase":1500,"parentId":25676,"offerId":25678,"priceOverride":false},
  {"name":"Упор дверной напольный Venezia ST 3, матовый хром","price":2700,"sourceBase":2700,"parentId":24914,"offerId":24916,"priceOverride":false,"purchasePrice":1000}
]);

const STOPPER_PRICE_AUDIT=Object.freeze({
  category:"Стопоры",
  source:"Hidden Doors — Ревизия фурнитуры — бренды v1 / Bitrix24 BASE",
  sourceRows:18,
  catalogRows:18,
  imported:18,
  exactMatched:18,
  missing:0,
  zero:0,
  suspiciousLow:0,
  suspiciousThreshold:100,
  minSourceBase:200,
  minWorkingBase:200,
  maxBase:3600,
  purchaseKnown:3
});

const STOPPER_PRICE_REVIEW=Object.freeze([]);

const BITRIX_THRESHOLD_BASE_PRICES=Object.freeze([
  {"name":"Автоматический порог EASY BLOCK F/1020","price":1350,"sourceBase":1350,"parentId":18804,"offerId":21366,"priceOverride":false,"purchasePrice":577.45},
  {"name":"Автоматический порог EASY BLOCK F/820","price":1350,"sourceBase":1350,"parentId":18798,"offerId":21398,"priceOverride":false,"purchasePrice":577.45}
]);

const THRESHOLD_PRICE_AUDIT=Object.freeze({
  category:"Скрытый порог",
  source:"Hidden Doors — Ревизия фурнитуры — бренды v1 / Bitrix24 BASE",
  sourceRows:2,
  catalogRows:2,
  imported:2,
  exactMatched:2,
  missing:0,
  zero:0,
  suspiciousLow:0,
  suspiciousThreshold:100,
  minSourceBase:1350,
  minWorkingBase:1350,
  maxBase:1350,
  purchaseKnown:2
});

const THRESHOLD_PRICE_REVIEW=Object.freeze([]);

const BITRIX_CLOSER_BASE_PRICES=Object.freeze([
  {"name":"Дверной доводчик GEZE Boxer EN 3-6 серебристый","price":24000,"sourceBase":24000,"parentId":25950,"offerId":25952,"priceOverride":false},
  {"name":"Дверной доводчик NOTEDO DC-015-115, IN+HO+BC, цвет мат хром","price":11680,"sourceBase":11680,"parentId":26018,"offerId":26020,"priceOverride":false},
  {"name":"Доводчик дверной Armadillo со скользящей тягой DCSLIDER85 (DCS-85) AL, цвет алюминий","price":4800,"sourceBase":4800,"parentId":25382,"offerId":25384,"priceOverride":false},
  {"name":"Доводчик дверной Armadillo со скользящей тягой DCSLIDER85 (DCS-85) BR, цвет коричневый","price":4800,"sourceBase":4800,"parentId":30236,"offerId":30238,"priceOverride":false},
  {"name":"Доводчик серия GEZE TS3000 EN1-4 чёрного цвета","price":12700,"sourceBase":12700,"parentId":24170,"offerId":24172,"priceOverride":false},
  {"name":"Доводчик скрытый врезной GEZE AktivStop","price":23922,"sourceBase":23922,"parentId":29134,"offerId":29136,"priceOverride":false},
  {"name":"Скрытый дверной доводчик с фиксацией HOME до 80 кг DC80FOPSKR, мат хром","price":5300,"sourceBase":5300,"parentId":25816,"offerId":25818,"priceOverride":false}
]);

const CLOSER_PRICE_AUDIT=Object.freeze({
  category:"Доводчики",
  source:"Hidden Doors — Ревизия фурнитуры — бренды v1 / Bitrix24 BASE",
  sourceRows:8,
  catalogRows:7,
  imported:7,
  exactMatched:7,
  missing:0,
  zero:0,
  suspiciousLow:0,
  suspiciousThreshold:100,
  minSourceBase:2300,
  minWorkingBase:4800,
  maxBase:24000,
  purchaseKnown:0,
  removedUnidentified:1
});

const CLOSER_PRICE_REVIEW=Object.freeze([]);
const CLOSER_CATALOG_REVIEW=Object.freeze([]);


const BITRIX_OPENING_SYSTEM_BASE_PRICES=Object.freeze([
  {"name":"Morelli система INVISIBLE-2 1100 Комплект для двери 80-110 см весом до 80 кг","price":46460,"sourceBase":46460,"parentId":25308,"offerId":25310,"priceOverride":false},
  {"name":"Morelli система INVISIBLE-2 1800 Комплект для двери 80-180 см весом до 80 кг","price":50770,"sourceBase":50770,"parentId":16404,"offerId":21404,"priceOverride":false},
  {"name":"Комплект Armadillo для обрамления пенала Armadillo SLD.Comfort-PENAL frame 900/2300 BL, цвет черный","price":27880,"sourceBase":27880,"parentId":42494,"offerId":42496,"priceOverride":false},
  {"name":"Комплект Armadillo для раздвижных дверей Armadillo SLD.Comfort-PRO.SET2.soft close/80","price":4720,"sourceBase":4720,"parentId":42486,"offerId":42488,"priceOverride":false},
  {"name":"Комплект для двери книжка до 30 кг. (Morelli SLIDING SET 1133-1137)","price":12300,"sourceBase":12300,"parentId":26304,"offerId":26306,"priceOverride":false},
  {"name":"Комплект для обрамления пенала Armadillo SLD.Comfort-PENAL frame 900/2300 AL, цвет алюминий","price":27880,"sourceBase":27880,"parentId":42498,"offerId":42500,"priceOverride":false},
  {"name":"Комплект для раздвижных дверей Armadillo SLD.Comfort-PRO.SET1.rollers/80","price":1950,"sourceBase":1950,"parentId":42482,"offerId":42484,"priceOverride":false},
  {"name":"Комплект для раздвижных дверей Armadillo SLD.Comfort-PRO.SET3.soft close+roller/80","price":3920,"sourceBase":3920,"parentId":42490,"offerId":42492,"priceOverride":false},
  {"name":"Нижняя направляющая Armadillo Comfort 60/80/1000 bottom track, цвет алюминий","price":350,"sourceBase":350,"parentId":42478,"offerId":42480,"priceOverride":false},
  {"name":"Пенал Armadillo для скрытой раздвижной системы SLD.Comfort-PENAL caseta 900/2300","price":45300,"sourceBase":45300,"parentId":42462,"offerId":42464,"priceOverride":false},
  {"name":"Пенал Armadillo для скрытой раздвижной системы SLD.Comfort-PENAL caseta 900/2600","price":59430,"sourceBase":59430,"parentId":42466,"offerId":42468,"priceOverride":false},
  {"name":"Пенал Armadillo для скрытой раздвижной системы SLD.Comfort-PENAL caseta 900/2900","price":68460,"sourceBase":68460,"parentId":42470,"offerId":42472,"priceOverride":false},
  {"name":"Раздвижная система Armadillo система HIDDEN/40 с профилем (для дверей весом до 40 кг)","price":42600,"sourceBase":42600,"parentId":25154,"offerId":25156,"priceOverride":false},
  {"name":"Раздвижная система Armadillo система HIDDEN/80 с профилем (для дверей весом от 40 до 80 кг)","price":42600,"sourceBase":42600,"parentId":25158,"offerId":25160,"priceOverride":false},
  {"name":"Рото система Morelli SWING. Комплект для двери 2000мм высота, ширина от 600 до 900мм, цвет фурнитуры - черный (+ комплект нажимных ручек и магнитный замок)","price":61282,"sourceBase":61282,"parentId":28234,"offerId":28236,"priceOverride":false},
  {"name":"Рото система Morelli SWING. Комплект для двери 2100мм высота, ширина от 600 до 900мм, цвет фурнитуры - хром (+ комплект нажимных ручек и магнитный замок)","price":63217,"sourceBase":63217,"parentId":28238,"offerId":28240,"priceOverride":false},
  {"name":"Рото система Morelli SWING. Комплект для двери 2400мм высота, ширина от 600 до 900мм, цвет фурнитуры - хром, с доводчиком (+ комплект нажимных ручек и магнитный замок)","price":67119,"sourceBase":67119,"parentId":28242,"offerId":28244,"priceOverride":false},
  {"name":"Система PRO SYNCHRON SOFT 80","price":14500,"sourceBase":14500,"parentId":25112,"offerId":25114,"priceOverride":false},
  {"name":"Система открывания PIVOT для поворотных полотен","price":46200,"sourceBase":46200,"parentId":36996,"offerId":36998,"priceOverride":false},
  {"name":"Система открывания TWICE, 180-TWICE LEFT 60, комплект для левой двери, черновой проем 700","price":35650,"sourceBase":35650,"parentId":25796,"offerId":25798,"priceOverride":false},
  {"name":"Система открывания TWICE, 180-TWICE LEFT 70, комплект для левой двери, черновой проем 800","price":35650,"sourceBase":35650,"parentId":25792,"offerId":25794,"priceOverride":false},
  {"name":"Система пенал Eclisse Telescopic single","price":45000,"sourceBase":45000,"parentId":16228,"offerId":16230,"priceOverride":false},
  {"name":"Толкатель Armadillo скрытого монтажа SLD.Comfort-PENAL K-push","price":6475,"sourceBase":6475,"parentId":42474,"offerId":42476,"priceOverride":false}
]);

const OPENING_SYSTEM_PRICE_AUDIT=Object.freeze({
  category:"Системы открывания",
  source:"Hidden Doors — Ревизия фурнитуры — бренды v1 / Bitrix24 BASE",
  sourceRows:23,
  catalogRows:23,
  imported:23,
  exactMatched:23,
  missing:0,
  zero:0,
  suspiciousLow:0,
  suspiciousThreshold:100,
  minSourceBase:350,
  minWorkingBase:350,
  maxBase:68460,
  purchaseKnown:0
});

const OPENING_SYSTEM_PRICE_REVIEW=Object.freeze([]);
const OPENING_SYSTEM_PRICE_ALIASES=Object.freeze({
  "Armadillo HIDDEN/40":"Раздвижная система Armadillo система HIDDEN/40 с профилем (для дверей весом до 40 кг)",
  "Armadillo HIDDEN/80":"Раздвижная система Armadillo система HIDDEN/80 с профилем (для дверей весом от 40 до 80 кг)",
  "Morelli INVISIBLE-2 1100":"Morelli система INVISIBLE-2 1100 Комплект для двери 80-110 см весом до 80 кг",
  "Morelli INVISIBLE-2 1800":"Morelli система INVISIBLE-2 1800 Комплект для двери 80-180 см весом до 80 кг"
});
function openingSystemPriceName(value){
  return OPENING_SYSTEM_PRICE_ALIASES[String(value||'').trim()]||String(value||'').trim();
}

function normalizeHardwarePriceName(value){
  return String(value||'')
    .toUpperCase().replace(/Ё/g,'Е')
    .replace(/[–—]/g,'-')
    .replace(/\s+/g,' ')
    .replace(/\s*,\s*/g,',')
    .replace(/\s*-\s*/g,'-')
    .trim();
}
const BITRIX_VENT_GRILLE_BASE_PRICES=Object.freeze([
  {name:"Вентиляционная алюминиевая решетка Profiledoors, 30x2,5см (комплект)",price:4300,sourceBase:4300,parentId:21502,offerId:21504,priceOverride:false},
  {name:"Решетка вентиляционная алюминиевая 245х60 мм, белая, GTV",price:610,sourceBase:610,parentId:21498,offerId:21500,priceOverride:false},
  {name:"Решетка вентиляционная алюминиевая 245х60 мм, серебристая, GTV (1шт)",price:610,sourceBase:610,parentId:21490,offerId:21492,priceOverride:false},
  {name:"Решетка вентиляционная алюминиевая 245х60 мм, чёрная, GTV",price:610,sourceBase:610,parentId:21494,offerId:21496,priceOverride:false},
  {name:"Решетка врезная металлическая 600х40, белая",price:1220,sourceBase:1220,parentId:25376,offerId:25378,priceOverride:false}
]);

const BITRIX_ADDITIONAL_ELEMENT_BASE_PRICES=Object.freeze([
  {name:"Иллюминатор, диаметр 250 мм, матовая латунь",price:15800,sourceBase:15800,parentId:24150,offerId:24152,priceOverride:false},
  {name:"Иллюминатор декоративный для дверей, диаметр 350мм",price:16160,sourceBase:16160,parentId:24004,offerId:24006,priceOverride:false},
  {name:"Иллюминатор для дверей. Нержавеющая сталь. Стекло прозрачное. Диаметр 350 мм, цвет - матовый хром",price:9000,sourceBase:9000,parentId:28602,offerId:28604,priceOverride:false},
  {name:"Накладка для двери из нитрид титана, матовая латунь",price:29400,sourceBase:29400,parentId:null,offerId:null,priceOverride:false},
  {name:"Квадрат (ось) 105 мм",price:70,sourceBase:70,parentId:30304,offerId:30306,priceOverride:true,priceOverrideReason:"BASE Bitrix24 70 ₽ подтверждён и утверждён как розничная цена"},
  {name:"Квадрат (ось) 8х150мм",price:150,sourceBase:150,parentId:28660,offerId:28662,priceOverride:false},
  {name:"Квадрат Spindle 6х80мм ARMADILLO (для дверей 59мм)",price:100,sourceBase:100,parentId:27392,offerId:27394,priceOverride:true,priceOverrideReason:"BASE Bitrix24 100 ₽ подтверждён и утверждён как розничная цена"},
  {name:"Четырехгранник LUX-SPINDLE-WC 110 NERO 110мм с кнопкой, цвет черный",price:1885,sourceBase:1885,parentId:29826,offerId:29828,priceOverride:false},
  {name:"Четырехгранник MORELLI LUX-SPINDLE-WC 110 CSA 110мм, цвет мат. хром",price:1863,sourceBase:1863,parentId:34296,offerId:34298,priceOverride:false}
]);

const BITRIX_INSTALLATION_BASE_PRICES=Object.freeze([
  {name:"Комплект монтажника под двери 42 мм",price:75,sourceBase:75,parentId:null,offerId:null,priceOverride:true,priceOverrideReason:"Утверждено Александром: розничная цена 75 ₽"},
  {name:"Комплект монтажника под двери 59 мм",price:75,sourceBase:75,parentId:null,offerId:null,priceOverride:true,priceOverrideReason:"Утверждено Александром: розничная цена 75 ₽"},
  {name:"Переход гибкий ABLOY EA281, цвет хром",price:800,sourceBase:800,parentId:null,offerId:null,priceOverride:true,priceOverrideReason:"Утверждено Александром: розничная цена 800 ₽"}
]);

const BITRIX_HARDWARE_BASE_PRICE_MAPS=Object.freeze({
  'Петли':new Map(BITRIX_HINGE_BASE_PRICES.map(item=>[normalizeHardwarePriceName(item.name),item])),
  'Замки':new Map(BITRIX_LOCK_BASE_PRICES.map(item=>[normalizeHardwarePriceName(item.name),item])),
  'Ручки':new Map(BITRIX_HANDLE_BASE_PRICES.map(item=>[normalizeHardwarePriceName(item.name),item])),
  'Завертки':new Map(BITRIX_TURN_BASE_PRICES.map(item=>[normalizeHardwarePriceName(item.name),item])),
  'Цилиндровые механизмы':new Map(BITRIX_CYLINDER_BASE_PRICES.map(item=>[normalizeHardwarePriceName(item.name),item])),
  'Стопоры':new Map(BITRIX_STOPPER_BASE_PRICES.map(item=>[normalizeHardwarePriceName(item.name),item])),
  'Скрытый порог':new Map(BITRIX_THRESHOLD_BASE_PRICES.map(item=>[normalizeHardwarePriceName(item.name),item])),
  'Доводчики':new Map(BITRIX_CLOSER_BASE_PRICES.map(item=>[normalizeHardwarePriceName(item.name),item])),
  'Системы открывания':new Map(BITRIX_OPENING_SYSTEM_BASE_PRICES.map(item=>[normalizeHardwarePriceName(item.name),item])),
  'Вентиляционные решетки':new Map(BITRIX_VENT_GRILLE_BASE_PRICES.map(item=>[normalizeHardwarePriceName(item.name),item])),
  'Доп.фурнитура':new Map(BITRIX_ADDITIONAL_ELEMENT_BASE_PRICES.map(item=>[normalizeHardwarePriceName(item.name),item])),
  'Монтаж и комплектующие':new Map(BITRIX_INSTALLATION_BASE_PRICES.map(item=>[normalizeHardwarePriceName(item.name),item]))
});
function hardwareBasePriceMeta(category,name){
  const map=BITRIX_HARDWARE_BASE_PRICE_MAPS[category];
  if(!map)return null;
  const item=map.get(normalizeHardwarePriceName(name));
  if(!item)return null;
  const effective=(item.price===null||item.price===undefined||item.price==='')?null:Number(item.price);
  const source=(item.sourceBase===null||item.sourceBase===undefined||item.sourceBase==='')?null:Number(item.sourceBase);
  const price=effective!==null&&Number.isFinite(effective)&&effective>0?effective:null;
  const sourceBase=source!==null&&Number.isFinite(source)?source:null;
  const suspicious=!item.priceOverride && (sourceBase===null || sourceBase<=100);
  return {
    category,
    name:item.name,
    source:'Bitrix24 BASE',
    parentId:item.parentId,
    offerId:item.offerId,
    sourceBase,
    price,
    priceOverride:!!item.priceOverride,
    priceOverrideReason:item.priceOverride?(item.priceOverrideReason||'Ручная согласованная корректировка цены'):'',
    suspicious,
    status:item.priceOverride?'override':price===null?'missing':suspicious?'suspicious':'ok'
  };
}
function hardwareBasePrice(category,name){
  const meta=hardwareBasePriceMeta(category,name);
  if(!meta||meta.price===null||meta.suspicious)return null;
  return meta.price;
}

const HARDWARE_SPECIAL_RETAIL_MARKUP=0.50;
const HARDWARE_SPECIAL_OPT1_MARKUP=0.125;
const VANTAGE_PARTNER_OPT2_STANDARD=603;

function hardwareSpecialPriceFamily(category,name){
  const c=String(category||'');
  const n=String(name||'');
  if(c==='Петли'&&/петл/i.test(n)&&!/колпач/i.test(n)&&/(?:K8060|К8060|K6360\/38|К6360\/38|K2760|К2760)/i.test(n)){
    return 'hinge';
  }
  if(c==='Замки'&&/Vantage/i.test(n)&&/магнитн/i.test(n)){
    return 'vantage';
  }
  return '';
}
function vantagePartnerStandardColor(name){
  const n=String(name||'');
  return /черн|хром|матовый хром|мат хром|\bSC\b|\bBL\b/i.test(n);
}
function hardwarePartnerOpt2Eligible(category,name){
  return !!hardwareSpecialPriceFamily(category,name);
}
function hardwareSalesPriceType(category,name,requestedType=activeSalesPriceType()){
  const requested=normalizeSalesPriceType(requestedType);
  return hardwarePartnerOpt2Eligible(category,name)?requested:'retail';
}
function hardwareSalesPriceMeta(category,name,requestedType=activeSalesPriceType()){
  const base=hardwareBasePriceMeta(category,name);
  if(!base)return null;
  const retailSource=(!base.suspicious&&Number.isFinite(Number(base.price))&&Number(base.price)>0)?Number(base.price):null;
  const family=hardwareSpecialPriceFamily(category,name);
  const eligible=!!family;
  const priceType=hardwareSalesPriceType(category,name,requestedType);

  let opt2Raw=null;
  let pricingBasis='';
  if(eligible&&retailSource!==null){
    if(family==='vantage'&&vantagePartnerStandardColor(name)){
      opt2Raw=VANTAGE_PARTNER_OPT2_STANDARD;
      pricingBasis='Партнёрский прайс: Vantage чёрный/серый/хром = 603 ₽ Опт 2';
    }else{
      opt2Raw=retailSource/(1+HARDWARE_SPECIAL_RETAIL_MARKUP);
      pricingBasis=(family==='vantage'
        ?'Vantage: Опт 2 рассчитан от текущей розницы /1,50; для этого цвета нет отдельной строки партнёрского прайса'
        :'Петли K8060 / K6360/38 / K2760: Опт 2 = Розница /1,50');
    }
  }

  const opt2Price=opt2Raw===null?null:Math.ceil(opt2Raw);
  const opt1Price=opt2Raw===null?null:Math.ceil(opt2Raw*(1+HARDWARE_SPECIAL_OPT1_MARKUP));
  const derivedRetail=opt2Raw===null?null:Math.ceil(opt2Raw*(1+HARDWARE_SPECIAL_RETAIL_MARKUP));
  const price=retailSource===null?null:
    (eligible
      ?(priceType==='wholesale2'?opt2Price:priceType==='wholesale1'?opt1Price:derivedRetail)
      :retailSource);

  return {
    ...base,
    retailPrice:eligible?derivedRetail:retailSource,
    retailSourcePrice:retailSource,
    priceType,
    price,
    opt2Eligible:eligible,
    opt2Price,
    opt1Price,
    derivedRetail,
    pricingFamily:family,
    pricingBasis,
    salesSource:eligible?pricingBasis:'Розничная цена каталога'
  };
}
function hardwareSalesPrice(category,name,requestedType=activeSalesPriceType()){
  const meta=hardwareSalesPriceMeta(category,name,requestedType);
  return !meta||meta.price===null||meta.suspicious?null:Number(meta.price);
}
function hardwarePartnerOpt2Rows(){
  const rows=[];
  for(const category of ['Петли','Замки']){
    const map=BITRIX_HARDWARE_BASE_PRICE_MAPS[category];
    if(!map)continue;
    for(const item of map.values()){
      if(!hardwarePartnerOpt2Eligible(category,item.name))continue;
      const meta=hardwareSalesPriceMeta(category,item.name,'wholesale2');
      if(meta)rows.push({category,name:item.name,retailPrice:meta.retailPrice,opt1Price:meta.opt1Price,opt2Price:meta.opt2Price,discount:meta.opt2Discount});
    }
  }
  return rows;
}
function configuredCatalogUnitPrice(){
  if(product()==='hardware'){
    const uiCategory=$('hardwareCategory')?.value||'';
    const sourceCategory=(typeof HARDWARE_MAP!=='undefined'?(HARDWARE_MAP[uiCategory]||uiCategory):uiCategory);
    return hardwareSalesPrice(sourceCategory,$('catalogItem')?.value||'',activeSalesPriceType());
  }
  if(product()==='openingSystem')return hardwareSalesPrice('Системы открывания',$('catalogItem')?.value||'',activeSalesPriceType());
  if(product()==='installation')return hardwareSalesPrice('Монтаж и комплектующие',$('catalogItem')?.value||'','retail');
  if(product()==='additionalElement'){
    const type=$('additionalType')?.value||'';
    const name=$('catalogItem')?.value||'';
    if(type==='Вентиляционные решётки')return hardwareSalesPrice('Вентиляционные решетки',name,'retail');
    const p=hardwareSalesPrice('Доп.фурнитура',name,'retail');
    if(p!==null)return p;
  }
  if(product()==='wallPanel'&&typeof configuredWallPanelUnitPrice==='function')return configuredWallPanelUnitPrice(activeSalesPriceType());
  if(product()==='trim42'&&typeof configuredTrim42UnitPrice==='function')return configuredTrim42UnitPrice(activeSalesPriceType());
  if(product()==='trim59'&&typeof configuredTrim59UnitPrice==='function')return configuredTrim59UnitPrice(activeSalesPriceType());
  if(['single42','sliding42'].includes(product())&&typeof configured42StandardUnitPrice==='function')return configured42StandardUnitPrice();
  if(product()==='double42'&&typeof configuredDouble42LeafUnitPrice==='function')return configuredDouble42LeafUnitPrice();
  if(product()==='single59'&&typeof configured59UnitPrice==='function')return configured59UnitPrice();
  return configured36CartUnitPrice();
}
const DOUBLE42_BOLT_DHM01_SALES_PRICES=Object.freeze({
  wholesale2:92,
  wholesale1:104,
  retail:138
});
function double42BoltSalesPrice(priceType=activeSalesPriceType()){
  const type=normalizeSalesPriceType(priceType);
  return DOUBLE42_BOLT_DHM01_SALES_PRICES[type]??DOUBLE42_BOLT_DHM01_SALES_PRICES.wholesale2;
}

function companionItemUnitPrice(item){
  const key=String(item?.key||'');
  const baseKey=String(item?.baseKey||key);
  const type=activeSalesPriceType();
  if(baseKey==='BUNDLE-P42-BOX'&&typeof price42BoxCompanionUnitPrice==='function')return price42BoxCompanionUnitPrice(item,type);
  if(/^BUNDLE-P42-DOUBLE-/.test(baseKey)&&typeof price42DoubleBoxPartUnitPrice==='function')return price42DoubleBoxPartUnitPrice(item,type);
  if(baseKey==='BUNDLE-P59-BOX'&&typeof price59BoxCompanionUnitPrice==='function')return price59BoxCompanionUnitPrice(item,type);
  if(baseKey==='POWDER-COAT-42')return Number(item?.fixedUnitPrice||PRICE42_POWDER_COAT_RATE_PER_M||460);
  if(baseKey==='POWDER-COAT-59')return Number(item?.fixedUnitPrice||PRICE59_POWDER_COAT_RATE_PER_M||460);
  if(/^BOX-MITER45-/.test(baseKey)||/^BOX-MITER45-/.test(key))return Number(item?.fixedUnitPrice||PRICE42_BOX_MITER45_FIXED_PRICE||1100);
  if(/^PROCESS-/.test(baseKey)||/^PROCESS-/.test(key))return Number(item?.fixedUnitPrice||0)||null;
  if(key==='DOOR-HINGE')return hardwareSalesPrice('Петли',item?.name||'',type);
  if(key==='DOOR-LOCK')return hardwareSalesPrice('Замки',item?.name||'',type);
  if(key==='DOOR-HANDLE'||key==='SLIDE42-HANDLE')return hardwareSalesPrice('Ручки',item?.name||'',type);
  if(key==='DOOR-TURN')return hardwareSalesPrice('Завертки',item?.name||'',type);
  if(key==='DOOR-CYLINDER')return hardwareSalesPrice('Цилиндровые механизмы',item?.name||'',type);
  if(baseKey==='DOOR-STOPPER'||key==='DOOR-STOPPER')return hardwareSalesPrice('Стопоры',item?.name||'',type);
  if(baseKey==='DOOR-THRESHOLD'||key==='DOOR-THRESHOLD')return hardwareSalesPrice('Скрытый порог',item?.name||'',type);
  if(key==='DOOR-CLOSER')return hardwareSalesPrice('Доводчики',item?.name||'',type);
  if(baseKey==='DOOR-VENT-GRILLE'||key==='DOOR-VENT-GRILLE')return hardwareSalesPrice('Вентиляционные решетки',item?.name||'','retail');
  if(baseKey==='DOOR-ADDITIONAL-ELEMENT'||key==='DOOR-ADDITIONAL-ELEMENT')return hardwareSalesPrice('Доп.фурнитура',item?.name||'','retail');
  if(key==='SLIDE42-SYSTEM')return hardwareSalesPrice('Системы открывания',openingSystemPriceName(item?.name||''),type);
  if(baseKey==='DOUBLE42-BOLT'||key==='DOUBLE42-BOLT')return double42BoltSalesPrice(type);
  return companion36UnitPrice(item);
}

function genericCatalogItemPrice(item){
  if(!item)return null;
  const category=String(item.category||'');
  const name=String(item.name||'');
  if(/петл/i.test(category)){
    const p=hardwareSalesPrice('Петли',name,item?.priceType||activeSalesPriceType());
    if(p!==null)return p;
  }
  if(/замк|защел|задвиж|ответн.*планк|корпус.*замк/i.test(category+' '+name)){
    const p=hardwareSalesPrice('Замки',name,item?.priceType||activeSalesPriceType());
    if(p!==null)return p;
  }
  if(/ручк/i.test(category+' '+name)){
    const p=hardwareSalesPrice('Ручки',name,item?.priceType||activeSalesPriceType());
    if(p!==null)return p;
  }
  if(/заверт/i.test(category)){
    const p=hardwareSalesPrice('Завертки',name,item?.priceType||activeSalesPriceType());
    if(p!==null)return p;
  }
  if(/цилиндр/i.test(category+' '+name)){
    const p=hardwareSalesPrice('Цилиндровые механизмы',name,item?.priceType||activeSalesPriceType());
    if(p!==null)return p;
  }
  if(/стоп|упор|ограничител/i.test(category+' '+name)){
    const p=hardwareSalesPrice('Стопоры',name,item?.priceType||activeSalesPriceType());
    if(p!==null)return p;
  }
  if(/порог/i.test(category+' '+name)){
    const p=hardwareSalesPrice('Скрытый порог',name,item?.priceType||activeSalesPriceType());
    if(p!==null)return p;
  }
  if(/доводчик/i.test(category+' '+name)){
    const p=hardwareSalesPrice('Доводчики',name,item?.priceType||activeSalesPriceType());
    if(p!==null)return p;
  }
  if(category==='Системы открывания'){
    const p=hardwareSalesPrice('Системы открывания',openingSystemPriceName(name),item?.priceType||activeSalesPriceType());
    if(p!==null)return p;
  }
  if(/вентиляционн.*решет|вентрешет/i.test(category+' '+name)){
    const p=hardwareSalesPrice('Вентиляционные решетки',name,'retail');
    if(p!==null)return p;
  }
  if(/монтаж|ABLOY EA281/i.test(category+' '+name)){
    const p=hardwareSalesPrice('Монтаж и комплектующие',name,'retail');
    if(p!==null)return p;
  }
  if(/иллюминатор/i.test(category+' '+name)){
    const p=hardwareSalesPrice('Доп.фурнитура',name,'retail');
    if(p!==null)return p;
  }
  if(typeof cart42StandardFallbackUnitPrice==='function'){
    const p42=cart42StandardFallbackUnitPrice(item);
    if(p42!==null)return p42;
  }
  return cart36FallbackUnitPrice(item);
}
