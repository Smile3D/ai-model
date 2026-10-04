import avatar1 from '../assets/avatar/1.webp'
import avatar2 from '../assets/avatar/2.webp'
import avatar3 from '../assets/avatar/3.webp'
import avatar4 from '../assets/avatar/4.webp'
import artemPost1 from '../assets/artemvideo/12.webp'
import artemPost2 from '../assets/artemvideo/22.webp'
import artemPost3 from '../assets/artemvideo/33.webp'
import denPost1 from '../assets/denvideo/1.webp'
import denPost2 from '../assets/denvideo/2.webp'
import denPost3 from '../assets/denvideo/3.webp'
import likaPost1 from '../assets/likavideo/1.webp'
import likaPost2 from '../assets/likavideo/2.webp'
import likaPost3 from '../assets/likavideo/3.webp'
import margoPost1 from '../assets/margovideo/1.webp'
import margoPost2 from '../assets/margovideo/2.webp'
import margoPost3 from '../assets/margovideo/3.webp'

// Structural, locale-independent data only. Translatable text (name,
// tagline, bio, post captions) lives in src/i18n/locales/*.js, keyed by
// blogger id, and is resolved via t(`bloggers.${id}.*`) where needed.
export const bloggers = [
  {
    id: 1,
    gender: 'male',
    handle: '@nexus.volkov',
    niche: 'business-tech',
    image: avatar1,
    telegramUrl: 'https://t.me/nexus_volkov',
    posts: [
      { image: artemPost1, likes: 4210 },
      { image: artemPost2, likes: 3127 },
      { image: artemPost3, likes: 2894 },
    ],
  },
  {
    id: 2,
    gender: 'male',
    handle: '@ripcord.daily',
    niche: 'sport-travel',
    image: avatar2,
    telegramUrl: 'https://t.me/ripcord_daily',
    posts: [
      { image: denPost1, likes: 8841 },
      { image: denPost2, likes: 6203 },
      { image: denPost3, likes: 7415 },
    ],
  },
  {
    id: 3,
    gender: 'female',
    handle: '@lika.slowlife',
    niche: 'lifestyle',
    image: avatar3,
    telegramUrl: 'https://t.me/lika_slowlife',
    posts: [
      { image: likaPost1, likes: 2740 },
      { image: likaPost2, likes: 4102 },
      { image: likaPost3, likes: 3356 },
    ],
  },
  {
    id: 4,
    gender: 'female',
    handle: '@margo.veil',
    niche: 'fashion-lifestyle',
    image: avatar4,
    telegramUrl: 'https://t.me/margo_veil',
    posts: [
      { image: margoPost1, likes: 9120 },
      { image: margoPost2, likes: 5461 },
      { image: margoPost3, likes: 6734 },
    ],
  },
]
