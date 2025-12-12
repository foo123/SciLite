fn.vander = function(v) {
    v = vec(v);
    if (!is_vector(v)) not_supported("vander");
    return v.map(function(vi) {
        return array(v.length, function(j, vij) {
            return 0 === j ? I : scalar_mul(vij[j-1], vi);
        }).reverse();
    });
};
