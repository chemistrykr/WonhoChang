---
layout: post
read_time: true
show_date: true
title:  DFT(Design for Test)-01
date:   2025-06-13 18:25:20 -0600
description: Description on DFT (SCAN, BIST)
img: posts/DFT/DFT.jpg 
tags: [RTL, DFT, ASIC]
author: Wonho Chang
github:  
mathjax: yes
---

Tape out 과정 이후 Physical 회로를 test한다고 가정해봅시다. 
우리는 사전 과정 없인 Black box 방식으로 test할 수 밖에 없습니다.  

즉, Chip I/O단에서 Pattern을 입력하고 실제 Output이랑 Golden value랑 compare함으로써 test를 진행합니다. 

하지만 test 과정에서 failure가 발생할 경우 어떻게 대응해야 할까요?  
위 과정에서는 어떤 point에서 잘못된 값이 propagation되는지 분석하기엔 한계가 있습니다.

White-box Observability를 향상시켜 내부 module 단위에서 Debugging을 진행할 수 있어야 합니다. 
이때 High-Level에서 test를 위한 물리적인 회로를 넣는 방식이 DFT라고 합니다.    



CHI protocol feature은 다음과 같습니다.  

- 64-Byte granularity of cache line
- Snoop filter and directory-based systems
- MESI, MOESI cache model을 support

CHI transaction은 다음과 같은 특성을 갖습니다.  

- interconnect내에 synchronization, atomic operation을 support
- Exclusive access를 효율적으로 사용 가능
- Packet 기반 communication
- 모든 transaction은 snoop, cache, memory access를 조정하는 interconnect-based인 Home node로 부터 처리

## Layers of the CHI Architecture

- **Protocol (communication granularity: transaction)**
    - protocol node에서 request, responses를 처리하고 생성
    - protocol node에서 valid한 cache 상태 변환을 정의
    - request type에 대한 transaction flow를 정의

- **Network (communication granularity: Packet)**
    - protocol message를 packetize함
    - interconnect를 통해 destination으로 routing 하는 데 요구되는 target node ID와 packet를 확인하고 packet에 추가

- **Link (communication granularity: Flit)**
    - network device간의 flow를 control함
    - network 전체에서 deadlock-free한 swiching을 제공하기 위해 Link channel을 관리

## Terminology
- **Message**
    - Message는 두 component간의 교환 granularity를 정의하는 Protocol layer의 용어
        - Request
        - Data response
        - Snoop request

- **Packet**
    - interconnect를 통해 endpoint간의 communication되는 transfer 단위, message는 하나 이상의 packet으로 구성  
    각각의 packet은 destination ID, source ID와 같은 routing 정보가 포함되어 있어 독립적인 routing이 가능

- **Flit**
    - Flit은 가장 작은 flow control 단위. packet은 하나 이상의 flit으로 구성.
    Packet의 모든 flit은 interconnect를 통해 동일 경로를 이용합니다. 

- **RN (Request node)**
    - protocol transaction을 생성하는 node, 일반적으로 CPU 같은 master core들이 해당

- **SN (Slave node)**
    - Home node로부터 Request를 수신하는 node, 요구되는 action을 수행하고 response를 반환. 주로 memory나 peripheral이 해당

- **HN (Home node)**
    - Request node로부터 protocol transaction을 수신하는 node. 요구되는 coherency 동작을 수행하고 response 반환. 주소마다 하나의 HN 존재.

## Transaction Classification
- **Read Classification**
<center><img src='./assets/img/posts/chi/read_classification.png'></center>

- **Write Classification**
<center><img src='./assets/img/posts/chi/write_classification.png'></center>

- **Other Classification**
<center><img src='./assets/img/posts/chi/other_classification.png'></center>