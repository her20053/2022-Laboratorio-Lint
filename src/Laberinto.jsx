import { React, useEffect, useState } from 'react'
import './laberinto.css'

function Encabezado() {
  return (
    <div className="divEncabezado">
      <h1>Laboratorio 7: Laberinto en React</h1>
      <h2>Jose Andres Hernandez Guerra 20053</h2>
    </div>
  )
}

function App() {
  const [permitirMovimiento, setPermitirMovimiento] = useState(true)
  const [colorFondo, setColorFondo] = useState('#5FFBF1')
  const [gif, setGif] = useState('./assets/Idle3.gif')
  const [posJugador, setPosJugador] = useState([0, 0])
  const [viendoHacia, setViendoHacia] = useState(1)
  const [movimiento, setMovimiento] = useState('')
  const [laberinto, setLaberinto] = useState([])
  const [tamano, setTamano] = useState(4)
  const [contador, setContador] = useState(0)

  useEffect(() => {
    fetch(`https://maze.juanelcaballo.club/?type=json&w=${tamano}&h=${tamano}`)
      .then((response) => response.json())
      .then((data) => {
        setLaberinto(data)
      })
    // eslint-disable-next-line space-before-function-paren
    document.addEventListener('keydown', (event) => {
      // console.log(`Key: ${event.key}`);
      if (['a', 'w', 's', 'd'].includes(event.key)) {
        setMovimiento(event.key)
        setContador((prev) => prev + 1)
      }
    })
    setPermitirMovimiento(true)
  }, [tamano])

  useEffect(() => {
    // console.log("Se ha realizado un movimiento: ", movimiento)

    let deseaMoverseA = posJugador

    if (movimiento === 'd') {
      setViendoHacia(1)
      deseaMoverseA = [posJugador[0], posJugador[1] + 1]
    }
    if (movimiento === 'a') {
      setViendoHacia(-1)
      deseaMoverseA = [posJugador[0], posJugador[1] - 1]
    }

    if (movimiento === 'w') { deseaMoverseA = [posJugador[0] - 1, posJugador[1]] }
    if (movimiento === 's') { deseaMoverseA = [posJugador[0] + 1, posJugador[1]] }

    // console.log(desea_moverse_a)

    let infoPaso = false
    let infoGanador = false

    try {
      // console.log(laberinto[desea_moverse_a[0]][desea_moverse_a[1]])
      if (laberinto[deseaMoverseA[0]][deseaMoverseA[1]] === ' ') {
        infoPaso = true
      }
      if (laberinto[deseaMoverseA[0]][deseaMoverseA[1]] === 'g') {
        infoGanador = true
      }
      // eslint-disable-next-line no-empty
    } catch (err) {
    }

    if (infoPaso && permitirMovimiento) {
      setGif('./assets/Roll4.gif')

      const nuevoLaberinto = []

      for (let i = 0; i < laberinto.length; i += 1) {
        nuevoLaberinto.push([...laberinto[i]])
      }

      // console.log(nuevoLaberinto)

      nuevoLaberinto[posJugador[0]][posJugador[1]] = ' '
      nuevoLaberinto[deseaMoverseA[0]][deseaMoverseA[1]] = 'p'

      // console.log(nuevoLaberinto)

      setLaberinto(nuevoLaberinto)
    }

    if (infoGanador) {
      // console.log('Puedes pasar, es espacio vacio: ', movimiento)

      const nuevoLaberinto = []

      for (let i = 0; i < laberinto.length; i += 1) {
        nuevoLaberinto.push([...laberinto[i]])
      }

      // console.log(nuevoLaberinto)

      nuevoLaberinto[posJugador[0]][posJugador[1]] = ' '
      nuevoLaberinto[deseaMoverseA[0]][deseaMoverseA[1]] = 'p'

      // console.log(nuevoLaberinto)

      setLaberinto(nuevoLaberinto)

      setColorFondo('yellow')

      setPermitirMovimiento(false)
    }
  }, [contador])

  useEffect(() => {
    // eslint-disable-next-line space-before-function-paren
    setTimeout(() => {
      setGif('./assets/idle3.gif')
    }, 400)
  }, [gif])

  useEffect(() => {
    for (let i = 0; i < laberinto.length; i += 1) {
      for (let j = 0; j < laberinto[i].length; j += 1) {
        if (laberinto[i][j] === 'p') {
          setPosJugador([i, j])
        }
      }
    }
  }, [laberinto])

  // eslint-disable-next-line react/no-unstable-nested-components
  function Controlador() {
    return (
      <div className="divControlador">
        <button type="submit" className="btn" onClick={() => setTamano((prev) => prev - 1)}>-</button>
        <p>{tamano}</p>
        <button type="submit" className="btn" onClick={() => setTamano((prev) => prev + 1)}>+</button>
      </div>
    )
  }

  const rot = {
    transform: `scaleX(${viendoHacia})`,
  }

  // eslint-disable-next-line react/no-unstable-nested-components
  function Tablero() {
    return (
      <div className="divTablero">
        {
          laberinto.map((fila) => (
            <div className="fila" key={Math.random()}>
              {
                // eslint-disable-next-line array-callback-return
                fila.map((p) => {
                  if (p === ' ') {
                    return (
                      <div
                        key={Math.random()}
                        className="espacio"
                        style={{ backgroundColor: colorFondo }}
                      />
                    )
                  } if (p === 'p') {
                    return (<img alt="hola" src={gif} style={rot} key={Math.random()} className="jugador" />)
                  } if (p === '|') {
                    return <div key={Math.random()} className="pared" />
                  } if (p === '+') {
                    return <div key={Math.random()} className="pared" />
                  } if (p === '-') {
                    return <div key={Math.random()} className="pared" />
                  } return <div key={Math.random()} className="meta" />
                })
              }
            </div>
          ))
        }
      </div>
    )
  }

  return (
    <div>
      <Encabezado />
      <Controlador />
      <Tablero />
    </div>
  )
}
export default App
