// plotting functions
$_.PALETTE = [
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#00ffff",
  "#ff00ff",
  "#ffff00",
  "#4eca8e",
  "#df7c26",
  "#e6e641",
  "#6da20b",
  "#37ed75",
  "#a20ac4",
  "#e6efd2",
  "#22ad51",
  "#2c7496",
  "#bb3e25",
  "#42cda8",
  "#c02a98",
  "#404ad4",
  "#3f8c36",
  "#d15fec",
  "#c4f84d",
  "#eb5291",
  "#38b3e0",
  "#29790c",
  "#4f17e8"
];
function figure()
{
    var self = this;
    if (!is_instance(self, figure)) return new figure();
    self.data = [];
}
figure.prototype = {
    constructor: figure,

    canvas: null,

    // figure params
    type: '',
    data: null,
    no: 0,
    xscale: 'linear',
    yscale: 'linear',
    xlabel: '',
    ylabel: '',
    title: '',

    // figure axes
    xmin: 0,
    xmax: 1,
    ymin: 0,
    ymax: 1,
    scx: 1,
    scy: 1,
    sc: 1,

    // padding
    pt: 45,
    pb: 60,
    pl: 70,
    pr: 20,

    option: function(style, args, i, kth) {
        var linedash = {
                "-" : [],           //Solid
                "--": [15, 5],      //Dashed
                ":" : [5, 5],       //Dotted
                "-.": [15,5,5,5],   //Dash-dotted
            },
            color_ = {
                "red": "r",
                "green": "g",
                "blue": "b",
                "cyan": "c",
                "magenta": "m",
                "yellow": "y",
                "black": "k",
                "white": "w"
            },
            color = {
                "r": [1, 0, 0],
                "g": [0, 1, 0],
                "b": [0, 0, 1],
                "c": [0, 1, 1],
                "m": [1, 0, 1],
                "y": [1, 1, 0],
                "k": [0, 0, 0],
                "w": [1, 1, 1]
            },
            palette = [
                "b",
                "r",
                "g",
                "y",
                "c",
                "m",
                "k",
                "w"
            ],
            val, k, f
        ;
        if (style.Color)
        {
            return {
                Color: color[palette[(kth || 0) % palette.length]],
                LineWidth: style.LineWidth,
                LineStyle: style.LineStyle,
                _LineStyle: style._LineStyle
            };
        }
        if (!style.Color) style.Color = color[palette[(kth || 0) % palette.length]];
        if (!style.LineWidth) style.LineWidth = 1;
        if (!style.LineStyle) style.LineStyle = linedash["-"];
        if (!style._LineStyle) style._LineStyle = "-";
        i = i || 0;
        while (i < args.length)
        {
            if ("Color" === args[i])
            {
                val = args[i+1];
                if (is_string(val))
                {
                    if (HAS.call(color_, val))
                    {
                        style.Color = color[color_[val]];
                    }
                    else if (HAS.call(color, val))
                    {
                        style.Color = color[val];
                    }
                }
                else if (is_vector(val) && (3 === val.length))
                {
                    style.Color = tonumber(val);
                }
                i += 2;
                continue;
            }
            else if ("LineWidth" === args[i])
            {
                val = args[i+1];
                if (is_num(val))
                {
                    style.LineWidth = 2*tonumber(val);
                }
                i += 2;
                continue;
            }
            else if ("LineStyle" === args[i])
            {
                val = args[i+1];
                if (is_string(val) && HAS.call(linedash, val))
                {
                    style._LineStyle = val;
                    style.LineStyle = linedash[val];
                }
                i += 2;
                continue;
            }
            else if (is_string(args[i]))
            {
                f = false;
                val = args[i];
                for (k in color)
                {
                    if (-1 < val.indexOf(k))
                    {
                        style.Color = color[k];
                        f = true;
                    }
                }
                for (k in linedash)
                {
                    if (('-' !== k) && (-1 < val.indexOf(k)))
                    {
                        style._LineStyle = k;
                        style.LineStyle = linedash[k];
                        f = true;
                    }
                }
                if (f)
                {
                    i += 1;
                    continue;
                }
            }
            break;
        }
        return i;
    },
    parse: function(args, type, defaultEmpty) {
        var fig = this, i = 0, j, kth = 0, n, v, x, y, z, s;
        if ('pie' === type)
        {
            while (i < args.length)
            {
                v = vec(args[i]);
                if (is_vector(v))
                {
                    fig.data.push({y:tonumber(v)});
                }
                i += 1;
            }
        }
        else if ('plot3' === type)
        {
            while (i < args.length)
            {
                x = null; y = null; z = null;
                v = vec(args[i]);
                if (is_vector(v))
                {
                    x = v;
                }
                v = vec(args[i+1]);
                if (is_vector(v))
                {
                    y = v;
                }
                v = vec(args[i+2]);
                if (is_vector(v))
                {
                    z = v;
                    i += 3;
                }
                if (x && y && z)
                {
                    s = {};
                    i = fig.option(s, args, i, kth);
                    fig.data.push({x:tonumber(x), y:tonumber(y), z:tonumber(z), style:s});
                    ++kth;
                }
                else
                {
                    i += 1;
                }
            }
        }
        else
        {
            while (i < args.length)
            {
                x = null; y = null;
                v = vec(args[i]);
                if (is_vector(v))
                {
                    x = v;
                }
                if (is_vector(args[i+1]) || is_matrix(args[i+1]))
                {
                    y = vec(args[i+1]);
                    i += 2;
                }
                else if (x)
                {
                    y = x;
                    x = colon(1, y.length);
                    i += 1;
                }
                if (x && y)
                {
                    x = tonumber(x);
                    s = {};
                    i = fig.option(s, args, i, kth);
                    if (is_matrix(y))
                    {
                        for (j=0,n=COLS(y); j<n; ++j)
                        {
                            fig.data.push({x:x, y:tonumber(COL(y, j)), style:s});
                            ++kth;
                            s = fig.option(s, args, i, kth);
                        }
                    }
                    else
                    {
                        fig.data.push({x:x, y:tonumber(y), style:s});
                        ++kth;
                    }
                }
                else
                {
                    i += 1;
                }
            }
        }
        return fig;
    }
};
$_.figure = figure;
$_.createCanvas = function(w, h) {};
$_.currentCanvas = function() {};
