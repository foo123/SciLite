fn.string = function string(x) {
    if (is_array(x))
    {
        return x.map(string);
    }
    if (is_string(x))
    {
        return x;
    }
    return String(x);
};
