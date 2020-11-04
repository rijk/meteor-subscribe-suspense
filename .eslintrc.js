/* eslint-disable max-len */
module.exports = {
	'env': {
		'browser': true,
		'node': true,
		'es6': true,
	},
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		'ecmaFeatures': {
			'jsx': true,
		},
		'sourceType': 'module',
	},
	'extends': [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/eslint-recommended',
	],
	'plugins': [
		'react',
		'@typescript-eslint',
	],
	'rules': {
		'indent': [ 'warn', 'tab', { SwitchCase: 1 }],
		'linebreak-style': [ 'error', 'unix' ],
		'quotes': [ 'error', 'single' ],
		'semi': [ 'error', 'never' ],
		'space-before-function-paren': [ 'error', { anonymous: 'never', named: 'never', asyncArrow: 'always' }],
		'array-bracket-spacing': [ 'warn', 'always', { objectsInArrays: false }],
		'object-curly-spacing': [ 'warn', 'always' ],
		'comma-spacing': [ 'warn' ],
		'comma-dangle': [ 'warn', 'always-multiline' ],
		'max-len': [ 'warn', { code: 80, tabWidth: 2, ignoreUrls: true, ignoreTrailingComments: true, ignoreTemplateLiterals: true }],
		'space-in-parens': [ 'warn', 'always', { exceptions: [ '{}' ] }],
		'array-bracket-newline': [ 'warn', 'consistent' ],
		'computed-property-spacing': [ 'warn', 'always' ],
		'jsx-quotes': [ 'warn', 'prefer-double' ],
		'eol-last': [ 'error', 'always' ],
		// 'multiline-ternary': [ 'error', 'always-multiline' ],
		'no-unused-vars': 0,
		'@typescript-eslint/no-unused-vars': [ 'error' ],
		'semi-spacing': [ 'warn' ],
		'key-spacing': [ 'warn' ],
		'no-console': [ 'warn', { allow: [ 'warn', 'error' ] }],
		'no-cond-assign': 0,
		'no-empty': [ 'error', { allowEmptyCatch: true }],
		'keyword-spacing': 'warn',
		'space-before-blocks': 'warn',
		'no-multi-spaces': 'warn',
		'react/react-in-jsx-scope': 0,
		'react/prop-types': 0,
		'react/display-name': 0,
		'react/jsx-tag-spacing': 'warn',
		'react/jsx-equals-spacing': [ 'warn', 'never' ],
	},
	'settings': {
		'import/resolver': 'meteor',
		'react': {
			'version': 'detect',
		},
	}
}
