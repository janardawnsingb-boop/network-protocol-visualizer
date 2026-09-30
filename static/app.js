const data = {
    mail: {
        protocol: "TCP",
        server: "Mail Server",
        sub: "SMTP / IMAP / POP3",
        steps: [
            ["1. Application creates email", "Your mail application prepares the message and passes it to SMTP."],
            ["2. TCP connection", "TCP establishes a connection using SYN → SYN-ACK → ACK."],
            ["3. Reliable segments", "The email is divided into TCP segments. Sequence numbers and acknowledgements provide reliable delivery."],
            ["4. IP network transfer", "TCP segments are carried inside IP packets and travel through routers."],
            ["5. Server receives data", "The mail server receives, reassembles and processes the email."]
        ],
        details: {
            Transport: "TCP",
            Application: "SMTP / IMAP / POP3",
            Reliability: "Reliable + ordered",
            Handshake: "TCP 3-way handshake",
            Ports: "25 / 465 / 587 / 143 / 993 / 110 / 995"
        }
    },

    web: {
        protocol: "UDP + QUIC",
        server: "Web Server",
        sub: "HTTP/3",
        steps: [
            ["1. Browser requests page", "The browser creates an HTTP/3 request."],
            ["2. QUIC starts over UDP", "HTTP/3 uses QUIC, which runs over UDP."],
            ["3. Data becomes QUIC packets", "Web data is carried inside QUIC packets."],
            ["4. IP network transfer", "UDP datagrams containing QUIC packets travel through the network."],
            ["5. Browser receives response", "QUIC handles loss recovery and HTTP/3 delivers the response."]
        ],
        details: {
            Transport: "UDP + QUIC",
            Application: "HTTP/3",
            Reliability: "QUIC provides reliability",
            Handshake: "QUIC connection establishment",
            Ports: "443 UDP"
        }
    }
};

let mode = "mail";
let step = 0;
let timer = null;

const $ = selector => document.querySelector(selector);

function render() {
    const d = data[mode];

    $("#protocolBadge").textContent = d.protocol;
    $("#serverName").textContent = d.server;
    $("#serverSub").textContent = d.sub;

    $("#stepCards").innerHTML = d.steps.map((item, i) => `
        <div class="step-card ${i === step ? "show" : ""}">
            <h3>${item[0]}</h3>
            <p>${item[1]}</p>
        </div>
    `).join("");

    $("#stepCounter").textContent =
        `Step ${step + 1} of ${d.steps.length}`;

    $("#details").innerHTML =
        Object.entries(d.details).map(([key, value]) => `
            <div class="detail-row">
                <b>${key}</b>
                <span>${value}</span>
            </div>
        `).join("");
}

function addLog(message) {
    const log = $("#log");

    const line = document.createElement("div");
    line.className = "logline";

    line.textContent =
        `[${new Date().toLocaleTimeString()}] ${message}`;

    log.prepend(line);

    while (log.children.length > 10) {
        log.lastChild.remove();
    }
}

function startAnimation() {
    clearInterval(timer);

    const packets = document.querySelectorAll(".packet");

    packets.forEach(packet => {
        packet.classList.remove("go");
    });

    // Force browser to restart CSS animation
    void document.body.offsetWidth;

    packets.forEach((packet, index) => {
        setTimeout(() => {
            packet.classList.add("go");
        }, index * 350);
    });

    timer = setInterval(() => {

        packets.forEach(packet => {
            packet.classList.remove("go");
        });

        void document.body.offsetWidth;

        packets.forEach((packet, index) => {
            setTimeout(() => {
                packet.classList.add("go");
            }, index * 350);
        });

        if (mode === "mail") {
            const messages = [
                "TCP SYN →",
                "TCP SYN-ACK ←",
                "TCP ACK →",
                "SMTP DATA →",
                "TCP ACK ←"
            ];

            addLog(messages[step % messages.length]);

        } else {
            const messages = [
                "HTTP/3 REQUEST →",
                "QUIC CONNECTION",
                "UDP DATAGRAM →",
                "QUIC PACKET →",
                "HTTP/3 RESPONSE ←"
            ];

            addLog(messages[step % messages.length]);
        }

        step++;

        if (step >= data[mode].steps.length) {
            step = 0;
        }

        render();

    }, 3000);
}

document.querySelectorAll(".mode").forEach(button => {

    button.addEventListener("click", () => {

        clearInterval(timer);

        document.querySelectorAll(".mode")
            .forEach(b => b.classList.remove("active"));

        button.classList.add("active");

        mode = button.dataset.mode;
        step = 0;

        document.querySelectorAll(".packet")
            .forEach(packet => packet.classList.remove("go"));

        render();

        addLog(
            mode === "mail"
                ? "Switched to EMAIL → TCP"
                : "Switched to BROWSING → UDP + QUIC"
        );
    });

});

$("#play").addEventListener("click", () => {

    startAnimation();

    addLog(
        mode === "mail"
            ? "TCP packet animation started."
            : "UDP + QUIC packet animation started."
    );

});

$("#reset").addEventListener("click", () => {

    clearInterval(timer);

    document.querySelectorAll(".packet")
        .forEach(packet => packet.classList.remove("go"));

    step = 0;

    $("#log").innerHTML = "";

    render();

    addLog("Simulation reset.");
});

render();

addLog("Ready. Select a protocol and press Play Animation.");