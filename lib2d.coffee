###
Copyright (c) 2011 Emanuel Rylke

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
###
@zip = (xs...) -> 
   len = Math.min (x.length for x in xs)...
   (x[i] for x in xs) for i in [0...len]

@reduce = (f, res, xs) ->
  res = f(res, x) for x in xs
  res

@map2d = (xs, ys, f) ->
  for x in xs
    for y in ys
      f x, y

@one = (xs, f) ->
  for x in xs
    if f x
      return x
  return false

@intlvmap = (xs, f) ->
  if xs.length < 2
    []
  else
    for i in [0..(xs.length - 2)]
      f xs[i], xs[i + 1]

###
these are cute but slow
@plus  = (xs...) -> reduce ((a, b) -> a + b), 0, x for x in zip xs...
@minus = (xs...) -> reduce ((a, b) -> a - b), y, ys for [y, ys...] in zip xs...
###

@tau = Math.PI * 2

#the builtin modulo operator sucks
@mod = (a, b) ->
  if a >= 0
    a % b
  else
    b + a % b

@plus = ([a0, a1], [b0, b1]) -> [a0 + b0, a1 + b1]
@minus = ([a0, a1], [b0, b1]) -> [a0 - b0, a1 - b1]
@min = ([a0, a1], [b0, b1]) -> [(Math.min a0, b0), (Math.min a1, b1)]
@mult = (xs, y) -> x * y for x in xs
@divi = (xs, y) -> x / y for x in xs
@floor = (xs) -> x | 0 for x in xs
@abs = (xs) -> Math.abs x for x in xs

@pyth = ([a, b]) -> Math.sqrt (Math.pow a, 2) + (Math.pow b, 2)

#@distance = (a, b) -> pyth minus a, b
#i wonder if modern javaScript engines do the inlining automaticly:
#firefox 6.0 seems not to do this. 
@distance = ([a0, a1], [b0, b1]) -> Math.sqrt (Math.pow a0 - b0, 2) + (Math.pow a1 - b1, 2)


@pldist = ([x1, y1], [x2, y2], [x3, y3]) ->
  dx = x2 - x1
  dy = y2 - y1
  if dx == 0 && dy == 0
    x0 = x1
    y0 = y1
  else
    t = ((x3 - x1) * dx + (y3 - y1) * dy) / (dx * dx + dy * dy)
    t = Math.min(Math.max(0, t), 1)
    x0 = x1 + t * dx
    y0 = y1 + t * dy
  distance [x3, y3], [x0, y0]

@pctangent = (point, {r, p}, sign) ->
  mod (asincos direction p, point) + sign * (Math.acos r / (distance p, point)), tau

@cctangent = (c1, c2, sign) ->
  pctangent c1.p, {r: c2.r - c1.r, p: c2.p}, sign

@convertline = (p1, p2) ->
  a = minus p2, p1
  b = a[1]/a[0]
  c = p1[1] - b * p1[0]
  [b, c]

@llcross = (p1, p2, p3, p4) ->
  [b, a] = convertline p1, p2
  [d, c] = convertline p3, p4
  crosspoint = [(c-a)/(b-d), a + b * (c-a)/(b-d)]
  [(contains crosspoint, p2, p1) && (contains crosspoint, p4, p3), crosspoint]


@contains = ([p0, p1], [b0, b1], [s0, s1]) ->
  (Math.min b0, s0) < p0 < (Math.max b0, s0) && (Math.min b1, s1) < p1 < (Math.max b1, s1)

@arcContains = (a1, a2, a3) ->
  if a2 > a3
    a2 < a1 || a1 < a3
  else
    a2 < a1 < a3

@direction = (from, to) ->
  path = minus to, from
  dist = pyth path
  if dist == 0
    [0, 0]
  else 
    divi path, dist

@sincos = (arc) -> [(Math.sin arc), (Math.cos arc)]

@ponc = (crcl, arc) -> plus crcl.p, (mult (sincos arc), crcl.r)

@asincos = ([p0, p1]) -> 
  if (Math.asin p0) > 0
    Math.acos p1
  else
    Math.PI * 2 - Math.acos p1

@arcdist = (a1, a2) ->
  d = Math.abs (mod a1, tau) - (mod a2, tau)
  return Math.min d, tau - d

@add = (p1, [b0, b1]) -> 
  p1[0] += b0
  p1[1] += b1
  p1

@ac = (array, [p0, p1]) -> 
  col = array[p0]
  if col?
    col[p1]
  else
    undefined

$ => 
  @ctx = ($ 'canvas')[0].getContext '2d'

@clearRect = (ctx, [p0, p1], [s0, s1]) ->
  ctx.clearRect(p0, p1, s0, s1)

@fillRect = (ctx, [p0, p1], [s0, s1]) ->
  ctx.fillRect(p0, p1, s0, s1)

@drawImage = (ctx, img, [p0, p1]) ->
  ctx.drawImage img, p0, p1

@strokeRect = (ctx, [p0, p1], [s0, s1]) ->
  ctx.strokeRect(p0, p1, s0, s1)

@moveTo = (ctx, [p0, p1]) ->
  ctx.moveTo p0, p1

@lineTo = (ctx, [p0, p1]) ->
  ctx.lineTo p0, p1

@arc = (ctx, [p0, p1], radius, startarc, endarc, foo) ->
  ctx.arc p0, p1, radius, Math.PI * 0.5 - startarc, Math.PI * 0.5 - endarc, foo

@translate = (ctx, [p0, p1]) ->
  ctx.translate p0, p1

@loadImg = (src) ->
  img = new Image()
  img.src = src
  img


class @stparray
  constructor: (@s) ->
    @es = []
    @ps = for i in [2,4,8,16]
      new parray @s, @s / i

  add: (e) ->
    p1 = minus e.p, [e.r, e.r]
    p2 = plus e.p, [e.r, e.r]
    for i in [3,2,1,0]
      helper = (x) => x - x % (@s / (2 << i))
      if (helper p1[0]) == (helper p2[0]) && (helper p1[1]) == (helper p2[1])
        @ps[i].add e
        return
    @es.push e

  eachin: (p, s, f) ->
    for i in @ps
      i.eachin p, s, f
    for i in @es
      f i
    undefined

  each: (f) ->
    for i in @ps
      i.each f
    for i in @es
      f i
    undefined

  hist: ->
    [@es.length, (i.length() for i in @ps)...]

  length: ->
    res = 0
    for i in @hist()
      res += i
    res


class @parray
  constructor: (s, @ts) ->
    @es = for x in [0..(s / @ts | 0)]
      for y in [0..(s / @ts | 0)]
        []
  add: (e) ->
    x = e.p[0] / @ts | 0
    y = e.p[1] / @ts | 0
    @es[x][y].push e

  near: (p) ->
    x1 = p[0] / @ts | 0
    y1 = p[1] / @ts | 0
    res = []
    for x in [x1-1..x1+1]
      if @es[x]
        for y in [y1-1..y1+1]
          if @es[x][y]
            res = res.concat(@es[x][y])
    res

  eachin: ([p0, p1], [s0, s1], f) ->
    x1 = Math.max (p0 / @ts | 0), 0
    y1 = Math.max (p1 / @ts | 0), 0
    x2 = Math.min ((p0 + s0) / @ts | 0), @es.length - 1
    y2 = Math.min ((p1 + s1) / @ts | 0), @es.length - 1
    for x in [x1..x2]
      for y in [y1..y2]
        for e in @es[x][y]
          f e
    undefined

  each: (f) ->
    for row in @es
      for tile in row
        for e in tile
          f e
    undefined

  length: ->
    res = 0
    @each ->
      res++
    res

@ptrue = (a) -> Math.random() < a

@pr = (a...) -> alert(JSON.stringify a)
