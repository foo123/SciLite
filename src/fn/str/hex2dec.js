fn.hex2dec = function hex2dec(x) {
    if (is_array(x))
    {
        return x.map(hex2dec);
    }
    else if (is_string(x))
    {
        return parseInt(x, 16);
    }
    return x;
};
