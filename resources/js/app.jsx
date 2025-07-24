import './bootstrap';
import '../css/app.css';
import '../css/scrollbar/custom-scrollbar.css';
import '../css/input/checkbox.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { Layout } from '@/Layouts/layout';

createInertiaApp({
    title: (title) => `${title}`,
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        const page = pages[`./Pages/${name}.jsx`];

        if (!page) {
            console.error(`Page not found: ./Pages/${name}.jsx`);
            throw new Error(`Page not found: ./Pages/${name}.jsx`);
        }

        if (name !== "Auth/Login") {
            page.default.layout =
                page.default.layout || ((page) => <Layout children={page} />);
        }

        return page;
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#ff8800',
    },
});
