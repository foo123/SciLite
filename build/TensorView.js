/**
*  TensorView
*  View array data as multidimensional tensors of various shapes efficiently
*  @VERSION 2.1.0
*  https://github.com/foo123/TensorView
*
**/
!function(root, name, factory) {
"use strict";
if ('object' === typeof exports)
    // CommonJS module
    module.exports = factory();
else if ('function' === typeof define && define.amd)
    // AMD. Register as an anonymous module.
    define(function(req) {return factory();});
else
    root[name] = factory();
}('undefined' !== typeof self ? self : this, 'TensorView', function(undef) {
"use strict";

var proto = 'prototype',
    NOP = function() {},
    stdMath = Math,
    def = Object.defineProperty,
    TypedArray = "undefined" !== typeof Float32Array ? Object.getPrototypeOf(Float32Array) : null;

function TensorView(data, o, _)
{
    if (!(this instanceof TensorView)) return new TensorView(data, o, _);

    var self = this,
        nd_shape = null,
        shape = null,
        ndim = 0,
        stride = null,
        ref = null,
        is_transposed = false,
        is_value = false,
        same_shape = false,
        total = 0,
        computed_total = null,
        aux_indices = null,
        getter, setter, selector;

    function get(index, indices)
    {
        var ret;
        if (getter)
        {
            ret = getter(indices);
        }
        else if (ref)
        {
            ret = ref.get(ref.indices(index));
        }
        else if (nd_shape)
        {
            ret = walk(data, same_shape ? indices : compute_indices(index, nd_shape.length, false, nd_shape, aux_indices));
        }
        else
        {
            ret = is_value ? data : data[index];
        }
        return ret;
    }
    function set(index, indices, value)
    {
        if (setter)
        {
            setter(indices, value);
        }
        else if (ref)
        {
            ref.set(ref.indices(index), value);
        }
        else if (nd_shape)
        {
            walk(data, same_shape ? indices : compute_indices(index, nd_shape.length, false, nd_shape, aux_indices), value);
        }
        else if (is_value)
        {
            data = value;
        }
        else
        {
            data[index] = value;
        }
    }

    o = o || {};

    is_transposed = _ ? !!_.transposed : false;
    getter = _ && is_function(_.get) ? _.get : null;
    setter = _ && is_function(_.set) ? _.set : null;
    selector = _ && is_function(_.select) ? _.select : null;

    shape = o.shape;
    stride = o.stride;

    if (data instanceof TensorView)
    {
        ref = data;
        data = ref.data;
        shape = shape || ref.shape();
        //stride = stride || ref.stride();
        //total = ref.length;
        computed_total = total = product(shape);
    }
    else if (is_array(data))
    {
        is_value = false;
        if (is_array(o.ndarray, true) && o.ndarray.length)
        {
            nd_shape = o.ndarray;
            total = product(nd_shape);
        }
        else if (is_array(data[0]))
        {
            nd_shape = compute_shape(data);
            total = product(nd_shape);
        }
        else
        {
            total = data.length;
        }
        if (!shape || !shape.length) shape = nd_shape ? nd_shape.slice() : [total];
        computed_total = product(shape);
    }
    else
    {
        is_value = null != data;
        if (is_value && (!shape || !shape.length)) shape = [1];
        computed_total = total = product(shape);
    }

    if (computed_total !== total) throw "TensorView shape ("+shape.join(',')+") does not match size "+String(total);
    ndim = shape.length;

    if (!is_array(stride, true) || (stride.length !== ndim))
    {
        stride = compute_stride(ndim, shape, is_transposed);
    }

    if (nd_shape)
    {
        same_shape = (nd_shape === shape) || ((nd_shape.length === shape.length) && (nd_shape.length === shape.filter(function(dim, axis) {return dim === nd_shape[axis];}).length));
        if (!same_shape) aux_indices = new Array(nd_shape.length);
    }

    if (!ndim) total = 0;
    o = _ = null;

    self.dispose = function() {
        ref = null;
        data = null;
        shape = null;
        stride = null;
        nd_shape = null;
        getter = null;
        setter = null;
        selector = null;
        aux_indices = null;
    };
    def(self, 'data', {
        get: function() {return data;},
        set: NOP,
        enumerable: true,
        configurable: false
    });
    def(self, 'dimension', {
        get: function() {return ndim;},
        set: NOP,
        enumerable: true,
        configurable: false
    });
    def(self, 'length', {
        get: function() {return total;},
        set: NOP,
        enumerable: true,
        configurable: false
    });
    self.shape = function(axis) {
        return arguments.length ? shape[axis] : shape.slice();
    };
    self.stride = function(axis) {
        return arguments.length ? stride[axis] : stride.slice();
    };
    self.iterator = function(type, dir) {
        type = "getter-setter" === type ? "getter-setter" : ("setter" === type ? "setter" : "getter");
        dir = -1 === dir ? -1 : 1;
        var axis = 0 < total ? ndim-1 : -1, dax = -1,
            indices = null, ind = null, val, index = 0,
            value = [null, null, null], ret = {value: null};
        return {next:function next(arg) {
            if ((0 > axis) || (axis >= ndim))
            {
                indices = ind = ret = value = null;
                return {done: true};
            }
            else
            {
                for (;;)
                {
                    if (!indices)
                    {
                        if (-1 === dir)
                        {
                            index = total-1;
                            ind = array(ndim, function(axis) {return shape[axis]-1;});
                        }
                        else
                        {
                            index = 0;
                            ind = array(ndim, 0);
                        }
                        indices = ind.slice();

                        if (selector && !selector(indices)) continue;

                        if ("getter-setter" === type)
                        {
                            value[0] = arg(get(index, ind), indices);
                            set(index, ind, value[0]);
                        }
                        else if ("setter" === type)
                        {
                            value[0] = arg;
                            set(index, ind, value[0]);
                        }
                        else
                        {
                            value[0] = get(index, ind);
                        }
                        value[1] = indices;
                        value[2] = index;
                        ret.value = value;
                        break;
                    }
                    else
                    {
                        while ((0 <= axis && axis < ndim) && (0 > ind[axis]+dir || ind[axis]+dir >= shape[axis]))
                        {
                            index -= dir * ind[axis] * stride[axis];
                            axis += dax;
                        }

                        if (0 <= axis && axis < ndim)
                        {
                            index += dir * stride[axis];
                            ind[axis] += dir;
                            indices[axis] = ind[axis];
                            while (0 <= axis-dax && axis-dax < ndim)
                            {
                                axis -= dax;
                                indices[axis] = ind[axis] = -1 === dir ? shape[axis]-1 : 0;
                            }

                            if (selector && !selector(indices)) continue;

                            if ("getter-setter" === type)
                            {
                                value[0] = arg(get(index, ind), indices);
                                set(index, ind, value[0]);
                            }
                            else if ("setter" === type)
                            {
                                value[0] = arg;
                                set(index, ind, value[0]);
                            }
                            else
                            {
                                value[0] = get(index, ind);
                            }
                            value[1] = indices;
                            value[2] = index;
                            ret.value = value;
                            break;
                        }
                        else
                        {
                            indices = ind = ret = value = null;
                            return {done: true};
                        }
                    }
                }
                return ret;
            }
        }};
    };
    self.forEach = function(f, dir) {
        if ((0 < total) && is_function(f))
        {
            var iter = self.iterator("getter", dir), next, ret = null;
            for (;;)
            {
                next = iter.next();
                if (!next || next.done) break;
                ret = f(next.value[0], next.value[1]/*, next.value[2]*/, data, self);
                if (false === ret) break; // if false returned end forEach
            }
        }
        return self;
    };
    self.map = function(f, dir) {
        var mapped = new Array(total),
            iter = self.iterator("getter", dir),
            index = 0, next;
        for (;;)
        {
            next = iter.next();
            if (!next || next.done) break;
            mapped[index++] = f(next.value[0], next.value[1], data, self);
        }
        return new TensorView(mapped, {shape: shape.slice(), stride: stride.slice()});
    };
    self.filter = function(f, dir) {
        var filtered = new Array(total),
            iter = self.iterator("getter", dir),
            index = 0,
            next;
        for (;;)
        {
            next = iter.next();
            if (!next || next.done) break;
            if (f(next.value[0], next.value[1], data, self))
            {
                filtered[index++] = next.value[0];
            }
        }
        if (index < filtered.length) filtered.length = index; // truncate
        return new TensorView(filtered); // flat by default
    };
    self.index = function(/*indices*/) {
        var indices = is_array(arguments[0], true) ? arguments[0] : arguments;
        return compute_index(indices, ndim, is_transposed, shape, stride);
    };
    self.indices = function(index) {
        index = index || 0;
        if (0 > index) index += total;
        if (0 > index || index >= total) throw "TensorView::_indices index ("+index+") is out of bounds (0,"+(total-1)+")!";
        return compute_indices(index, ndim, is_transposed, shape);
    };
    self.get = function(/*indices*/) {
        var indices = is_array(arguments[0], true) ? arguments[0] : arguments, index = 0;
        if (indices.length < ndim) throw "TensorView::get indices do not match shape dimension!";
        index = compute_index(indices, ndim, is_transposed, shape, stride);
        if (0 > index || index >= total) throw "TensorView::get index ("+index+") is out of bounds (0,"+(total-1)+")!";
        return get(index, indices);
    };
    self.set = function(/*indices, value*/) {
        //if (arguments[0] instanceof TensorView) return self.setFrom(arguments[0]);
        var indices = arguments, count = arguments.length-1, index = 0;
        if (is_array(arguments[0], true)) {indices = arguments[0]; count = indices.length;}
        if (count < ndim) throw "TensorView::set indices do not match shape dimension!";
        if (!selector || selector(indices))
        {
            index = compute_index(indices, ndim, is_transposed, shape, stride);
            if (0 > index || index >= total) throw "TensorView::set index ("+index+") is out of bounds (0,"+(total-1)+")!";
            set(index, indices, arguments[arguments.length-1]);
        }
        return self;
    };
    self.setFrom = function(other) {
        if (is_array(other)) other = new TensorView(other);
        else if (!(other instanceof TensorView)) other = new TensorView([other]);
        if ((other instanceof TensorView) && (0 < total) && (0 < other.length))
        {
            var selfiter = self.iterator("setter", 1),
                otheriter = other.iterator("getter", 1),
                selfnext, othernext,
                index, indices, value,
                items = 0;
            for (;;)
            {
                othernext = otheriter.next();
                if (!othernext || othernext.done)
                {
                    if (0 === items)
                    {
                        // empty
                        break;
                    }
                    else if (items < total)
                    {
                        // rewind and continue
                        otheriter = other.iterator();
                        othernext = otheriter.next();
                        //if (!othernext || othernext.done) break;
                    }
                    else
                    {
                        // done
                        break;
                    }
                }
                ++items;
                selfnext = selfiter.next(othernext.value[0]);
                if (!selfnext || selfnext.done)
                {
                    // done
                    break;
                }
            }
        }
        return self;
    };
    self.transpose = function() {
        return ref && is_transposed ? ref /*idempotent*/ : new TensorView(self, {shape: shape.slice().reverse()}, {transposed: !is_transposed});
    };
    self.permute = function(/*permutation*/) {
        var permutation = is_array(arguments[0], true) ? arguments[0] : [].slice.call(arguments);
        if (!is_perm(permutation, ndim))
        {
            throw "TensorView::permute permutation not valid or does not match shape dimension!";
        }
        var ipermutation = invperm(permutation);
        return permutation.length === permutation.filter(function(pi, i) {return pi === i;}).length ? self /*identity*/ : new TensorView(self, {
            shape: permute(shape, permutation)
        }, {
            select: selector ? function(indices) {
                return selector(permute(indices, ipermutation));
            } : null,
            get: function(indices) {
                if (indices.length < ndim) throw "TensorView::get indices do not match shape dimension!";
                return self.get(permute(indices, ipermutation));
            },
            set: function(indices, value) {
                if (indices.length < ndim) throw "TensorView::set indices do not match shape dimension!";
                self.set(permute(indices, ipermutation), value);
            }
        });
    };
    self.reshape = function(new_shape) {
        var new_ndim = new_shape.length;
        if (
            (ndim === new_ndim) &&
            (new_ndim === shape.filter(function(dim, axis) {return dim === new_shape[axis];}).length)
        )
        {
            return self; /*idempotent*/
        }
        if (
            ref &&
            (ref.dimension === new_ndim) &&
            (new_ndim === ref.shape().filter(function(dim, axis) {return dim === new_shape[axis];}).length)
        )
        {
            return ref; /*idempotent*/
        }
        return new TensorView(!ref && (null != data) ? data : self, {shape: new_shape});
    };
    self.reorder = function(new_in_order, new_out_order) {
        new_in_order = compute_order(ndim, new_in_order);
        new_out_order = compute_order(ndim, new_out_order);
        if (new_in_order.length !== ndim || new_out_order.length !== ndim)
        {
            throw "TensorView::reorder order not valid or does not match shape dimension!";
        }
        return new TensorView((new TensorView(self.permute(new_in_order), {shape: permute(shape, invperm(new_out_order))})).permute(new_out_order), {shape: shape.slice()});
    };
    self.slice = function(/*slices*/) {
        var slices = compute_slices((1 === arguments.length) && is_array(arguments[0], true) && (arguments[0].length === shape.length) ? arguments[0] : ([].slice.call(arguments)), shape),
            new_shape = slices.map(function(slice, axis) {
                return compute_slice_length(shape[axis], slice);
            }),
            adjust_indices = function(indices) {
                return slices.map(function(slice, axis) {
                    return null != slice.start ? (slice.start + indices[axis] * slice.step) : (slice[indices[axis]]);
                });
            }
        ;
        return new TensorView(self, {
            shape: new_shape
        }, {
            select: selector ? function(indices) {
                return selector(adjust_indices(indices));
            } : null,
            get: function(indices) {
                if (indices.length < ndim) throw "TensorView::get indices do not match shape dimension!";
                return self.get(adjust_indices(indices));
            },
            set: function(indices, value) {
                if (indices.length < ndim) throw "TensorView::set indices do not match shape dimension!";
                self.set(adjust_indices(indices), value);
            }
        });
    };
    self.select = function(selection) {
        if (false === selection)
        {
            return selector ? ref : self;
        }
        else
        {
            return !is_function(selection) && !is_array(selection) ? self : new TensorView(selector ? ref : self, {
                shape: shape.slice()
            }, {
                select: is_function(selection) ? function(indices) {
                    return selection(indices) ? indices : null;
                } : function(indices) {
                    return indices.reduce(function(sel, i) {
                        return is_array(sel) && (i < sel.length) ? sel[i] : 0;
                    }, selection) ? indices : null;
                }
            });
        }
    };
    self.concat = function(others, on_axis) {
        if (others instanceof TensorView) others = [others];
        on_axis = on_axis || 0;
        var stack = [self].concat(others),
            dims, min_dim, max_dim,
            adjust_shape, aux_indices;
        if ("newaxis" === on_axis)
        {
            dims = stack.map(function(view) {return view.dimension;});
            min_dim = stdMath.min.apply(stdMath, dims);
            max_dim = stdMath.max.apply(stdMath, dims);
            if (max_dim === min_dim) ++max_dim;
            on_axis = max_dim-1;
            adjust_shape = function(view) {
                return view.shape().concat(array(max_dim-view.dimension, 1));
            };
            return self.reshape(adjust_shape(self)).concat(others.map(function(other) {return other.reshape(adjust_shape(other));}), on_axis);
        }
        for (var i=0,n=others.length,matchShape; i<n; ++i)
        {
            matchShape = shape.filter(function(dim, axis) {return (on_axis === axis) || (dim === others[i].shape(axis));});
            if (matchShape.length !== shape.length) throw "TensorView::concat ("+shape.map(function(dim, axis) {return on_axis === axis ? ':' : dim;}).join(',')+") and ("+others[i].shape().map(function(dim, axis) {return on_axis === axis ? ':' : dim;}).join(',')+") shapes do not match!";
        }
        aux_indices = new Array(ndim);
        return new TensorView(null, {
            shape: shape.map(function(dim, axis) {
                return on_axis === axis ? others.reduce(function(total, other) {
                    return total + other.shape(on_axis);
                }, dim) : dim;
            })
        }, {
            get: function(indices) {
                if (indices.length < ndim) throw "TensorView::get indices do not match shape dimension!";
                for (var i=0; i<ndim; ++i)
                {
                    aux_indices[i] = indices[i];
                }
                for (var i=0,n=stack.length,t,tl; i<n; ++i)
                {
                    t = stack[i]; tl = t.shape(on_axis);
                    if (0 <= aux_indices[on_axis] && aux_indices[on_axis] < tl) return t.get(aux_indices);
                    aux_indices[on_axis] -= tl;
                }
            },
            set: function(indices, value) {
                if (indices.length < ndim) throw "TensorView::set indices do not match shape dimension!";
                for (var i=0; i<ndim; ++i)
                {
                    aux_indices[i] = indices[i];
                }
                for (var i=0,n=stack.length,t,tl; i<n; ++i)
                {
                    t = stack[i]; tl = t.shape(on_axis);
                    if (0 <= aux_indices[on_axis] && aux_indices[on_axis] < tl)
                    {
                        t.set(aux_indices, value);
                        return;
                    }
                    aux_indices[on_axis] -= tl;
                }
            }
        });
    };
    self.squeeze = function(start_axis) {
        start_axis = start_axis || 0;
        var new_shape = shape.filter(function(dim, axis) {
                return (axis < start_axis) || (1 !== dim);
            }),
            new_ndim,
            adjust_indices = function(indices) {
                var i = 0;
                return shape.map(function(dim, axis) {
                    return axis < start_axis ? indices[i++] : (1 === dim ? 0 : indices[i++]);
                });
            };
        if (!new_shape.length) new_shape = [1];
        new_ndim = new_shape.length;
        return new_ndim === ndim ? self /*idempotent*/ : new TensorView(self, {
            shape: new_shape
        }, {
            get: function(indices) {
                if (indices.length < new_ndim) throw "TensorView::get indices do not match shape dimension!";
                return self.get(adjust_indices(indices));
            },
            set: function(indices, value) {
                if (indices.length < new_ndim) throw "TensorView::set indices do not match shape dimension!";
                self.set(adjust_indices(indices), value);
            }
        });
    };
}
TensorView.VERSION = '2.1.0';
TensorView[proto] = {
    constructor: TensorView,
    dispose: null,
    data: null,
    dimension: null,
    length: null,
    shape: null,
    stride: null,
    iterator: null,
    forEach: null,
    map: null,
    filter: null,
    index: null,
    indices: null,
    get: null,
    set: null,
    setFrom: null,
    transpose: null,
    permute: null,
    reshape: null,
    reorder: null,
    slice: null,
    select: null,
    concat: null,
    squeeze: null,
    toArray: function(ArrayClass) {
        var self = this, array = new (ArrayClass || Array)(self.length), index = 0;
        self.forEach(function(item/*, indices*/) {array[index++] = item;});
        if (index < array.length) array.length = index; // truncate
        return array;
    },
    toNDArray: function() {
        var self = this,
            shape = self.shape(),
            ndim = shape.length,
            ndarray = ndim ? new Array(shape[0]) : [];
        self.forEach(function(item, indices) {
            for (var a=ndarray,n=ndim-1,i=0,ind; i<n; ++i)
            {
                ind = indices[i];
                if (null == a[ind]) a[ind] = new Array(shape[i+1]);
                a = a[ind];
            }
            a[indices[n]] = item;
        });
        return ndarray;
    },
    toString: function(maxsize, stringify, i0) {
        i0 = i0 || 0;
        if (!is_function(stringify)) stringify = to_string;
        if (!is_num(maxsize, true)) maxsize = Infinity;
        var self = this, shape = self.shape(), ndim = shape.length, ndarray = self.toNDArray();
        return 2 < ndim ? str_nd(ndarray, shape, maxsize, stringify, i0) : (2 === ndim ? str_2d(ndarray, shape, maxsize, stringify) : str_1d(ndarray, shape, maxsize, stringify));
    },
    toTex: function(maxsize, texify, i0) {
        i0 = i0 || 0;
        if (!is_function(texify)) texify = to_string;
        if (!is_num(maxsize, true)) maxsize = Infinity;
        var self = this, shape = self.shape(), ndim = shape.length, ndarray = self.toNDArray();
        return 2 < ndim ? '\\displaylines{'+tex_nd(ndarray, shape, maxsize, texify, i0)+'}' : (2 === ndim ? tex_2d(ndarray, shape, maxsize, texify) : tex_1d(ndarray, shape, maxsize, texify));
    }
};
if (('undefined' !== typeof Symbol) && ('undefined' !== typeof Symbol.iterator))
{
    TensorView[proto][Symbol.iterator] = function() {
        return this.iterator();
    };
}

// utils
function std_eq(a, b)
{
    return a === b;
}
function to_string(x)
{
    return String(x);
}
function is_function(x)
{
    return "function" === typeof x;
}
function is_obj(x)
{
    return "object" === typeof x;
}
function is_num(x, strict)
{
    return ("number" === typeof x) && (!strict || !isNaN(x));
}
function is_string(x)
{
    return "string" === typeof x;
}
function is_array(x, strict)
{
    if (Array.isArray(x)) return true;
    if (strict) return false;
    return TypedArray ? (x instanceof TypedArray) : false;
}
function array(n, v)
{
    n = stdMath.max(0, stdMath.round(n));
    var i, arr = new Array(n);
    for (i=0; i<n; ++i) arr[i] = is_function(v) ? v(i, arr) : v;
    return arr;
}
function walk(a, i, v)
{
    var ai = a, n = i.length-1, j;
    for (j=0; j<n; ++j) ai = ai[i[j]];
    if (2 < arguments.length) ai[i[n]] = v;
    return ai[i[n]];
}
function compute_shape(x)
{
    return is_array(x) ? ([x.length]).concat(compute_shape(x[0])) : [];
}
function compute_stride(ndim, shape, is_transposed)
{
    var axis, stride = new Array(ndim);
    if (is_transposed)
    {
        stride[0] = 1;
        for (axis=1; axis<ndim; ++axis) stride[axis] = stride[axis-1] * shape[axis-1];
    }
    else
    {
        stride[ndim-1] = 1;
        for (axis=ndim-2; axis>=0; --axis) stride[axis] = stride[axis+1] * shape[axis+1];
    }
    return stride;
}
function compute_order(ndim, order)
{
    if ("column-major-reverse" === order)
    {
        order = array(ndim, function(axis) {return ndim-1-(axis < 2 ? 1-axis : axis);});
    }
    else if ("column-major" === order)
    {
        order = array(ndim, function(axis) {return axis < 2 ? 1-axis : axis;});
    }
    else if ("row-major-reverse" === order)
    {
        order = array(ndim, function(axis) {return ndim-1-axis;});
    }
    else if (("row-major" === order) || !order || (ndim !== order.length))
    {
        order = array(ndim, function(axis) {return axis;});
    }
    return order;
}
function compute_index(indices, ndim, is_transposed, shape, stride)
{
    // compute single index from multidimensional indices
    var index = 0, axis, i;
    for (axis=0; axis<ndim; ++axis)
    {
        i = indices[axis];
        if (0 > i) i += shape[axis];
        if (0 > i || i >= shape[axis]) throw "TensorView index ("+indices[axis]+") for dimension ("+axis+") is out of bounds (0,"+(shape[axis]-1)+")!";
        index += stride[axis] * i;
    }
    return index;
}
function compute_indices(index, ndim, is_transposed, shape, indices)
{
    // compute multidimensional indices from single index
    indices = indices || new Array(ndim);
    var axis, i;
    if (is_transposed)
    {
        for (axis=0; axis<ndim; ++axis)
        {
            i = index % shape[axis];
            index = stdMath.floor(index / shape[axis]);
            indices[axis] = i;
        }
    }
    else
    {
        for (axis=ndim-1; axis>=0; --axis)
        {
            i = index % shape[axis];
            index = stdMath.floor(index / shape[axis]);
            indices[axis] = i;
        }
    }
    return indices;
}
function compute_slices(slices, shape)
{
    while (slices.length < shape.length) slices = slices.concat(":");
    return slices.slice(0, shape.length).map(function(slice, i) {
        if (is_string(slice))
        {
            slice = slice.trim();
            if (":" === slice)
            {
                slice = {start:0, end:shape[i]-1, step:1};
            }
            else if (-1 < slice.indexOf(":"))
            {
                slice = slice.split(":");
                slice = slice.length > 2 ? {start:+slice[0], end:+slice[2], step:+slice[1]} : {start:+slice[0], end:+slice[1], step:1};
            }
            else if (-1 < slice.indexOf(","))
            {
                slice = slice.split(",").map(function(index) {
                    index = +index;
                    if (0 > index) index += shape[i];
                    return index;
                });
            }
            else
            {
                slice = ([+slice]).map(function(index) {
                    if (0 > index) index += shape[i];
                    return index;
                });
            }
        }
        else if (is_num(slice, true))
        {
            slice = ([slice]).map(function(index) {
                if (0 > index) index += shape[i];
                return index;
            });
        }
        else if (is_array(slice, true))
        {
            //slice = slice.length > 2 ? {start:slice[0], end:slice[2], step:slice[1]} : {start:slice[0], end:slice[1], step:1};
            slice = slice.map(function(index) {
                index = +index;
                if (0 > index) index += shape[i];
                return index;
            });
        }
        else if ((null == slice.start) && (null == slice.end))
        {
            slice = {start:0, end:shape[i]-1, step:1};
        }
        if (is_array(slice, true))
        {
            slice = slice.filter(function(index) {
                return 0 <= index && index < shape[i];
            });
        }
        else
        {
            if (null == slice.start) slice.start = 0;
            if (null == slice.end) slice.end = shape[i]-1;
            if (null == slice.step) slice.step = 1;
            slice.start = slice.start || 0;
            slice.end = slice.end || 0;
            slice.step = slice.step || 1;
            if (0 > slice.start) slice.start += shape[i];
            if (0 > slice.end) slice.end += shape[i];
            slice.start = clamp(slice.start, 0, shape[i]-1);
            slice.end = clamp(slice.end, 0, shape[i]-1);
            slice.step = clamp(slice.step, -shape[i], shape[i]);
            slice.end = slice.start + slice.step*stdMath.floor(stdMath.abs(slice.end-slice.start)/stdMath.abs(slice.step));
        }
        return slice;
    });
}
function compute_slice_length(length, slice)
{
    if (is_array(slice, true))
    {
        return !length ? 0 : (slice.length);
    }
    else
    {
        if (!length || (0 > slice.step && (slice.start < 0 || slice.start < slice.end)) || (0 < slice.step && (slice.start >= length || slice.start > slice.end))) return 0;
        return stdMath.min(length, stdMath.ceil((stdMath.abs(slice.end-slice.start)+1)/stdMath.abs(slice.step)));
    }
}
function is_perm(p, n)
{
    if (p.length !== n) return false;
    var i, cnt = array(n, 0);
    for (i=0; i<n; ++i)
    {
        if ((0 > p[i]) || (p[i] >= n)) return false;
        ++cnt[p[i]];
    }
    return cnt.filter(function(cnt) {return 1 === cnt;}).length === n;
}
function invperm(p)
{
    var i, n = p.length, ip = new Array(n);
    for (i=0; i<n; ++i) ip[p[i]] = i;
    return ip;
}
function compose(/*perms*/)
{
    for (var res=arguments[0],i=1,n=arguments.length; i<n; ++i)
    {
        res = permute(res, arguments[i]);
    }
    return res;
}
function permute(arr, perm)
{
    return perm ? array(arr.length, function(i) {
        return arr[perm[i]];
    }) : arr;
}
function project(x, i, j)
{
    j = j || 0;
    if (is_array(x, true))
    {
        return ':' === i[j] ? x.map(function(xj) {return project(xj, i, j+1);}) : project(x[i[j]], i, j+1);
    }
    return x;
}
function pad(s, n, z, after)
{
    var p = s.length < n ? (new Array(n-s.length+1)).join(z) : '';
    return after ? (s + p) : (p + s);
}
function clamp(x, min, max)
{
    return stdMath.min(stdMath.max(x, min), max);
}
function add(a, b)
{
    return a + b;
}
function mul(a, b)
{
    return a * b;
}
function sum(array)
{
    return array.reduce(add, 0);
}
function product(array)
{
    return array.reduce(mul, 1);
}
function str_1d(x, shape, MAXPRINTSIZE, stringify)
{
    if (shape[0] > MAXPRINTSIZE)
    {
        x = x.slice(0, stdMath.round(MAXPRINTSIZE/2)).concat(['..']).concat(x.slice(-stdMath.round(MAXPRINTSIZE/2)+1));
    }
    return '[' + x.map(stringify).join('  ') + ']';
}
function str_2d(x, shape, MAXPRINTSIZE, stringify)
{
    var use_ddots = false;
    if (shape[1] > MAXPRINTSIZE)
    {
        x = x.map(function(row) {
            return row.slice(0, stdMath.round(MAXPRINTSIZE/2)).concat('..').concat(row.slice(-stdMath.round(MAXPRINTSIZE/2)+1));
        });
        use_ddots = true;
    }
    if (shape[0] > MAXPRINTSIZE)
    {
        x = x.slice(0, stdMath.round(MAXPRINTSIZE/2)).concat([array(x[0].length, function(i) {return stdMath.round(MAXPRINTSIZE/2) === i ? (use_ddots ? ':.' : ':') : ':';})]).concat(x.slice(-stdMath.round(MAXPRINTSIZE/2)+1));
    }
    var ln = array(x[0].length, function(col) {
        return x.map(function(row) {return row[col];}).reduce(function(l, xi) {
            return stdMath.max(l, stringify(xi).length);
        }, 0);
    });
    return x.map(function(row, i) {
        return '[' + row.map(function(xij, j) {
            return pad(stringify(xij), ln[j], ' ');
        }).join('  ') + ']';
    }).join('\n');
}
function str_nd(x, shape, MAXPRINTSIZE, stringify, i0, indices)
{
    if (null == indices) indices = [];
    var str = '', ind, i, n, lim;
    if (shape.length === 2 + indices.length)
    {
        ind = [':', ':'].concat(indices);
        str += 'array(' + ind.map(function(i) {return is_string(i) ? i : String(i + i0);}).join(',') + ')' + "\n" + str_2d(project(x, ind), shape, MAXPRINTSIZE, stringify);
    }
    else
    {
        n = shape[2+indices.length];
        lim = stdMath.min(n, stdMath.round(MAXPRINTSIZE/2));
        for (i=0; i<lim; ++i)
        {
            if (str.length) str += "\n";
            str += str_nd(x, shape, MAXPRINTSIZE, stringify, i0, indices.concat(i));
        }
        if (lim < n)
        {
            if (str.length) str += "\n:";
            for (i=n-lim; i<n; ++i)
            {
                if (str.length) str += "\n";
                str += str_nd(x, shape, MAXPRINTSIZE, stringify, i0, indices.concat(i));
            }
        }
    }
    return str;
}
function tex_1d(x, shape, MAXPRINTSIZE, texify)
{
    if (shape[0] > MAXPRINTSIZE)
    {
        x = x.slice(0, stdMath.round(MAXPRINTSIZE/2)).concat(['\\cdots']).concat(x.slice(-stdMath.round(MAXPRINTSIZE/2)+1));
    }
    return x.map(texify).join(' \\hskip 1em ');
}
function tex_2d(x, shape, MAXPRINTSIZE, texify)
{
    var use_ddots = false;
    if (shape[1] > MAXPRINTSIZE)
    {
        x = x.map(function(row) {
            return row.slice(0, stdMath.round(MAXPRINTSIZE/2)).concat(['\\cdots']).concat(row.slice(-stdMath.round(MAXPRINTSIZE/2)+1));
        });
        use_ddots = true;
    }
    if (shape[0] > MAXPRINTSIZE)
    {
        x = x.slice(0, stdMath.round(MAXPRINTSIZE/2)).concat([array(x[0].length, function(i) {return stdMath.round(MAXPRINTSIZE/2) === i ? (use_ddots ? '\\ddots' : '\\vdots') : '\\vdots';})]).concat(x.slice(-stdMath.round(MAXPRINTSIZE/2)+1));
    }
    return '\\begin{bmatrix}'+ x.map(function(xi) {return xi.map(texify).join(' & \\hskip 1em ');}).join(' \\\\ ') + '\\end{bmatrix}';
}
function tex_nd(x, shape, MAXPRINTSIZE, texify, i0, indices)
{
    if (null == indices) indices = [];
    var tex = '', ind, i, n, lim;
    if (shape.length === 2 + indices.length)
    {
        ind = [':', ':'].concat(indices);
        tex += '\\text{array}(' + ind.map(function(i) {return is_string(i) ? i : String(i + i0);}).join(',') + ')' + " \\\\ " + tex_2d(project(x, ind), shape, MAXPRINTSIZE, texify);
    }
    else
    {
        n = shape[2+indices.length];
        lim = stdMath.min(n, stdMath.round(MAXPRINTSIZE/2));
        for (i=0; i<lim; ++i)
        {
            if (tex.length) tex += "\\\\";
            tex += tex_nd(x, shape, MAXPRINTSIZE, texify, i0, indices.concat(i));
        }
        if (lim < n)
        {
            if (tex.length) tex += "\\\\ \\vdots";
            for (i=n-lim; i<n; ++i)
            {
                if (tex.length) tex += "\\\\";
                tex += tex_nd(x, shape, MAXPRINTSIZE, texify, i0, indices.concat(i));
            }
        }
    }
    return tex;
}

// export it
return TensorView;
});
