---
layout: post
read_time: true
show_date: true
title:  CHI Protocol Overview (1)
date:   2025-05-02 17:32:20 -0600
description: CHI protocol specialized for cache coherence
img: posts/chi/chi.jpg 
tags: [RTL, AMBA Bus, Cache coherence]
author: Wonho Chang
github:  
mathjax: yes
---

Cache coherence를 hardware적으로 지원하는 CHI interface를 살펴봅시다.  

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


## What is MESI, MOESI model?
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
