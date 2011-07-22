arrows = []
bunnies = new parray 5000, 500
deathbunnies = []
flowers = new parray 5000, 500
pos = [250, 250]
dogpos = [300, 300]
doghasbunny = false
dogrun = false
deathbunnycount = 0
posm = [0, 0]
quux = 0

@bla = -> flowers

@bg = new Image()
bg.src = 'bg.png'
@bg2 = new Image()
bg2.src = 'bg2.png'


draw = ->
  #clearRect ctx, [0, 0], [500, 500]
  ctx.fillStyle = '#000000'
  fillRect ctx, [0, 0], [1000, 500]
  ctx.save()
  translate ctx, minus [500, 250], pos
  for x in [0..29]
    for y in [0..29]
      ctx.drawImage bg, x*bg.width, y*bg.height
  for x in [0..23]
    for y in [0..23]
      ctx.drawImage bg2, x*bg2.width, y*bg2.height
  ctx.fillStyle = '#ee3300'
  for {p} in deathbunnies
    fillRect ctx, p, [40, 40]
  ctx.fillStyle = '#eeaa00'
  for {p, death} in flowers.near pos
    fillRect ctx, p, [20, 20]
  ctx.fillStyle = '#000000'
  for {p} in bunnies.near pos
    fillRect ctx, p, [40, 40]
  if doghasbunny
    ctx.fillStyle = '#aa6600'
  fillRect ctx, (minus dogpos, [20, 20]), [40, 40]
  ctx.fillStyle = '#000000'
  fillRect ctx, (minus pos, [20, 20]), [40, 40]
  for {p, m} in arrows
    ctx.beginPath()
    moveTo ctx, p
    lineTo ctx, plus p, m
    ctx.closePath()
    ctx.stroke()
  ctx.restore()
  ctx.fillStyle = '#ddaa00'
  fillRect ctx, [10, 10], [((Math.sqrt deathbunnycount)) * 10, 10]
  #fillRect ctx, [10, 30], [bunnies.length(), 10]


hitp = (bunny) ->
  for a in arrows
    if contains (plus a.p, a.m), bunny.p, [40, 40]
      a.p = [-100, -100]
      return true
  false


# the numbers are not quite 5000 because this would mean that flowers would get to a place where bunnies would seek them but wouldn't reach
randpos = -> [4950 * Math.random(), 4950 * Math.random()]

step = ->
  pos = plus pos, posm
  bunnies.add({p: randpos(), alarmed: false, life: 100}) if bunnies.length() < 1
  flowers.add({p: randpos(), death: false})
  arrows = for {p, m, h} in arrows when h > 1
    {p: (plus p, m), m, h: h - 1}
  newbunnies = new parray 5000, 500
  bunnies.each (bunny) -> 
    if (hitp bunny)
      deathbunnies.push bunny
      return
    if bunny.life < 1
      return 
    bunny.life--
    for otherbunny in bunnies.near bunny.p when not (bunny == otherbunny)
      if (pyth minus bunny.p, otherbunny.p) < 50
        bunny.p = plus bunny.p, mult (direction otherbunny.p, bunny.p), 2
    dist = pyth minus pos, bunny.p
    if dist < 150 #&& false
      bunny.alarmed = true
      ###
      for otherbunny in bunnies.near bunny.p
        dist2 = pyth minus bunny.p, otherbunny.p
        if dist2 < 150
          otherbunny.alarmed = true
      ###
    if bunny.alarmed
      bunny.alarmed = dist < 600
      bunny.p = plus bunny.p, mult (direction pos, bunny.p), 10
    else
      if bunny.life > 1000
        bunny.life -= 200
        bunny.life /= 2
        newbunnies.add {
          p: (plus bunny.p, [20, 20]), 
          alarmed: false,
          life: bunny.life}
      f = {p: [99999,99999]}
      for f2 in flowers.near bunny.p
        if (distance f.p, bunny.p) > (distance f2.p, bunny.p)
          other = false
          for otherbunny in bunnies.near bunny.p when not (bunny == otherbunny)
            if (distance f2.p, bunny.p) > (distance f2.p, otherbunny.p)
              other = true
              break
          if not other
            f = f2
      if f.p[0] != 99999
        bunny.p = plus bunny.p, mult (direction bunny.p, f.p), 8
        if (pyth minus f.p, bunny.p) < 20
          bunny.life += 50
          f.death = true
    if bunny.p[0] < 0
      bunny.p[0] = 0
    else if bunny.p[0] > 4960
      bunny.p[0] = 4960
    if bunny.p[1] < 0
      bunny.p[1] = 0
    else if bunny.p[1] > 4960
      bunny.p[1] = 4960
    newbunnies.add bunny
  bunnies = newbunnies
  if doghasbunny
    if (distance dogpos, pos) < 50
      deathbunnycount++
      doghasbunny = false
    else
      dogpos = plus dogpos, mult (direction dogpos, pos), 8
  else
    db = {p: [99999, 99999]}
    for db2 in deathbunnies
      dist = distance db2.p, dogpos
      if dist < 500 && dist < (distance dogpos, db.p)
        db = db2
    if db.p[0] != 99999
      dogpos = plus dogpos, mult (direction dogpos, db.p), 8
    else if dogrun
      if (distance dogpos, pos) > 90
        dogpos = plus dogpos, mult (direction dogpos, pos), 8
      else
        dogrun = false
    else if (distance dogpos, pos) > 250
      dogrun = true
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
  switch evt.which
    when 38
      posm[1] = -6
    when 40
      posm[1] = +6
    when 39
      posm[0] = +6
    when 37
      posm[0] = -6

($ document).keyup (evt) ->
  switch evt.which
    when 38
      posm[1] += 6
    when 40
      posm[1] -= 6
    when 39
      posm[0] -= 6
    when 37
      posm[0] += 6

$ ->
  quux = setInterval step, 40
  #setTimeout (-> clearInterval quux), 100
  ($ 'canvas').click (evt) ->
    arrows.push {h: 30, p: pos, m: mult (direction pos, (plus [evt.offsetX, evt.offsetY], (minus pos, [500, 250]))), 20}

