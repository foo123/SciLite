fn['char'] = function tochar(x) {
    x = vec(x);
    if (is_array(x))
    {
        return x.map(tochar);
    }
    if (is_string(x))
    {
        return x.split('');
    }
    if (is_int(x))
    {
        return String.fromCharCode(_(x));
    }
    return String(x);
};
