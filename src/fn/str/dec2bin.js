fn.dec2bin = function dec2bin(x) {
    if (is_array(x))
    {
        return x.map(dec2bin);
    }
    else if (is_number(x))
    {
        return x.toString(2);
    }
    else if (is_decimal(x))
    {
        return x.toBinary();
    }
    return x;
};
