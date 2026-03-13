import { ResponsiveTreeMap } from "@nivo/treemap";
import React from "react";
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MyResponsiveTreeMap = ({ data /* see data tab */ }) => (
  <ResponsiveTreeMap
    data={{
      name: "nivo",
      color: "hsl(137, 70%, 50%)",
      children: [
        {
          name: "viz",
          color: "hsl(231, 70%, 50%)",
          children: [
            {
              name: "stack",
              color: "hsl(27, 70%, 50%)",
              children: [
                {
                  name: "cchart",
                  color: "hsl(161, 70%, 50%)",
                  loc: 193925,
                },
                {
                  name: "xAxis",
                  color: "hsl(38, 70%, 50%)",
                  loc: 51355,
                },
                {
                  name: "yAxis",
                  color: "hsl(237, 70%, 50%)",
                  loc: 13119,
                },
                {
                  name: "layers",
                  color: "hsl(165, 70%, 50%)",
                  loc: 32714,
                },
              ],
            },
            {
              name: "ppie",
              color: "hsl(230, 70%, 50%)",
              children: [
                {
                  name: "chart",
                  color: "hsl(43, 70%, 50%)",
                  children: [
                    {
                      name: "pie",
                      color: "hsl(179, 70%, 50%)",
                      children: [
                        {
                          name: "outline",
                          color: "hsl(355, 70%, 50%)",
                          loc: 155802,
                        },
                        {
                          name: "slices",
                          color: "hsl(86, 70%, 50%)",
                          loc: 33663,
                        },
                        {
                          name: "bbox",
                          color: "hsl(255, 70%, 50%)",
                          loc: 105059,
                        },
                      ],
                    },
                    {
                      name: "donut",
                      color: "hsl(346, 70%, 50%)",
                      loc: 17408,
                    },
                    {
                      name: "gauge",
                      color: "hsl(61, 70%, 50%)",
                      loc: 116730,
                    },
                  ],
                },
                {
                  name: "legends",
                  color: "hsl(331, 70%, 50%)",
                  loc: 98651,
                },
              ],
            },
          ],
        },
        {
          name: "colors",
          color: "hsl(108, 70%, 50%)",
          children: [
            {
              name: "rgb",
              color: "hsl(322, 70%, 50%)",
              loc: 76566,
            },
            {
              name: "hsl",
              color: "hsl(347, 70%, 50%)",
              loc: 102528,
            },
          ],
        },
        {
          name: "utils",
          color: "hsl(181, 70%, 50%)",
          children: [
            {
              name: "randomize",
              color: "hsl(129, 70%, 50%)",
              loc: 17119,
            },
            {
              name: "resetClock",
              color: "hsl(93, 70%, 50%)",
              loc: 50824,
            },
            {
              name: "noop",
              color: "hsl(61, 70%, 50%)",
              loc: 192336,
            },
            {
              name: "tick",
              color: "hsl(48, 70%, 50%)",
              loc: 148782,
            },
            {
              name: "forceGC",
              color: "hsl(78, 70%, 50%)",
              loc: 111845,
            },
            {
              name: "stackTrace",
              color: "hsl(141, 70%, 50%)",
              loc: 140281,
            },
            {
              name: "dbg",
              color: "hsl(22, 70%, 50%)",
              loc: 8826,
            },
          ],
        },
        {
          name: "generators",
          color: "hsl(174, 70%, 50%)",
          children: [
            {
              name: "address",
              color: "hsl(112, 70%, 50%)",
              loc: 4140,
            },
            {
              name: "city",
              color: "hsl(312, 70%, 50%)",
              loc: 80842,
            },
            {
              name: "animal",
              color: "hsl(86, 70%, 50%)",
              loc: 22911,
            },
            {
              name: "movie",
              color: "hsl(46, 70%, 50%)",
              loc: 64982,
            },
            {
              name: "user",
              color: "hsl(341, 70%, 50%)",
              loc: 195324,
            },
          ],
        },
        {
          name: "set",
          color: "hsl(302, 70%, 50%)",
          children: [
            {
              name: "clone",
              color: "hsl(121, 70%, 50%)",
              loc: 5667,
            },
            {
              name: "intersect",
              color: "hsl(166, 70%, 50%)",
              loc: 150865,
            },
            {
              name: "merge",
              color: "hsl(272, 70%, 50%)",
              loc: 101950,
            },
            {
              name: "reverse",
              color: "hsl(22, 70%, 50%)",
              loc: 161705,
            },
            {
              name: "toArray",
              color: "hsl(223, 70%, 50%)",
              loc: 84202,
            },
            {
              name: "toObject",
              color: "hsl(259, 70%, 50%)",
              loc: 68397,
            },
            {
              name: "fromCSV",
              color: "hsl(151, 70%, 50%)",
              loc: 189938,
            },
            {
              name: "slice",
              color: "hsl(20, 70%, 50%)",
              loc: 83849,
            },
            {
              name: "append",
              color: "hsl(199, 70%, 50%)",
              loc: 154495,
            },
            {
              name: "prepend",
              color: "hsl(134, 70%, 50%)",
              loc: 48369,
            },
            {
              name: "shuffle",
              color: "hsl(231, 70%, 50%)",
              loc: 171632,
            },
            {
              name: "pick",
              color: "hsl(228, 70%, 50%)",
              loc: 147537,
            },
            {
              name: "plouc",
              color: "hsl(234, 70%, 50%)",
              loc: 119835,
            },
          ],
        },
        {
          name: "text",
          color: "hsl(340, 70%, 50%)",
          children: [
            {
              name: "trim",
              color: "hsl(329, 70%, 50%)",
              loc: 33816,
            },
            {
              name: "slugify",
              color: "hsl(154, 70%, 50%)",
              loc: 21157,
            },
            {
              name: "snakeCase",
              color: "hsl(111, 70%, 50%)",
              loc: 196193,
            },
            {
              name: "camelCase",
              color: "hsl(100, 70%, 50%)",
              loc: 29788,
            },
            {
              name: "repeat",
              color: "hsl(80, 70%, 50%)",
              loc: 167259,
            },
            {
              name: "padLeft",
              color: "hsl(21, 70%, 50%)",
              loc: 35075,
            },
            {
              name: "padRight",
              color: "hsl(278, 70%, 50%)",
              loc: 66969,
            },
            {
              name: "sanitize",
              color: "hsl(212, 70%, 50%)",
              loc: 151225,
            },
            {
              name: "ploucify",
              color: "hsl(164, 70%, 50%)",
              loc: 42049,
            },
          ],
        },
        {
          name: "misc",
          color: "hsl(193, 70%, 50%)",
          children: [
            {
              name: "greetings",
              color: "hsl(65, 70%, 50%)",
              children: [
                {
                  name: "hey",
                  color: "hsl(68, 70%, 50%)",
                  loc: 18120,
                },
                {
                  name: "HOWDY",
                  color: "hsl(306, 70%, 50%)",
                  loc: 30854,
                },
                {
                  name: "aloha",
                  color: "hsl(148, 70%, 50%)",
                  loc: 125140,
                },
                {
                  name: "AHOY",
                  color: "hsl(138, 70%, 50%)",
                  loc: 52840,
                },
              ],
            },
            {
              name: "other",
              color: "hsl(278, 70%, 50%)",
              loc: 34463,
            },
            {
              name: "path",
              color: "hsl(60, 70%, 50%)",
              children: [
                {
                  name: "pathA",
                  color: "hsl(317, 70%, 50%)",
                  loc: 163395,
                },
                {
                  name: "pathB",
                  color: "hsl(185, 70%, 50%)",
                  children: [
                    {
                      name: "pathB1",
                      color: "hsl(118, 70%, 50%)",
                      loc: 71077,
                    },
                    {
                      name: "pathB2",
                      color: "hsl(319, 70%, 50%)",
                      loc: 84550,
                    },
                    {
                      name: "pathB3",
                      color: "hsl(187, 70%, 50%)",
                      loc: 67206,
                    },
                    {
                      name: "pathB4",
                      color: "hsl(301, 70%, 50%)",
                      loc: 124476,
                    },
                  ],
                },
                {
                  name: "pathC",
                  color: "hsl(7, 70%, 50%)",
                  children: [
                    {
                      name: "pathC1",
                      color: "hsl(77, 70%, 50%)",
                      loc: 68741,
                    },
                    {
                      name: "pathC2",
                      color: "hsl(343, 70%, 50%)",
                      loc: 117572,
                    },
                    {
                      name: "pathC3",
                      color: "hsl(35, 70%, 50%)",
                      loc: 55471,
                    },
                    {
                      name: "pathC4",
                      color: "hsl(310, 70%, 50%)",
                      loc: 146692,
                    },
                    {
                      name: "pathC5",
                      color: "hsl(285, 70%, 50%)",
                      loc: 104402,
                    },
                    {
                      name: "pathC6",
                      color: "hsl(71, 70%, 50%)",
                      loc: 199620,
                    },
                    {
                      name: "pathC7",
                      color: "hsl(304, 70%, 50%)",
                      loc: 47392,
                    },
                    {
                      name: "pathC8",
                      color: "hsl(231, 70%, 50%)",
                      loc: 67259,
                    },
                    {
                      name: "pathC9",
                      color: "hsl(150, 70%, 50%)",
                      loc: 117003,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }}
    identity="name"
    value="loc"
    valueFormat=".02s"
    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
    labelSkipSize={12}
    labelTextColor={{
      from: "color",
      modifiers: [["darker", 1.2]],
    }}
    parentLabelPosition="left"
    parentLabelTextColor={{
      from: "color",
      modifiers: [["darker", 2]],
    }}
    borderColor={{
      from: "color",
      modifiers: [["darker", 0.1]],
    }}
  />
);

function App() {
  return <MyResponsiveTreeMap />;
}

export default React.memo(App);
