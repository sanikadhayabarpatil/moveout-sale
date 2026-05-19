"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react"

// =============================================================================
// TYPES
// =============================================================================

type MediaItem =
  | { type: "image"; url: string }
  | { type: "video"; url: string }
  | { type: "youtube"; url: string }
  | { type: "emoji"; emoji: string }

interface Listing {
  id: number
  title: string
  category: string
  price: string
  description: string
  payment: string
  media: MediaItem[]
  sold: boolean
}

// =============================================================================
// LISTINGS DATA
// =============================================================================

/*
  HOW TO ADD REAL MEDIA:
  
  For images hosted on GitHub:
  { type: "image", url: "https://raw.githubusercontent.com/username/repo/main/images/photo.jpg" }
  
  For videos hosted on GitHub (mp4):
  { type: "video", url: "https://raw.githubusercontent.com/username/repo/main/videos/clip.mp4" }
  
  For YouTube videos:
  { type: "youtube", url: "https://www.youtube.com/watch?v=VIDEO_ID" }
  or
  { type: "youtube", url: "https://youtu.be/VIDEO_ID" }
  
  Multiple media items per listing are supported and shown in the gallery carousel.
  The first media item is used as the thumbnail in the product grid.
*/

const LISTINGS: Listing[] = [
  {
    id: 1,
    title: 'HOME OFFICE WORKSTATIONS – LG 27" Monitor',
    category: "Electronics",
    price: "$40",
    description:
      "Excellent, crisp display with vibrant colors and wide viewing angles thanks to the IPS panel. Features a sleek, virtually borderless design on three sides. Fully functional with no dead pixels or scratches on the screen. Includes the original power adapter. \n Inputs: HDMI and VGA ports. Perfect for a dual-screen setup, student studying, or remote work.",
    payment: "Cash or Zelle accepted. Pickup only from Jamaica Plain",
    media: [
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/701940825_1476309394292632_3845013594369838637_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=104&ccb=1-7&_nc_sid=247b10&_nc_ohc=EoBDMg1o2l8Q7kNvwGpIsKF&_nc_oc=AdoiRhA2i-8fNAQqyAhTzC_pu-vAtykAtOxNh63SdKpB1WXtwEE8ocycHbyAWYe67lcTgkuuI_WeZy_tH2UwbOi7&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=9_ry4URonmgDM52ay5UK6A&_nc_ss=7b2a8&oh=00_Af7K7Mj8C6qU06tkFtOOqvWT0N6j46joagpz3KJtl0hprQ&oe=6A129EF9" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/701465349_953195417346377_2697787423279045355_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=106&ccb=1-7&_nc_sid=247b10&_nc_ohc=t737hQSGLe0Q7kNvwGYin4-&_nc_oc=Adq9VmAHy3ZcnUzDF8OWhQpyMzPpPPD5R-mjwnJGB7pq77zNkTH254sAz8LLW2fHJcASKQepVzCeRsM7K5BV9elr&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=9_ry4URonmgDM52ay5UK6A&_nc_ss=7b2a8&oh=00_Af6_0IyivToE6snynmnWdqP15WSGM4eNpT31mP8b8RNYPA&oe=6A12922E" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/676770097_973924568683202_1163880640200977813_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=108&ccb=1-7&_nc_sid=247b10&_nc_ohc=Mb26IeFvmuAQ7kNvwGYbhs2&_nc_oc=Adr_CrBNPTL4yeeiEccOBg4G3sSRHUC_vNgRJEEPeTOY2qGE-uNL6eso-Iplh0SRoO0aaffTQJJsIqdpuOKIvOvz&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=9_ry4URonmgDM52ay5UK6A&_nc_ss=7b2a8&oh=00_Af6OO5yXLspZjGvXL1zPhwNTEiXGEbYhpU3B8WLwHgEJ9w&oe=6A127507" }

      // Replace with real images:
      // { type: "image", url: "https://raw.githubusercontent.com/username/repo/main/images/kallax-1.jpg" },
      // { type: "image", url: "https://raw.githubusercontent.com/username/repo/main/images/kallax-2.jpg" },
    ],
    sold: false,
  },
  {
    id: 2,
    title: "Brita Water Filter + 2 Brand New Filters Included",
    category: "Appliances",
    price: "$35",
    description:
      "Selling a classic Brita water filtration pitcher. Excellent everyday essential for getting crisp, great-tasting, purified water right from your tap while cutting down on plastic waste.Features:Includes 2 brand new, sealed Brita replacement filters so you are ready to go for months.Large capacity size—fits comfortably on a standard refrigerator shelf or kitchen countertop.Easy-fill flip lid design for quick top-offs under the tap.Thoroughly washed, sanitized, and clear of any hard-water marks.",
    payment: "Cash or Zelle accepted. Pickup only from Jamaica Plain",
    media: [
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/704570478_2149525922561262_1442787506664340501_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=111&ccb=1-7&_nc_sid=247b10&_nc_ohc=XMkuYxUuhZ0Q7kNvwHsNmgW&_nc_oc=AdrVGBxEnnUAQOI1GXroEf2zA88yeL_fW-TNhm-6LdLKGf5nu8uoOdEiif3wZIsSe7ADnZ67k5roMv6sQ0CQBBhk&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=EmME8IgFdiOEgl_dBusVDQ&_nc_ss=7b2a8&oh=00_Af6GTIlPStjlN_5o4N8BGRGWJm1ltOmb3XD7Y37-X7SUMw&oe=6A1282EB" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/702611495_1631787224784045_230887859561084942_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=104&ccb=1-7&_nc_sid=247b10&_nc_ohc=5wk-xY64wKgQ7kNvwGYZdFc&_nc_oc=AdpAizEhc4EQUuxsgvr6yKlQXK12yv6oPRLwtznXy-vmv0fk-RnEgNk9G5zG0BW2CzuO5kXoQt_e5ERwK869hqj9&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=EmME8IgFdiOEgl_dBusVDQ&_nc_ss=7b2a8&oh=00_Af6HJEMcabYh1TatmfoEpa9b2KETeGy0Ls656Dntv6JLXw&oe=6A128BEF" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/704666694_1406920854577264_6227710527118473719_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=109&ccb=1-7&_nc_sid=247b10&_nc_ohc=-ApIn56x1eAQ7kNvwHFV41S&_nc_oc=Ado1hYI44IuuqvatOsajpBfUi06K2KzZ7HwYPlwYDm5WIB4jDGgbDu1PSmMl2jbDe8PPW510FB870m2aqqo8SEOp&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=EmME8IgFdiOEgl_dBusVDQ&_nc_ss=7b2a8&oh=00_Af7_Oi99bmzj4cvClXYOQSdQO9H3lpQp4QM6yJsKsyz49w&oe=6A129951" },

      // { type: "image", url: "https://raw.githubusercontent.com/username/repo/main/images/table.jpg" },
    ],
    sold: false,
  },
  {
    id: 3,
    title: "JIFAR 1080P Support WiFi & Bluetooth Projector + Adjustable Stand",
    category: "Electronics",
    price: "$50",
    description:
      "Selling a complete home theater movie projector setup, including a dedicated adjustable projector stand. Perfect for outdoor movie nights, gaming, or a bedroom cinema setup! \n Wireless Screen Mirroring: Features built-in high-speed WiFi. Instantly mirror your iOS or Android smartphone or tablet screen without needing annoying adapter cables.\n Bluetooth & Built-in Sound: Equipped with stereo surround speakers for crisp audio, plus Bluetooth connectivity to easily link your favorite ",
    payment: "Cash or Zelle accepted. Pickup only from Jamaica Plain",
    media: [
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/704527344_1784530156318265_1013118755388509038_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=105&ccb=1-7&_nc_sid=247b10&_nc_ohc=Nwd_QGRA2fMQ7kNvwELvXIQ&_nc_oc=Adq9Lyl1THTx11Jqa5JoY_6ZNdxwSirHM-CJnMPuFJnkLzTqLT7kMod_DqV71mqu25ZCmkd4gwNC0oMMtuAkROap&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=K8qXOj34RBfCqEQ7MykuIA&_nc_ss=7b2a8&oh=00_Af6bkKn9NoHVqaRCbR2i1eSJIHDwr9GQkpRPWE-2Kt5goQ&oe=6A12A137" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/704386764_1472589327322568_4864773071888008765_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=103&ccb=1-7&_nc_sid=247b10&_nc_ohc=KMdIZSqUeCEQ7kNvwFz9tcc&_nc_oc=Adr7E9jRs3pbHVyd_CZaLu7lkVlOUq0Z5JETYEhbKMcutFt-IgEHE2KUyhQtRWc64pnnsNcDIBQ2xLkMKRDBF0bQ&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=K8qXOj34RBfCqEQ7MykuIA&_nc_ss=7b2a8&oh=00_Af7-DAZFNC0u04wz09uiAZ3wKoGmAI7SnIycmvkwXAo9GA&oe=6A12821D" }
      // { type: "image", url: "https://raw.githubusercontent.com/username/repo/main/images/almirah.jpg" },
    ],
    sold: false, // 
  },
  {
    id: 4,
    title: "HOME OFFICE WORKSTATIONS – Compact Desk and Chair",
    category: "Furniture",
    price: "$35",
    description:
      "Space-saving, efficient black study desk. Ideal for smaller spaces, bedroom corners, or a dedicated secondary workstation. Includes an integrated side fabric storage organizer. \n Dimensions: 31.5” L x 19.75” W x 29.75” H \n High-quality Neo Chair ergonomic office chair. Features a breathable mesh backrest for airflow, built-in lumbar support, a plush cushioned seat, and smooth-rolling caster wheels. Fully adjustable height with pneumatic lift. It’s clean and in excellent mechanical condition.",
    payment: "Cash or Zelle accepted. Pickup only from Jamaica Plain",
    media: [
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/702374870_977733071527348_2712113796251417220_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=104&ccb=1-7&_nc_sid=247b10&_nc_ohc=UJm1oz16K0oQ7kNvwH909LC&_nc_oc=AdptupF4lERbIB4kMozjrtEEGp1oUJpraJ52TlmbtbUjap4UyX8sP-Wf_ynqoG6Tkf3_2gzRedDrh_8lgZDq9PJu&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=im3kf_eGwT0EUbDdcbAK0w&_nc_ss=7b2a8&oh=00_Af5tecwpxB0Dp_l0PEPSDjN2Hq937MkvZni73wJ5unLxKg&oe=6A128D53" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/703744979_1746914326679646_7379005611228069320_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=106&ccb=1-7&_nc_sid=247b10&_nc_ohc=U3mtkeqs_5oQ7kNvwHT_nD6&_nc_oc=AdqpXGxZb5Nt-Qyjbk6SKQdkQfY5o6X4hQis1gTEFiReyf8NmgYM-eRMNRMWWLLecbzebw0vONhiWc-vFSTOUlLD&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=im3kf_eGwT0EUbDdcbAK0w&_nc_ss=7b2a8&oh=00_Af67Tbo5edetPzZQUzmv-h5FwNRLxcSVVqRuAM225cBTag&oe=6A129606" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/702450409_1495236165667245_3382925318961410229_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=100&ccb=1-7&_nc_sid=247b10&_nc_ohc=dmbKtTns5GsQ7kNvwHHcONZ&_nc_oc=Adrt3rqvRYW8y1Ts-RGJcMwsDIAfq4XhdLdyTEfECbeuLBnEBTX9Iya926XYXmdZgxMNC2OVaO5iHYjIWxnS_had&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=im3kf_eGwT0EUbDdcbAK0w&_nc_ss=7b2a8&oh=00_Af70nR9XNcdtR8T79wfdBoMkcs3MddXJ-Jp2UXd70ftd8A&oe=6A127F1C" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/702374111_969825839111110_8916721371859281795_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=102&ccb=1-7&_nc_sid=247b10&_nc_ohc=0ti3fzP4jtAQ7kNvwG_jcRG&_nc_oc=Adq_I4K8YQtmHmRZJpp4xVQdHk-kjwmVRkCQp3GX_mjN4oh6sdrAdLZ7ejLWcqoUWZ0CpF7evcmLlujKs8I9Atkv&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=im3kf_eGwT0EUbDdcbAK0w&_nc_ss=7b2a8&oh=00_Af4T_wolCFylNWWdUiJmgECys4zzt4FKs1C3rC6UspD67w&oe=6A128492" },
      // { type: "image", url: "https://raw.githubusercontent.com/username/repo/main/images/sony-xm3.jpg" },
      // { type: "video", url: "https://raw.githubusercontent.com/username/repo/main/videos/headphones-demo.mp4" },
    ],
    sold: false,
  },
  {
    id: 5,
    title: 'HOME OFFICE WORKSTATIONS – Large Desk Ergonomic Chair',
    category: "Furniture",
    price: "$45",
    description:
      "Minimalist and sturdy black writing desk with a clean work surface. Offers plenty of room for a laptop, external monitor, and desk accessories. Features a sleek black metal frame with an integrated side fabric storage pocket for notebooks and files.\n Dimensions : 47.5” L x 19.75” W x 29.75” H \n Features a breathable mesh backrest for airflow, built-in lumbar support, a plush cushioned seat, and smooth-rolling caster wheels. Fully adjustable height with pneumatic lift. ",
    payment: "Cash or Zelle accepted. Pickup only from Jamaica Plain.",
    media: [
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/701495747_1355734373037943_2453828241080429929_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=111&ccb=1-7&_nc_sid=247b10&_nc_ohc=woS6Y6z1IWUQ7kNvwF47N9m&_nc_oc=AdpFgcNIQXQOEamCR8iNTDyqLyLIb_M2K9fDoV5HBR5vDsCG4E-BoQYS_jjcmuJI3-BWb_oaK5CLkP8DX1nRN9rk&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=lltcMD8WmOQ5MxKgsfJaTQ&_nc_ss=7b2a8&oh=00_Af6o9PkBNBJQmjaMW9bZQrfnf1TIP5JLY9kOgiZJUobpPQ&oe=6A127FEE" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/700697900_26812758975055198_4425817686669118309_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=109&ccb=1-7&_nc_sid=247b10&_nc_ohc=QTy6GWZGYfsQ7kNvwE02BBs&_nc_oc=Adp37Dgmt_oZUYhKhf8zqxEU6VPRrbFNR4Knit8lAcMJd5sm-biVya1ntWppqat9w6Rqj5HQIZVXyGU7GaXS_GLb&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=lltcMD8WmOQ5MxKgsfJaTQ&_nc_ss=7b2a8&oh=00_Af40AM3uHHAOIfJp0TrHihpHOWvU2wzK5N7SMw2-TyO3KQ&oe=6A128091" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/701008546_1292978832943982_1593592641861003141_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=103&ccb=1-7&_nc_sid=247b10&_nc_ohc=Ezjo-0ahAfIQ7kNvwF8bVyr&_nc_oc=AdpiPOolw5QlcBh-TaGyWxoFm62wP5w1JsnAj3PH7kyV8NJnKzprEuOtmpIEsFuhMUcOCfipH4McHb2yazSefe4z&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=lltcMD8WmOQ5MxKgsfJaTQ&_nc_ss=7b2a8&oh=00_Af7Gre_q-kjiAh5cTSKASPyuaPKuFL3eEpw1JXDflbkX7g&oe=6A1287D7" },
      // { type: "image", url: "https://raw.githubusercontent.com/username/repo/main/images/mi-tv.jpg" },
      // { type: "youtube", url: "https://youtu.be/dQw4w9WgXcQ" },
    ],
    sold: false,
  },
  {
    id: 6,
    title: "Complete Queen Bedroom Bundle (Frame, Mattress, & Linen)",
    category: "Furniture",
    price: "$180",
    description:
      "A complete, ready-to-sleep queen bedroom setup. Ideal for a guest room or someone moving into a new apartment. The mattress is incredibly comfortable, clean, and has been kept in a protective cover. \n Includes: \n 1. Queen Size Mattress - Zinus Green Tea \n Condition: Excellent, clean condition. Very comfortable, supportive, and has always been kept in a clean environment. No stains, rips, or sagging. 2. Sleek Black Wooden Bed Frame & Headboard \n Description: Sturdy, minimalist black wooden bed frame with a matching low-profile headboard. Solid construction that doesn't squeak or wobble \n Storage: Offers great under-bed clearance, perfect for hiding storage bins or luggage.\n 3. White Bed Skirt: Includes the crisp white fabric bed skirt (shown in photos) to cleanly hide the frame legs and any under-bed storage.\n . Pillows + Covers: Includes 2 standard-sized plush bed pillows. Comes with the two floral/botanical pattern pillow shams/covers pictured. \n 5. A Mattress Cover/ Protector \n Dimensions - Fits standard Queen Size (60”W x 80” L) ",
    payment: "Cash or Zelle accepted. Pickup only from Jamaica Plain..",
    media: [
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/702099350_2057788101830198_2176073813021024457_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=109&ccb=1-7&_nc_sid=247b10&_nc_ohc=8TS_hYZzwXMQ7kNvwGQCNRo&_nc_oc=AdotQIalNmkxsuXNSkoQm2kBvnB_lhHUCSobxwFSXeYMC57XREn4zpD0hjMrHqZLzoRO2iLvtZDdv2DKS5eDg0OA&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=jD1pk2SB3UpwrWyepcXPow&_nc_ss=7b2a8&oh=00_Af5pAOqGNibsdqHGAFFQcJFN-0geYx9kTdhybCpmY70ZEA&oe=6A1286C2" },
      // { type: "image", url: "https://raw.githubusercontent.com/username/repo/main/images/kitchen-1.jpg" },
      // { type: "image", url: "https://raw.githubusercontent.com/username/repo/main/images/kitchen-2.jpg" },
    ],
    sold: false,
  },
  {
    id: 7,
    title: "Twin Mattress & Comforter Set",
    category: "Furniture",
    price: "$60",
    description:
      "Perfect setup for a daybed, kid's room, or student apartment. The mattress is clean, sanitized, and comes from a smoke-free, pet-free home. \n Includes: \n 1. Twin Mattress: Clean and supportive \n 2. Black Twin Comforter: Warm, lightweight, and freshly washed. 3. One Fitted Sheet: Perfect matching fit for the mattress with the Pillow covers \n 4. Two- Sleeping Pillow: Includes a matching pillow cover. \n 5. A Mattress Cover/ Protector ",
    payment: "Cash or Zelle accepted. Pickup only from Jamaica Plain.",
    media: [
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/701612152_901431132907897_5765282186693860052_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=107&ccb=1-7&_nc_sid=247b10&_nc_ohc=nE3rPAXUD0YQ7kNvwE0NwrV&_nc_oc=AdqnWtL63-XZITpSvLHOucwderu-GLMCAmsePA-ukWnsBufuTMhO0zH9FmftiNJyMQ1oZF1u0tjtZ1oW2iKTCER0&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=jD1pk2SB3UpwrWyepcXPow&_nc_ss=7b2a8&oh=00_Af6w1Sc_00wk-xOQwA27OFl5egvi20GAQLD1mZv0nSjpnA&oe=6A1290D7" },

      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/702176679_1327119802852829_2363501950773211437_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=100&ccb=1-7&_nc_sid=247b10&_nc_ohc=drz2T15fQBsQ7kNvwEuZEcP&_nc_oc=AdpC3KBlKjYvPKiuGsZ0H1c2Ih9fFUr8GPUQq1nm3MgG7iO5f_HkcDIFwkcYaVm7OW2bNn8P9QPz3hzANwgfepEB&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=jD1pk2SB3UpwrWyepcXPow&_nc_ss=7b2a8&oh=00_Af4DygvxmAZJNddF1dFF8nOO_TQMh7NxnLDbNwRkGylXRw&oe=6A129225" },
      // { type: "image", url: "https://raw.githubusercontent.com/username/repo/main/images/kitchen-2.jpg" },
    ],
    sold: false,
  },
  {
    id: 8,
    title: "Twin Mattress & Pillow Set",
    category: "Furniture",
    price: "$30",
    description:
      "An extra twin mattress perfect for guests, trundle beds, or a quick floor setup. \n Includes: \n 1. Twin Mattress: Clean, comfortable, and well-maintained. \n 2. Bedding set with Sheets and Pillow Shams  \n 3. A Mattress Cover/ Protector ",
    payment: "Cash or Zelle accepted. Pickup only from Jamaica Plain..",
    media: [
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/702176679_1327119802852829_2363501950773211437_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=100&ccb=1-7&_nc_sid=247b10&_nc_ohc=drz2T15fQBsQ7kNvwEuZEcP&_nc_oc=AdpC3KBlKjYvPKiuGsZ0H1c2Ih9fFUr8GPUQq1nm3MgG7iO5f_HkcDIFwkcYaVm7OW2bNn8P9QPz3hzANwgfepEB&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=jD1pk2SB3UpwrWyepcXPow&_nc_ss=7b2a8&oh=00_Af4DygvxmAZJNddF1dFF8nOO_TQMh7NxnLDbNwRkGylXRw&oe=6A129225" },
      // { type: "image", url: "https://raw.githubusercontent.com/username/repo/main/images/kitchen-1.jpg" },
      // { type: "image", url: "https://raw.githubusercontent.com/username/repo/main/images/kitchen-2.jpg" },
    ],
    sold: false,
  },
  {
    id: 9,
    title: "Mid-Century Modern Blue Velvet Sofa/Couch",
    category: "Furniture",
    price: "$60",
    description:
      "A gorgeous, incredibly comfortable 3-seater sofa in a rich blue velvet finish with tapered wooden legs. Perfect statement piece for a living room. Cushions are plush and hold their shape well. Minor normal wear, no stains or tears. \n Dimensions: L - 77 inch W - 33.5 inch H - 32 inch ",
    payment: "Cash or Zelle accepted. Pickup only from Jamaica Plain..",
    media: [
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/676770097_2183978202447404_4234086791420045626_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=105&ccb=1-7&_nc_sid=247b10&_nc_ohc=0FxjLRmry2kQ7kNvwFFnlKr&_nc_oc=AdrcywSJ-qJ5hPXSq9eAw4_qVp-PaJ8I5OxAsQqST8XhPZ5LXN4sciSRPojCXWTNpmCtlk5T_aO78BlgaYW8LX7n&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=85wbL9SsKjHgpS97CZBGlA&_nc_ss=7b2a8&oh=00_Af6hhpayygcvbjMOBh_-03nOiiy8hnJX0ZUGxHGfigaPyA&oe=6A12A169" },
      // { type: "image", url: "https://raw.githubusercontent.com/username/repo/main/images/kitchen-1.jpg" },
      // { type: "image", url: "https://raw.githubusercontent.com/username/repo/main/images/kitchen-2.jpg" },
    ],
    sold: false,
  },
  {
    id: 10,
    title: "FUNCTIONAL HOME ESSENTIALS - Foldable Lightweight Grey Storage Ottoman",
    category: "Furniture",
    price: "$10",
    description:
      "A clever, space-saving double-duty piece. It serves as a comfortable footrest or extra seat, but the lid lifts off to reveal deep hidden storage for blankets, pillows, or books. Folds completely flat when not in use. Clean and sturdy finish.",
    payment: "Cash or Zelle accepted. Pickup only from Jamaica Plain..",
    media: [
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/702545121_993031619848410_273377366738584523_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=104&ccb=1-7&_nc_sid=247b10&_nc_ohc=vFX_qocyIqoQ7kNvwFjKzQw&_nc_oc=AdrcpGGvWzraUrbOv1dLzEaoevn2k8Fbfxesp0M49w4ds9s0id3KlMhhBvbiFLlNtlrLzomMVY7sWei98ZpJTUOt&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=ihSpW1TDgJ3j5ds57S6xog&_nc_ss=7b2a8&oh=00_Af52TMxJyHNTQLsFd7Vkzam_FKMTLlI2vcv0jvOpidDnVA&oe=6A12AE85" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/702364234_1675396603603372_7648681445196445885_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=106&ccb=1-7&_nc_sid=247b10&_nc_ohc=kmurPeDk1YoQ7kNvwFRA1fz&_nc_oc=Adrp-0mk2PIc-nyKnQ8AFLe5xZnRt9LEUR2KUjjPjIErbPZuWFnqTYz1XCUuiGkpTyXELNnu7Ew4MTotlFU7q3G7&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=ihSpW1TDgJ3j5ds57S6xog&_nc_ss=7b2a8&oh=00_Af6gM2fMDU98vr0hVvQLw1UOiuIc3z2iL1hOYDolul93Jg&oe=6A12B1C6" },
      // { type: "image", url: "https://raw.githubusercontent.com/username/repo/main/images/kitchen-2.jpg" },
    ],
    sold: false,
  },
  {
    id: 11,
    title: "FUNCTIONAL HOME ESSENTIALS- Premium Brown Woven 2-Compartment Laundry Basket",
    category: "Furniture",
    price: "$15",
    description:
      "Large, elegant espresso-brown woven laundry hamper. Features a built-in central divider creating two separated pockets to sort your lights and darks effortlessly. Includes dual side carrying handles and a tidy flip-top lid. ",
    payment: "Cash or Zelle accepted. Pickup only from Jamaica Plain..",
    media: [
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/701798894_2076989483160823_3821676266686203418_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=107&ccb=1-7&_nc_sid=247b10&_nc_ohc=pRZpH6FaRMEQ7kNvwG5CR2e&_nc_oc=AdpkpLQJcej9PcRARvTK36eBs6nQsglGQyyOzndmQlA6Z2NS6uOa_1ILWwIl1Co6h9v-lehcD5voXQLcD9YZorba&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=ihSpW1TDgJ3j5ds57S6xog&_nc_ss=7b2a8&oh=00_Af7SWRrrqAu9Xyqg1ixXVRzebTJIXd6O62ji66X8Nfp2sw&oe=6A128B39" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/701914636_1495611772041152_3486481911237835203_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=100&ccb=1-7&_nc_sid=247b10&_nc_ohc=oNo35uRZycQQ7kNvwEDrFpK&_nc_oc=AdqeeMBzRQrfpz2aGMrEsNvxNoEpjtVFSIyv1Lu6t1uSbLZObU-hp22M85Hnp5wEp8dt48fA6Jf3Ii3Tg-MkDj_m&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=ihSpW1TDgJ3j5ds57S6xog&_nc_ss=7b2a8&oh=00_Af4f-KkfLrSkZ9vYmW5z4FigUstoxQs8De_TyGwB_PzjQg&oe=6A12B46A" },
      // { type: "image", url: "https://raw.githubusercontent.com/username/repo/main/images/kitchen-2.jpg" },
    ],
    sold: false,
  },
  {
    id: 12,
    title: "FUNCTIONAL HOME ESSENTIALS - Sculptural White Ceramic Table Lamp",
    category: "Furniture",
    price: "$15",
    description:
      "Trendy, geometric white ceramic base lamp with a classic cream linen shade. Adds a warm, modern aesthetic to any nightstand, desk, or side table. Working lightbulb included. ",
    payment: "Cash or Zelle accepted. Pickup only from Jamaica Plain..",
    media: [
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/701745846_991370570500902_7861831323957018074_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=101&ccb=1-7&_nc_sid=247b10&_nc_ohc=lO4nVuG1RKUQ7kNvwFsFnYk&_nc_oc=AdqUbJroftnf4yw1S1F7J7IxilKu6w2tCHb6_RSoD5RrNGSdNCEXvFk4dCPQ6hoY0l8ogKNb8k5F1y4J5-_-l36v&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=ihSpW1TDgJ3j5ds57S6xog&_nc_ss=7b2a8&oh=00_Af7FG-4KAEqzCTp-iM0mGPns7VuY3kVipvVhwyPxZngc9w&oe=6A12827E" },
      // { type: "image", url: "https://raw.githubusercontent.com/username/repo/main/images/kitchen-1.jpg" },
      // { type: "image", url: "https://raw.githubusercontent.com/username/repo/main/images/kitchen-2.jpg" },
    ],
    sold: false,
  },
  {
    id: 13,
    title: "FUNCTIONAL HOME ESSENTIALS - Honeywell Digital Ceramic Tower Space Heater",
    category: "Furniture",
    price: "$20",
    description:
      "Oscillating Honeywell ceramic space heater with digital thermostat display, precise temperature controls, and built-in safety timer settings. Powerful, quiet, and warms up a room incredibly fast. ",
    payment: "Cash or Zelle accepted. Pickup only from Jamaica Plain..",
    media: [
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/698856848_1345374990766157_2502566289954621995_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=109&ccb=1-7&_nc_sid=247b10&_nc_ohc=YcZRd9FC3wIQ7kNvwEdGzdj&_nc_oc=AdqhfVCEl9CqA3wrXa6GTPTbuGN3Dnoy6omSoDF7i9mzrFIekHNRDpvWxoLrSHR0UDPn07B-kHSmN_ieo0tjrAT-&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=ihSpW1TDgJ3j5ds57S6xog&_nc_ss=7b2a8&oh=00_Af4cYTzOcEqtK3CN0QelnmFfPgbisR3mpz3CckNa-33tbg&oe=6A1283F0" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/698854320_1575682300567231_4410294435225926421_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=105&ccb=1-7&_nc_sid=247b10&_nc_ohc=LEgt-PO6k7UQ7kNvwFrKLVQ&_nc_oc=AdqflIYR4mBbAxSeSM7JXuU8MqDmEQhT_Lra3hf2g1gzPIPgNAaPvo0FQhloml0rktwlx0PJOCrvMU_ChSYcdnp7&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=ihSpW1TDgJ3j5ds57S6xog&_nc_ss=7b2a8&oh=00_Af4GDbsVasWv9oMk5Ij4KlscH11US8keuW4Zxh7o5Znuvw&oe=6A129589" },
      // { type: "image", url: "https://raw.githubusercontent.com/username/repo/main/images/kitchen-2.jpg" },
    ],
    sold: false,
  },
  {
    id: 14,
    title: "FUNCTIONAL HOME ESSENTIALS - High-Density Vibrant Green Yoga / Fitness Mat",
    category: "General",
    price: "$20",
    description:
      'Superior Comfort & Support: Extra-large (71" x 24") and 1/2-inch thick high-density foam yoga mat provides cushioned support for spine, hips, knees, and elbows on hard floors. \n Non-Slip Safety: Double-sided anti-slip surface ensures maximum grip and stability during yoga, pilates, and other workouts to help prevent injuries \n Easy to Clean: Moisture-resistant material makes it quick and simple to wipe clean with soap and water after use \n Lightweight & Portable: Includes a convenient carrying strap; easy to roll up, tie, and take anywhere—from home to the studio or gym \n Durable & Resilient: Designed to withstand daily use while maintaining shape and performance for long-term reliability',
    payment: "Cash or Zelle accepted. Pickup only from Jamaica Plain..",
    media: [
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/676772011_1339077324815399_1126292373450848144_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=107&ccb=1-7&_nc_sid=247b10&_nc_ohc=Y9wjVnntFGIQ7kNvwGXnrh1&_nc_oc=AdpEu1C4tUBLteONIroPkLW1EV_WYiHpdml409BPuaWJF74OWMi9Lpd5oxJ0InC8YG1MIEclDcaantUKF_5yTOub&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=ihSpW1TDgJ3j5ds57S6xog&_nc_ss=7b2a8&oh=00_Af5-TC0TEkeHeWftITcNpeu6m4THEG8uRcTklFRJBMawGg&oe=6A129D9E" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/701941730_969808822128175_5488993180386950386_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=107&ccb=1-7&_nc_sid=247b10&_nc_ohc=0zrA0hFMjwcQ7kNvwFO-AHc&_nc_oc=AdqGrT0-KGx-R5XhAWQ9RLPWkMzBaOAk8bmrnNMemrd1jxdJOW4gyeeRV030EBD6-7i4Yggv05M96mRrnJrjIuuE&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=ihSpW1TDgJ3j5ds57S6xog&_nc_ss=7b2a8&oh=00_Af7NXjQd1Rlp4W-72zxYqkUEyRbuP4FCHuUXiVRR5e0TWA&oe=6A12A9A2" },
      // { type: "image", url: "https://raw.githubusercontent.com/username/repo/main/images/kitchen-2.jpg" },
    ],
    sold: false,
  },
  {
    id: 15,
    title: "Set of Green Summer Planting Pots / Garden Planters",
    category: "General",
    price: "$10",
    description:
      "Selling a set of vibrant green planting pots, perfect for your summer gardening projects! Great for indoor houseplants, balcony herbs, or patio flowers.Beautiful, matching green color palette that adds a lively pop of color to any windowsill, desk, or patio. Lightweight, durable construction that holds up well under outdoor summer sun. Includes proper drainage features to keep your plant roots healthy. Fully cleaned out, free of old soil, and ready for fresh potting mix!",
    payment: "Cash or Zelle accepted. Pickup only from Jamaica Plain..",
    media: [
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/704507111_1492494912613720_4177073779314458195_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=100&ccb=1-7&_nc_sid=247b10&_nc_ohc=pSAkU7a5RaMQ7kNvwGcvOQD&_nc_oc=AdoUL2DGTUxjYSQEi2VRVitxAJF-VOLKvJBb66G3s0zUm_t-oK7bSGwww3f45VwEA5ZmlOhYU2c5mBRQxPXXJknJ&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=EbkxClsZwa2TnPFRFqYGLQ&_nc_ss=7b2a8&oh=00_Af7kicpQ6ZuRSneCiAzQhcI7Ec-mOw_3Okv5xuS8iIkWPA&oe=6A129C76" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/704731122_2530173424104065_2851166817241701399_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=108&ccb=1-7&_nc_sid=247b10&_nc_ohc=QMpckABaCQUQ7kNvwFBQXcT&_nc_oc=AdrbUuG5EM3jTHRd5FhMBNACWhjK8FMBq3MWwGf62VU_7lxRxMTYqU3_lTmMqPvjNOp5IZSSmLt7FlRMhUcFFCl7&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=EbkxClsZwa2TnPFRFqYGLQ&_nc_ss=7b2a8&oh=00_Af4Pj8fIkwzGQFvkjbs5rb8aLATFG8OKC4k_QYB_8MET7Q&oe=6A12805A" },
      // { type: "image", url: "https://raw.githubusercontent.com/username/repo/main/images/kitchen-2.jpg" },
    ],
    sold: false,
  },
  {
    id: 16,
    title: "Olsky Deep Tissue Massage Gun with Interchangeable Massage Heads",
    category: "Appliances",
    price: "$20",
    description:
      "Selling an Olsky deep tissue percussion massage gun in fantastic, clean condition. Ideal for athletes, post-workout muscle recovery, relieving shoulder/neck tension, or general deep muscle relaxation. Powerful percussion motor with adjustable speed intensity levels to match your pain tolerance. Comes with multiple removable massage gun-points/heads tailored for different muscle groups (bullet head for joints, fork for spine, round for large muscles, etc.). Rechargeable battery with long-lasting life per charge. Quiet glide technology so you can use it while watching TV without annoying noise. ",
    payment: "Cash or Zelle accepted. Pickup only from Jamaica Plain..",
    media: [
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/704666755_999570215937918_3012827474224765125_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=106&ccb=1-7&_nc_sid=247b10&_nc_ohc=FXLgnzRAZUkQ7kNvwERqTGw&_nc_oc=AdqmkJQQqB96wXteQaMhZsOcZh73wrjggv2Sb26X7iftrKt16AQshTgPYFqPV4PRIDIE3w81lRqHMj-UwoIZ7Snu&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=wXdhBzSuIZjoYzWm3HLFvg&_nc_ss=7b2a8&oh=00_Af5e2yx9a_KRUWnoDhZNegB8R1eLU2yFpmAABxB-qt83_w&oe=6A128706" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/704406690_1613480986386257_7047988428950626057_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=102&ccb=1-7&_nc_sid=247b10&_nc_ohc=LbhFnasrzX0Q7kNvwEV8MV3&_nc_oc=AdocI1xJx_dlLuS7WqTcyCD8MQXW-xMse790ncssLFcLexlJRcM2bzhIODBiT3jJM7YfXtExPwJ8G39hk-CSy4jt&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=wXdhBzSuIZjoYzWm3HLFvg&_nc_ss=7b2a8&oh=00_Af7VoL_fBSMf0CmXuxJedgNdsmQ_tMDpSLecKW-QidV26A&oe=6A128ABC" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/704426882_2260188091179679_3495117109338943116_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=104&ccb=1-7&_nc_sid=247b10&_nc_ohc=D6VDvMn78hgQ7kNvwG4S8KA&_nc_oc=AdoV4BHKZE9MqxtxwRBegakjZlLeF0qrmIoHnkNmEVwEj3ewCmrwtA5pjqKR4MMKQ8zJqDojHoUBrQBIyycxkjVY&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=wXdhBzSuIZjoYzWm3HLFvg&_nc_ss=7b2a8&oh=00_Af5BTiF36MAqlmK4_z7naSdpOIhGPaXUcngWRwC-Flav4A&oe=6A128EBE" },
    ],
    sold: false,
  },
  {
    id: 17,
    title: "Set of Multi-Size Clear Plastic Pantry & Fridge Storage Bins",
    category: "Storage",
    price: "$15",
    description:
      "Selling a matching set of durable, clear plastic storage organizer bins. These are absolute lifesavers for organizing your pantry shelves, cabinets, or refrigerator. Multiple Sizes: Set includes various dimensions to perfectly fit everything from spice jars and snacks to fresh produce or condiments. Crystal Clear Plastic: Fully transparent so you can instantly find exactly what you're looking for without digging through boxes.Sturdy, shatter-resistant, lightweight, and thoroughly washed/cleaned. ",
    payment: "Cash or Zelle accepted. Pickup only from Jamaica Plain..",
    media: [
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/704527301_822601797244411_6632608618748651201_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=103&ccb=1-7&_nc_sid=247b10&_nc_ohc=2uZunVvxrHYQ7kNvwFEh4-H&_nc_oc=Adrc8INRcR-B9-1A_3yHhOYH-C5KXEwVm0rNOWfKbPhFJjHNKxqdAz67_5G_eLf-ZpjQoGWBeZHp5-e8VereteJH&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=91PZ3FKGvv-q2Rz2sBCYRA&_nc_ss=7b2a8&oh=00_Af4ZfQziTZW2ixNM19_stVz6_TJQCNU8dYVaAIE4RISOXw&oe=6A129E7A" },
      // { type: "image", url: "https://raw.githubusercontent.com/username/repo/main/images/kitchen-2.jpg" },
    ],
    sold: false,
  },
  {
    id: 18,
    title: "6-Grid Rotating Grain & Lentil Dispenser with Measuring Cup",
    category: "Storage",
    price: "$20",
    description:
      "Selling a super convenient, space-saving 360-degree rotating kitchen grain and lentil dispenser. Perfect for organizing your countertop or pantry and keeping your ingredients fresh and easily accessible!6-Grid Storage: Features 6 separate compartments to store different lentils, pulses, rice, beans, or small grains all in one compact unit.One-Button Dispense: Simply rotate to the ingredient you need and press the button to dispense exactly what you want into the lower tray. Removable Lid: Easy to top off and fill from the upper lid. ",
    payment: "Cash or Zelle accepted. Pickup only from Jamaica Plain..",
    media: [
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/702162134_1497466988594205_650211736906741870_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=111&ccb=1-7&_nc_sid=247b10&_nc_ohc=d0XCqTOgC1oQ7kNvwFi3dFN&_nc_oc=AdrDWGov4hpd8dHZW8PgX4v1JjGiXYxTCw2xZPywMXUWLC4iI6g8dCanhrhUmzK7nM8W-2YVo3ED5e4gStIgpnGe&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=qWKC8mmixNMhhGGFa4i7Ug&_nc_ss=7b2a8&oh=00_Af4RtaI59af2ayfwijZ40egCf_DX-T2V_9GkyVzYaweQxA&oe=6A1293A6" },

      // { type: "image", url: "https://raw.githubusercontent.com/username/repo/main/images/kitchen-2.jpg" },
    ],
    sold: false,
  },
  {
    id: 19,
    title: "Set of Clear Glass Mason Jars / Storage Canisters with Lids",
    category: "Storage",
    price: "$20",
    description:
      "Selling a classic, clean set of clear glass mason jars/canisters. Ideal for food preservation, storing dry goods (like sugar, flour, oats, or coffee beans), or DIY kitchen projects.",
    payment: "Cash or Zelle accepted. Pickup only from Jamaica Plain..",
    media: [
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/704327273_35795837166727914_2319138932929976378_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=111&ccb=1-7&_nc_sid=247b10&_nc_ohc=hTRv7bfS7P4Q7kNvwGB2m-B&_nc_oc=AdpJf5MAFXWpGweKHj3M6uOAoL2YgU6Kv4PY6gi6exphNdIFqZtsGyC2xwuE0SWv8ZDWn-Cm8IIix5HQLunebjyS&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=mO7Mf_6yylihiEsj2LQmSA&_nc_ss=7b2a8&oh=00_Af7vPQu10bSFwZhslt5wBH8DyDDZaj3vPe-KwWKlw38Oag&oe=6A128CD2" },
      // { type: "image", url: "https://raw.githubusercontent.com/username/repo/main/images/kitchen-2.jpg" },
    ],
    sold: false,
  },
  {
    id: 20,
    title: "Quick Room Essentials & Decor (Dustbin, Mirror, Curtain Set)",
    category: "General",
    price: "$20",
    description:
      "A collection of highly useful, modern essentials to instantly upgrade a bedroom or bathroom setup. Everything is clean, fully functional, and ready to use. \n What's Included: \n 1. Sleek Black Slow-Close Dustbin \n 2. Complete Curtain Rod & Curtain Set \n 3.Modern Black Framed Mirror \n 4. Clean White Step Dustbin ",
    payment: "Cash or Zelle accepted. Pickup only from Jamaica Plain..",
    media: [
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/701940832_991582573256624_7976389228637667115_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=102&ccb=1-7&_nc_sid=247b10&_nc_ohc=ntHW_FkPjl8Q7kNvwGkSeHb&_nc_oc=AdqrHHECVACZRStRxCVBxhmWSfIKg_7W0XAq94Qm10CQYRYY6v9IjnjXAU0CLuLH5BFY0AF0jb64VUJSh3nua1lr&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=IRp5tQGUlCG-Q84-mdhUfQ&_nc_ss=7b2a8&oh=00_Af4JjcI8WKbIN3z43ByhMnjc_PBAH1yz-y_-v0VKvF-IqA&oe=6A12B479" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/702176701_1813493599629615_5857081528246744783_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=105&ccb=1-7&_nc_sid=247b10&_nc_ohc=kC5xBxekJD8Q7kNvwFCeyBj&_nc_oc=AdqaQIMBrKFDG1BlJk1IjpvHYKKDOYgp8RCQgw1peaqyc-eMt3vXHPwjgt0yPZtKktBODiwcHQvd7YamcOVTOGGY&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=IRp5tQGUlCG-Q84-mdhUfQ&_nc_ss=7b2a8&oh=00_Af48FLtFW2-5ij42LS8_YJLiGJoFwa0dD1vIW5L7U9dDGQ&oe=6A12A9ED" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/700687902_994767653403649_2338605341580236645_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=111&ccb=1-7&_nc_sid=247b10&_nc_ohc=SjVejxchFGsQ7kNvwGpRemS&_nc_oc=Adq2QGrzGqe2SvJqMWbdiMi9eMbSAhvO3J9ZyLj_e9VWNS_UB8pTiEz530Lxuk3zLRw4WsZ0pITlNkp9B8bRZhoQ&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=IRp5tQGUlCG-Q84-mdhUfQ&_nc_ss=7b2a8&oh=00_Af51NQpVpIgel7GfNchlMlpOxPHOs6D4DwqQls1GjlHrcA&oe=6A128984" },
    ],
    sold: false,
  },
  {
    id: 21,
    title: "Contemporary Black 3-Drawer Chest Set - 2 pieces",
    category: "Storage",
    price: "$60",
    description:
      "Sleek, modern black set chest of drawers with polished silver ring handles. Solid construction, perfect for a bedroom, living room , or extra storage..",
    payment: "Cash or Zelle accepted. Pickup only from Jamaica Plain..",
    media: [
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/701716555_2182084509281583_1578998214225822543_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=102&ccb=1-7&_nc_sid=247b10&_nc_ohc=fozJrwQ6gN4Q7kNvwGscUUD&_nc_oc=AdopX1CbEyNlXzH4S-tkxgPDFLHJ-y2v64CzqHMRVucgQ9ZFM8EMznLQxSDUFUPI8FI55bXWXyJHLaJiQ83yU6QI&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=vyhCXahvRXHKWY2lNDhd-w&_nc_ss=7b2a8&oh=00_Af5c7FSCjojPOMkrSIpWjK66enLPOYS6mVdh0oltUcYczQ&oe=6A128AEF" },
      // { type: "image", url: "https://raw.githubusercontent.com/username/repo/main/images/kitchen-2.jpg" },
    ],
    sold: false,
  },
  {
    id: 22,
    title: "Minimalist White 4-Drawer Tall Dresser and Modern White 1 Drawer Nightstand Set",
    category: "Storage",
    price: "$40",
    description:
      "Clean, bright white tallboy dresser. Features four deep drawers for plenty of vertical storage, finished with clear crystal-style acrylic knobs. Includes an open bottom shelf perfect for shoe storage or baskets.\n Missing the very top drawer knob in both \n ",
    payment: "Cash or Zelle accepted. Pickup only from Jamaica Plain..",
    media: [
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/698974015_1654738592398815_7910073028490360565_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=110&ccb=1-7&_nc_sid=247b10&_nc_ohc=Ut5wQN-l1HYQ7kNvwHKxvwr&_nc_oc=Adr0hSiLG4z457nHYdftj730JBDhi0fhShIbSF9XaAR86GxoLZsIz4zeZSF2In6fJEaiibqzwv8mKqgRf_HYO0iR&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=IlDtoEWa-HXufLzkeM8amw&_nc_ss=7b2a8&oh=00_Af7sln-kj6juc11VNqb5_RT2hxDioHXazSZmdh-Hsk3BVg&oe=6A12B6F1" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/704327280_1717598692762164_8424987484109573143_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=102&ccb=1-7&_nc_sid=247b10&_nc_ohc=raxdpCnciawQ7kNvwEIT6_Z&_nc_oc=AdqpPgRCYrvYM0g_23fx7wfHhWHVdMvLbapuujAhYOByVLjkn76QN0eK25VmBLDaAIoWOKzYfKw6dd3K3kZYweyx&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=IlDtoEWa-HXufLzkeM8amw&_nc_ss=7b2a8&oh=00_Af7OFBm_ZRC1YyF6hbwly4ToVeAZ3dR7rS00lZimP-xO-Q&oe=6A12A4FD" },
    ],
    sold: false,
  },
  {
    id: 23,
    title: "Seasonal Fall Bundle 🍁",
    category: "General",
    price: "$25",
    description:
      "Everything you need to make your space cozy for autumn and Halloween! High-quality, matching seasonal items in excellent condition. Ceramic Serving Bowl: Beautiful earth-toned glazed finish for Fall and Christmas.Fall Pumpkin Jar with Lid: Perfect for candy, candles, or countertop display.Hanging Pumpkin : Glass Pumpkin for keys or tealights. Two Faux Plants: One lush green summer style, one vibrant warm autumn/fall leaf style.Halloween/Fall Garlands & Accent Decor: Festive maple leaf strands Woven baskets : Aesthetic Fall Style Woven Baskets in different sizes.",
    payment: "Cash or Zelle accepted. Pickup only from Jamaica Plain..",
    media: [
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/701704999_1525059672561503_708453222381869399_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=111&ccb=1-7&_nc_sid=247b10&_nc_ohc=NH2hHdQ-ECUQ7kNvwG2DLuX&_nc_oc=Adp-WefY9HBxgbvbG6vNXdlcl_EfoQlWDSdlsVSNIrDWK0lh_f2WLuZ06LC3G3svXwr6_-YZsp4pDEdhBqi9bxRW&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=2A2tuUNowrjgn_yjVWkG_g&_nc_ss=7b2a8&oh=00_Af65_saBteNvuaJbygQA0coJa_4ShalL5d8fPa8enUEIYQ&oe=6A12A56F" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/701889108_4389054551309182_8827630320844709145_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=106&ccb=1-7&_nc_sid=247b10&_nc_ohc=wiRrwTWXpEIQ7kNvwHEwCrU&_nc_oc=AdoBLHTLBBRg3DdrW1ar1tI-oyAhQTCSvKeHWFp3FO6jp-xMJIaL_kTXNVQtbRZ87iUVwzD1OI5zCU56Mfg5GsYp&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=2A2tuUNowrjgn_yjVWkG_g&_nc_ss=7b2a8&oh=00_Af7xptCidZ0xHvx-1riP5vOSo1QnaWOGMYvfmy5pc-VDAA&oe=6A1295FC" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/702508886_26486690287666427_1737226558187899387_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=104&ccb=1-7&_nc_sid=247b10&_nc_ohc=tU3tuDor1wYQ7kNvwFxR7nR&_nc_oc=AdpFcieiUhxLqEUxcukpQt4l4IsiPdAU76unjy5982Bnv9qzgZPToP_IOjnQHuRGTDtTozMfLwZbj0vAPK1_ERsg&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=2A2tuUNowrjgn_yjVWkG_g&_nc_ss=7b2a8&oh=00_Af5lh5rGm-igtxSh80264OyvCJPuADjPTG-IlLVqeEAa_g&oe=6A129F9B" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/698834398_1537383914401252_5919431061802138024_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=101&ccb=1-7&_nc_sid=247b10&_nc_ohc=O8mjTvxg_7cQ7kNvwGN3p9k&_nc_oc=AdrXjVEAfCi8U0XzgOjs78XJYgMhGKkW90Gq0wcpozta3br62cQkBTRYU7Zk53w8u_2n-Fh8A3Vq5QgCK5MVhCA3&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=2A2tuUNowrjgn_yjVWkG_g&_nc_ss=7b2a8&oh=00_Af538Y-gRy8zT2X33pIZb4HW8ZV3YrpYNLN3dSB9GnHjag&oe=6A129E10" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/702624888_1486526236606786_5005040015338067872_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=108&ccb=1-7&_nc_sid=247b10&_nc_ohc=XC8JmdanqyIQ7kNvwHOhI_-&_nc_oc=AdpUnloHDwdg6PPracB9BwFucgesojljCD9ovEgAr-6_TyRP-Hpv3tdp8SRaTEDhSz8uAmcoHcJkXJtTURl20J8n&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=2A2tuUNowrjgn_yjVWkG_g&_nc_ss=7b2a8&oh=00_Af7wJgVP9gFMcP3zvYT981ftq6GwEuC57MIMwM0YFJWSpQ&oe=6A12AB45" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/701889110_1291813829197093_3451490363708538226_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=111&ccb=1-7&_nc_sid=247b10&_nc_ohc=Cr7iFNjHn4QQ7kNvwFkGq7R&_nc_oc=AdpXYpVjFPHBfECBONYgxk_pnU1hlQ1fcn07slyg95bAFI0Ns7lMxL4vxTvBh64oQrKdWZw5Q1bnzfAM8fB6cdh7&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=T96QIzGvLmXF6zE_ezWejA&_nc_ss=7b2a8&oh=00_Af4oQ4hGVRMqBTaRMi1cXmawYaRSHw-x9lWVd0jOTYJl3A&oe=6A12BD79" },
    ],
    sold: false,
  },
  {
    id: 24,
    title: "Apartment Essentials & Furniture Bundle",
    category: "General",
    price: "$15",
    description:
      "Elegant Tall Black Ceramic Floor Vase with fake plant : A gorgeous, sleek white ceramic statement vase with a beautiful modern silhouette. Looks amazing standing on the floor in a corner or entryway to add instant height and style to a room. \n Multi-Tier Over-the-Door Shoe Rack : A massive space-saver! White metal and mesh construction that hangs effortlessly over any standard door to neatly organize dozens of pairs of shoes without taking up precious closet floor space. \n Portable Bed & Sofa Lap Desk: A super convenient, lightweight portable tray table with folding legs. Features a smooth wood-grain surface with an integrated tablet slot, a cup holder, and a side drawer for pens or cables. Perfect for working from bed or lounging on the couch.\n Minimalist Small Brown Accent Side Table: A clean, compact square wooden side table. Perfect height to place next to a sofa, bed, or armchair to hold coffee, books, or a lamp.\n Industrial Accent Bar Stool :A stylish bar-height stool featuring a warm wooden top seat and a sturdy black metal frame with an integrated footrest ring. Perfect for a kitchen island, high counter, or bar table.",
    payment: "Cash or Zelle accepted. Pickup only from Jamaica Plain..",
    media: [
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/702190507_1718089935884801_5256362851631426655_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=111&ccb=1-7&_nc_sid=247b10&_nc_ohc=U7pxTEsckH0Q7kNvwESQFSz&_nc_oc=AdqLM1yD2kPEjlgRsrewKBlejuPPdZxEovbh82mK-EI29Mu-K4OUDzbW3J_JmgtcU7gUKzV7Yxy1oFKlLnFa0Qkr&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=nXAMGKOOPh7KVKg70z7-qQ&_nc_ss=7b2a8&oh=00_Af7XZjYrw3OIYQdL58N4qm4F92xWi4G_HJrEpCeyUYtBhQ&oe=6A12B123" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/702162105_1622748878799918_3178471723723930313_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=103&ccb=1-7&_nc_sid=247b10&_nc_ohc=f_at9rP2xpwQ7kNvwEiaxRU&_nc_oc=AdrVbkPAyX4THWm-CHi1-STzr7W6KvQa1TfTJkbVfo8j-80t7ipgGmZM_D-pGE-Ilve6C-W_zn_037uxZPfNd9AT&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=nXAMGKOOPh7KVKg70z7-qQ&_nc_ss=7b2a8&oh=00_Af5VVDzuDmiH7xIB1NNC_izKg0R5UaW3RexoP3WR2s25HA&oe=6A128B83" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/702089395_969825435817206_8875388162388310393_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=108&ccb=1-7&_nc_sid=247b10&_nc_ohc=zWSAkoEJpJ0Q7kNvwFTVTxy&_nc_oc=Adq72wUsm3buWfCP-usTnNnV_sEivvsIxqcWj9fuPwiD13lp_B-lR9YH4kUmtYruRuWWoEKascjB-vpYPKiHr_wZ&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=nXAMGKOOPh7KVKg70z7-qQ&_nc_ss=7b2a8&oh=00_Af6bhaQmlVV0GBgCvmHnsGUNJHd7RkXsgQvsZCcLnheq7A&oe=6A12A93C" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/702099349_981595687787726_3771087229438215514_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=110&ccb=1-7&_nc_sid=247b10&_nc_ohc=AjgKpxQEV0MQ7kNvwFkDXto&_nc_oc=AdqGWOAj3Wa9ZJwdVyeEM0TF14xdHC9syGACL5d6lcASd7t8hHGRVUKCD_zskglsqff0XU0HeGG4AQdbLO_4f7e6&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=nXAMGKOOPh7KVKg70z7-qQ&_nc_ss=7b2a8&oh=00_Af7tVn21qJRiqhg4XtyWVWTBhg0oSUg9ci95fvrC8YCDtQ&oe=6A12B4A1" },
    ],
    sold: false,
  },
  {
    id: 25,
    title: "COZY CHRISTMAS & HOLIDAY KITCHEN BUNDLE – Complete Accent Decor Set ! 🎄",
    category: "General",
    price: "$40",
    description:
      "What’s Included in This Festive Bundle:\n 1. Holiday Dining Table Runner / Hot Pot Insulation Mat \n 2. Premium Wooden Coaster Set with Matching Holder. \n 3. Premium Artificial Christmas Tree \n 4. Traditional Red & White Tree Skirt \n 5. Complete Coordinated Ornament & Decor Set",
    payment: "Cash or Zelle accepted. Pickup only from Jamaica Plain..",
    media: [
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/676775700_1000663262429282_2828284862986907552_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=105&ccb=1-7&_nc_sid=247b10&_nc_ohc=16tRwDaqOwAQ7kNvwEDC9jc&_nc_oc=AdoYMPy0TOgYhHCbH6wkTHjZaDVeCFwhePRN77VbPB_QUXfnbLz1JdBNLOvDmBM9O4wls2UGEHg01p9Qe0cubJ64&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=T96QIzGvLmXF6zE_ezWejA&_nc_ss=7b2a8&oh=00_Af7vkkd2WvY1-Xh2l3iII-MjAHEKv5YR06lpbzirtpUVxw&oe=6A129E39" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/700809958_1365791738697137_2665460278292280600_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=100&ccb=1-7&_nc_sid=247b10&_nc_ohc=l68GdOCIBhMQ7kNvwF-q_XR&_nc_oc=Adp3CA_L3hE_B6S0mBKXC_ANIEzbO29IuzhATNAgEpyApRGYkgIbd8FxFPUYqvA-k-Qa53ISGFjw50m7IRieaj0R&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=T96QIzGvLmXF6zE_ezWejA&_nc_ss=7b2a8&oh=00_Af6WNb0ZAHnkV5_FEhLDq_UttYHyRJK6M5CSWoGH7P3IaQ&oe=6A12BBD6" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/702084040_2277641416407050_6991300121649517589_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=101&ccb=1-7&_nc_sid=247b10&_nc_ohc=yqGjMaNNp00Q7kNvwFx9pxe&_nc_oc=AdplSAFfKS5jHrYOH9af5bLONbZu5rAN_I0R5aSUbL0XJDhzkNIHzv2mQf2Ju8A7IH2mCsYby89ihYYILcvDnWQ5&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=T96QIzGvLmXF6zE_ezWejA&_nc_ss=7b2a8&oh=00_Af6mPFmSHbGIAplZ2sfGi5eP3xClnsHqdPmT5Y804vbUIg&oe=6A12C117" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/701700154_1340016217943691_4991859204509828477_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=111&ccb=1-7&_nc_sid=247b10&_nc_ohc=qTKd-z2H4goQ7kNvwF-d0FP&_nc_oc=Adot_i2vr19uAXcIrZRpqOfCS5spnGxs9LAiud_vQJY-ZTvCMczur-pFR1OgVMTWAIke6f1t5lRCf6whuIwZCas5&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=T96QIzGvLmXF6zE_ezWejA&_nc_ss=7b2a8&oh=00_Af4_qQrMcY1W49fp3_w37EE5neU24n7zL-lFUmkrtuZP-Q&oe=6A12AAE1" },
      { type: "image", url: "https://scontent-bos5-1.xx.fbcdn.net/v/t45.5328-4/701914632_25423806313984304_7260808720789470486_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=100&ccb=1-7&_nc_sid=247b10&_nc_ohc=lRm8cBAL61gQ7kNvwFKRCKL&_nc_oc=AdrMUH4EIuUdjFVd32Y-AcYMCsWIyDm20Hs6irAgmNtuArb_i4tZyo6oJ3wglwyLrbv5zRB72MShyPGQah7O7oYG&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=T96QIzGvLmXF6zE_ezWejA&_nc_ss=7b2a8&oh=00_Af63jcHL4ubUWowJjuvTJpZGQLnQ1_gTAaeB5TFHPvyDRA&oe=6A12B884" },
    ],
    sold: false,
  },
]

const WHATSAPP_NUMBER = "918805799434"

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

function getYouTubeThumbnail(url: string): string {
  const videoId = getYouTubeId(url)
  return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : ""
}

function getWhatsAppLink(title: string, price: string): string {
  const message = encodeURIComponent(
    `Hi! I'm interested in: *${title}* (${price}). Is it still available?`
  )
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
}

// =============================================================================
// COMPONENTS
// =============================================================================

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

// -----------------------------------------------------------------------------
// Header
// -----------------------------------------------------------------------------

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#E8E4DC] bg-[#FAF8F4]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
          MoveOut<span className="text-[#2D6A4F]">.</span>
        </h1>
        <span className="rounded-full border border-[#E8E4DC] bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Everything Must Go
        </span>
      </div>
    </header>
  )
}

// -----------------------------------------------------------------------------
// Hero
// -----------------------------------------------------------------------------

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-8 pt-12 text-center md:pt-16">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#2D6A4F]">
        Clearance Sale
      </p>
      <h2 className="font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl text-balance">
        Quality stuff, honest prices.
      </h2>
      <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground md:text-lg">
        Moving out and selling everything I own. Well-maintained items at fair prices.
        First come, first served.
      </p>
    </section>
  )
}

// -----------------------------------------------------------------------------
// Category Filter
// -----------------------------------------------------------------------------

interface CategoryFilterProps {
  categories: string[]
  selected: string
  onSelect: (category: string) => void
}

function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-8">
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${selected === category
              ? "bg-[#2D6A4F] text-white"
              : "border border-[#E8E4DC] bg-white text-foreground hover:border-[#2D6A4F] hover:text-[#2D6A4F]"
              }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Media Thumbnail (for product cards)
// -----------------------------------------------------------------------------

interface MediaThumbnailProps {
  media: MediaItem
  alt: string
}

function MediaThumbnail({ media, alt }: MediaThumbnailProps) {
  if (media.type === "emoji") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#F5F3EF] text-6xl">
        {media.emoji}
      </div>
    )
  }

  if (media.type === "image") {
    return (
      <img
        src={media.url}
        alt={alt}
        className="h-full w-full object-cover"
      />
    )
  }

  if (media.type === "video") {
    return (
      <div className="relative h-full w-full bg-[#F5F3EF]">
        <video
          src={media.url}
          className="h-full w-full object-cover"
          muted
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60">
            <Play className="h-5 w-5 fill-white text-white" />
          </div>
        </div>
      </div>
    )
  }

  if (media.type === "youtube") {
    return (
      <div className="relative h-full w-full bg-[#F5F3EF]">
        <img
          src={getYouTubeThumbnail(media.url)}
          alt={alt}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600">
            <Play className="h-5 w-5 fill-white text-white" />
          </div>
        </div>
      </div>
    )
  }

  return null
}

// -----------------------------------------------------------------------------
// Product Card
// -----------------------------------------------------------------------------

interface ProductCardProps {
  listing: Listing
  onClick: () => void
}

function ProductCard({ listing, onClick }: ProductCardProps) {
  const { title, category, price, media, sold } = listing
  const hasMultipleMedia = media.length > 1

  return (
    <button
      onClick={sold ? undefined : onClick}
      disabled={sold}
      className={`group relative w-full overflow-hidden rounded-xl border border-[#E8E4DC] bg-white text-left transition-all ${sold
        ? "cursor-not-allowed opacity-60"
        : "cursor-pointer hover:-translate-y-1 hover:shadow-lg"
        }`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F3EF]">
        <MediaThumbnail media={media[0]} alt={title} />

        {/* Multiple media badge */}
        {hasMultipleMedia && !sold && (
          <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white">
            +{media.length - 1} more
          </span>
        )}

        {/* Sold badge */}
        {sold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-md bg-white px-4 py-2 text-sm font-bold uppercase tracking-wide text-gray-700">
              Sold
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category pill */}
        <span className="mb-2 inline-block rounded-full bg-[#F5F3EF] px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          {category}
        </span>

        {/* Title */}
        <h3
          className={`font-serif text-lg font-semibold leading-tight ${sold ? "text-gray-400" : "text-foreground"
            }`}
        >
          {title}
        </h3>

        {/* Price */}
        <p
          className={`mt-1 text-lg font-semibold ${sold ? "text-gray-400 line-through" : "text-[#2D6A4F]"
            }`}
        >
          {price}
        </p>
      </div>
    </button>
  )
}

// -----------------------------------------------------------------------------
// Product Grid
// -----------------------------------------------------------------------------

interface ProductGridProps {
  listings: Listing[]
  onSelect: (listing: Listing) => void
}

function ProductGrid({ listings, onSelect }: ProductGridProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        }}
      >
        {listings.map((listing) => (
          <ProductCard
            key={listing.id}
            listing={listing}
            onClick={() => onSelect(listing)}
          />
        ))}
      </div>

      {listings.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-lg text-muted-foreground">No items in this category.</p>
        </div>
      )}
    </section>
  )
}

// -----------------------------------------------------------------------------
// Modal Gallery Thumbnail
// -----------------------------------------------------------------------------

interface GalleryThumbnailProps {
  media: MediaItem
  isActive: boolean
  onClick: () => void
}

function GalleryThumbnail({ media, isActive, onClick }: GalleryThumbnailProps) {
  return (
    <button
      onClick={onClick}
      className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${isActive ? "border-[#2D6A4F]" : "border-transparent hover:border-[#E8E4DC]"
        }`}
    >
      {media.type === "emoji" && (
        <div className="flex h-full w-full items-center justify-center bg-[#F5F3EF] text-2xl">
          {media.emoji}
        </div>
      )}
      {media.type === "image" && (
        <img src={media.url} alt="" className="h-full w-full object-cover" />
      )}
      {media.type === "video" && (
        <div className="relative h-full w-full bg-[#F5F3EF]">
          <video src={media.url} className="h-full w-full object-cover" muted preload="metadata" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Play className="h-4 w-4 fill-white text-white" />
          </div>
        </div>
      )}
      {media.type === "youtube" && (
        <div className="relative h-full w-full bg-[#F5F3EF]">
          <img
            src={getYouTubeThumbnail(media.url)}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Play className="h-4 w-4 fill-white text-white" />
          </div>
        </div>
      )}
    </button>
  )
}

// -----------------------------------------------------------------------------
// Modal Main Viewer
// -----------------------------------------------------------------------------

interface MainViewerProps {
  media: MediaItem
  isActive: boolean
}

function MainViewer({ media, isActive }: MainViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!isActive && videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [isActive])

  if (media.type === "emoji") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#F5F3EF] text-8xl">
        {media.emoji}
      </div>
    )
  }

  if (media.type === "image") {
    return (
      <img
        src={media.url}
        alt=""
        className="h-full w-full object-contain"
      />
    )
  }

  if (media.type === "video") {
    return (
      <div className="relative h-full w-full bg-black">
        <video
          ref={videoRef}
          src={media.url}
          className="h-full w-full object-contain"
          controls={isPlaying}
          playsInline
          onClick={() => {
            if (videoRef.current) {
              if (videoRef.current.paused) {
                videoRef.current.play()
                setIsPlaying(true)
              } else {
                videoRef.current.pause()
                setIsPlaying(false)
              }
            }
          }}
        />
        {!isPlaying && (
          <div
            className="absolute inset-0 flex cursor-pointer items-center justify-center"
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.play()
                setIsPlaying(true)
              }
            }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/60 transition-transform hover:scale-110">
              <Play className="h-7 w-7 fill-white text-white" />
            </div>
          </div>
        )}
      </div>
    )
  }

  if (media.type === "youtube") {
    const videoId = getYouTubeId(media.url)
    if (!videoId) return null

    return (
      <iframe
        src={isActive ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1` : ""}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube video"
      />
    )
  }

  return null
}

// -----------------------------------------------------------------------------
// Product Modal
// -----------------------------------------------------------------------------

interface ProductModalProps {
  listing: Listing
  onClose: () => void
}

function ProductModal({ listing, onClose }: ProductModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const { title, category, price, description, payment, media } = listing

  const hasMultipleMedia = media.length > 1

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1))
  }, [media.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1))
  }, [media.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft" && hasMultipleMedia) goToPrev()
      if (e.key === "ArrowRight" && hasMultipleMedia) goToNext()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose, goToPrev, goToNext, hasMultipleMedia])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  // Handle touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null || !hasMultipleMedia) return
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext()
      else goToPrev()
    }
    setTouchStart(null)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="modal-scroll relative flex max-h-[92vh] w-full max-w-[680px] flex-col overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md transition-colors hover:bg-white"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Media Gallery */}
        <div className="relative flex-shrink-0">
          {/* Main Viewer */}
          <div
            className="relative aspect-video w-full overflow-hidden bg-[#F5F3EF]"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <MainViewer media={media[currentIndex]} isActive={true} />

            {/* Navigation Arrows */}
            {hasMultipleMedia && (
              <>
                <button
                  onClick={goToPrev}
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md transition-colors hover:bg-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md transition-colors hover:bg-white"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Slide counter */}
            {hasMultipleMedia && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
                {currentIndex + 1} / {media.length}
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {hasMultipleMedia && (
            <div className="flex justify-center gap-2 overflow-x-auto bg-[#FAF8F4] p-3">
              {media.map((item, index) => (
                <GalleryThumbnail
                  key={index}
                  media={item}
                  isActive={index === currentIndex}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="flex flex-col gap-4 p-6">
          {/* Category */}
          <span className="inline-block w-fit rounded-full bg-[#F5F3EF] px-3 py-1 text-xs font-medium text-muted-foreground">
            {category}
          </span>

          {/* Title and Price */}
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-serif text-2xl font-bold text-foreground">{title}</h2>
            <span className="text-2xl font-bold text-[#2D6A4F]">{price}</span>
          </div>

          {/* Description */}
          <p className="text-base leading-relaxed text-muted-foreground">{description}</p>

          {/* Payment & Pickup Box */}
          <div className="rounded-xl border border-[#2D6A4F]/20 bg-[#2D6A4F]/5 p-4">
            <p className="text-sm font-medium text-[#2D6A4F]">Payment & Pickup</p>
            <p className="mt-1 text-sm text-foreground">{payment}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <a
              href={getWhatsAppLink(title, price)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#20bd5a]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Buy via WhatsApp
            </a>
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-[#E8E4DC] bg-white px-6 py-3 text-base font-semibold text-foreground transition-colors hover:bg-[#F5F3EF]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Footer
// -----------------------------------------------------------------------------

function Footer() {
  return (
    <footer className="border-t border-[#E8E4DC] py-8">
      <p className="text-center text-sm text-muted-foreground">
        MoveOut Sale · Contact via WhatsApp · All items are negotiable!
      </p>
    </footer>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function MoveOutSalePage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)

  // Get unique categories derived from listings data, sorted alphabetically
  const categories = useMemo(() => {
    const unique = Array.from(new Set(LISTINGS.map((l) => l.category.trim()))).sort()
    return ["All", ...unique]
  }, [])

  // Filter listings — trim both sides to guard against accidental whitespace in data
  const filteredListings = useMemo(() => {
    if (selectedCategory === "All") return LISTINGS
    return LISTINGS.filter((l) => l.category.trim() === selectedCategory.trim())
  }, [selectedCategory])

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      <Header />
      <main>
        <Hero />
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <ProductGrid
          listings={filteredListings}
          onSelect={setSelectedListing}
        />
      </main>
      <Footer />

      {/* Product Modal */}
      {selectedListing && (
        <ProductModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </div>
  )
}
