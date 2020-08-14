import React, { useState, useEffect, useRef } from 'react'

const DragDrop = (props) => {
  const [bgColor, setBgColor] = useState('transparent')

  const changeBgColor = (state) => {
    console.log(state)
    setBgColor((state && 'green') || 'transparent')
  }

  return (
    <div
      style={{
        backgroundColor: bgColor,
      }}
      className={props.className}
      onDragEnter={(e) => {
        e.preventDefault()
        e.stopPropagation()
        changeBgColor(true)
        e.dataTransfer.dropEffect = 'copy'
        console.log('DragEnter', e.dataTransfer.items.length)
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        e.stopPropagation()
        changeBgColor(false)
        console.log('onDragLeave')
      }}
      onDragOver={(e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log('onDragOver')
      }}
      onDrop={(e) => {
        e.preventDefault()
        e.stopPropagation()
        changeBgColor(false)
        console.log(e.dataTransfer.items)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          props.sendFiles(e.dataTransfer.files)
        }
      }}
    >
      {props.children}
    </div>
  )
}

export default DragDrop
