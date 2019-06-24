import resolve from "rollup-plugin-node-resolve";
import { uglify } from "rollup-plugin-uglify";
import filesize from "rollup-plugin-filesize";

export default {
    input: "src/index.js",
    output: {
        file: "dist/cUrl.js",
        format: "umd",
        name: 'cUrl'
    },
    plugins: [
        resolve({}),
        // uglify(),
        filesize()
    ]
};
