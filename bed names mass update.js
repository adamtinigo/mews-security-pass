const iframe = document.createElement("iframe")
document.body.append(iframe)

function wait(conditionCallback, delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // if (conditionCallback()) return
             resolve()
            // wait(conditionCallback, delay)
        }, delay);
    })
}

(async ()=>{

    const beds_to_change = Array.from(document.querySelectorAll('tr > td:first-child a'))
    .filter(x=>x.outerText.match(/[\dK][\dR]\d?-\d\d/));

    for (const bed of beds_to_change) {
        iframe.contentWindow.location = bed.href
        console.log('passing...')
        await wait(()=>(iframe.contentDocument.querySelectorAll('input#Name') !== null), 6500)
        console.log('pass')
        const input = iframe.contentDocument.querySelector('input#Name')
        const newValue = input.value.replace('-','.')
        
        input.focus()
        input.click()
        input.value = newValue
        input.dispatchEvent(new InputEvent("beforeinput", {inputType: "insertText", data: newValue, bubbles: true, cancelable: true}))
        input.dispatchEvent(new InputEvent("input", {inputType: "insertText", data: newValue, bubbles: true}))
        input.dispatchEvent(new InputEvent("change", {bubbles: true}))
        iframe.contentDocument.querySelector('button[type="submit"]').click()
    }
})()