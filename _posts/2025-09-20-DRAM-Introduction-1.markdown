---
layout: post
read_time: true
show_date: true
title:  DRAM Introduction 
date:   2025-09-19 05:00:20 -0600
description: Description on DRAM
img: posts/DRAM/DRAM.jpg 
tags: [RTL, DRAM, JEDEC]
author: Wonho Chang
github:  
mathjax: yes
---
  
최근 AI 시대에 고대역폭 메모리를 요구함에 따라 DRAM의 중요도는 증가하고 있습니다. 이번 페이지에서는 DRAM의 기본적인 동작과 구조에 대해 살펴보도록 하겠습니다.  

## DRAM Operation
DRAM은 Capacitor로 이루어진 아날로그 소자입니다.  
그래서 Current Leakage로 인한 Data integrity를 보장하기 위해 Refresh 동작을 주기적으로 수행해야 합니다.  

DRAM의 Cell은 1T-1C (1Transistor, 1Capacitor)로 이루어져 있으며 Transistor에 전압을 인가 후 Capacitor에 전하를 저장하는 방식으로 Data를 저장합니다. DRAM은 바둑판처럼 격자 구조로 여러 cell을 구성합니다.    

<center><img src='./assets/img/posts/DRAM/dram_cell.jpg'></center>

이때 Row(행), Column(열)은 DRAM을 access하는 단위입니다. 즉 Row는 여러 cell의 Transistor와 연결되어 있어 전압을 인가하여 open 시켜주는 역할을 합니다. 우리는 이를 Word line으로 부릅니다.  
그리고 Transistor 동작 후 Cell의 전하는 자연스럽게 bit-line에 흐르게 됩니다. bitline에 흐르는 전하로 인해 전압차가 발생되고 Sense Amplifier에서 이를 증폭시켜 Data를 High/Low인지 구분합니다.  
        
  
<center><img src='./assets/img/posts/DRAM/dram_operation.jpg'></center>

  
그렇다면 System 관점에서 어떻게 위 동작을 지시할지 생각해봐야 합니다. 우리는 Row address를 포함한 ACT라는 command를 통해 Row에 포함된 다수의 data를 Sense Amplifier에 load합니다.  
Row open 후 Column address를 포함한 CAS라는 command를 통해 Read/Write 동작을 수행합니다. 상위 그림은 DRAM Data가 I/O단에 입출력되는 과정을 보여주지만 현대 DRAM 동작이랑 상이할 수 있습니다.  

## DRAM Architecture

<center><img src='./assets/img/posts/DRAM/dram_architecture.jpg'></center>

DRAM Architecture을 설명하기 위해 익숙한 구조인 Column, Row부터 Rank까지 Bottom-up 방식으로 설명하겠습니다. 

**Column** - DRAM을 Access할 때 가장 작은 단위에 속합니다. Size는 connected되어 있는 DRAM die의 DQ width에 따라 달라집니다.  

예를 들어 16-bit DRAM Die가 4개로 lock-step방식으로 연결되어 있으면 CAS command당 최소 64bit 단위로 Data가 움직입니다. 또한 Prefetch 개념이 도입되어 DRAM type에 따라 최소 burst-length 결정됩니다. 최종 CAS command의 Data Size는 Burst-lenth, Logical DQ width를 모두 고려해야합니다.  


**Row** - Activate Command에 병렬적으로 동작하는 단위입니다. 시스템 관점에서 Precharge command 이전에 Data를 보관할 수 있다는 의미에서 DRAM Page라는 용어를 사용합니다. 우리는 여러 Bank에서 서로 다른 Page를 open 시켜 Utilization을 높일 수 있습니다. 


**Bank** - 1-bit당 DRAM cell의 격자 구조는 Memory array라고 부릅니다. Lock-step 방식으로 여러 개의 Memory array가 움직이는 단위를
Bank라고 부릅니다. DRAM Die의 DQ width는 단일 Bank 내부 Memory array의 갯수에 따라 결정됩니다. Bank끼리 서로 독립적으로 동작시킬 수 있습니다.  

예를 들어 서로 다른 Bank의 ACT command를 issue하여 timing 제약 없이 여러 Page를 이용하여 효율적으로 동작시킬 수 있습니다. 또한 사용하지 않는 Page는 Precharge를 통해 전력 소모를 줄이고
Data Integrity를 위해 Refresh command를 수행할 수 있습니다. 


**Rank** - Command에 의해 lock-step 방식으로 동작하는 DRAM Device의 set라고 생각하면 됩니다. Rank 내부 Dram Device는 Command line을 공유하고 DQ line은 group 되어 system DQ width를 결정합니다.  

예를 들어 system 64bit data bus를 구축한다고 가정하면 user의 요구사항에 따라 x16 Dram die 4개 or x8 Dram die 8개로 구성할 수 있습니다. 그리고 각각의 Rank의 동작은 CS핀으로 제어합니다.  