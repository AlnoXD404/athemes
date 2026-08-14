const colors = require('tailwindcss/colors');

const gray = {
    50: '#f5f7ff',
    100: '#e8ecf9',
    200: '#d4dbf0',
    300: '#aab4d0',
    400: '#7f8bae',
    500: '#5b6689',
    600: '#3f4a6b',
    700: '#2b3452',
    800: '#1a2238',
    900: '#10162a',
};

module.exports = {
    content: [
        './resources/scripts/**/*.{js,ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                header: ['"Outfit"', '"IBM Plex Sans"', '"Roboto"', 'system-ui', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
            },
            colors: {
                black: '#08080d',
                // "primary" and "neutral" are deprecated, prefer the use of "blue" and "gray"
                // in new code.
                primary: {
                    50: '#f3f1ff',
                    100: '#e6e1ff',
                    200: '#c9beff',
                    300: '#a78bfa',
                    400: '#8b5cf6',
                    500: '#7c3aed',
                    600: '#6366f1',
                    700: '#5b21b6',
                    800: '#4c1d95',
                    900: '#2e1065',
                },
                blue: {
                    ...colors.blue,
                    500: '#3b82f6',
                    600: '#6366f1',
                },
                gray: gray,
                neutral: gray,
                cyan: colors.cyan,
            },
            fontSize: {
                '2xs': '0.625rem',
            },
            transitionDuration: {
                250: '250ms',
            },
            borderColor: theme => ({
                default: theme('colors.neutral.400', 'currentColor'),
            }),
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
    ]
};
