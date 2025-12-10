fn.bin2dec = function bin2dec(x) {
    if (is_array(x))
    {
        return x.map(bin2dec);
    }
    else if (is_string(x))
    {
        return parseInt(x, 2);
    }
    return x;
};
