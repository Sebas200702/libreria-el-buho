export const instagramHandle = 'libreria.elbuho';
import {env} from '@/config/env'
export const media = {
    logoUrl: '/logo-owl.png',
    instagramHandle,
    instagramUrl: `https://instagram.com/${instagramHandle}`,
    whatsapp: env.WHATSAPP_NUMBER,
    year: new Date().getFullYear()
}
