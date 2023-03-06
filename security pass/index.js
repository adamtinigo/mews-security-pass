
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
    <img src="https://kinlaydublin.ie/wp-content/uploads/kinlay_logo.png" class="attachment-full size-full" alt="" loading="lazy" srcset="https://kinlaydublin.ie/wp-content/uploads/kinlay_logo.png 360w, https://kinlaydublin.ie/wp-content/uploads/kinlay_logo-300x178.png 300w" sizes="(max-width: 360px) 100vw, 360px" width="360" height="213">

    <h2>SECURITY PASS</h2>
    <hr>
    <table>
        <tr>
            <td>Guest:</td>
            <td>{guest}</td>
        </tr>
        <tr>
            <td>Reference:</td>
            <td>{reference}</td>
        </tr>
        <tr>
            <td>Room:</td>
            <td>{room}</td>
        </tr>
        <tr>
            <td>Bed:</td>
            <td>{bed}</td>
        </tr>
        <tr>
            <td>Arrival:</td>
            <td>{arrival}</td>
        </tr>
        <tr>
            <td>Departure:</td>
            <td>{departure}</td>
        </tr>
    </table>
    <hr>

    <h5>Free Breakfast from: 7.30 AM - 10 AM</h5>
    <h5><strong>Check-out time: 10 AM</strong></h5>
    <h5>WI-FI password: bananaman</h5>
    <h5>Cooking time: 11 AM - 10 PM</h5>
    <h5>Access CODE for lockers: C234</h5>
    <h5><strong>😊 PUB CRAWL TICKETS ON SALE 😊</strong></h5>

</body>
</html>`;

reservations = Array.from(document.querySelectorAll("[data-test-reservation-card]"));

iframe = document.getElementById("security_pass_print");
if (iframe === null) {
    iframe = document.createElement("iframe");
    iframe.id = "security_pass_print";
    iframe.style.position = "fixed";
    iframe.style.visibility = "hidden";
    document.body.appendChild(iframe);
};

reservations.forEach(reservation => {
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
    let [room, bed] = roombed.split("-");
    if (room.toLowerCase() === "kr") room = "Kinlay Room";
    if (bed === undefined) bed = "All";
    const [arrival, departure] = reservation.querySelector("[class^=Caption] > span")
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
     */
    const button = reservation.querySelector('[data-test-icon-button="print"]');
    button.addEventListener("click", event => {
        iframe.contentDocument.open();
        iframe.contentDocument.write(security_pass);
        iframe.focus();
        iframe.contentWindow.print();
    });
});
