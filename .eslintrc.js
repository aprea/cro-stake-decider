module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:import/errors',
		'plugin:import/typescript',
		'plugin:import/warnings',
		'plugin:react/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: { jsx: true },
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: [ './tsconfig.eslint.json' ],
	},
	plugins: [
		'@typescript-eslint',
		'react-hooks',
		'simple-import-sort',
	],
	settings: { react: { version: 'detect' } },
	rules: {
		'array-bracket-spacing': [
			'error',
			'always',
		],
		'arrow-parens': [ 'error', 'as-needed' ],
		'arrow-spacing': [
			'error',
			{ before: true, after: true },
		],
		'block-spacing': [ 'error' ],
		'brace-style': [ 'error', '1tbs' ],
		'comma-dangle': [ 'error', 'always-multiline' ],
		'comma-spacing': [
			'error',
			{ before: false, after: true },
		],
		'computed-property-spacing': [ 'error', 'always' ],
		curly: [ 'error', 'all' ],
		'eol-last': [ 'error', 'unix' ],
		eqeqeq: [ 'error' ],
		'dot-notation': [ 'error' ],
		'func-call-spacing': [ 'error' ],
		'import/newline-after-import': [ 'error' ],
		'import/no-amd': [ 'error' ],
		'import/no-commonjs': [ 'error' ],
		indent: [
			'error',
			'tab',
			{ SwitchCase: 1 },
		],
		'jsx-quotes': [ 'error', 'prefer-double' ],
		'key-spacing': [
			'error', { mode: 'minimum' },
		],
		'keyword-spacing': [
			'error',
			{ after: true, before: true },
		],
		'linebreak-style': [ 'error', 'unix' ],
		'lines-around-comment': [ 'error', {
			allowArrayStart: true,
			allowBlockStart: true,
			allowClassStart: true,
			allowObjectStart: true,
			beforeBlockComment: true,
			beforeLineComment: true,
		} ],
		'no-console': [ 'warn', { allow: [ 'warn', 'error' ] } ],
		'no-mixed-spaces-and-tabs': [ 'error' ],
		'no-multi-spaces': [
			'error',
			{
				ignoreEOLComments: true,
				exceptions: {
					AssignmentPattern: true,
					AssignmentExpression: true,
					VariableDeclaration: true,
					VariableDeclarator: true,
				},
			},
		],
		'no-multiple-empty-lines': [
			'error',
			{ max: 1 },
		],
		'no-return-assign': [ 'error', 'always' ],
		'no-trailing-spaces': [ 'error' ],
		'no-unused-expressions': 'off',
		'no-unused-vars': [
			'error',
			{
				args: 'none',
				caughtErrors: 'all',
				ignoreRestSiblings: true,
				vars: 'local',
			},
		],
		'no-useless-concat': 'error',
		'no-var': 'error',
		'multiline-comment-style': 'error',
		'object-curly-newline': [
			'error',
			{ multiline: true },
		],
		'object-curly-spacing': [
			'error',
			'always',
		],
		'object-property-newline': [
			'error',
			{ allowAllPropertiesOnSameLine: true },
		],
		'object-shorthand': [ 'error', 'always' ],
		'one-var': [ 'error', 'never' ],
		'prefer-const': 'error',
		'prefer-object-spread': 'error',
		'prefer-template': 'error',
		'quote-props': [ 'error', 'as-needed' ],
		quotes: [ 'error', 'single' ],
		'react-hooks/exhaustive-deps': 'error',
		'react-hooks/rules-of-hooks': 'error',
		'react/display-name': 'off',
		'react/jsx-boolean-value': [ 'error', 'never' ],
		'react/jsx-closing-bracket-location': 'error',
		'react/jsx-closing-tag-location': 'error',
		'react/jsx-curly-brace-presence': 'error',
		'react/jsx-curly-spacing': [
			'error',
			{
				attributes: { when: 'always' },
				children: { when: 'always' },
			},
		],
		'react/jsx-equals-spacing': [ 'error', 'never' ],
		'react/jsx-first-prop-new-line': 'error',
		'react/jsx-fragments': 'error',
		'react/jsx-handler-names': 'error',
		'react/jsx-indent-props': [ 'error', 'tab' ],
		'react/jsx-indent': [ 'error', 'tab' ],
		'react/jsx-pascal-case': 'error',
		'react/jsx-props-no-multi-spaces': 'error',
		'react/jsx-sort-props': [
			'error',
			{
				callbacksLast: false,
				shorthandFirst: false,
				shorthandLast: false,
				ignoreCase: true,
				noSortAlphabetically: false,
				reservedFirst: false,
			},
		],
		'react/jsx-tag-spacing': [ 'error', {
			afterOpening: 'never',
			beforeClosing: 'never',
			beforeSelfClosing: 'always',
			closingSlash: 'never',
		} ],
		'react/jsx-wrap-multilines': [ 'error', {
			declaration: 'parens-new-line',
			assignment: 'parens-new-line',
			return: 'parens-new-line',
			arrow: 'parens-new-line',
			condition: 'ignore',
			logical: 'ignore',
			prop: 'ignore',
		} ],
		'react/prop-types': 'off',
		'react/react-in-jsx-scope': 'off',
		'react/self-closing-comp': [ 'error', {
			component: true,
			html: true,
		} ],
		'semi-spacing': [
			'error',
			{ before: false, after: true },
		],
		semi: [ 'error', 'always' ],
		'simple-import-sort/imports': [
			'error',
			{
				groups: [
					// Anything from node_modules.
					[ '^@?\\w' ],

					// Anything not matched in another group.
					[ '^' ],

					// Relative imports.
					[ '^\\.' ],

					// Side effects. e.g., scss files.
					[ '^\\u0000' ],
				],
			},
		],
		'space-before-blocks': [ 'error', 'always' ],
		'space-before-function-paren': [
			'error',
			{
				anonymous: 'always',
				asyncArrow: 'always',
				named: 'never',
			},
		],
		'space-in-parens': [
			'error',
			'always',
			{ exceptions: [ 'empty' ] },
		],
		'space-infix-ops': [ 'error' ],
		'space-unary-ops': [
			'error',
			{
				words: true,
				nonwords: true,
				overrides: {
					'++': false,
					'--': false,
				},
			},
		],
		'spaced-comment': [ 'error', 'always', { block: { balanced: true } } ],
		'template-curly-spacing': [ 'error', 'always' ],
		yoda: [
			'error',
			'never',
			{ exceptRange: true },
		],
	},
	overrides: [
		{
			env: { node: true },
			files: [
				'.eslintrc.js',
				'stylelint.config.js',
			],
			rules: { 'import/no-commonjs': 'off' },
		},
		{
			files: [ '*.ts', '*.tsx', '.*.ts', '.*.tsx' ],
			extends: [ 'plugin:@typescript-eslint/recommended' ],
			rules: {
				'@typescript-eslint/array-type': [ 'error', { default: 'array' } ],
				'@typescript-eslint/func-call-spacing': [ 'error' ],
				'@typescript-eslint/indent': [ 'error', 'tab' ],
				'@typescript-eslint/keyword-spacing': [ 'error' ],
				'@typescript-eslint/member-delimiter-style': [ 'error' ],
				'@typescript-eslint/no-explicit-any': 'error',
				'@typescript-eslint/semi': [ 'error' ],
				'@typescript-eslint/type-annotation-spacing': [ 'error' ],

				// TypeScript takes care of this for us.
				'import/named': 'off',
				indent: 'off',
			},
		},
	],
};
