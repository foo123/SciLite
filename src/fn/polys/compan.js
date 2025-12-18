function compan(p)
{
    return matrix(p.length-1, p.length-1, function(i, j) {
        return 0 === i ? scalar_neg(scalar_div(p[j+1], p[0])) : (j+1 === i ? I : O);
        
    });
}
fn.compan = function(p) {
    p = vec(p);
    if (!is_vector(p)) not_supported("compan");
    return compan(p);
};
