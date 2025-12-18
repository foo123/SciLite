// interpreter
function TRUE(x)
{
    if (is_string(x))
    {
        return 0 < x.length;
    }
    else if (is_nan(x))
    {
        return false;
    }
    else if (is_number(x))
    {
        return 0 !== x;
    }
    else if (is_decimal(x))
    {
        return !x.eq(O);
    }
    else if (is_complex(x))
    {
        return !n_eq(x.re, O) || !n_eq(x.im, O);
    }
    else if (is_array(x))
    {
        if (!x.length) return false;
        for (var i=0,n=x.length; i<n; ++i)
        {
            if (!TRUE(x[i])) return false;
        }
        return true;
    }
    return true === x ? true : false;
}

var PREFIX = -1,
    INFIX = 0,
    POSTFIX = 1,
    LEFT = -1,
    RIGHT = 1,
    COMMUTATIVE = 1,
    NONCOMMUTATIVE = 0,
    ANTICOMMUTATIVE = -1
;

var OP = {
    "[]": {
     name         : 'literal_array'
    ,arity        : 1
    ,fixity       : PREFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 0
    ,fn           : function(/*args..*/) {
                        var arr = [], row = [];
                        [].forEach.call(arguments, function(arg) {
                            if (',' === arg)
                            {
                                // pass
                            }
                            else if (';' === arg)
                            {
                                if (row.length)
                                {
                                    if (is_array(row[0]))
                                    {
                                        arr = arr.length ? cat("vert", arr, row) : row;
                                    }
                                    else
                                    {
                                        arr.push(row);
                                    }
                                    row = [];
                                }
                            }
                            else
                            {
                                if (is_instance(arg, variable))
                                {
                                    row.push(arg);
                                }
                                else if (is_array(arg))
                                {
                                    row = row.length ? cat("horz", row, arg) : arg;
                                }
                                else
                                {
                                    row.push(arg);
                                }
                            }
                        });
                        if (row.length)
                        {
                            if (is_array(row[0]))
                            {
                                arr = arr.length ? cat("vert", arr, row) : row;
                            }
                            else if (arr.length)
                            {
                                arr.push(row);
                            }
                            else
                            {
                                arr = row;
                            }
                        }
                        return arr;
                    }
    },
    "(:)": {
     name         : 'colon'
    ,arity        : 1
    ,fixity       : POSTFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 30
    ,fn           : function(arg0) {
                        return colon(arg0);
                    }
    },
    ":": {
     name         : 'colon1'
    ,arity        : 2
    ,fixity       : POSTFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 30
    ,fn           : function(arg0, arg1) {
                        return colon(arg0, arg1);
                    }
    },
    "::": {
     name         : 'colon2'
    ,arity        : 3
    ,fixity       : POSTFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 30
    ,fn           : function(arg0, arg1, arg2) {
                        return colon(arg0, arg1, arg2);
                    }
    },
    "'": {
     name         : 'ctranspose'
    ,arity        : 1
    ,fixity       : POSTFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 10
    ,fn           : function(arg0) {
                        return ctranspose(arg0);
                    }
    },
    ".'": {
     name         : 'transpose'
    ,arity        : 1
    ,fixity       : POSTFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 10
    ,fn           : function(arg0) {
                        return transpose(arg0);
                    }
    },
    '^': {
     name         : 'pow'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 15
    ,fn           : function(arg0, arg1) {
                        return pow(arg0, arg1);
                    }
    },
    '.^': {
     name         : 'dotpow'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 15
    ,fn           : function(arg0, arg1) {
                        return dotpow(arg0, arg1);
                    }
    },
    '\\': {
     name         : 'mldivide'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 20
    ,fn           : function(arg0, arg1) {
                        return mldivide(arg0, arg1);
                    }
    },
    '/': {
     name         : 'div'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 20
    ,fn           : function(arg0, arg1) {
                        return dotdiv(arg0, arg1);
                    }
    },
    './': {
     name         : 'dotdiv'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 20
    ,fn           : function(arg0, arg1) {
                        return dotdiv(arg0, arg1);
                    }
    },
    '*': {
     name         : 'mul'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: COMMUTATIVE
    ,priority     : 20
    ,fn           : function(arg0, arg1) {
                        return mul(arg0, arg1);
                    }
    },
    '.*': {
     name         : 'dotmul'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: COMMUTATIVE
    ,priority     : 20
    ,fn           : function(arg0, arg1) {
                        return dotmul(arg0, arg1);
                    }
    },
    '+': {
     name         : 'add'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: COMMUTATIVE
    ,priority     : 25
    ,fn           : function(arg0, arg1) {
                        return add(arg0, arg1);
                    }
    },
    '-': {
     name         : 'sub'
    ,arity        : 2
    ,arityalt     : 1
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: ANTICOMMUTATIVE
    ,priority     : 25
    ,fn           : function(arg0, arg1) {
                        return 1 === arguments.length ? neg(arg0) : sub(arg0, arg1);
                    }
    },
    '>=': {
     name         : 'ge'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 35
    ,fn           : function(arg0, arg1) {
                        return ge(arg0, arg1);
                    }
    },
    '<=': {
     name         : 'le'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 35
    ,fn           : function(arg0, arg1) {
                        return le(arg0, arg1);
                    }
    },
    '>': {
     name         : 'gt'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 35
    ,fn           : function(arg0, arg1) {
                        return gt(arg0, arg1);
                    }
    },
    '<': {
     name         : 'lt'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 35
    ,fn           : function(arg0, arg1) {
                        return lt(arg0, arg1);
                    }
    },
    '~=': {
     name         : 'ne'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: COMMUTATIVE
    ,priority     : 40
    ,fn           : function(arg0, arg1) {
                        return ne(arg0, arg1);
                    }
    },
    '==': {
     name         : 'eq'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: COMMUTATIVE
    ,priority     : 40
    ,fn           : function(arg0, arg1) {
                        return eq(arg0, arg1);
                    }
    },
    '&&': {
     name         : 'and'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: COMMUTATIVE
    ,priority     : 32
    ,fn           : function(arg0, arg1) {
                        return TRUE(arg0) && TRUE(arg1) ? 1 : 0;
                    }
    },
    '||': {
     name         : 'or'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: COMMUTATIVE
    ,priority     : 33
    ,fn           : function(arg0, arg1) {
                        return TRUE(arg0) || TRUE(arg1) ? 1 : 0;
                    }
    },
    'xor': {
     name         : 'xor'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: COMMUTATIVE
    ,priority     : 33
    ,fn           : function(arg0, arg1) {
                        var a = TRUE(arg0), b = TRUE(arg1);
                        return (a && !b) || (b && !a) ? 1 : 0;
                    }
    },
    '~': {
     name         : 'not'
    ,arity        : 1
    ,fixity       : PREFIX
    ,associativity: LEFT
    ,commutativity: ANTICOMMUTATIVE
    ,priority     : 31
    ,fn           : function(arg0) {
                        return TRUE(arg0) ? 0 : 1;
                    }
    },
    '=': {
     name         : 'set'
    ,breakpoint   : 'set'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 45
    ,fn           : async function(arg0, arg1) {
                        if (is_array(arg0) && is_instance(arg0[0], variable))
                        {
                            // de-structuring
                            var vars = arg0, val = arg1;
                            if (is_array(val))
                            {
                                vars = await Promise.all(vars.map(function(vari, i) {
                                    return set_var(vari, i < val.length ? val[i] : null);
                                }));
                            }
                            else
                            {
                                vars = await Promise.all(vars.map(function(vari, i) {
                                    return set_var(vari, 0 === i ? val : null);
                                }));
                            }
                            return vars;
                        }
                        else
                        {
                            return await set_var(arg0, arg1.$scilitevarargout$ ? arg1[0] : arg1);
                        }
                    }
    }
};
$.op = OP;

async function set_var($var, $val)
{
    if (!is_instance($var, variable) || !is_string($var.v)) throw "setting non-variable";
    await $var.set($val);
    return await $var.get(true);
}

async function if_end($arg, v, $)
{
    var i, j, k, n, statements, res, ans = null;
    if (TRUE(await vale($arg['if'].cond, v, $)))
    {
        statements = $arg['if'].statements;
        for (i=0,n=statements.length; i<n; ++i)
        {
            res = await vale(statements[i], v, $);
            if (null != res) ans = res;
        }
        return ans;
    }
    if ($arg['elseif'].length)
    {
        for (j=0,k=$arg['elseif'].length; j<k; ++j)
        {
            if (TRUE(await vale($arg['elseif'][j].cond, v, $)))
            {
                statements = $arg['elseif'][j].statements;
                for (i=0,n=statements.length; i<n; ++i)
                {
                    res = await vale(statements[i], v, $);
                    if (null != res) ans = res;
                }
                return ans;
            }
        }
    }
    if ($arg['else'].statements.length)
    {
        statements = $arg['else'].statements;
        for (i=0,n=statements.length; i<n; ++i)
        {
            res = await vale(statements[i], v, $);
            if (null != res) ans = res;
        }
        return ans;
    }
}

async function for_end($arg, v, $)
{
    var i, n, j, k, res, ans = null,
        brk, is_break = false,
        cont, is_continue = false,
        values = await vale($arg.val, v, $),
        statements = $arg.statements;
    if (is_array(values))
    {
        $ = $ || {};
        brk = $.brk;
        cont = $.cont;
        $.brk = function() {is_break = true;};
        $.cont = function() {is_continue = true;};
        for (j=0,k=values.length; j<k; ++j)
        {
            is_break = false;
            is_continue = false;
            await $arg.ind.set(values[j]);
            for (i=0,n=statements.length; i<n; ++i)
            {
                res = await vale(statements[i], v, $);
                if (is_break || is_continue) break;
                if (null != res) ans = res;
            }
            if (is_break) break;
            else if (is_continue) continue;
        }
        $.brk = brk;
        $.cont = cont;
    }
    return ans;
}

async function while_end($arg, v, $)
{
    var i, n, res, ans = null,
        brk, is_break = false,
        cont, is_continue = false,
        statements = $arg.statements;
    $ = $ || {};
    brk = $.brk;
    cont = $.cont;
    $.brk = function() {is_break = true;};
    $.cont = function() {is_continue = true;};
    while (TRUE(await vale($arg.cond, v, $)))
    {
        is_break = false;
        is_continue = false;
        for (i=0,n=statements.length; i<n; ++i)
        {
            res = await vale(statements[i], v, $);
            if (is_break || is_continue) break;
            if (null != res) ans = res;
        }
        if (is_break) break;
        else if (is_continue) continue;
    }
    $.brk = brk;
    $.cont = cont;
    return ans;
}

function variable(ctx, v, i)
{
    var self = this;
    if (!is_instance(self, variable)) return new variable(ctx, v, i);
    self.ctx = ctx;
    self.v = v;
    self.i = i;
}
variable.prototype = {
    constructor: variable,
    ctx: null,
    v: null,
    i: null,
    get: async function(orig) {
        var self = this, val, s, i;
        if (is_instance(self.v, expr))
        {
            val = await vale(self.v);
        }
        else
        {
            if (!HAS.call(self.ctx, self.v) && !HAS.call(constant, self.v))
            {
                throw 'undefined variable "'+self.v+'"';
            }
            val = HAS.call(self.ctx, self.v) ? self.ctx[self.v] : constant[self.v];
        }
        if ((true !== orig) && (null != self.i))
        {
            s = size(val);
            i = await Promise.all(self.i.map(function(ind, i) {
                return vale(ind, {end:1 === self.i.length ? s[0]*s[1] : s[i]});
            }));
            return get.apply(null, [val].concat(i));
        }
        return val;
    },
    set: async function(value) {
        var self = this, val, s, i;
        if (null != self.i)
        {
            if (is_instance(self.v, expr))
            {
                val = await vale(self.v);
            }
            else
            {
                if (!HAS.call(self.ctx, self.v)) throw 'undefined variable "'+self.v+'"';
                val = self.ctx[self.v];
            }
            s = size(val);
            i = await Promise.all(self.i.map(function(ind, i) {
                return vale(ind, {end:1 === self.i.length ? s[0]*s[1] : s[i]});
            }));
            if (1 === i.length) i = i.concat(null); // null crange
            set.apply(null, [val].concat(i).concat([value]));
        }
        else
        {
            if (is_instance(self.v, expr))
            {
                // nothing
            }
            else
            {
                self.ctx[self.v] = value;
            }
        }
        return self;
    },
    isset: function() {
        return is_string(this.v) && HAS.call(this.ctx, this.v);
    },
    isByRef: function() {
        return (null == this.i);
    }
};
async function val(x)
{
    return is_instance(x, variable) ? await x.get() : x;
}

function expr(op, arg)
{
    var self = this;
    if (!is_instance(self, expr)) return new expr(op, arg);
    if (null == arg)
    {
        arg = op;
        op = '';
    }
    self.op = op;
    self.arg = arg;
}
expr.prototype = {
    constructor: expr,
    op: null,
    arg: null
};
async function vale(x, v, $)
{
    if (is_instance(x, expr))
    {
        return await evaluate(x, v, $);
    }
    else if (is_array(x))
    {
        //return await Promise.all(x.map(function(xi) {return vale(xi, v, $);}));
        for (var i=0,n=x.length,y=new Array(n); i<n; ++i)
        {
            y[i] = await vale(x[i], v, $);
        }
        return y;
    }
    return x;
}

function parse(s, ctx, lineStart, posStart)
{
    var i = 0, l = 0, j, t = s;

    function error(msg, pos, ln)
    {
        if (null == ln) ln = l;
        if (null == pos) pos = i;
        var line = t.split("\n")[ln];
        msg = String(msg) + ' at line ' + String((lineStart||0)+ln) + ' position ' + String((posStart||0)+pos) + ':';
        return (msg + "\n" + line + "\n" + (new Array(pos+1)).join(' ') + '^' + "\n");
    }

    function parse_until(expected)
    {
        var match, m, n, c,
            op, term, arg,
            tmp, tmp2,
            terms = [], ops = [],
            statements = [];

        function merge(up_to_end)
        {
            // generalized shunting-yard algorithm
            if (!ops.length) return;
            var o, op, opc,
                o2, op2, opc2,
                result, args;
            if (up_to_end)
            {
                while (0 < ops.length)
                {
                    o2 = ops.shift();
                    op2 = o2[0];
                    opc2 = OP[op2];

                    if (up_to_end === opc2.breakpoint)
                    {
                        ops.unshift(o2);
                        break;
                    }
                    if (opc2.arity > terms.length)
                    {
                        if ((null != opc2.arityalt) && (opc2.arityalt <= terms.length))
                        {
                            args = terms.splice(0, opc2.arityalt).reverse();
                        }
                        else
                        {
                            throw error('invalid or missing argument for "'+op2+'"', o2[1], o2[2]);
                        }
                    }
                    else
                    {
                        args = terms.splice(0, opc2.arity).reverse();
                    }
                    result = expr(opc2.fn, args);
                    terms.unshift(result);
                }
            }
            else
            {
                o = ops.shift();
                op = o[0];
                opc = OP[op];
                if (POSTFIX === opc.fixity)
                {
                    // postfix assumed to be already in correct order,
                    // no re-structuring needed
                    if (opc.arity > terms.length)
                    {
                        if ((null != opc.arityalt) && (opc.arityalt <= terms.length))
                        {
                            args = terms.splice(0, opc.arityalt).reverse();
                        }
                        else
                        {
                            throw error('invalid or missing argument for "'+op+'"', o[1], o[2]);
                        }
                    }
                    else
                    {
                        args = terms.splice(0, opc.arity).reverse();
                    }
                    result = expr(opc.fn, args);
                    terms.unshift(result);
                }
                else if (PREFIX === opc.fixity)
                {
                    // prefix assumed to be already in reverse correct order,
                    // just push to op queue for later re-ordering
                    ops.unshift(o);
                }
                else //if (INFIX === opc.fixity)
                {
                    while (0 < ops.length)
                    {
                        o2 = ops[0];
                        op2 = o2[0];
                        opc2 = OP[op2];

                        if (
                            (opc2.priority < opc.priority ||
                            (opc2.priority === opc.priority &&
                            (opc2.associativity < opc.associativity ||
                            (opc2.associativity === opc.associativity &&
                            LEFT === opc2.associativity))))
                        )
                        {
                            if (opc2.arity > terms.length)
                            {
                                if ((null != opc2.arityalt) && (opc2.arityalt <= terms.length))
                                {
                                    args = terms.splice(0, opc2.arityalt).reverse();
                                }
                                else
                                {
                                    throw error('invalid or missing argument for "'+op2+'"', o2[1], o2[2]);

                                }
                            }
                            else
                            {
                                args = terms.splice(0, opc2.arity).reverse();
                            }
                            result = expr(opc2.fn, args);
                            terms.unshift(result);
                            ops.shift();
                        }
                        else
                        {
                            break;
                        }
                    }
                    ops.unshift(o);
                }
            }
        }

        function end(and_reset)
        {
            merge(true);
            if ((1 < terms.length) || (0 < ops.length)) throw error('mismatched terms and operators', ops.length ? ops[0][1] : i, ops.length ? ops[0][2] : l);
            if (true === and_reset)
            {
                if (is_instance(terms[0], expr)) statements.push(terms[0]);
                terms = [];
                ops = [];
            }
        }

        function can_merge()
        {
            return ops.reduce(function(used_terms, op) {
                var opc = OP[op[0]];
                return used_terms + ((opc.arity > terms.length-used_terms) && (null != opc.arityalt) ? opc.arityalt : opc.arity);
            }, 0) <= terms.length;
        }

        function eat(pattern, group)
        {
            var match = pattern.test ? s.match(pattern) : (pattern === s.slice(0, pattern.length)), offset;
            if (match)
            {
                if (false === group)
                {
                    return pattern.test ? match : [pattern, pattern];
                }
                if (pattern.test) // regexp
                {
                    offset = match[group || 0].length;
                    s = s.slice(offset);
                    i += offset;
                    return match;
                }
                else // string
                {
                    offset = pattern.length;
                    s = s.slice(offset);
                    i += offset;
                    return [pattern, pattern];
                }
            }
            return false;
        }

        function findmatching(close, open, skipstring)
        {
            var c, j = 0, k = 0, t;
            while (j < s.length)
            {
                c = s.charAt(j);
                if (skipstring && ('"' === c || "'" === c))
                {
                    // string, skip
                    j = string_literal(c, false, j+1)[1];
                    continue;
                }
                if (open === c)
                {
                    ++k;
                }
                else if (close === c)
                {
                    if (0 === k) break;
                    --k;
                }
                ++j;
            }
            return k || (j >= s.length) ? -1 : j;
        }

        function string_literal(q, eat, j0)
        {
            var c, j = j0 || 0, r = '';
            while (j < s.length)
            {
                c = s.charAt(j);
                if (q === c)
                {
                    if ((j+1 < s.length) && (q === s.charAt(j+1)))
                    {
                        r += c;
                        j += 2;
                    }
                    else
                    {
                        break;
                    }
                }
                else
                {
                    r += c;
                    j += 1;
                }
            }
            if (eat)
            {
                s = s.slice(j+1);
                i += j+1;
            }
            return [r, j+1];
        }

        function array_literal()
        {
            var tmp, arg, entry, j = findmatching(']', '[', true);
            if (-1 === j) throw error('mismatched brackets');
            tmp = s.slice(0, j);
            if (/[\[\]]/.test(tmp))
            {
                arg = [];
                for (;;)
                {
                    entry = parse_until(',;]');
                    if (entry)
                    {
                        arg.push(entry);
                        if (eat(","))
                        {
                            arg.push(expr(','));
                        }
                        else if (eat(";"))
                        {
                            arg.push(expr(';'));
                        }
                        else
                        {
                            break;
                        }
                    }
                    else
                    {
                        break;
                    }
                }
                eat(/^\s+/);
                eat("]");
            }
            else
            {
                if (/[,;\n]/.test(tmp))
                {
                    arg = tmp.trim().split(/[;\n]/g).reduce(function(arg, row) {
                        var hasrow = arg.length, hascol = 0;
                        return row.trim().split(-1 < row.indexOf(',') ? ',' : /\s+/g).reduce(function(arg, col) {
                            col = parse(col.trim(), ctx, l+lineStart, i);
                            if (col)
                            {
                                if (hascol) arg.push(expr(','));
                                else if (hasrow) arg.push(expr(';'));
                                arg.push(col);
                                hascol = 1;
                            }
                            return arg;
                        }, arg);
                    }, []);
                }
                else
                {
                    arg = tmp.trim().split(/\s+/g).reduce(function(arg, col) {
                        col = parse(col.trim(), ctx, l+lineStart, i);
                        if (col)
                        {
                            if (arg.length) arg.push(expr(','));
                            arg.push(col);
                        }
                        return arg;
                    }, []);
                }
                s = s.slice(j+1);
                i += j+1;
                tmp = tmp.split("\n");
                if (1 < tmp.length)
                {
                    l += tmp.length-1;
                    tmp.slice(0, -1).forEach(function(ln) {
                        i -= ln.length+1/*\n*/;
                    });
                }
            }
            return expr(OP['[]'].fn, arg);
        }

        while (0 < s.length)
        {
            if (eat(/^if\b/))
            {
                end(true);
                tmp = parse_until("\n,");
                if (!tmp) throw error('missing or invalid condition in "if"');
                if (eat("\n"))
                {
                    ++l;
                    i = 0;
                }
                else
                {
                    eat(',');
                }
                arg = {'if':{cond:tmp,statements:[]},'elseif':[],'else':{statements:[]}};
                term = arg['if'];
                for (;;)
                {
                    tmp = parse_until(['elseif','else','end']);
                    if (tmp) term.statements = term.statements.concat(tmp);
                    if (eat('elseif'))
                    {
                        tmp = parse_until("\n,");
                        if (!tmp) throw error('missing or invalid condition in "elseif"');
                        if (eat("\n"))
                        {
                            ++l;
                            i = 0;
                        }
                        else
                        {
                            eat(',');
                        }
                        arg['elseif'].push({cond:tmp, statements:[]});
                        term = arg['elseif'][arg['elseif'].length-1];
                    }
                    else if (eat('else'))
                    {
                        eat(/^[ \t\v\f]+/);
                        if (eat("\n"))
                        {
                            ++l;
                            i = 0;
                        }
                        else
                        {
                            eat(',');
                        }
                        term = arg['else'];
                    }
                    else if (eat('end') || !tmp)
                    {
                        break;
                    }
                }
                statements.push(expr(if_end, arg));
                continue;
            }
            if (eat(/^for\b/))
            {
                end(true);
                if (match = eat(/^\s+([_a-z][_a-z0-9]*)\s*=\s*/i))
                {
                    // pass
                }
                else
                {
                    throw error('missing or invalid declaration in "for"');
                }
                tmp = parse_until("\n,");
                if (!tmp) throw error('missing or invalid declaration in "for"');
                if (eat("\n"))
                {
                    ++l;
                    i = 0;
                }
                else
                {
                    eat(',');
                }
                arg = {ind:variable(ctx, match[1]),val:tmp,statements:[]};
                for (;;)
                {
                    tmp = parse_until(['end']);
                    if (tmp) arg.statements = arg.statements.concat(tmp);
                    if (eat('end') || !tmp) break;
                }
                statements.push(expr(for_end, arg));
                continue;
            }
            if (eat(/^while\b/))
            {
                end(true);
                tmp = parse_until("\n,");
                if (!tmp) throw error('missing or invalid condition in "while"');
                if (eat("\n"))
                {
                    ++l;
                    i = 0;
                }
                else
                {
                    eat(',');
                }
                arg = {cond:tmp,statements:[]};
                for (;;)
                {
                    tmp = parse_until(['end']);
                    if (tmp) arg.statements = arg.statements.concat(tmp);
                    if (eat('end') || !tmp) break;
                }
                statements.push(expr(while_end, arg));
                continue;
            }
            if (match = eat(/^(continue|break|elseif|else|end)\b/, false))
            {
                if (expected && (-1 < expected.indexOf(match[1])))
                {
                    break;
                }
                else if ('continue' === match[1])
                {
                    eat('continue');
                    statements.push(expr('continue', ''));
                    continue;
                }
                else if ('break' === match[1])
                {
                    eat('break');
                    statements.push(expr('break', ''));
                    continue;
                }
                else if ('end' === match[1])
                {
                    eat('end');
                    terms.unshift(expr('v', variable(ctx, 'end')));
                    continue;
                }
                else
                {
                    throw error('unexpected "' + match[1] + '"');
                }
            }
            if (eat("..."))
            {
                // continue line
                eat(/^[ \t\v\f]+/);
                if (eat("\n"))
                {
                    // new line
                    ++l;
                    i = 0;
                }
                continue;
            }
            if (eat(";", false))
            {
                if (expected && (-1 < expected.indexOf(";")))
                {
                    break;
                }
                else
                {
                    // statement end
                    eat(";");
                    // new statement
                    end(true);
                    continue;
                }
            }
            if (eat("\n", false))
            {
                if (expected && (-1 < expected.indexOf("\n")))
                {
                    break;
                }
                else
                {
                    // line end
                    eat("\n");
                    // new line
                    ++l;
                    i = 0;
                    // new statement
                    end(true);
                    continue;
                }
            }
            if (eat(/^\s+/))
            {
                if (expected && (-1 < expected.indexOf(' ')))
                {
                    break;
                }
                else
                {
                    // space
                    continue;
                }
            }
            if (match = eat('%'))
            {
                // comment
                j = s.indexOf("\n");
                s = s.slice(-1 < j ? j+1 : s.length);
                if (-1 < j) ++l;
                i = 0;
                end(true);
                continue;
            }
            if ((match = eat("'")) || (match = eat('"')))
            {
                // string
                term = string_literal(match[0], true)[0];
                terms.unshift(expr("'" === match[0] ? term.split('') : term));
                continue;
            }
            if (match = eat(/^(&&|\|\|)[^&\|]/, 1))
            {
                // logical and/or
                op = match[1];
                ops.unshift([op, i, l]);
                merge();
                continue;
            }
            if (match = eat(/^(xor)[^a-zA-Z]/, 1))
            {
                // logical xor
                op = match[1];
                ops.unshift([op, i, l]);
                merge();
                continue;
            }
            if (match = eat(/^(>=|<=|==|~=|>|<)[^<>=]/, 1))
            {
                // relational op
                op = match[1];
                ops.unshift([op, i, l]);
                merge();
                continue;
            }
            if (match = eat("~"))
            {
                // logical not
                ops.unshift(["~", i, l]);
                merge();
                continue;
            }
            if (match = eat('='))
            {
                // set
                ops.unshift(['=', i, l]);
                merge();
                continue;
            }
            if (match = eat(/^(\+|-|\.\*|\*|\.\/|\/|\\|\.\^|\^)/i))
            {
                // +,-,*,/,^ op
                op = match[0];
                ops.unshift([op, i, l]);
                merge();
                continue;
            }
            if (match = eat(/^([_a-z][_a-z0-9]*)\s*\(/i))
            {
                // function or matrix indexing
                m = match[1];
                if (eat(/^\s*\:\s*\)/))
                {
                    // single colon
                    term = expr('v', variable(ctx, m));
                    terms.unshift(term);
                    ops.unshift(['(:)', i, l]);
                    merge();
                }
                else
                {
                    arg = [];
                    for (;;)
                    {
                        tmp = parse_until(',)');
                        if (tmp) arg.push(tmp);
                        if (!eat(',')) break;
                    }
                    if (!eat(')')) throw error("mismatched parentheses");
                    if (HAS.call(fn, m))
                    {
                        // function
                        term = expr(fn[m], arg);
                    }
                    else
                    {
                        // matrix indexing
                        term = expr('v', variable(ctx, m, arg.length ? arg : null));
                    }
                    terms.unshift(term);
                }
                eat(/^[ \t\v\f]+/);
                if ((match = eat("'")) || (match = eat(".'")))
                {
                    // transpose
                    ops.unshift([match[0], i, l]);
                    merge();
                }
                continue;
            }
            if (match = eat(/^[_a-z][_a-z0-9]*/i))
            {
                // variable
                m = match[0];
                if (HAS.call(fn, m) && (0 === fn[m].length))
                {
                    // function without arguments
                    term = expr(fn[m], []);
                }
                else
                {
                    term = expr('v', variable(ctx, m));
                }
                terms.unshift(term);
                eat(/^[ \t\v\f]+/);
                if ((match = eat("'")) || (match = eat(".'")))
                {
                    // transpose
                    ops.unshift([match[0], i, l]);
                    merge();
                }
                continue;
            }
            if (match = eat(/^(-?\s*\d+(\.\d+)?([eE][+-]?\d+)?)([ij])?/))
            {
                // number
                arg = match[1].split(/\s+/).join('');
                if (decimal)
                {
                    // prefer default number for small integers
                    /*if (!/[\.eE]/.test(arg) && (arg.length < 6))
                    {
                        arg = parseFloat(arg, 10);
                    }
                    else
                    {*/
                        arg = decimal(arg);
                    /*}*/
                }
                else
                {
                    arg = parseFloat(arg, 10);
                }
                term = expr(match[4] ? (new complex(0, arg)) : arg);
                terms.unshift(term);
                continue;
            }
            if (match = eat(/^(-?\s*\.\d+([eE][+-]?\d+)?)([ij])?/))
            {
                // number, shorthand version
                arg = match[1].split(/\s+/).join('');
                arg = '-' === arg.charAt(0) ? ('-0'+arg.slice(1)) : ('0'+arg);
                if (decimal)
                {
                    // prefer default number for small integers
                    /*if (!/[\.eE]/.test(arg) && (arg.length < 6))
                    {
                        arg = parseFloat(arg, 10);
                    }
                    else
                    {*/
                        arg = decimal(arg);
                    /*}*/
                }
                else
                {
                    arg = parseFloat(arg, 10);
                }
                term = expr(match[4] ? (new complex(0, arg)) : arg);
                terms.unshift(term);
                continue;
            }
            c = s.charAt(0);
            if ('[' === c)
            {
                // bracket, literal array
                s = s.slice(1);
                i += 1;
                term = array_literal();
                if (term)
                {
                    terms.unshift(term);
                    eat(/^[ \t\v\f]+/);
                    if ((match = eat("'")) || (match = eat(".'")))
                    {
                        // transpose
                        ops.unshift([match[0], i, l]);
                        merge();
                    }
                }
                continue;
            }
            if (']' === c)
            {
                if ((expected) && (-1 < expected.indexOf(']')))
                {
                    // end bracket
                    break;
                }
                else
                {
                    throw error('mismatched brackets');
                }
            }
            if ('(' === c)
            {
                // paren
                s = s.slice(1);
                i += 1;
                if (eat(/^\s*\:\s*\)/))
                {
                    // single colon
                    ops.unshift(['(:)', i, l]);
                    merge();
                }
                else
                {
                    if (terms.length && can_merge())
                    {
                        merge('set');
                        term = terms.shift();
                        arg = [];
                        for (;;)
                        {
                            tmp = parse_until(',)');
                            if (tmp) arg.push(tmp);
                            if (!eat(',')) break;
                        }
                        if (!eat(')')) throw error("mismatched parentheses");
                        // matrix indexing
                        if (arg.length) term = expr('v', variable(ctx, term, arg));
                    }
                    else
                    {
                        term = parse_until(')');
                        if (!eat(')')) throw error("mismatched parentheses");
                    }
                    if (term)
                    {
                        terms.unshift(term);
                        eat(/^[ \t\v\f]+/);
                        if ((match = eat("'")) || (match = eat(".'")))
                        {
                            // transpose
                            ops.unshift([match[0], i, l]);
                            merge();
                        }
                    }
                }
                continue;
            }
            if (')' === c)
            {
                if ((expected) && (-1 < expected.indexOf(')')))
                {
                    // end paren
                    break;
                }
                else
                {
                    throw error('mismatched parentheses');
                }
            }
            if ((',' === c) && (expected) && (-1 < expected.indexOf(',')))
            {
                break;
            }
            if (':' === c)
            {
                // colon
                if (expected && (-1 < expected.indexOf(':'))) break;
                s = s.slice(1);
                i += 1;
                tmp = [i, l];
                merge('set');
                if (terms.length)
                {
                    arg = 1;
                }
                else
                {
                    arg = 0;
                    terms.unshift(expr(':'));
                }
                for (;;)
                {
                    term = parse_until(':,)\n');
                    eat(/^[ \t\v\f]+/);
                    if (term) {terms.unshift(term); ++arg;}
                    else if (eat(':', false)) terms.unshift(expr(':'));
                    if (!eat(':')) break;
                }
                if (1 < arg)
                {
                    ops.unshift([3 === arg ? '::' : ':', tmp[0], tmp[1]]);
                    merge();
                }
                //if (expected) break;
                //else continue;
                continue;
            }
            throw error(expected ? ('missing expected "' + (is_string(expected) ? expected.split('') : expected).join('" or "') + '"') : ('unexpected "' + c + '"'));
        }
        end(true);
        return 0 === statements.length ? null : (1 === statements.length ? statements[0] : statements);
    }
    return parse_until(false);
}

async function evaluate(e, v, $)
{
    var f, argout, nargout;
    if (is_instance(e, expr))
    {
        if ('' === e.op)
        {
            // value
            return e.arg;
        }
        else if ('v' === e.op)
        {
            // variable
            if (false === v)
            {
                return e.arg;
            }
            else if (is_instance(e.arg.v, expr))
            {
                return await val(e.arg);
            }
            else
            {
                return is_obj(v) && HAS.call(v, e.arg.v) ? v[e.arg.v] : await val(e.arg);
            }
        }
        else if (if_end === e.op)
        {
            // if .. else .. elseif .. end
            return await if_end(e.arg, v, $);
        }
        else if (for_end === e.op)
        {
            // for .. end loop
            return await for_end(e.arg, v, $);
        }
        else if (while_end === e.op)
        {
            // while .. end loop
            return await while_end(e.arg, v, $);
        }
        else if ('break' === e.op)
        {
            if ($ && is_callable($.brk)) $.brk();
            return;
        }
        else if ('continue' === e.op)
        {
            if ($ && is_callable($.cont)) $.cont();
            return;
        }
        else if (OP['='].fn === e.op)
        {
            // set
            $ = $ || {};
            nargout = $.nargout;
            argout = await evaluate(e.arg[0], false);
            if (is_array(argout) && is_instance(argout[0], variable))
            {
                $.nargout = argout.length; // variable output
            }
            if ((2 === e.arg.length) && ('v' === e.arg[1].op))
            {
                // A = B, A = B(:,:), ..
                // make sure a copy is set and not by reference
                return await e.op.apply(null, [argout, e.arg[1].arg.isByRef() ? copy(await evaluate(e.arg[1], v, $, true)) : await evaluate(e.arg[1], v, $, true)]);
            }
            else
            {
                // A = other expr
                return await e.op.apply(null, [argout].concat(await Promise.all(e.arg.slice(1).map(function(e) {return evaluate(e, v, $);}))));
            }
            $.nargout = nargout;
        }
        else if (is_callable(e.op))
        {
            // other operator
            f = $ && is_int($.nargout) && is_callable(e.op.nargout) ? e.op.nargout($.nargout) : e.op;
            return await f.apply(null, await Promise.all(e.arg.map(function(e) {return evaluate(e, v, $);})));
        }
    }
    throw "invalid expr";
}

$_.createContext = function() {
    return {ans: null};
};

$_.eval = async function(code, ctx, lineStart) {
    ctx = ctx || $_.createContext();
    var ast = parse(String(code), ctx, null == lineStart ? 1 : lineStart, 1);
    var ans = null, ans_changed = false;
    if (is_array(ast))
    {
        for (var i=0,n=ast.length; i<n; ++i)
        {
            if (ast[i])
            {
                ans = await evaluate(ast[i]);
                ans_changed = true;
            }
        }
    }
    else if (ast)
    {
        ans = await evaluate(ast);
        ans_changed = true;
    }
    if (ans_changed && (is_array(ans) || is_nan(ans) || is_scalar(ans) || is_string(ans))) ctx.ans = ans;
    return ans_changed ? ans : null;
};
