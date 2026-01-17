// primitive numeric ops (overloaded)
function n_eq(a, b)
{
    if (is_number(a))
    {
        if (is_number(b)) return a === b;
        else return b.eq(a);
    }
    return a.eq(b);
}
$_.neq = n_eq;
function n_lt(a, b)
{
    if (is_number(a))
    {
        if (is_number(b)) return a < b;
        else return b.gt(a);
    }
    return a.lt(b);
}
$_.nlt = n_lt;
function n_gt(a, b)
{
    if (is_number(a))
    {
        if (is_number(b)) return a > b;
        else return b.lt(a);
    }
    return a.gt(b);
}
$_.ngt = n_gt;
function n_le(a, b)
{
    if (is_number(a))
    {
        if (is_number(b)) return a <= b;
        else return b.gte(a);
    }
    return a.lte(b);
}
$_.nle = n_le;
function n_ge(a, b)
{
    if (is_number(a))
    {
        if (is_number(b)) return a >= b;
        else return b.lte(a);
    }
    return a.gte(b);
}
$_.nge = n_ge;
function n_add(a, b)
{
    if (is_number(a))
    {
        if (is_number(b)) return a+b;
        else return b.add(a);
    }
    return a.add(b);
}
$_.nadd = n_add;
function n_sub(a, b)
{
    if (is_number(a))
    {
        if (is_number(b)) return a-b;
        else return b.neg().add(a);
    }
    return a.sub(b);
}
$_.nsub = n_sub;
function n_mul(a, b)
{
    if (is_number(a))
    {
        if (is_number(b)) return a*b;
        else return b.mul(a);
    }
    return a.mul(b);
}
$_.nmul = n_mul;
function n_div(a, b)
{
    if (is_number(a))
    {
        if (is_number(b)) return a/b;
        else return decimal(a).div(b);
    }
    return a.div(b);
}
$_.ndiv = n_div;
function n_pow(a, b)
{
    if (is_nan(a) || is_nan(b))
    {
        return nan;
    }
    if (is_number(a))
    {
        if (is_number(b))
        {
            return (0 > a) && !is_int(b) ? (realify((new complex(a)).pow(b))) : (stdMath.pow(a, b));
        }
        else
        {
            return (0 > a) && !is_int(b) ? realify((new complex(decimal(a))).pow(b)) : (decimal(a).pow(b));
        }
    }
    return n_gt(O, a) && !is_int(b) ? realify((new complex(a)).pow(decimal(b))) : a.pow(b);
}
$_.npow = n_pow;
function n_mod(a, b)
{
    if (is_number(a))
    {
        if (is_number(b)) return a % b;
        else return decimal(a).mod(b);
    }
    return a.mod(b);
}
$_.nmod = n_mod;
function n_neg(a)
{
    return is_number(a) ? -a : (a.neg());
}
$_.nneg = n_neg;
function n_inv(a)
{
    return is_number(a) ? 1/a : I.div(a);
}
$_.ninv = n_inv;

// numeric ops (overloaded)
function eq(a, b)
{
    if (is_string(a))
    {
        if (is_string(b)) return a === b ? 1 : 0;
        else if (is_scalar(b)) return a === String(b) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return eq(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return eq(a, b[i][j]);});
    }
    else if (is_num(a))
    {
        if (is_string(b)) return String(a) === b ? 1 : 0;
        else if (is_num(b)) return n_eq(a, b) ? 1 : 0;
        else if (is_complex(b)) return n_eq(b.re, a) && n_eq(b.im, O) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return eq(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return eq(a, b[i][j]);});
    }
    else if (is_complex(a))
    {
        if (is_string(b)) return String(a) === b ? 1 : 0;
        else if (is_num(b)) return n_eq(a.re, b) && n_eq(a.im, O) ? 1 : 0;
        else if (is_complex(b)) return n_eq(a.re, b.re) && n_eq(a.im, b.im) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return eq(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return eq(a, b[i][j]);});
    }
    else if (is_vector(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return a.map(function(ai) {return eq(ai, b);});
        }
        else if (is_vector(b))
        {
            if (a.length !== b.length) throw "eq: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return eq(ai, b[i]);});
        }
        else if (is_matrix(b))
        {
            if (a.length !== COLS(b)) throw "eq: inputs have incompatible dimensions";
            return matrix(ROWS(b), COLS(b), function(i, j) {return eq(a[j], b[i][j]);});
        }
    }
    else if (is_matrix(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return matrix(ROWS(a), COLS(a), function(i, j) {return eq(a[i][j], b);});
        }
        else if (is_vector(b))
        {
            if (COLS(a) !== b.length) throw "eq: inputs have incompatible dimensions";
            return matrix(ROWS(a), COLS(a), function(i, j) {return eq(a[i][j], b[j]);});
        }
        else if (is_matrix(b))
        {
            if ((ROWS(a) !== ROWS(b)) || (COLS(a) !== COLS(b))) throw "eq: inputs have incompatible dimensions";
            return matrix(ROWS(a), COLS(a), function(i, j) {return eq(a[i][j], b[i][j]);});
        }
    }
    return 0;
}
$_.eq = eq;
function ne(a, b)
{
    if (is_string(a))
    {
        if (is_string(b)) return a === b ? 0 : 1;
        else if (is_scalar(b)) return a === String(b) ? 0 : 1;
        else if (is_vector(b)) return b.map(function(bi) {return ne(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return ne(a, b[i][j]);});
    }
    else if (is_num(a))
    {
        if (is_string(b)) return String(a) === b ? 0 : 1;
        else if (is_num(b)) return n_eq(a, b) ? 0 : 1;
        else if (is_complex(b)) return n_eq(b.re, a) && n_eq(b.im, O) ? 0 : 1;
        else if (is_vector(b)) return b.map(function(bi) {return ne(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return ne(a, b[i][j]);});
    }
    else if (is_complex(a))
    {
        if (is_string(b)) return String(a) === b ? 0 : 1;
        else if (is_num(b)) return n_eq(a.re, b) && n_eq(a.im, O) ? 0 : 1;
        else if (is_complex(b)) return n_eq(a.re, b.re) && n_eq(a.im, b.im) ? 0 : 1;
        else if (is_vector(b)) return b.map(function(bi) {return ne(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return ne(a, b[i][j]);});
    }
    else if (is_vector(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return a.map(function(ai) {return ne(ai, b);});
        }
        else if (is_vector(b))
        {
            if (a.length !== b.length) throw "ne: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return ne(ai, b[i]);});
        }
        else if (is_matrix(b))
        {
            if (a.length !== COLS(b)) throw "ne: inputs have incompatible dimensions";
            return matrix(ROWS(b), COLS(b), function(i, j) {return ne(a[j], b[i][j]);});
        }
    }
    else if (is_matrix(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return matrix(ROWS(a), COLS(a), function(i, j) {return ne(a[i][j], b);});
        }
        else if (is_vector(b))
        {
            if (COLS(a) !== b.length) throw "ne: inputs have incompatible dimensions";
            return matrix(ROWS(a), COLS(a), function(i, j) {return ne(a[i][j], b[j]);});
        }
        else if (is_matrix(b))
        {
            if ((ROWS(a) !== ROWS(b)) || (COLS(a) !== COLS(b))) throw "ne: inputs have incompatible dimensions";
            return matrix(ROWS(a), COLS(a), function(i, j) {return ne(a[i][j], b[i][j]);});
        }
    }
    return 0;
}
$_.ne = ne;
function lt(a, b)
{
    if (is_string(a))
    {
        if (is_string(b)) return a < b ? 1 : 0;
        else if (is_scalar(b)) return a < String(b) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return lt(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return lt(a, b[i][j]);});
    }
    else if (is_num(a))
    {
        if (is_string(b)) return String(a) < b ? 1 : 0;
        else if (is_num(b)) return n_lt(a, b) ? 1 : 0;
        else if (is_complex(b)) return n_lt(b.re, a) && n_eq(b.im, O) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return lt(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return lt(a, b[i][j]);});
    }
    else if (is_complex(a))
    {
        if (is_string(b)) return String(a) < b ? 1 : 0;
        else if (is_num(b)) return n_lt(a.re, b) && n_eq(a.im, O) ? 1 : 0;
        else if (is_complex(b)) return (n_lt(a.re, b.re) && n_eq(a.im, O) && n_eq(b.im, O)) || (n_lt(a.im, b.im) && n_eq(a.re, O) && n_eq(b.re, O)) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return lt(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return lt(a, b[i][j]);});
    }
    else if (is_vector(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return a.map(function(ai) {return lt(ai, b);});
        }
        else if (is_vector(b))
        {
            if (a.length !== b.length) throw "lt: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return lt(ai, b[i]);});
        }
        else if (is_matrix(b))
        {
            if (a.length !== COLS(b)) throw "lt: inputs have incompatible dimensions";
            return matrix(ROWS(b), COLS(b), function(i, j) {return lt(a[j], b[i][j]);});
        }
    }
    else if (is_matrix(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return matrix(ROWS(a), COLS(a), function(i, j) {return lt(a[i][j], b);});
        }
        else if (is_vector(b))
        {
            if (COLS(a) !== b.length) throw "lt: inputs have incompatible dimensions";
            return matrix(ROWS(a), COLS(a), function(i, j) {return lt(a[i][j], b[j]);});
        }
        else if (is_matrix(b))
        {
            if ((ROWS(a) !== ROWS(b)) || (COLS(a) !== COLS(b))) throw "lt: inputs have incompatible dimensions";
            return matrix(ROWS(a), COLS(a), function(i, j) {return lt(a[i][j], b[i][j]);});
        }
    }
    return 0;
}
$_.lt = lt;
function gt(a, b)
{
    if (is_string(a))
    {
        if (is_string(b)) return a > b ? 1 : 0;
        else if (is_scalar(b)) return a > String(b) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return gt(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return gt(a, b[i][j]);});
    }
    else if (is_num(a))
    {
        if (is_string(b)) return String(a) > b ? 1 : 0;
        else if (is_num(b)) return n_gt(a, b) ? 1 : 0;
        else if (is_complex(b)) return n_gt(b.re, a) && n_eq(b.im, O) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return gt(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return gt(a, b[i][j]);});
    }
    else if (is_complex(a))
    {
        if (is_string(b)) return String(a) > b ? 1 : 0;
        else if (is_num(b)) return n_gt(a.re, b) && n_eq(a.im, O) ? 1 : 0;
        else if (is_complex(b)) return (n_gt(a.re, b.re) && n_eq(a.im, O) && n_eq(b.im, O)) || (n_gt(a.im, b.im) && n_eq(a.re, O) && n_eq(b.re, O)) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return gt(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return gt(a, b[i][j]);});
    }
    else if (is_vector(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return a.map(function(ai) {return gt(ai, b);});
        }
        else if (is_vector(b))
        {
            if (a.length !== b.length) throw "gt: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return gt(ai, b[i]);});
        }
        else if (is_matrix(b))
        {
            if (a.length !== COLS(b)) throw "gt: inputs have incompatible dimensions";
            return matrix(ROWS(b), COLS(b), function(i, j) {return gt(a[j], b[i][j]);});
        }
    }
    else if (is_matrix(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return matrix(ROWS(a), COLS(a), function(i, j) {return gt(a[i][j], b);});
        }
        else if (is_vector(b))
        {
            if (COLS(a) !== b.length) throw "gt: inputs have incompatible dimensions";
            return matrix(ROWS(a), COLS(a), function(i, j) {return gt(a[i][j], b[j]);});
        }
        else if (is_matrix(b))
        {
            if ((ROWS(a) !== ROWS(b)) || (COLS(a) !== COLS(b))) throw "gt: inputs have incompatible dimensions";
            return matrix(ROWS(a), COLS(a), function(i, j) {return gt(a[i][j], b[i][j]);});
        }
    }
    return 0;
}
$_.gt = gt;
function le(a, b)
{
    if (is_string(a))
    {
        if (is_string(b)) return a <= b ? 1 : 0;
        else if (is_scalar(b)) return a <= String(b) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return le(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return le(a, b[i][j]);});
    }
    else if (is_num(a))
    {
        if (is_string(b)) return String(a) <= b ? 1 : 0;
        else if (is_num(b)) return n_le(a, b) ? 1 : 0;
        else if (is_complex(b)) return n_le(b.re, a) && n_eq(b.im, O) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return le(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return le(a, b[i][j]);});
    }
    else if (is_complex(a))
    {
        if (is_string(b)) return String(a) <= b ? 1 : 0;
        else if (is_num(b)) return n_le(a.re, b) && n_eq(a.im, O) ? 1 : 0;
        else if (is_complex(b)) return (n_le(a.re, b.re) && n_eq(a.im, O) && n_eq(b.im, O)) || (n_le(a.im, b.im) && n_eq(a.re, O) && n_eq(b.re, O)) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return le(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return le(a, b[i][j]);});
    }
    else if (is_vector(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return a.map(function(ai) {return le(ai, b);});
        }
        else if (is_vector(b))
        {
            if (a.length !== b.length) throw "le: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return le(ai, b[i]);});
        }
        else if (is_matrix(b))
        {
            if (a.length !== COLS(b)) throw "le: inputs have incompatible dimensions";
            return matrix(ROWS(b), COLS(b), function(i, j) {return le(a[j], b[i][j]);});
        }
    }
    else if (is_matrix(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return matrix(ROWS(a), COLS(a), function(i, j) {return le(a[i][j], b);});
        }
        else if (is_vector(b))
        {
            if (COLS(a) !== b.length) throw "le: inputs have incompatible dimensions";
            return matrix(ROWS(a), COLS(a), function(i, j) {return le(a[i][j], b[j]);});
        }
        else if (is_matrix(b))
        {
            if ((ROWS(a) !== ROWS(b)) || (COLS(a) !== COLS(b))) throw "le: inputs have incompatible dimensions";
            return matrix(ROWS(a), COLS(a), function(i, j) {return le(a[i][j], b[i][j]);});
        }
    }
    return 0;
}
$_.le = le;
function ge(a, b)
{
    if (is_string(a))
    {
        if (is_string(b)) return a >= b ? 1 : 0;
        else if (is_scalar(b)) return a >= String(b) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return ge(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return ge(a, b[i][j]);});
    }
    else if (is_num(a))
    {
        if (is_string(b)) return String(a) >= b ? 1 : 0;
        else if (is_num(b)) return n_ge(a, b) ? 1 : 0;
        else if (is_complex(b)) return n_ge(b.re, a) && n_eq(b.im, O) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return ge(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return ge(a, b[i][j]);});
    }
    else if (is_complex(a))
    {
        if (is_string(b)) return String(a) >= b ? 1 : 0;
        else if (is_num(b)) return n_ge(a.re, b) && n_eq(a.im, O) ? 1 : 0;
        else if (is_complex(b)) return (n_ge(a.re, b.re) && n_eq(a.im, O) && n_eq(b.im, O)) || (n_ge(a.im, b.im) && n_eq(a.re, O) && n_eq(b.re, O)) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return ge(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return ge(a, b[i][j]);});
    }
    else if (is_vector(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return a.map(function(ai) {return ge(ai, b);});
        }
        else if (is_vector(b))
        {
            if (a.length !== b.length) throw "ge: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return ge(ai, b[i]);});
        }
        else if (is_matrix(b))
        {
            if (a.length !== COLS(b)) throw "ge: inputs have incompatible dimensions";
            return matrix(ROWS(b), COLS(b), function(i, j) {return ge(a[j], b[i][j]);});
        }
    }
    else if (is_matrix(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return matrix(ROWS(a), COLS(a), function(i, j) {return ge(a[i][j], b);});
        }
        else if (is_vector(b))
        {
            if (COLS(a) !== b.length) throw "ge: inputs have incompatible dimensions";
            return matrix(ROWS(a), COLS(a), function(i, j) {return ge(a[i][j], b[j]);});
        }
        else if (is_matrix(b))
        {
            if ((ROWS(a) !== ROWS(b)) || (COLS(a) !== COLS(b))) throw "ge: inputs have incompatible dimensions";
            return matrix(ROWS(a), COLS(a), function(i, j) {return ge(a[i][j], b[i][j]);});
        }
    }
    return 0;
}
$_.ge = ge;
function scalar_sign(x)
{
    return is_complex(x) ? x.sign() : realMath.sign(x);
}
$_.ssign = scalar_sign;
function scalar_add(a, b)
{
    if (is_num(a) && is_num(b)) return n_add(a, b);
    else if (is_complex(a) && is_scalar(b)) return a.add(b);
    else if (is_complex(b) && is_scalar(a)) return b.add(a);
    return nan;
}
$_.sadd = scalar_add;
function scalar_sub(a, b)
{
    if (is_num(a) && is_num(b)) return n_sub(a, b);
    else if (is_complex(a) && is_scalar(b)) return a.sub(b);
    else if (is_complex(b) && is_scalar(a)) return b.neg().add(a);
    return nan;
}
$_.ssub = scalar_sub;
function scalar_mul(a, b)
{
    if (is_num(a) && is_num(b)) return n_mul(a, b);
    else if (is_complex(a) && is_scalar(b)) return a.mul(b);
    else if (is_complex(b) && is_scalar(a)) return b.mul(a);
    return nan;
}
$_.smul = scalar_mul;
function scalar_div(a, b)
{
    if (is_num(a) && is_num(b)) return n_div(a, b);
    else if (is_complex(a) && is_scalar(b)) return a.div(b);
    else if (is_complex(b) && is_scalar(a)) return b.inv().mul(a);
    return nan;
}
$_.sdiv = scalar_div;
function scalar_pow(a, b)
{
    if (is_num(a) && is_num(b)) return n_pow(a, b);
    else if (is_complex(a) && is_scalar(b)) return a.pow(b);
    else if (is_complex(b) && is_scalar(a)) return (new complex(a, O)).pow(b);
    return nan;
}
$_.spow = scalar_pow;
function scalar_neg(a)
{
    if (is_num(a)) return n_neg(a);
    else if (is_complex(a)) return a.neg();
    return nan;
}
$_.sneg = scalar_neg;
function scalar_conj(a)
{
    if (is_num(a)) return a;
    else if (is_complex(a)) return a.conj();
    return nan;
}
$_.sconj = scalar_conj;
function scalar_inv(a)
{
    if (is_num(a)) return n_eq(a, O) ? inf : n_inv(a);
    else if (is_complex(a)) return n_eq(a.abs(), O) ? new complex(inf, n_lt(a.im, O) ? inf : -inf) : a.inv();
    return nan;
}
$_.sinv = scalar_inv;
function scalar_abs(a)
{
    if (is_num(a)) return realMath.abs(a);
    else if (is_complex(a)) return a.abs();
    return nan;
}
$_.sabs = scalar_abs;
function scalar_angle(a)
{
    if (is_num(a)) return (n_lt(a, O) ? constant.pi : O);
    else if (is_complex(a)) return a.angle();
    return nan;
}
$_.sangle = scalar_angle;
function add(a, b)
{
    if (is_string(a) && is_string(b))
    {
        // concat
        return a+b;
    }
    else if (is_scalar(a) && is_scalar(b))
    {
        // scalar-scalar
        return scalar_add(a, b);
    }
    else if (is_matrix(a) && is_matrix(b))
    {
        // matrix-matrix
        if ((ROWS(a) === ROWS(b)) && (COLS(a) === COLS(b)))
        {
            return a.map(function(ai, i) {
                var bi = b[i];
                return ai.map(function(aij, j) {
                    return add(aij, bi[j]);
                });
            });
        }
        else
        {
            throw "add: matrix dimensions do not match";
        }
    }
    else if (is_vector(a) && is_vector(b))
    {
        // vector-vector
        if (a.length === b.length)
        {
            return a.map(function(ai, i) {
                return add(ai, b[i]);
            });
        }
        else
        {
            throw "add: vector dimensions do not match";
        }
    }
    else if (is_array(a))
    {
        // matrix-scalar
        return a.map(function(ai) {return add(ai, b);});
    }
    else if (is_array(b))
    {
        // scalar-matrix
        return b.map(function(bi) {return add(a, bi);});
    }
    not_supported("add");
}
$_.add = add;
function sub(a, b)
{
    if (is_scalar(a) && is_scalar(b))
    {
        // scalar-scalar
        return scalar_sub(a, b);
    }
    else if (is_matrix(a) && is_matrix(b))
    {
        // matrix-matrix
        if ((ROWS(a) === ROWS(b)) && (COLS(a) === COLS(b)))
        {
            return a.map(function(ai, i) {
                var bi = b[i];
                return ai.map(function(aij, j) {
                    return sub(aij, bi[j]);
                });
            });
        }
        else
        {
            throw "sub: matrix dimensions do not match";
        }
    }
    else if (is_vector(a) && is_vector(b))
    {
        // vector-vector
        if (a.length === b.length)
        {
            return a.map(function(ai, i) {
                return sub(ai, b[i]);
            });
        }
        else
        {
            throw "sub: vector dimensions do not match";
        }
    }
    else if (is_array(a))
    {
        // matrix-scalar
        return a.map(function(ai) {return sub(ai, b);});
    }
    else if (is_array(b))
    {
        // scalar-matrix
        return b.map(function(bi) {return sub(a, bi);});
    }
    not_supported("sub");
}
$_.sub = sub;
function dotmul(a, b)
{
    if (is_scalar(a) && is_scalar(b))
    {
        // scalar-scalar
        return scalar_mul(a, b);
    }
    else if (is_matrix(a) && is_matrix(b))
    {
        // matrix-matrix
        if ((ROWS(a) === ROWS(b)) && (COLS(a) === COLS(b)))
        {
            return a.map(function(ai, i) {
                var bi = b[i];
                return ai.map(function(aij, j) {
                    return dotmul(aij, bi[j]);
                });
            });
        }
        else
        {
            throw "dotmul: matrix dimensions do not match";
        }
    }
    else if (is_vector(a) && is_vector(b))
    {
        // vector-vector
        if (a.length === b.length)
        {
            return a.map(function(ai, i) {
                return dotmul(ai, b[i]);
            });
        }
        else
        {
            throw "dotmul: vector dimensions do not match";
        }
    }
    else if (is_array(a))
    {
        // matrix-scalar
        return a.map(function(ai) {return dotmul(ai, b);});
    }
    else if (is_array(b))
    {
        // scalar-matrix
        return b.map(function(bi) {return dotmul(a, bi);});
    }
    not_supported("dotmul");
}
$_.dotmul = dotmul;
fn.times = dotmul;
function dotdiv(a, b)
{
    if (is_scalar(a) && is_scalar(b))
    {
        // scalar-scalar
        return scalar_div(a, b);
    }
    else if (is_matrix(a) && is_matrix(b))
    {
        // matrix-matrix
        if ((ROWS(a) === ROWS(b)) && (COLS(a) === COLS(b)))
        {
            return a.map(function(ai, i) {
                var bi = b[i];
                return ai.map(function(aij, j) {
                    return dotdiv(aij, bi[j]);
                });
            });
        }
        else
        {
            throw "dotdiv: matrix dimensions do not match";
        }
    }
    else if (is_vector(a) && is_vector(b))
    {
        // vector-vector
        if (a.length === b.length)
        {
            return a.map(function(ai, i) {
                return dotdiv(ai, b[i]);
            });
        }
        else
        {
            throw "dotdiv: vector dimensions do not match";
        }
    }
    else if (is_array(a))
    {
        // matrix-scalar
        return a.map(function(ai) {return dotdiv(ai, b);});
    }
    else if (is_array(b))
    {
        // scalar-matrix
        return b.map(function(bi) {return dotdiv(a, bi);});
    }
    not_supported("dotdiv");
}
$_.dotdiv = dotdiv;
function dotpow(a, b)
{
    if (is_scalar(a) && is_scalar(b))
    {
        // scalar-scalar
        return scalar_pow(a, b);
    }
    else if (is_matrix(a) && is_matrix(b))
    {
        // matrix-matrix
        if ((ROWS(a) === ROWS(b)) && (COLS(a) === COLS(b)))
        {
            return a.map(function(ai, i) {
                var bi = b[i];
                return ai.map(function(aij, j) {
                    return dotpow(aij, bi[j]);
                });
            });
        }
        else
        {
            throw "dotpow: matrix dimensions do not match";
        }
    }
    else if (is_vector(a) && is_vector(b))
    {
        // vector-vector
        if (a.length === b.length)
        {
            return a.map(function(ai, i) {
                return dotpow(ai, b[i]);
            });
        }
        else
        {
            throw "dotpow: vector dimensions do not match";
        }
    }
    else if (is_array(a))
    {
        // matrix-scalar
        return a.map(function(ai) {return dotpow(ai, b);});
    }
    else if (is_array(b))
    {
        // scalar-matrix
        return b.map(function(bi) {return dotpow(a, bi);});
    }
    not_supported("dotpow");
}
$_.dotpow = dotpow;
fn.power = dotpow;
function mul_tri(A, B)
{
    // faster matrix-matrix mul for A,B nxn upper triangular
    if (COLS(A) === ROWS(B))
    {
        return matrix(ROWS(A), COLS(B), function(i, j) {
            if (j < i) return O; // upper triangular
            for (var cij=O,k=i,kmax=j+1; k<kmax; ++k)
            {
                cij = scalar_add(cij, scalar_mul(A[i][k], B[k][j]));
            }
            return cij;
        });
    }
    throw "mul: matrix-matrix dimensions do not match";
}
function mul(a, b)
{
    if (is_scalar(a) && is_scalar(b))
    {
        // scalar-scalar
        return scalar_mul(a, b);
    }
    else if (is_matrix(a) && is_matrix(b))
    {
        // matrix-matrix
        if (COLS(a) === ROWS(b))
        {
            // TODO maybe optimize matrix-matrix multiplication (eg Strassen algorithm)
            var rows = ROWS(a), cols = COLS(b), rc = ROWS(b);
            return matrix(rows, cols, function(i, j) {
                for (var cij=O,k=0; k<rc; ++k)
                {
                    cij = scalar_add(cij, scalar_mul(a[i][k], b[k][j]));
                }
                return cij;
            });
        }
        else
        {
            throw "mul: matrix-matrix dimensions do not match";
        }
    }
    else if (is_vector(a) && is_matrix(b))
    {
        // vector-matrix
        if (a.length === ROWS(b))
        {
            var rows = 1, cols = COLS(b), rc = a.length;
            return /*array(cols, */matrix(rows, cols, function(i, j) {
                for (var cij=O,k=0; k<rc; ++k)
                {
                    cij = scalar_add(cij, scalar_mul(a[k], b[k][j]));
                }
                return cij;
            });
        }
        else
        {
            throw "mul: vector-matrix dimensions do not match";
        }
    }
    else if (is_matrix(a) && is_vector(b))
    {
        // matrix-vector
        if (COLS(a) === b.length)
        {
            var rows = ROWS(a), cols = 1, rc = b.length;
            return /*array(rows, */matrix(rows, cols, function(i, j) {
                for (var cij=O,k=0; k<rc; ++k)
                {
                    cij = scalar_add(cij, scalar_mul(a[i][k], b[k]));
                }
                return cij;
            });
        }
        else
        {
            throw "mul: matrix-vector dimensions do not match";
        }
    }
    else if (is_vector(a) && is_vector(b))
    {
        // vector-vector outer
        var rows = a.length, cols = b.length;
        return matrix(rows, cols, function(i, j) {
            return scalar_mul(a[i], b[j]);
        });
    }
    else if (is_array(a))
    {
        // matrix-scalar
        return a.map(function(ai) {return mul(ai, b);});
    }
    else if (is_array(b))
    {
        // scalar-matrix
        return b.map(function(bi) {return mul(a, bi);});
    }
    not_supported("mul");
}
$_.mul = mul;
function pow(a, b)
{
    if (is_scalar(a) && is_scalar(b))
    {
        return scalar_pow(a, b);
    }
    else if (is_matrix(a) && (ROWS(a) === COLS(a)) && is_int(b))
    {
        // matrix pow
        b = _(b);
        if (0 > b)
        {
            b = -b;
            a = inv(a);
            if (!a || !a.length) throw "pow: no inverse";
        }
        if (0 === b)
        {
            return eye(ROWS(a));
        }
        else if (1 === b)
        {
            return a;
        }
        else if (2 === b)
        {
            return mul(a, a);
        }
        else
        {
            // exponentiation by squaring
            var pow = eye(ROWS(a));
            while (0 !== b)
            {
                if (b & 1) pow = mul(pow, a);
                b >>= 1;
                if (0 < b) a = mul(a, a);
            }
            return pow;
        }
    }
    not_supported("pow");
}
$_.pow = pow;
fn.mpower = pow;

function neg(a)
{
    if (is_scalar(a)) return scalar_neg(a);
    if (is_array(a)) return a.map(neg);
    return a;
}
$_.neg = neg;

function get(mat, rrange = ':', crange = null)
{
    // indices start from 1 to end
    // B=A(:,[5 6]); B=get(A,':',[5,6]);
    var ret;
    if (is_1d(mat))
    {
        if (is_vector(rrange) && (rrange.length === mat.length) && all(rrange, function(v) {return 0 === _(v) || 1 === _(v);}))
        {
            ret = rrange.reduce(function(ret, v, i) {
                if (1 === _(v)) ret.push(mat[i]);
                return ret;
            }, []);
            if (1 === ret.length) ret = ret[0];
            return ret;
        }
        if (is_scalar(rrange)) rrange = sca(rrange, true);
        if ((':' === rrange) || is_int(rrange) || is_vector(rrange))
        {
            var n = mat.length;
            if (':' === rrange) rrange = colon(1, n);
            if (is_int(rrange)) rrange = [rrange];
            ret = rrange.map(function(r) {
                r = _(r);
                if (1 > r) r += n;
                if (1 > r || r > n) throw "get: index out of bounds";
                return mat[r-1];
            });
            if (1 === ret.length) ret = ret[0];
            return ret;
        }
        throw "get: invalid range";
    }
    if (is_2d(mat))
    {
        var rows = ROWS(mat), cols = COLS(mat), n = rows*cols;
        if (null == crange && is_matrix(rrange) && (ROWS(rrange) === rows) && (COLS(rrange) === cols) && all(rrange, function(v) {return 0 === _(v) || 1 === _(v);}))
        {
            ret = [];
            for (var j=0; j<cols; ++j)
            {
                for (var i=0; i<rows; ++i)
                {
                    if (1 === _(rrange[i][j]))
                    {
                        ret.push(mat[i][j]);
                    }
                }
            }
            if (1 === ret.length) ret = ret[0];
            return ret;
        }
        if (is_scalar(rrange)) rrange = sca(rrange, true);
        if (is_scalar(crange)) crange = sca(crange, true);
        if ((':' === rrange) || is_int(rrange) || is_vector(rrange))
        {
            if (':' === rrange) rrange = colon(1, rows);
            if (is_int(rrange)) rrange = [rrange];
            if (null == crange)
            {
                ret = rrange.map(function(r) {
                    r = _(r);
                    if (1 > r) r += n;
                    if (1 > r || r > n) throw "get: index out of bounds";
                    return mat[(r-1) % rows][stdMath.floor((r-1) / rows)];
                });
                if (1 === ret.length) ret = ret[0];
                return ret;
            }
            else if ((':' === crange) || is_int(crange) || is_vector(crange))
            {
                if (':' === crange) crange = colon(1, cols);
                if (is_int(crange)) crange = [crange];
                ret = rrange.map(function(r) {
                    r = _(r);
                    if (1 > r) r += rows;
                    if (1 > r || r > rows) throw "get: index out of bounds";
                    return crange.map(function(c) {
                        c = _(c);
                        if (1 > c) c += cols;
                        if (1 > c || c > cols) throw "get: index out of bounds";
                        return mat[r-1][c-1];
                    });
                });
                if ((1 === ret.length) && (1 === ret[0].length)) ret = ret[0][0];
                return ret;
            }
        }
        throw "get: invalid range";
    }
    return mat;
}
$_.get = get;
function set(mat, rrange = ':', crange = null, val = null)
{
    // indices start from 1 to end
    // A(:,[5 6]) = B; set(A,':',[5,6], B);
    if (is_1d(mat))
    {
        //val = crange;
        if (is_2d(val)) val = COL(val, 0);
        if (is_vector(rrange) && (rrange.length === mat.length) && all(rrange, function(v) {return 0 === _(v) || 1 === _(v);}))
        {
            if (is_0d(val))
            {
                rrange.forEach(function(v, i) {
                    if (1 === _(v)) mat[i] = val;
                });
                return mat;
            }
            else if (is_array(val))
            {
                var k = 0, nv = val.length;
                rrange.forEach(function(v, i) {
                    if (1 === _(v))
                    {
                        if (k >= nv) throw "set: index out of bounds";
                        mat[i] = val[k++];
                    }
                });
                return mat;
            }
            //throw "set: invalid value or range does not match dimensions";
        }
        if (is_scalar(rrange)) rrange = sca(rrange, true);
        if ((':' === rrange) || is_int(rrange) || is_vector(rrange))
        {
            var n = mat.length, index;
            if (':' === rrange) rrange = colon(1, n);
            if (is_int(rrange)) rrange = [rrange];
            if (is_0d(val))
            {
                rrange.forEach(function(r) {
                    r = _(r);
                    if (1 > r) r += n;
                    if (1 > r || r > n) throw "set: index out of bounds";
                    mat[r-1] = val;
                });
                return mat;
            }
            else if (is_array(val) && (val.length >= rrange.length))
            {
                rrange.forEach(function(r, i) {
                    r = _(r);
                    if (1 > r) r += n;
                    if (1 > r || r > n) throw "set: index out of bounds";
                    mat[r-1] = val[i];
                });
                return mat;
            }
            throw "set: invalid value or range does not match dimensions";
        }
        throw "set: invalid range";
    }
    if (is_2d(mat))
    {
        var rows = ROWS(mat), cols = COLS(mat), n = rows*cols, rowsv, colsv, nv, i, j, iv, jv, k;
        if (is_matrix(rrange) && (ROWS(rrange) === rows) && (COLS(rrange) === cols) && all(rrange, function(v) {return 0 === _(v) || 1 === _(v);}))
        {
            if (is_0d(val))
            {
                rrange.forEach(function(row, i) {
                    row.forEach(function(v, j) {
                        if (1 === _(v)) mat[i][j] = val;
                    });
                });
                return mat;
            }
            else if (is_2d(val))
            {
                rowsv = ROWS(val);
                colsv = COLS(val);
                for (j=0,jv=0; j<cols; ++j,++jv)
                {
                    if (1 === colsv) jv = 0;
                    else if (jv >= colsv) throw "set: index out of bounds";
                    for (i=0,iv=0; i<rows; ++i,++iv)
                    {
                        if (1 === _(rrange[i][j]))
                        {
                            if (1 === rowsv) iv = 0;
                            else if (iv >= rowsv) throw "set: index out of bounds";
                            mat[i][j] = val[iv][jv];
                        }
                    }
                }
                return mat;
            }
            else if (is_array(val))
            {
                nv = val.length;
                for (k=0,j=0; j<cols; ++j)
                {
                    for (i=0; i<rows; ++i)
                    {
                        if (1 === _(rrange[i][j]))
                        {
                            if (k >= nv) throw "set: index out of bounds";
                            mat[i][j] = val[k++];
                        }
                    }
                }
                return mat;
            }
            //throw "set: invalid value or range does not match dimensions";
        }
        if (is_scalar(rrange)) rrange = sca(rrange, true);
        if (is_scalar(crange)) crange = sca(crange, true);
        if ((':' === rrange) || is_int(rrange) || is_vector(rrange))
        {
            if (null == crange)
            {
                if (':' === rrange) rrange = colon(1, n);
                if (is_int(rrange)) rrange = [rrange];
                if (is_0d(val))
                {
                    rrange.forEach(function(r) {
                        r = _(r);
                        if (1 > r) r += n;
                        if (1 > r || r > n) throw "set: index out of bounds";
                        mat[(r-1) % rows][stdMath.floor((r-1) / rows)] = val;
                    });
                    return mat;
                }
                else if (is_2d(val))
                {
                    rowsv = ROWS(val);
                    colsv = COLS(val);
                    rrange.forEach(function(r, i) {
                        r = _(r);
                        if (1 > r) r += n;
                        if (1 > r || r > n) throw "set: index out of bounds";
                        var iv = 1 === rowsv ? 0 : (i % rows),
                            jv = 1 === colsv ? 0 : stdMath.floor(i / rows);
                        if (iv >= rowsv || jv >= colsv) throw "set: index out of bounds";
                        mat[(r-1) % rows][stdMath.floor((r-1) / rows)] = val[iv][jv];
                    });
                    return mat;
                }
                else if (is_array(val) && (val.length >= rrange.length))
                {
                    rrange.forEach(function(r, i) {
                        r = _(r);
                        if (1 > r) r += n;
                        if (1 > r || r > n) throw "set: index out of bounds";
                        mat[(r-1) % rows][stdMath.floor((r-1) / rows)] = val[i];
                    });
                    return mat;
                }
            }
            else if ((':' === crange) || is_int(crange) || is_vector(crange))
            {
                if (':' === rrange) rrange = colon(1, rows);
                if (is_int(rrange)) rrange = [rrange];
                if (':' === crange) crange = colon(1, cols);
                if (is_int(crange)) crange = [crange];
                if (is_0d(val))
                {
                    rrange.forEach(function(r) {
                        r = _(r);
                        if (1 > r) r += rows;
                        if (1 > r || r > rows) throw "set: index out of bounds";
                        crange.forEach(function(c) {
                            c = _(c);
                            if (1 > c) c += cols;
                            if (1 > c || c > cols) throw "set: index out of bounds";
                            mat[r-1][c-1] = val;
                        });
                    });
                    return mat;
                }
                else if (is_2d(val))
                {
                    rowsv = ROWS(val);
                    colsv = COLS(val);
                    rrange.forEach(function(r, iv) {
                        r = _(r);
                        if (1 > r) r += rows;
                        if (1 > r || r > rows) throw "set: index out of bounds";
                        if (1 === rowsv) iv = 0;
                        else if (iv >= rowsv) throw "set: index out of bounds";
                        crange.forEach(function(c, jv) {
                            c = _(c);
                            if (1 > c) c += cols;
                            if (1 > c || c > cols) throw "set: index out of bounds";
                            if (1 === colsv) jv = 0;
                            else if (jv >= colsv) throw "set: index out of bounds";
                            mat[r-1][c-1] = val[iv][jv];
                        });
                    });
                    return mat;
                }
                else if (is_array(val) && (val.length >= rrange.length*crange.length))
                {
                    k = 0;
                    crange.forEach(function(c, j) {
                        c = _(c);
                        if (1 > c) c += cols;
                        if (1 > c || c > cols) throw "set: index out of bounds";
                        rrange.forEach(function(r, i) {
                            r = _(r);
                            if (1 > r) r += rows;
                            if (1 > r || r > rows) throw "set: index out of bounds";
                            mat[r-1][c-1] = val[k++];
                        });
                    });
                    return mat;
                }
            }
            throw "set: invalid value or range does not match dimensions";
        }
        throw "set: invalid range";
    }
    return mat;
}
$_.set = set;
