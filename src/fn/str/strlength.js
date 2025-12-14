fn.strlength = function(str) {
    if (is_string(str))
    {
        return str.length;
    }
    not_supported("strlength");
};
