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


