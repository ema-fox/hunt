progressCounter = 0
progress = ->
  progressCounter++
  #if ctx?
    #fillRect ctx, [0, 100], [progressCounter, 10]

initStubs = []

runStubs = (stubs) ->
  if stubs.length > 0
    stubs.shift()()
    progress()
    setTimeout (-> runStubs stubs), 1

arrows = []
bunnies = new parray 5000, 500
deathbunnies = []
flowers = new parray 5000, 500
patches = []


# the numbers are not quite 5000 because this would mean that flowers would get to a place where bunnies would seek them but wouldn't reach
randpos = -> 
  [4950 * Math.random(), 4950 * Math.random()]


pos = null
dogpos = null
doggoal = null
doghasbunny = false
dogrun = false
dogpath = []
dogspeed = 0
deathbunnycount = 0
mp = [0, 0]
quux = 0

up = false
down = false
left = false
right = false


drawPs = []

#bg = loadImg 'bg.png'
#bg2 = loadImg 'bg2.png'
brownbunny = loadImg 'brownbunny.png'
deathbrownbunny = loadImg 'deathbrownbunny.png'
dog = loadImg 'dog.png'
flower = loadImg 'flower.png'
hunter = loadImg 'hunter.png'
#let them drop
initStubs.push ->
  patches =
    for i in [0..100]
      {r: 40 + Math.random() * 200, p: [2500 + Math.random(), 2500 + Math.random()], n: []}

initStubs.push ->
  foo = true
  i = 0
  while foo && i < 1000
    i++
    foo = false
    if true || confirm 'foo?'
      for patch in patches
        for other in patches when patch != other
          dist = distance patch.p, other.p
          rr = patch.r + other.r
          if dist + 5 < rr
            foo = true
            patch.p = plus patch.p, (direction other.p, patch.p)
          else if dist - 5 < rr
            patch.p = plus patch.p, (mult (direction patch.p, other.p), 0.5)

initStubs.push ->
  for patch in patches
    for other in patches when patch != other
      if (distance patch.p, other.p) < patch.r + other.r
        patch.n.push other

initStubs.push ->
  pos = patches[0].p
  dogpos = plus pos, [patches[0].r / 2, 0]
  doggoal = pos
  quux = setInterval (->
    try
      step()
    catch err
      clearInterval quux
      throw err
  ), 40

grasscanvas = ($ '<canvas width="5000" height="5000">')[0]
grassctx = grasscanvas.getContext '2d'
rockcanvas = ($ '<canvas width="5000" height="5000">')[0]
rockctx = rockcanvas.getContext '2d'
initStubs.push ->
  rockctx.fillStyle = '#bbaaaa'
  fillRect rockctx, [0, 0], [5000, 5000]
  rockctx.globalCompositeOperation = 'destination-out'
  for {r, p} in patches
    rockctx.beginPath()
    arc rockctx, p, r, 0, tau + 0.001
    rockctx.fill()
  #rockctx.globalCompositeOperation = 'source-over'


drawBg = (name) ->
  bg = new Image()
  ($ bg).ready ->
    console.debug name
    bgsize = bg.width
    for x in [0..(5000 / bgsize | 0)]
      ((x) ->
        initStubs.push ->
          for y in [0..(5000 / bgsize | 0)]
            grassctx.drawImage bg, x*bgsize, y*bgsize)(x)
    initStubs.push ->
      drawImage grassctx, rockcanvas, [0, 0]
  bg.src = name

drawBg 'bg.png'
drawBg 'bg2.png'



draw = ->
  #clearRect ctx, [0, 0], [500, 500]
  ctx.fillStyle = '#000000'
  fillRect ctx, [0, 0], [1000, 500]
  ctx.save()
  translate ctx, minus [500, 250], pos
  drawImage ctx, grasscanvas, [0, 0]
  #drawImage ctx, rockcanvas, [0, 0]
  ###
  for patch in patches
    if (distance patch.p, pos) < patch.r
      ctx.strokeStyle = '#aa0000'
      ctx.beginPath()
      arc ctx, patch.p, patch.r, 0, tau
      ctx.stroke()
      ctx.strokeStyle = '#aa9900'
      for {p, r} in patch.n
        ctx.beginPath()
        arc ctx, p, r, 0, tau
        ctx.stroke()
  ###
  ctx.strokeStyle = '#000000'
  ###
  ctx.beginPath()
  moveTo ctx, dogpos
  for p in dogpath
    lineTo ctx, p
  ctx.stroke()
  ###
  for {p} in deathbunnies
    drawImage ctx, deathbrownbunny, (minus p, [20, 20])
  flowers.eachin (minus pos, [500, 250]), [1000, 500], ({p}) ->
    drawImage ctx, flower, (minus p, [10, 10])
  bunnies.eachin (minus pos, [500, 250]), [1000, 500], ({p}) ->
    drawImage ctx, brownbunny, (minus p, [20, 20])
  drawImage ctx, dog, (minus dogpos, [20, 20])
  if doghasbunny
    drawImage ctx, deathbrownbunny, (minus dogpos, [10, 10])
  drawImage ctx, hunter, (minus pos, [20, 20])
  for {p, m} in arrows
    ctx.beginPath()
    moveTo ctx, p
    lineTo ctx, plus p, m
    ctx.closePath()
    ctx.stroke()
  ctx.lineWidth = 400
  strokeRect ctx, [-200, -200], [5400, 5400]
  for p in drawPs
    fillRect ctx, p, [10, 10]
  drawPs = []
  ctx.restore()
  for i in [0...deathbunnycount]
    p = plus [30, 30], [i ^ (i * 31.31) % 50, i ^ (i * 42.42) % 50]
    drawImage ctx, deathbrownbunny, p

hitp = (bunny) ->
  for a in arrows
    if contains (plus a.p, a.m), (minus bunny.p, [20, 20]), (plus bunny.p, [20, 20])
      a.p = [-100, -100]
      return true
  false

intersect = (patch1, patch2) ->
  plus patch1.p, (mult (direction patch1.p, patch2.p), patch1.r)

#I wish you luck understanding this function and i'm sorry that i didn't document it
pathing = (p1, p2) ->
  p1patch = false
  for patch in patches
    if (distance p1, patch.p) < patch.r
      p1patch = patch
      break
  p2patch = false
  for patch in patches
    if (distance p2, patch.p) < patch.r
      p2patch = patch
      break
  if not p2patch
    return [p1]
  else if p2patch == p1patch || not p1patch
    return [p2]
  else
    open = [{heurD: (distance p1, p2), measD: 0, p: [p2patch]}]
    closed = []
    loop
      open.sort (a, b) ->
        (a.heurD + a.measD) - (b.heurD + b.measD)
      if open.length == 0
        return [p1]
      pth = open.shift()
      closed.push pth.p[0]
      for n in pth.p[0].n
        if n == p1patch
          return [(intlvmap [n, pth.p...], intersect)..., p2]
        bar = one closed, (x) ->
          x == n
        if not bar
          newpath =
            heurD: (distance p1, (intersect pth.p[0], n))
            measD: (pth.measD + (distance (intersect pth.p[0], n), (if pth.p.length > 1 then (intersect pth.p[0], pth.p[1]) else p2)))
            p: [n, pth.p...]
          bla = true
          for j in [0...(open.length)]
            if open[j].p[0] == n
              if open[j].heurD + open[j].measD > newpath.heurD + newpath.measD
                open[j] = newpath
              bla = false
              break
          if bla
            open.push newpath

step = ->
  goal = [pos[0] + (if right then 1 else 0) - (if left then 1 else 0), pos[1] + (if down then 1 else 0) - (if up then 1 else 0)]
  pos = plus pos, (mult (direction pos, goal), 6)
  bunnies.add {p: randpos(), alarmed: false, life: 100} if bunnies.length() < 5
  fp = randpos()
  foo = false
  for {p, r} in patches
    if (distance fp, p) < r
      foo = true
  if foo
    flowers.add {p: fp, death: false}
  newarrows = []
  for a in arrows
    a.p = plus a.p, a.m
    if a.h > 1
      a.h -= 1
      newarrows.push a
  arrows = newarrows
  newbunnies = new parray 5000, 500
  bunnies.each (bunny) -> 
    bunnygoal = bunny.p
    bunnyspeed = 0
    if (hitp bunny)
      deathbunnies.push bunny
      return
    if bunny.life < 1
      return 
    bunny.life--
    dist = distance pos, bunny.p
    if dist < 150
      bunnies.eachin (minus bunny.p, [150, 150]), [300, 300], (otherbunny) ->
        dist2 = distance bunny.p, otherbunny.p
        if dist2 < 150
          otherbunny.alarmed = true
    if bunny.alarmed
      bunny.alarmed = dist < 600
      bunnyspeed = 10
      bunnygoal = plus bunny.p, mult (direction pos, bunny.p), 100
    else
      if bunny.life > 1000
        bunny.life -= 200
        bunny.life /= 2
        newbunnies.add {
          p: (plus bunny.p, [20, 20]), 
          alarmed: false,
          life: bunny.life}
      f = {p: [99999,99999]}
      flowers.eachin (minus bunny.p, [500, 500]), [1000, 1000], (f2) ->
        if (distance f.p, bunny.p) > (distance f2.p, bunny.p)
          if (distance f2.p, bunny.p) > (distance f2.p, pos)
            other = true
          else 
            other = false
            bunnies.eachin (minus bunny.p, [50, 50]), [100, 100], (otherbunny) ->
              if (bunny != otherbunny) && (distance f2.p, bunny.p) > (distance f2.p, otherbunny.p)
                other = true
          if not other
            f = f2
      if f.p[0] != 99999
        bunnyspeed = 8
        bunnygoal = f.p
        if (distance f.p, bunny.p) < 20
          bunny.life += 50
          f.death = true
    bunnypath = pathing bunny.p, bunnygoal
    bunny.p = plus bunny.p, mult (direction bunny.p, bunnypath[0]), bunnyspeed
    newbunnies.add bunny
  bunnies = newbunnies
  doggoal = dogpos
  if doghasbunny
    if (distance dogpos, pos) < 50
      deathbunnycount++
      doghasbunny = false
    else
      dogspeed = 10
      doggoal = pos
  else
    db = {p: [99999, 99999]}
    for db2 in deathbunnies
      dist = distance db2.p, dogpos
      if dist < 500 && dist < (distance dogpos, db.p)
        db = db2
    if db.p[0] != 99999
      dogspeed = 10
      doggoal = db.p
    else if dogrun
      if (distance dogpos, pos) > 90
        dogspeed = 7
        doggoal = pos
      else
        dogrun = false
    else if (distance dogpos, pos) > 250
      dogrun = true
  dogpath = pathing dogpos, doggoal
  dogpos = plus dogpos, mult (direction dogpos, dogpath[0]), dogspeed
  newdeathbunnies = []
  for db in deathbunnies
    if (distance db.p, pos) < 50 
      deathbunnycount++
    else if (not doghasbunny) && (distance db.p, dogpos) < 50
      doghasbunny = true
    else
      newdeathbunnies.push db
  deathbunnies = newdeathbunnies
  newflowers = new parray 5000, 500
  flowers.each (f) ->
    if not f.death
      newflowers.add f
  flowers = newflowers
  draw()

($ document).keydown (evt) ->
  switch String.fromCharCode(evt.which)
    when 'A'
      left = true
    when 'S'
      down = true
    when 'W'
      up = true
    when 'D'
      right = true

($ document).keyup (evt) ->
  switch String.fromCharCode evt.which
    when 'A'
      left = false
    when 'S'
      down = false
    when 'W'
      up = false
    when 'D'
      right = false
      
shoot = ->
  arrows.push {h: 30, p: pos, m: mult (direction pos, (plus mp, (minus pos, [500, 250]))), 20}

shootId = false

$ ->
  runStubs initStubs
  cnvs = $ 'canvas'
  ($ 'canvas').mousemove (evt) ->
    mp = minus [evt.pageX, evt.pageY], [cnvs.offset().left, cnvs.offset().top]
    evt.preventDefault()
  ($ 'canvas').click ->
    shoot()
  ($ 'canvas').mousedown ->
    shoot
    #maybe a previous mouseup wasn't recorded because the courser was in a sepperate window or something
    clearInterval shootId
    shootId = setInterval shoot, 320
    true
  ($ 'canvas').mouseup ->
    clearInterval shootId
    true

