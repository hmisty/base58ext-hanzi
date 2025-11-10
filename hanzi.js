//---------------------------------------------------------------------
// Base58ExtHanzi for JavaScript
//
// Copyright (c) 2025 Evan Liu <evan at blockcoach.com>
//
// Use deliberately chosen Chinese characters to encode base58 chars 
// extended with bech32 chars.
// 使用精心挑选的汉字对base58扩展字符集进行编码
//
//---------------------------------------------------------------------

(function () {
	//---------------------------------------------------------------------
	// Base58ExtHanzi
	//---------------------------------------------------------------------

	var Base58ExtHanzi = window.Base58ExtHanzi = function () {
		this.encodingTable = this.createEncodingTable();
		this.decodingTable = this.createDecodingTable();
	}

	Base58ExtHanzi.prototype = {

		/**
		 * 创建编码对照表
		 */
		createEncodingTable: function() {
			return {
				// 数字部分 (0-9)
				'0': '零', '1': '壹', '2': '贰', '3': '叁', '4': '肆',
				'5': '伍', '6': '陆', '7': '柒', '8': '捌', '9': '玖',

				// 大写字母 (A-Z)
				'A': '氩', 'B': '硼', 'C': '碳', 'D': '镝', 'E': '铒',
				'F': '氟', 'G': '镓', 'H': '氢', 'J': '金', 'K': '钾',
				'L': '锂', 'M': '镁', 'N': '氮', 'P': '磷', 'Q': '铅',
				'R': '氡', 'S': '硫', 'T': '钛', 'U': '铀', 'V': '钒',
				'W': '钨', 'X': '氙', 'Y': '钇', 'Z': '锌',

				// 小写字母 (a-z)
				'a': '安', 'b': '白', 'c': '程', 'd': '戴', 'e': '鄂',
				'f': '冯', 'g': '高', 'h': '韩', 'i': '伊', 'j': '蒋',
				'k': '孔', 'l': '李', 'm': '毛', 'n': '牛', 'o': '欧',
				'p': '潘', 'q': '秦', 'r': '任', 's': '孙', 't': '唐',
				'u': '乌', 'v': '俞', 'w': '王', 'x': '谢', 'y': '杨',
				'z': '赵'
			};
		},

		/**
		 * 创建解码对照表（反向映射）
		 */
		createDecodingTable: function() {
			var decodingTable = {};
			var encodingTable = this.createEncodingTable();

			for (var char in encodingTable) {
				if (encodingTable.hasOwnProperty(char)) {
					decodingTable[encodingTable[char]] = char;
				}
			}
			return decodingTable;
		},

		/**
		 * 将base58ext字符串编码为汉字
		 * @param {string} input - 输入的base58ext字符串
		 * @returns {string} 编码后的汉字字符串
		 */
		encode: function(input) {
			if (typeof input !== 'string') {
				throw new Error('输入必须是字符串');
			}

			var result = '';
			for (var i = 0; i < input.length; i++) {
				var char = input[i];
				if (this.encodingTable[char]) {
					result += this.encodingTable[char];
				} else {
					throw new Error('包含不支持编码的字符: ' + char);
				}
			}
			return result;
		},

		/**
		 * 将汉字字符串解码为base58ext字符串
		 * @param {string} input - 输入的汉字字符串
		 * @returns {string} 解码后的base58ext字符串
		 */
		decode: function(input) {
			if (typeof input !== 'string') {
				throw new Error('输入必须是字符串');
			}

			var result = '';
			// 处理可能包含多字节字符的情况
			var chars = this.splitChineseString(input);

			for (var i = 0; i < chars.length; i++) {
				var char = chars[i];
				if (this.decodingTable[char]) {
					result += this.decodingTable[char];
				} else {
					throw new Error('包含无法解码的汉字: ' + char);
				}
			}
			return result;
		},

		/**
		 * 将中文字符串分割为单个汉字数组
		 * @param {string} str - 中文字符串
		 * @returns {Array} 汉字数组
		 */
		splitChineseString: function(str) {
			var result = [];
			for (var i = 0; i < str.length; i++) {
				// 中文字符的Unicode范围
				var charCode = str.charCodeAt(i);
				if (charCode >= 0x4E00 && charCode <= 0x9FFF) {
					result.push(str[i]);
				}
			}
			return result;
		},

		/**
		 * 验证字符串是否为有效的base58ext编码
		 * @param {string} input - 待验证的字符串
		 * @returns {boolean} 是否有效
		 */
		isValidBase58Ext: function(input) {
			if (typeof input !== 'string' || input.length === 0) {
				return false;
			}

			var validChars = Object.keys(this.encodingTable);
			for (var i = 0; i < input.length; i++) {
				if (validChars.indexOf(input[i]) === -1) {
					return false;
				}
			}
			return true;
		},

		/**
		 * 验证字符串是否为有效的汉字编码
		 * @param {string} input - 待验证的汉字字符串
		 * @returns {boolean} 是否有效
		 */
		isValidHanziEncoded: function(input) {
			if (typeof input !== 'string') return false;

			var chars = this.splitChineseString(input);
			for (var i = 0; i < chars.length; i++) {
				if (!this.decodingTable[chars[i]]) {
					return false;
				}
			}
			return chars.length > 0;
		},

		/**
		 * 转义正则表达式特殊字符
		 * @param {string} string - 待转义字符串
		 * @returns {string} 转义后的字符串
		 */
		escapeRegExp: function(string) {
			return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		},

		/**
		 * 获取编码表（只读）
		 * @returns {Object} 编码表副本
		 */
		getEncodingTable: function() {
			return JSON.parse(JSON.stringify(this.encodingTable));
		},

		/**
		 * 获取解码表（只读）
		 * @returns {Object} 解码表副本
		 */
		getDecodingTable: function() {
			return JSON.parse(JSON.stringify(this.decodingTable));
		},

		/**
		 * 批量编码多个字符串
		 * @param {Array} inputs - 字符串数组
		 * @returns {Array} 编码后的汉字字符串数组
		 */
		encodeBatch: function(inputs) {
			if (!Array.isArray(inputs)) {
				throw new Error('输入必须是数组');
			}

			var results = [];
			for (var i = 0; i < inputs.length; i++) {
				results.push(this.encode(inputs[i]));
			}
			return results;
		},

		/**
		 * 批量解码多个汉字字符串
		 * @param {Array} inputs - 汉字字符串数组
		 * @returns {Array} 解码后的base58ext字符串数组
		 */
		decodeBatch: function(inputs) {
			if (!Array.isArray(inputs)) {
				throw new Error('输入必须是数组');
			}

			var results = [];
			for (var i = 0; i < inputs.length; i++) {
				results.push(this.decode(inputs[i]));
			}
			return results;
		}
	};

	//---------------------------------------------------------------------
	// 静态方法 - 工具函数
	//---------------------------------------------------------------------

	Base58ExtHanzi.util = {

		/**
		 * 快速编码（使用默认实例）
		 * @param {string} input - 输入的base58ext字符串
		 * @returns {string} 编码后的汉字字符串
		 */
		encode: function(input) {
			var encoder = new Base58ExtHanzi();
			return encoder.encode(input);
		},

		/**
		 * 快速解码（使用默认实例）
		 * @param {string} input - 输入的汉字字符串
		 * @returns {string} 解码后的base58ext字符串
		 */
		decode: function(input) {
			var encoder = new Base58ExtHanzi();
			return encoder.decode(input);
		},

		/**
		 * 验证base58ext字符串
		 * @param {string} input - 待验证字符串
		 * @returns {boolean} 是否有效
		 */
		isValidBase58Ext: function(input) {
			var encoder = new Base58ExtHanzi();
			return encoder.isValidBase58Ext(input);
		},

		/**
		 * 验证汉字编码字符串
		 * @param {string} input - 待验证汉字字符串
		 * @returns {boolean} 是否有效
		 */
		isValidHanziEncoded: function(input) {
			var encoder = new Base58ExtHanzi();
			return encoder.isValidHanziEncoded(input);
		}
	};

	//---------------------------------------------------------------------
	// 字符分类工具
	//---------------------------------------------------------------------

	Base58ExtHanzi.categories = {
		/**
		 * 获取数字字符对应的汉字
		 * @returns {Object} 数字字符到汉字的映射
		 */
		getDigits: function() {
			var encoder = new Base58ExtHanzi();
			var table = encoder.getEncodingTable();
			var digits = {};

			for (var i = 0; i <= 9; i++) {
				digits[i.toString()] = table[i.toString()];
			}
			return digits;
		},

		/**
		 * 获取大写字母对应的汉字（化学元素）
		 * @returns {Object} 大写字母到汉字的映射
		 */
		getUppercaseLetters: function() {
			var encoder = new Base58ExtHanzi();
			var table = encoder.getEncodingTable();
			var uppercase = {};

			for (var char in table) {
				if (table.hasOwnProperty(char) && char >= 'A' && char <= 'Z') {
					uppercase[char] = table[char];
				}
			}
			return uppercase;
		},

		/**
		 * 获取小写字母对应的汉字（百家姓）
		 * @returns {Object} 小写字母到汉字的映射
		 */
		getLowercaseLetters: function() {
			var encoder = new Base58ExtHanzi();
			var table = encoder.getEncodingTable();
			var lowercase = {};

			for (var char in table) {
				if (table.hasOwnProperty(char) && char >= 'a' && char <= 'z') {
					lowercase[char] = table[char];
				}
			}
			return lowercase;
		}
	};
})();
