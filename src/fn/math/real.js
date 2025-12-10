(['floor','ceil','round','sign','abs','exp','log','log10','sqrt','sin','cos','tan','sinh','cosh','tanh','asin','acos','atan','asinh','acosh','atanh']).forEach(function(f) {
    if ('log' === f)
    {
        realMath[f] = function(x) {
            return is_number(x) ? stdMath.log(x) : x.ln();
        };
    }
    else if ('log10' === f)
    {
        realMath[f] = function(x) {
            return is_number(x) ? stdMath.log10(x) : x.log();
        };
    }
    else
    {
        realMath[f] = function(x) {
            return is_number(x) ? stdMath[f](x) : x[f]();
        };
    }
});
$_.realMath = realMath;
