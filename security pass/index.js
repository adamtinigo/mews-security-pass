{
    security_pass_template = `<html lang="en">
    <head>
        <title>Security Pass</title>
        <style>
            html {
                width: 500px;
                background-color: white;
                font-size: 1.5em;
            }
            h2 {
                text-align: center;
            }
            td {
                padding-left: 0.5em;
                font-size: 1.2em;
            }
            h5 {
                text-align: center;
                margin: 0;
            }
            strong{
                background-color: blue;
                color: white;
            }
            table {
                margin: auto;
                font-size: inherit;
                font-weight: bold;
            }
            hr {
                display: block;
                height: 2px;
                background: transparent;
                width: 100%;
                border: none;
                border-top: solid 2px black;
                margin: 1em 0;
            }
            img {
                display: block;
                height: 150px;
                margin: auto;
                max-width: 100%;
            }
        </style>
    </head>
    <body>
        <img src="">
    
        <h2>SECURITY PASS</h2>
        <hr>
        <table>
            <tr>
                <td>Guest:</td>
                <td contenteditable>{guest}</td>
            </tr>
            <tr>
                <td>Reference:</td>
                <td contenteditable>{reference}</td>
            </tr>
            <tr>
                <td>Room:</td>
                <td contenteditable>{room}</td>
            </tr>
            <tr>
                <td>Bed:</td>
                <td contenteditable>{bed}</td>
            </tr>
            <tr>
                <td>Arrival:</td>
                <td contenteditable>{arrival}</td>
            </tr>
            <tr>
                <td>Departure:</td>
                <td contenteditable>{departure}</td>
            </tr>
        </table>
        <hr>
    
        <h5 contenteditable>Free Walking tours at 11 AM and 1 PM</h5>
        <h5 contenteditable>Free Breakfast from: 7.30 AM - 10 AM</h5>
        <h5 contenteditable><strong>Check-out time: 10 AM</strong></h5>
        <h5 contenteditable>WI-FI password: bananaman</h5>
        <h5 contenteditable>Cooking time: 11 AM - 10 PM</h5>
        <h5 contenteditable>Access CODE for lockers: C234</h5>
        <h5 contenteditable><strong>😊 PUB CRAWL TICKETS ON SALE 😊</strong></h5>
        <br>
        <br>
        .
    </body>
    </html>`;
    
    /** @type {HTMLElement[]} */
    /*let reservations;*/
    
    reservations = Array.from(document.querySelectorAll("[data-test-reservation-card]:not(.print-modified)"));
    
    /** @type {HTMLElement} */
    /*let container;*/
    
    container = document.getElementById("security_pass_print");
    if (container === null) {
        container = document.createElement("div");
        container.id = "security_pass_print";
        container.style.zIndex = 10001;
        container.style.position = "fixed";
        container.style.height = "100vh";
        container.style.width = "100vw";
        container.style.display = "flex";
        container.style.justifyContent = "center";
        container.style.alignItems = "stretch";
        container.style.visibility = "hidden";
        document.body.appendChild(container);
        
        const backdrop = document.createElement("div");
        backdrop.style.backgroundColor = "gray";
        backdrop.style.opacity = 0.5;
        backdrop.style.flexGrow = 1;
        backdrop.onclick = () => container.style.visibility = "hidden";
        container.appendChild(backdrop);
    
        const iframe_container = document.createElement("div");
        iframe_container.style.display = "flex";
        iframe_container.style.flexBasis = "515px";
        iframe_container.style.flexDirection = "column";
    
        {    
            const iframe = document.createElement("iframe");
            iframe.style.flexGrow = "1";
            iframe_container.appendChild(iframe);
    
            const button = document.createElement("button");
            button.innerText = "Print Security Pass";
            button.style.fontSize = "2em";
            button.style.padding = "0.5em";
            button.onclick = () => iframe.contentWindow.print();
            iframe_container.appendChild(button);
        };
        container.appendChild(iframe_container);
    
        const backdrop_clone = backdrop.cloneNode();
        backdrop_clone.onclick = () => container.style.visibility = "hidden";
        container.appendChild(backdrop_clone);
    
    
        document.addEventListener("keydown", event => {
            if (event.key !== "Escape") return;
            container.style.visibility = "hidden";
        }, true);
    };
    
    reservations.forEach(reservation => {
        reservation.classList.add("print-modified");
        /**
         * Extracting data
         */
        const [nameReversed, roombed] = reservation.querySelector(".modal-header h2")
                                        .outerText.split(" - ");
        const guest = nameReversed.split(', ').reverse().join(" ");
        const reference = Array.from(reservation.querySelectorAll(".short-hand > span"))
                                .find(el => el.outerText.match(/[0-9]{5}/))
                                .outerText;
        /** @type string */
        let [room, bed] = roombed.split(".");
        if (room.toLowerCase() === "kr") room = "Kinlay Room";
        if (bed === undefined) bed = "Private Room";
        const [arrival, departure] = reservation.querySelector('[data-test-tag="true"] ~ [class^=Typography] > span')
                                                .outerText.split(" ‐ ");
    
        /**
         * embedding data into template
         */
        let security_pass = security_pass_template
                                .replace("{guest}", guest)
                                .replace("{reference}", reference)
                                .replace("{room}", room)
                                .replace("{bed}", bed)
                                .replace("{arrival}", arrival)
                                .replace("{departure}", departure);
    
        /**
         * Make *print button* print the security pass
         * @type {HTMLElement}
         */
        const button = reservation.querySelector('[data-test-icon-button="print"]');
        button.addEventListener("click", event => {
            const iframe = container.querySelector("iframe");
            iframe.contentDocument.open();
            iframe.contentDocument.write(security_pass);
            iframe.contentWindow.print();
        });
        button.addEventListener("contextmenu", event => {
            event.preventDefault();
            container.style.visibility = "visible";
            const iframe = container.querySelector("iframe");
            iframe.contentDocument.open();
            iframe.contentDocument.write(security_pass);
            iframe.focus();
    
            iframe.contentDocument.addEventListener("keydown", event => {
                if (event.key !== "Escape") return;
                container.style.visibility = "hidden";
            }, true);
        });
    });
}
/* made by github.com/madacol */
