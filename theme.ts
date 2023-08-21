import {extendTheme} from '@chakra-ui/react'
import {DM_Sans, Bebas_Neue} from 'next/font/google'

const dm_sans = DM_Sans({
    weight: ['400'],
    subsets:['latin']
})

const bebas_neue = Bebas_Neue({
    weight: ['400'],
    subsets: ['latin']
})

const theme = extendTheme({
    fonts: {
        body: dm_sans.style.fontFamily,
        heading: bebas_neue.style.fontFamily
    }
})

export default theme;