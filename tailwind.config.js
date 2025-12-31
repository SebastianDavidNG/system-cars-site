module.exports = {
    content: [
        './themes/system-cars-theme/**/*.{php,js,jsx,scss}',
    ],
    safelist: [
        // Grid columns clases para service-card
        'grid',
        'grid-cols-12',
        'col-span-12',
        'md:col-span-1',
        'md:col-span-2',
        'md:col-span-3',
        'md:col-span-4',
        'md:col-span-5',
        'md:col-span-6',
        'md:col-span-7',
        'md:col-span-8',
        'md:col-span-9',
        'md:col-span-10',
        'md:col-span-11',
        'md:col-span-12',
        // Altura fija para service-card
        'h-[350px]',
        'md:h-[300px]',
        'lg:h-[400px]',
        // Tamaños responsive
        'w-14',
        'h-14',
        'md:w-[75px]',
        'md:h-[75px]',
        'text-xl',
        'text-sm',
        'md:text-2xl',
        'md:text-base',
    ],
    theme: {
        extend: {
            colors: {
                primary:   '#ff0000',
                secondary: '#002060',
                tertiary:  '#232225',
                white:     '#ffffff',
                black:     '#000000'
            }
        }
    },
    variants: {},
    plugins: [],
};