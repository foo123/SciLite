fn.tolower = function tolower(x) {
    if (is_array(x))
    {
        return x.map(tolower);
    }
    else if (is_string(x))
    {
        return x.toLowerCase();
    }
    return x;
};
