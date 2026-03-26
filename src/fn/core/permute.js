function permute(x, dimorder)
{
    return tensorview(x).permute(vec(dimorder).map(function(di) {return _(di)-1;})).toNDArray();
}
fn.permute = function(x, dimorder) {
    return permute(x, dimorder);
};
