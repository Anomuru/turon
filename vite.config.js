import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {createHtmlPlugin} from "vite-plugin-html";
import tsconfigPaths from 'vite-tsconfig-paths'
import path from "path"
import svgr from 'vite-plugin-svgr'
import Inspect from 'vite-plugin-inspect';


// https://vite.dev/config/
export default defineConfig({

    root: "src",
    publicDir: "../public",
    build: {
        outDir: "../build"
    },
    assetsInclude: ['**/*.svg'],
    plugins: [
        // tsconfigPaths(),
        Inspect(),
        react(),
        // svgr({
        //     svgrOptions: {
        //         exportType: 'named',
        //         ref: true,
        //         svgo: false,
        //         titleProp: true,
        //     },
        //     include: '**/*.svg',
        // }),
        createHtmlPlugin({
            inject: {
                data: {
                    title: "Vite + React",
                },
            },
        }),
    ],
    server: {
        host: true, // ← это разрешает доступ извне
        port: 5173, // можно указать другой порт, если нужно
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, './src'),
            app: path.resolve(__dirname, './src/app'),
            entities: path.resolve(__dirname, './src/entities'),
            features: path.resolve(__dirname, './src/features'),
            pages: path.resolve(__dirname, './src/pages'),
            widgets: path.resolve(__dirname, './src/widgets'),
            shared: path.resolve(__dirname, './src/shared'),

            // assets: "/src/assets",
            // lib: "/src/lib",
        },
    },

})
