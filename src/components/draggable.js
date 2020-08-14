import React, { useState, useEffect, useRef } from 'react'

const Draggable = (props) => {
  const [pressed, setPressed] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const ref = useRef()

  useEffect(() => {
    if (ref.current) {
      ref.current.style.transform = `translate(${position.x}px, ${position.y}px)`
    }
  }, [position])

  const onMouseMove = (event) => {
    if (pressed) {
      setPosition({
        x: position.x + event.movementX,
        y: position.y + event.movementY,
      })
    }
  }

  return (
    <div
      style={props.style}
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      {props.children}
    </div>
  )
}

export default Draggable
