process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

require('@babel/register')({
	extensions: ['.js', '.jsx', '.ts', '.tsx'],
	ignore: [/node_modules/],
	caller: {
		name: 'babel-register',
		supportsDynamicImport: false,
		supportsStaticESM: false,
	},
});

const Module = require('module');
const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
	if (
		request.includes('import-meta') ||
		(parent && parent.filename && parent.filename.includes('src/index.js'))
	) {
		const originalCompile = Module.prototype.compile;
		Module.prototype.compile = function (code, filename) {
			if (filename.includes('src/index.js')) {
				code = code.replace(
					/import\.meta\.env\.NODE_ENV/g,
					'process.env.NODE_ENV'
				);
			}
			return originalCompile.call(this, code, filename);
		};
	}
	return originalLoad.apply(this, arguments);
};
