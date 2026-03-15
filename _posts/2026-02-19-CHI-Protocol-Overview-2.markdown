---
layout: post
read_time: true
show_date: true
title:  CHI Protocol (Transaction)
date:   2026-02-18 17:32:20 -0600
description: CHI protocol Overview (Transaction)
img: posts/chi/chi.jpg 
tags: [RTL, AMBA Bus, Cache coherence]
author: Wonho Chang
github:  
mathjax: yes
---

이번 장은 CHI Protocol에서 Cache Model과 transaction에 대해 살펴볼 예정입니다.   

## Cache State Model
CHI에서 Cache line은 6가지 state를 가질 수 있습니다. 
Valid/InValid, Clean/Dirty, Parial/Empty, Unique/Shared에 따라 state가 결정됩니다.  
<center><img src='./assets/img/posts/chi/cache_model.png'></center>

- **Invalid**
    - cache line이 cache에 존재하지 않은 state  
    <br>

- **Unique Dirty**
    - cache line이 해당 cache에만 존재하는 경우
    - cache line의 data가 Main Memory에 반영하지 않은 상태
    - Unique이기 때문에 다른 cache에 알릴 필요없이 Modify 가능
    - Dirty이기 때문에 제거시 다음 level의 cache or memory에 write back을 수행해야 한다.
    - Snoop에 의해 Directly하게 Cache line을 Requester에 전송 가능  
    <br>

- **Unique Dirty Partial**
    - Unique Dirty에서 cache line의 특정 byte만 valid할 경우
    - Unique Dirty의 특징을 포함하고 있지만 Requester로 Directy forwarding 불가능 (Cache 관련 최소 단위는 64Byte)
    - Cache line evict시 해당 data와 valid한 기존 data에 대한 merge 동작 요구  
    <br>


- **Shared Dirty**
    - 다른 cache들도 해당 cache line의 copy본을 공유하고 있는 상태 
    - Dirty이기 때문에 제거시 다음 level의 cache or memory에 write back을 수행해야 한다.
    - 다른 Cache들과 cache line을 공유하고 있기에 Unique한 ownership을 얻거나 다른 cache line을 invalidate 하지 않는 이상 함부로 modify 불가  
    <br>

- **Unique Clean**
    - cache line이 해당 cache에만 존재하는 경우
    - cache line과 Main memory와 Coherency가 보장된 상태
    - Unique이기 때문에 다른 cache에 알릴 필요없이 Modify 가능  
    <br>

- **Unique Clean Empty**
    - Unique Clean state에서 valid한 data를 가지지 않는 상태 (Ownership만 가진 상태)  
    <br>

- **Shared Clean**
    - 다른 cache들도 해당 cache line의 copy본을 공유하고 있는 상태 
    - 해당 cache line은 Memory에 대해 update 됐을 수도 있는 상태
    - 다만 evict시 Memory에 write back해야 할 책임은 없음
    - 다른 Cache들과 cache line을 공유하고 있기에 Unique한 ownership을 얻거나 다른 cache line을 invalidate 하지 않는 이상 함부로 modify 불가  

## Read Transaction 
- **Allocating Read**
    - ReadClean
    - ReadNotSharedDirty
    - ReadShared
    - ReadUnique
    - ReadPreferUnique
    - MakeReadUnique

<center><img src='./assets/img/posts/chi/allocating_read.png'></center>

Allocating Read는 Cacheline을 해당 Cache에 저장하기 위한 동작이다.
Allocating Read는 마지막 flow에 Requester가 Compack을 전송해야 하며 이때 **Home은 Compack을 수신할 때 까지 해당 Cacheline에 Snoop을 요청하면 안된다**.  

상위 그림은 Allocating Read 동작시 5가지 방식의 flow로 진행될 수 있음
- **1. Combined Response from Home**
    - 해당 방식은 주로 Home node에 data가 존재할 때 사용, data와 response를 combine하여 Requester에 전송 (즉 같은 data channel로 동시에 response, data 전송)  
    <br> 

- **2. Separate data and response from Home**
    - Home에서 독립적으로 response와 data를 전송할 때 사용되는 방식  
    <br>  

- **3. Combined response from Subordinate**
    - Home에 data가 존재하지 않아 Memory로 Data를 요청할 때 사용, Subordintae가 Data와 Response를 합쳐 Data channel로 전송
    - Order(!=0) 제약 사항이 있을 경우 선택적으로 Subordinate가 ReadReceipt response 반환
    - Home에서 Subordinate로 ReadNoSnp Downstream Request 전송  
    <br>

- **4. Response from Home, Data from Subordinate**
    - 독립적으로 Response는 Home이 전송하고 Data만 Subordinate에서 반환할 때 사용 
    - Home에서 Subordinate로 ReadNoSnpSep Downstream Request 전송 (Data만 반환)  
    - Subordinate는 Read Receipt를 전송해야 한다. Data 전송 이후로 Receipt Response 전송할 수는 있지만 필수 사항은 아니다. 
    <br>

일반적으로 Response와 Data가 독립적으로 전송할 때 Response를 빨리 전송한다. 이때 Requester가 CompAck의 전송 시점은 Home으로부터 Response를 받은 이후부터 가능하다.  <br> 
즉 Home은 Requester로부터 Compack을 받은 이후 transaction을 완료할 수 있기에 combined response보다 빨리 transaction을 처리할 수 있음

- **5. Forwarding snoop**
    - Home에서 Snoopee (Requester)에 data forwarding을 요청하는 case
    - 이때 Home에 최신 data가 존재하지 않고 특정 Requester에 data가 존재할 때 Snoop 동작을 요청하는 방식 
    - 5a: Home에 Snoop Response만 전송하고 Requester에 Data를 fowarding하는 방식
    - 5b: Home에 Data와 함께 Response를 전송하고 Requester에 Data를 fowarding하는 방식 (주로 Dirty copy -> Clean할 때 사용)
    - 5c: Snoopee가 fail의 Snpresp 전송할 경우 Home에서 다른 대안을 찾는 방식
    - 5c: Snoopee가 fail의 Data와 함께 Snpresp 전송할 경우 Home에서 다른 대안을 찾는 방식  
    <br>

- **6. MakeReadUnique only**
    - Home이 다른 Requester의 해당 Cacheline을 invalidate한 후 Comp response를 전송 

## Reference 
**AMBA CHI Architecture Specification H version**

<!--
A perceptron is the basic building block of a neural network, it can be compared to a neuron, And its conception is what detonated the vast field of Artificial Intelligence nowadays.

Back in the late 1950's, a young [Frank Rosenblatt](https://en.wikipedia.org/wiki/Frank_Rosenblatt) devised a very simple algorithm as a foundation to construct a machine that could learn to perform different tasks.

In its essence, a perceptron is nothing more than a collection of values and rules for passing information through them, but in its simplicity lies its power.

<center><img src='./assets/img/posts/20210125/Perceptron.png'></center>

Imagine you have a 'neuron' and to 'activate' it, you pass through several input signals, each signal connects to the neuron through a synapse, once the signal is aggregated in the perceptron, it is then passed on to one or as many outputs as defined. A perceptron is but a neuron and its collection of synapses to get a signal into it and to modify a signal to pass on.

In more mathematical terms, a perceptron is an array of values (let's call them weights), and the rules to apply such values to an input signal.

For instance a perceptron could get 3 different inputs as in the image, lets pretend that the inputs it receives as signal are: $x_1 = 1, \; x_2 = 2\; and \; x_3 = 3$, if it's weights are $w_1 = 0.5,\; w_2 = 1\; and \; w_3 = -1$ respectively, then what the perceptron will do when the signal is received is to multiply each input value by its corresponding weight, then add them up.

<p style="text-align:center">\(<br>
\begin{align}
\begin{split}
\left(x_1 * w_1\right) + \left(x_2 * w_2\right) + \left(x_3 * w_3\right)
\end{split}
\end{align}
\)</p>

<p style="text-align:center">\(<br>
\begin{align}<br>
\begin{split}<br>
\left(0.5 * 1\right) + \left(1 * 2\right) + \left(-1 * 3\right) = 0.5 + 2 - 3 = -0.5
\end{split}<br>
\end{align}<br>
\)</p>

Typically when this value is obtained, we need to apply an "activation" function to smooth the output, but let's say that our activation function is linear, meaning that we keep the value as it is, then that's it, that is the output of the perceptron, -0.5.

In a practical application, the output means something, perhaps we want our perceptron to classify a set of data and if the perceptron outputs a negative number, then we know the data is of type A, and if it is a positive number then it is of type B.

Once we understand this, the magic starts to happen through a process called backpropagation, where we "educate" our tiny one neuron brain to have it learn how to do its job.

<tweet>The magic starts to happen through a process called backpropagation, where we "educate" our tiny one neuron brain to have it learn how to do its job.</tweet>

For this we need a set of data that it is already classified, we call this a training set. This data has inputs and their corresponding correct output. So we can tell the little brain when it misses in its prediction, and by doing so, we also adjust the weights a bit in the direction where we know the perceptron committed the mistake hoping that after many iterations like this the weights will be so that most of the predictions will be correct.

After the model trains successfully we can have it classify data it has never seen before, and we have a fairly high confidence that it will do so correctly.

The math behind this magical property of the perceptron is called gradient descent, and is just a bit of differential calculus that helps us convert the error the brain is having into tiny nudges of value of the weights towards their optimum. [This video series by 3 blue 1 brown explains it wonderfuly.](https://www.youtube.com/watch?v=aircAruvnKk&list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi)

My program creates a single neuron neural network tuned to guess if a point is above or below a randomly generated line and generates a visualization based on graphs to see how the neural network is learning through time.

The neuron has 3 inputs and weights to calculate its output:
    
    input 1 is the X coordinate of the point,
    Input 2 is the y coordinate of the point,
    Input 3 is the bias and it is always 1

    Input 3 or the bias is required for lines that do not cross the origin (0,0)

The Perceptron starts with weights all set to zero and learns by using 1,000 random points per each iteration.

The output of the perceptron is calculated with the following activation function:
    if x * weight_x + y weight_y + weight_bias is positive then 1 else 0

The error for each point is calculated as the expected outcome of the perceptron minus the real outcome therefore there are only 3 possible error values:

|Expected  |  Calculated | Error|
|:----:|:----:|:----:|
|1|-1|1|
|1|1|0|
|-1|-1|0|
|-1|1|-1|

With every point that is learned if the error is not 0 the weights are adjusted according to:

    New_weight = Old_weight + error * input * learning_rate
    for example: New_weight_x = Old_weight_x + error * x * learning rate

A very useful parameter in all of neural networks is teh learning rate, which is basically a measure on how tiny our nudge to the weights is going to be. 

In this particular case, I coded the learning_rate to decrease with every iteration as follows:

    learning_rate = 0.01 / (iteration + 1)

this is important to ensure that once the weights are nearing the optimal values the adjustment in each iteration is subsequently more subtle.

<center><img src='./assets/img/posts/20210125/Learning_1000_points_per_iteration.jpg'></center>

In the end, the perceptron always converges into a solution and finds with great precision the line we are looking for.

Perceptrons are quite a revelation in that they can resolve equations by learning, however they are very limited. By their nature they can only resolve linear equations, so their problem space is quite narrow. 

Nowadays the neural networks consist of combinations of many perceptrons, in many layers, and other types of "neurons", like convolution, recurrent, etc. increasing significantly the types of problems they solve.
-->