module.exports = {
	extends: [
		'@wordpress/stylelint-config/scss',
	],
	rules: {
		'comment-empty-line-before': [
			'always',
			{
				except: [
					'first-nested',
				],
			},
		],
		'declaration-property-unit-whitelist': {
			'line-height': [
				'em',
				'px',
			],
		},
		'font-family-no-missing-generic-family-keyword': null,
		'font-weight-notation': 'named-where-possible',
		'function-parentheses-space-inside': 'always',
		'max-line-length': null,
		'no-descending-specificity': null,
		'selector-pseudo-class-parentheses-space-inside': 'always',
		'selector-pseudo-element-colon-notation': 'single',
		'selector-pseudo-class-no-unknown': [
			true,
			{
				ignorePseudoClasses: [
					'export',
				],
			},
		],
	},
};
