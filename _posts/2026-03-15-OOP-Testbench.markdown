---
layout: post
read_time: true
show_date: true
title:  OOP Testbench (Primer)
date:   2026-03-13 12:32:20 -0600
description: Modern Testbench
img: posts/UVM/testbench.jpg 
tags: [RTL, OOP, UVM]
author: Wonho Chang
github:  
mathjax: yes
---

이번 장은 UVM의 기본 구조인 OOP Testbench에 대해 설명하겠습니다.
먼저 OOP가 무엇이며 기존 Testbench의 한계점이 무엇인지 알아야 합니다. 

OOP로 인해 얻을 수 있는 강점은 다음과 같습니다.
- Code Reuse
    - Class로 Variable 뿐만 아니라 function도 Reuse 가능 
- Code Maintainability
    - code를 한번의 update로 전체 반영 가능
- Memory Management
    - C언어와 달리 Memory Deallocation/Allocation 방식이 간단함

## Class
OOP에서 Class는 가장 핵심적인 문법 중 하나입니다. 
먼저 친숙한 C언어의 Struct를 비교하면서 Class의 특징을 파악해봅시다. 

**Class vs Struct**  
일반적으로 C언어에서 여러 변수 type을 하나로 capturing할 때 구조체를 사용합니다. 
하지만 한계점은 명확합니다. 예를 들어 정사각형과 직사각형을 설명한다고 가정합시다. 
<ul><li> 구조체로 정의할 경우 도형의 넓이를 구하는 기능(function)을 어떻게 설정할 것인가 ? </li>
<li> 구조체는 선언 시 메모리 할당되는데 어떻게 유지 관리를 할것 인가?</li>
<li> 두 도형의 연관성을 어떻게 구조체에서 정의할 수 있을까? </li> </ul>

위 한계점은 class라는 type을 통해 돌파할 수 있다. 
해당 내용은 차츰 설명할 예정이고 class 내부에 사용되는 terminology부터 정의하겠습니다. 

member - class 내부에서 정의된 변수, 함수  
property - class에 속한 변수  
method - class 내부에서 정의되는 function or task  

**Memory Allocation**  
Class는 구조체와 달리 선언 시 Memory 할당되지 않고 user가 명시적으로 할당해야 합니다.
new라는 method를 call함으로써 객체에 대한 memory를 할당합니다 (instantiating).

new method의 인자를 통해 내부 property 초기값을 설정할 수 있습니다.  
또한 인스턴스화 할 수 있는 객체의 수는 컴퓨터 memory에 제한되며 handle을 다른 변수로 copy 가능 (shallow copy) 

객체를 참조하는 동안 Memory의 할당이 지속되지만 참조가 해제될 경우 garbage 대상이 되고 일정 시간 이후에 Memory deallocation 된다. 

**Extension**    