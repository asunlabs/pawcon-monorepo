import { IncreaseToTarget, Wrapper } from './counter.js'
 
const display = document.querySelector(".display") as HTMLHeadingElement // type casting
const dataTarget = display.getAttribute('data-target') as string

const counterSetting = { 
    target : parseInt(dataTarget),
    count : 0, 
    speed : 10, 
    display : display
}

IncreaseToTarget(counterSetting)

// initiate
window.addEventListener("load", ()=>{
    const counter = document.querySelector(".counter") as HTMLElement
    setTimeout(()=>{
        counter.style.display = "block"
        display.classList.add("active")
        IncreaseToTarget(counterSetting)
    }, 2000)
})