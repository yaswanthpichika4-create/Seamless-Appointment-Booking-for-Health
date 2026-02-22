import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#008080", // Teal
            dark: "#004d4d",
            contrastText: "#fff",
        },
        secondary: {
            main: "#20b2aa", // Light Sea Green
            contrastText: "#fff",
        },
        background: {
            default: "#f4f7f6",
            paper: "#ffffff",
        },
        text: {
            primary: "#333333",
            secondary: "#666666",
        },
    },
    typography: {
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(","),
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 700,
        },
        h5: {
            fontWeight: 600,
        },
        button: {
            textTransform: "none",
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                    padding: "10px 24px",
                },
                containedPrimary: {
                    "&:hover": {
                        backgroundColor: "#006666",
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                    },
                },
            },
        },
    },
});

export default theme;
