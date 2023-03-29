{
    function getElementNotYetRendered(elementGetter, delay = 100, timeout = 10000) {
        let retries = Math.ceil(timeout / delay);
        return new Promise((resolve, reject) => {
            (function resolveIfElementFound() {
                setTimeout(() => {
                    const element = elementGetter()
                    if (element?.toString().includes("Element")) return resolve(element)
                    if (element?.toString().includes("NodeList") && element.length > 0) return resolve(element)
                    
                    if (retries-- <= 0) return console.error(`Max retries reached: element was not found
                    element: "${element}"
                    elementGetter: "${elementGetter}"
                    `);
                    resolveIfElementFound()
                }, delay);
            })()
        })
    }
    
    function most_foreground_modal() { return document.querySelector('[class^="style__ModalTransitionGroup"] > [id^="mgr-0-modal"]:last-child') }
    
    async function getFirstOptionToChange() {
        /**
         * This select is too optimized and only shows options currently in view,
         * so we have to get and process its options in chunks
         */
    
        while (true) {
            const options_chunk = await getElementNotYetRendered(()=>document.querySelectorAll('[role="listbox"] [role="option"]'))
            console.log(options_chunk);
            const options_chunk_array = Array.from(options_chunk)
            const option = options_chunk_array.find(option => !option.outerText.includes("."));
            if (option) return option
            
            /* last_option */ options_chunk_array.at(-1).scrollIntoView()
        }
    }
    
    (async ()=>{
    
        while (true) {
            /* click add_button */ (await getElementNotYetRendered(()=>most_foreground_modal()?.querySelector('[data-test-icon-button="add_box"]'))).click()
        
            // open select input
            const room_select = await getElementNotYetRendered(()=>most_foreground_modal()?.querySelector('[data-test-select-name="Resource.Id"]'))
            /* click room_select */ room_select.click()
        
            const option = await getFirstOptionToChange()
            console.log(option.outerText);
            if (!option) return
        
            option.click()
            const input = document.getElementById("LockIdentifier")
            input.value = `${option.outerText}.01`
            const send_button = most_foreground_modal()?.querySelector('button[type="submit"]').click()
        }
    
    })()
}