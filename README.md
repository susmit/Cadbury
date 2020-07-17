# Cadbury
## Decentralized meetings powered by web3

Open,neutral,bodorles,decentralized and Censorship resistance Meetings(Google Meet / Zoom) powered by web 3.

![Cadbury Image](https://i.ibb.co/0s6RrB1/Screenshot-2020-07-17-at-8-26-26-PM.png)

### Landing Page:-

Fleek https://cadbury.on.fleek.co/

IPFS https://ipfs.fleek.co/ipfs/QmTFJZQwtrJTV4FmLfZDSZgFC64q8ExLVEFG4CXCeR9GXF/

### Meeting's Infra
* Capture media from web cam. 
* Connection libp2p js webrtc on browser.
* Get WebM with VP9 codec every 5 seconds from web cam data.
* Send data to another node for providing video processing service via FFMPEG  to HLS chunks. (incentivised via smc ,decentralized transcoders).
* Relay nodes for bandwidth ,Peer-to-Peer Streaming Peer Protocol (PPSPP) ,(Incentivised via smc)
* Then processed data in m3u8 formats gets stored in ipfs/ipns.
* pinning Services and http gateway to fetch content
* http hls player plays the stream on client side.
* Html ,Javascript ,React (HLS player).
* Fleek,Space Daemon ,unstoppable Domains,Textile,pinata (complementing pieces) 


### Meeting's Mechanics
* Authorization /Authentication to be handled on ETH (3box,metamask,eth smart contracts).
* Broadcast stream will categorised in paid,private,public stream (Eth smart contracts)
* business logic handled via eth smart contracts.
* Textile, orbitdb for our database


