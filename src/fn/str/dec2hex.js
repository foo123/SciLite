fn.dec2hex = function dec2hex(x) {
    if (is_array(x))
    {
        return x.map(dec2hex);
    }
    else if (is_number(x))
    {
        return x.toString(16);
    }
    else if (is_decimal(x))
    {
        return x.toHexadecimal();
    }
    return x;
};
