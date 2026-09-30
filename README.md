# Network Protocol Visualizer — Mail (TCP) & Web Browsing (UDP/QUIC)

A small educational web project that visually demonstrates packet flow for:
- Email: Application layer → TCP → IP → Network
- Web browsing: Application layer → QUIC/HTTP/3 → UDP → IP → Network

> Note: Traditional HTTP/1.1 and HTTP/2 normally use TCP. This project intentionally demonstrates modern HTTP/3/QUIC browsing over UDP because that is the UDP-based browsing example requested.

## Run
1. Open a terminal in this folder.
2. Run:
   python app.py
3. Open http://127.0.0.1:5000

No external packages are required.

## Features
- Interactive protocol selector
- Animated packet flow
- Step-by-step explanation
- TCP connection / reliable delivery visualization for mail
- UDP + QUIC / HTTP/3 visualization for browsing
- Packet log and protocol comparison
