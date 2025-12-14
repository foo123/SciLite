fn.upper = fn.toupper = function toupper(x) {
    if (is_array(x))
    {
        return x.map(toupper);
    }
    else if (is_string(x))
    {
        return x.toUpperCase();
    }
    return x;
};
