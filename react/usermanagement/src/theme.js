import { createTheme } from "@mui/material"

export const theme = createTheme({
    palette: {
        primary: {
          main: '#B71375'
        },
        secondary: {
          main: '#97BC62'
        }
      },
      typography: {
        fontFamily: 'Poppins',
        fontSize: 15,
        h1: {
          fontFamily: 'Poppins',
          fontSize: 25
        }
      },
      shape: {
        borderRadius: 2
      }
})