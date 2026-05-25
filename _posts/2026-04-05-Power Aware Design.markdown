---
layout: post
read_time: true
show_date: true
title:  CHI Protocol (Transaction(2))
date:   2026-03-15 17:32:20 -0600
description: CHI protocol Overview (Transaction)
img: posts/chi/chi.jpg 
tags: [RTL, AMBA Bus, Cache coherence]
author: Wonho Chang
github:  
mathjax: yes
---

이번 장은 지난번 주제인 Read Transaction을 좀 더 살펴보도록 하겠습니다.
Cacheline에 저장하지 않고 처리되는 Non-Allocating Read는 어떤 방식으로 동작할까요? 

## Read Transaction 
- **Non-Allocating Read**
    - ReadNoSnp
    - ReadOnce
    - ReadOnceCleanInvalid
    - ReadOnceMakeInvalid

<center><img src='./assets/img/posts/chi/non-allocating_read.png'></center>

상위 그림은 Non-allocating Read 동작시 5가지 방식의 flow로 진행될 수 있음  
다만 Allocating Read와 달리 CompAck이 필수가 아니다.    
CompAck 동작을 요구할 경우 Transaction의 ExpCompAck을 설정해야 한다.  
Order, ExpCompAck의 설정에 따라 Transaction flow에 영향을 미칠 수 있다.    

예를 들어 Order 제약 조건이 있지만 CompAck을 요구하지 않을 경우 alternative 방식이 적용되지 않을 수 있습니다.  

- **1. Combined Response from Home**
    - 해당 방식은 주로 Home node에 data가 존재할 때 사용, data와 response를 combine하여 Requester에 전송
    - Order 제약조건 있을 경우 Optinal하게 Home은 ReadReceipt 반환할 수 있다.  
    <br> 

- **2. Separate data and response from Home**
    - Home에서 독립적으로 response와 data를 전송할 때 사용되는 방식  
    - Order 제약조건이 존재하고 CompAck을 요구하지 않을 경우 해당 scheme을 사용하지 못할 수 있음  
    <br>  

- **3. Combined response from Subordinate**
    - Home에 data가 존재하지 않아 Memory로 Data를 요청할 때 사용, Subordintae가 Data와 Response를 합쳐 Data channel로 전송
    - Order(!=0) 제약 사항이 있을 경우 선택적으로 Subordinate가 ReadReceipt response 반환, 다만 Compack을 요청하지 않을 경우 ReadReceipt 반환은 필수적이다.  
    - Home에서 Subordinate로 ReadNoSnp Downstream Request 전송  
    <br>

- **4. Response from Home, Data from Subordinate**
    - 독립적으로 Response는 Home이 전송하고 Data만 Subordinate에서 반환할 때 사용 
    - Home에서 Subordinate로 ReadNoSnpSep Downstream Request 전송 (Data만 반환)  
    - Optionally하게 Home이 Read Receipt를 요청할 경우 Subordinate는 Read Receipt를 전송할 수 있다. 하지만 Order와 CompAck을 명시되지 않는한 Home은 반드시 Read Receipt를 요청해야 합니다.   
    <br>

일반적으로 Response와 Data가 독립적으로 전송할 때 Response를 빨리 전송한다. 이때 Requester가 CompAck의 전송 시점은 Home으로부터 Response를 받은 이후부터 가능하다.  <br><br> 
즉 Home은 Requester로부터 Compack을 받은 이후 transaction을 완료할 수 있기에 combined response보다 빨리 transaction을 처리할 수 있음

- **5. Forwarding snoop**
    - Home에서 Snoopee (Requester)에 data forwarding을 요청하는 case
    - 이때 Home에 최신 data가 존재하지 않고 특정 Requester에 data가 존재할 때 Snoop 동작을 요청하는 방식 
    - 5a: Home에 Snoop Response만 전송하고 Requester에 Data를 fowarding하는 방식
    - 5b: Home에 Data와 함께 Response를 전송하고 Requester에 Data를 fowarding하는 방식 (주로 Dirty copy -> Clean할 때 사용)
    - 5c: Snoopee가 fail의 Snpresp 전송할 경우 Home에서 다른 대안을 찾는 방식
    - 5c: Snoopee가 fail의 Data와 함께 Snpresp 전송할 경우 Home에서 다른 대안을 찾는 방식  
    <br>

CompAck을 요청하는 Request일 경우 CompAck Response를 다음과 같은 순서 중 하나를 지켜줘야 한다.  
- 적어도 하나의 CompData를 수신할 경우
- Ordering 제약 사항이 없을 경우 2번이나 4번 Scheme에서 RespSepData가 올 경우
- Ordering 제약 사항이 있을 경우 RespSepData와 하나의 DataSepResp가 올 경우

<center><img src='./assets/img/posts/chi/no_allocating_dct_dmt.png'></center>

Home node를 Bypass하여 Read Data를 공급하는 주체가 DRAM or Cache인지에 따라 DMT와 DCT로 구분된다.  
상위 표는 Non-allocating Read인 ReadNoSnp, ReadOnce일 경우 DMT, DCT의 허용되는 조건이다.  

DMT일 경우 Subordinate에서 Home으로 ReadRecipt를 반환해야 한다.  
그리고 Order 제약 조건이 있을 경우 ExpCompAck을 설정해야 한다. 

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