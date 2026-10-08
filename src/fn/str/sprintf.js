function pad_(s, n, c, right)
{
    if (null == c) c = ' ';
    var str = String(s), l = str.length, p = l < n ? new Array(n-l+1).join(c) : '';
    return right ? (str+p) : (p+str);
}
function justify(value, prefix, leftJustify, minWidth, zeroPad, customPadChar)
{
    var sv = String(value), diff = minWidth - sv.length;
    if (diff > 0)
    {
        if (leftJustify || !zeroPad)
            sv = pad_(sv, minWidth, customPadChar, leftJustify);
        else
            sv = sv.slice(0, prefix.length) + pad_('', diff, '0', true) + sv.slice(prefix.length);
    }
    return sv;
}
function formatBaseX(value, base, prefix, leftJustify, minWidth, precision, zeroPad)
{
    // Note: casts negative numbers to positive ones
    var number = value >>> 0;
    prefix = prefix && number && ({
    '2': '0b',
    '8': '0',
    '16': '0x'
    })[base] || '';
    value = prefix + pad_(number.toString(base), precision||0, '0', false);
    return justify(value, prefix, leftJustify, minWidth, zeroPad);
}
function formatString(value, leftJustify, minWidth, precision, zeroPad, customPadChar)
{
    if (null != precision) value = value.slice(0, precision);
    return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
}
var sprintf_format_re = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
function sprintf()
{
    // adapted from https://github.com/foo123/Contemplate
    var i = 1, fmt = arguments[0], a = arguments, is_charvector = false, ret;
    if (is_array(fmt))
    {
        fmt = fmt.join('');
        is_charvector = true;
    }
    var do_format = function do_format(substring, valueIndex, flags, minWidth, _x_, precision, type) {
        var number, prefix, method, textTransform, value;
        if ('%%' == substring) return '%';

        // parse flags
        var leftJustify = false, positivePrefix = '', zeroPad = false, prefixBaseX = false,
            j, customPadChar = ' ', flagsl = flags.length;
        for (j=0; flags && j < flagsl; ++j)
        {
            switch (flags.charAt(j))
            {
                case ' ':
                    positivePrefix = ' ';
                    break;
                case '+':
                    positivePrefix = '+';
                    break;
                case '-':
                    leftJustify = true;
                    break;
                case "'":
                    customPadChar = flags.charAt(j + 1);
                    break;
                case '0':
                    zeroPad = true;
                    break;
                case '#':
                    prefixBaseX = true;
                    break;
            }
        }

        // parameters may be null, undefined, empty-string or real valued
        // we want to ignore null, undefined and empty-string values
        if (!minWidth) minWidth = 0;
        else if ('*' == minWidth) minWidth = +_(a[i++]);
        else if ('*' == minWidth.charAt(0)) minWidth = +_(a[minWidth.slice(1, -1)]);
        else minWidth = +minWidth;

        // Note: undocumented perl feature:
        if (0 > minWidth)
        {
            minWidth = -minWidth;
            leftJustify = true;
        }

        if (!isFinite(minWidth))
        {
            throw 'sprintf: (minimum-)width must be finite';
        }

        if (!precision) precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type == 'd') ? 0 : undefined;
        else if ('*' == precision) precision = +_(a[i++]);
        else if ('*' == precision.charAt(0)) precision = +_(a[precision.slice(1, -1)]);
        else precision = +precision;

        // grab value using valueIndex if required?
        value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];
        if (is_array(value)) value = value.join('');

        switch (type)
        {
            case 's':
                return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
            case 'c':
                return formatString(String.fromCharCode(+_(value)), leftJustify, minWidth, precision, zeroPad);
            case 'b':
                return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'o':
                return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'x':
                return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'X':
                return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
            case 'u':
                return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'i':
            case 'd':
                number = _(value || 0);
                number = stdMath.round(number - number % 1); // Plain Math.round doesn't just truncate
                prefix = number < 0 ? '-' : positivePrefix;
                value = prefix + pad_(String(stdMath.abs(number)), precision, '0', false);
                return justify(value, prefix, leftJustify, minWidth, zeroPad);
            case 'e':
            case 'E':
            case 'f': // Should handle locales (as per setlocale)
            case 'F':
            case 'g':
            case 'G':
                number = _(value || 0);
                prefix = number < 0 ? '-' : positivePrefix;
                method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
                textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
                value = prefix + stdMath.abs(number)[method](precision);
                return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
            default:
                return substring;
        }
    };
    ret = fmt.replace(sprintf_format_re, do_format);
    if (is_charvector) ret = ret.split('');
    return ret;
}
fn.sprintf = function(/*..args*/) {
    return sprintf.apply(null, [].slice.call(arguments));
};
