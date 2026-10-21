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

    style: function(style, kth) {
        var linedash = {
                "-" : [],          //Solid
                "--": [15,5],      //Dashed
                ":" : [5,5],       //Dotted
                "-.": [15,5,5,5],  //Dash-dotted
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
            val, k
        ;
        if (is_string(style))
        {
            val = style;
            style = {
                Color: color[palette[(kth || 0) % palette.length]].slice(),
                LineWidth: 2,
                LineStyle: '-',
                _LineStyle: linedash['-'].slice()
            };
            for (k in color)
            {
                if (-1 < val.indexOf(k))
                {
                    style.Color = color[k].slice();
                    break;
                }
            }
            for (k in linedash)
            {
                if (('-' !== k) && (-1 < val.indexOf(k)))
                {
                    style.LineStyle = k;
                    style._LineStyle = linedash[k].slice();
                    break;
                }
            }
        }
        else if (is_obj(style))
        {
            if (is_string(style.Color))
            {
                if (HAS.call(color_, style.Color))
                {
                    style.Color = color[color_[style.Color]].slice();
                }
                else if (HAS.call(color, style.Color))
                {
                    style.Color = color[style.Color].slice();
                }
                else
                {
                    style.Color = color[palette[(kth || 0) % palette.length]].slice();
                }
            }
            else if (is_array(style.Color) && is_vector(val=vec(style.Color)) && (3 === val.length))
            {
                style.Color = tonumber(val);
            }
            else
            {
                style.Color = color[palette[(kth || 0) % palette.length]].slice();
            }

            if (is_num(style.LineWidth))
            {
                style.LineWidth = 2*tonumber(style.LineWidth);
            }
            else
            {
                style.LineWidth = 2;
            }

            if (is_string(style.LineStyle) && HAS.call(linedash, style.LineStyle))
            {
                style._LineStyle = linedash[style.LineStyle].slice();
            }
            else
            {
                style.LineStyle = '-';
                style._LineStyle = linedash['-'].slice();
            }
        }
        else
        {
            style = {
                Color: color[palette[(kth || 0) % palette.length]].slice(),
                LineWidth: 2,
                LineStyle: '-',
                _LineStyle: linedash['-'].slice()
            };
        }
        return style;
    },
    parse: function(args, type, defaultEmpty) {
        var fig = this, i = 0, j, kth = 0, n, v, x, y, z, s;
        if ('pie' === type)
        {
            while (i < args.length)
            {
                if (is_array(args[i]) && is_vector(v=vec(args[i])))
                {
                    fig.data.push({
                        y:tonumber(v)
                    });
                }
                i += 1;
            }
        }
        else if ('plot3' === type)
        {
            while (i < args.length)
            {
                x = null; y = null; z = null;
                if (is_array(args[i]) && is_vector(v=vec(args[i])))
                {
                    x = v;
                }
                if (is_array(args[i+1]) && is_vector(v=vec(args[i+1])))
                {
                    y = v;
                }
                if (is_array(args[i+2]) && is_vector(v=vec(args[i+2])))
                {
                    z = v;
                }
                if (x && y && z)
                {
                    i += 3;
                    s = get_style(args[i]);
                    if (s) i += 1;
                    else s = {};
                    fig.data.push({
                        x:tonumber(x),
                        y:tonumber(y),
                        z:tonumber(z),
                        style:fig.style(s, kth++)
                    });
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
                if (is_array(args[i]) && is_vector(v=vec(args[i])))
                {
                    x = v;
                }
                if (is_array(args[i+1]) && (is_matrix(args[i+1]) || is_vector(vec(args[i+1]))))
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
                    if (is_matrix(y))
                    {
                        for (j=0,n=COLS(y); j<n; ++j)
                        {
                            s = get_style(args[i]);
                            if (s) i += 1;
                            else s = {};
                            fig.data.push({
                                x:x,
                                y:tonumber(COL(y, j)),
                                style:fig.style(s, kth++)
                            });
                        }
                    }
                    else
                    {
                        s = get_style(args[i]);
                        if (s) i += 1;
                        else s = {};
                        fig.data.push({
                            x:x,
                            y:tonumber(y),
                            style:fig.style(s, kth++)
                        });
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
function get_style(arg)
{
    return is_instance(arg, namevalue) && arg.has('Color') ? arg._ : (is_string(arg) ? arg : null);
}
$_.figure = figure;
$_.createCanvas = function(w, h) {};
$_.currentCanvas = function() {};
