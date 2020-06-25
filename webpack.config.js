const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/ReactSignalsPlot.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'ReactSignalsPlot.js',
        libraryTarget: 'commonjs2' // THIS IS THE MOST IMPORTANT LINE! :mindblow:
        // I wasted more than 2 days until realize this was the line most important in all this guide.
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    externals: {
        react: 'commonjs react' // this line is just to use the React dependency
        // of our parent-testing-project instead of using our own React.
    }
};
