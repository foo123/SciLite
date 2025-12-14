(['floor','ceil','round','sign','abs','exp','log','log10','log2','sqrt','sin','cos','tan','sinh','cosh','tanh','asin','acos','atan','asinh','acosh','atanh']).forEach(function(f) {
    if ('log' === f)
    {
        realMath[f] = function(x) {
            return is_number(x) ? stdMath.log(x) : x.ln();
        };
    }
    else if ('log10' === f)
    {
        realMath[f] = function(x) {
            return is_number(x) ? stdMath.log10(x) : x.log(ten);
        };
    }
    else if ('log2' === f)
    {
        realMath[f] = function(x) {
            return is_number(x) ? stdMath.log2(x) : x.log(two);
        };
    }
    else
    {
        realMath[f] = function(x) {
            return is_number(x) ? stdMath[f](x) : x[f]();
        };
    }
});
realMath.atan2 = function(y, x) {
    return n_eq(O, x) && n_eq(O, y) ? O : (is_number(y) && is_number(x) ? stdMath.atan2(y, x) : decimal.atan2(y, x));
};
realMath.fix = function(x) {
    return n_lt(x, O) ? realMath.ceil(x) : realMath.floor(x);
};
$_.realMath = realMath;
