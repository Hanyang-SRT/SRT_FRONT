# SRT_FrontEnd
본 프로젝트는 Prosody-Based Korean Speech Analysis and Feedback System for Foreign Learners를 목표로 하며, 이 레퍼지토리는 Front-End 파트이다.

## Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Development Environment](#development-environment)
- [Libraries and Tools](#libraries-and-tools)
- [Features](#Features)
  
## Overview
본 프로젝트는 외국인 한국어 학습자를 위한 Korean Transcriber를 주제로 하는 프로젝트로, 그 중 한국어의 운율을 한국 드라마와 같은 한류 콘텐츠 섀도잉을 통해 학습하는 것을 목표로 한다. 한국어에서 운율이란 성조, 억양, 강세, 리듬 등을 포괄하는 용어로 의미상의 차이를 가져오는 소리의 특징을 말한다. 한국어의 운율 정보는 청자들로 하여금 단어와 구를 식별하는 데에 영향을 끼치며, 실시간 언어 처리를 효율적으로 만들어 말소리를 보다 잘 이해하는 데에 도움을 줄 수 있다. 

사용자 타겟층은 한국어 발음에는 무리를 느끼지 않는 외국인 학습자이며, 학습을 위한 한류 콘텐츠는 모두 표준어를 기반으로 한다. 

## Project Structure
```
📦SRT_FRONT
 ┣ 
 ┣ 📂Images
 ┃ ┣ 📜audioWave.png
 ┃ ┣ 📜duration.png
 ┃ ┣ 📜intensity.png
 ┃ ┣ 📜pause.png
 ┃ ┣ 📜pitch.png
 ┃ ┣ 📜play.png
 ┃ ┣ 📜record.png
 ┃ ┣ 📜replay.png
 ┃ ┣ 📜report.png
 ┃ ┣ 📜stop.png
 ┃ ┗ 📜submit.png
 ┣ 📜.env
 ┣ 📜.gitignore
 ┣ 📜index.html
 ┣ 📜lobby.html
 ┣ 📜lobby.js
 ┣ 📜script.js
 ┗ 📜style.css
```

## Development Environment
* Browser Compatibility: Chrome 120+, Edge 120+, Safari 17+
(Tested for consistent layout and performance across modern browsers)

* Markup Language: HTML5
(Used to structure the content and layout of each page)

* Style Language: CSS3
(Used for styling, responsive layout, and basic animations)

* Scripting Language: JavaScript (ES6+)
(Used to handle DOM interactions, button events, and communication with the backend)
  
## Libraries and Tools
* Axios (if used): for making HTTP requests to the FastAPI backend
* YouTube Iframe API: for embedding and controlling the YouTube player


## Features
프론트는 3가지 화면으로 구성되어 있다. 

✅ Landing Page (랜딩 페이지)

<img src="https://github.com/user-attachments/assets/48cbb144-fa09-49a2-8323-a39bc9151c99" style="width:50%;"/>

- 기능

학습을 시작하기 위한 영상 카테고리 선택 화면

- 역할
  
사용자가 학습하고자 하는 영상의 카테고리를 선택

선택한 카테고리에 따라 관련된 유튜브 영상 목록을 필터링하여 표시

학습 페이지로 이동하는 시작페이지

<br>

✅ Learning Page (학습 페이지) 

<img src="https://github.com/user-attachments/assets/7632043a-34f8-4672-89dd-f8c7ada5b3ed" style="width:50%;"/>
<img src="https://github.com/user-attachments/assets/c087fb9b-d215-4d08-9f28-22212aaa5a63" style="width:50%;"/>

- 기능
  
영상 시청 및 섀도잉 학습 수행

- 역할

중앙에 유튜브 영상이 임베딩되어 있어 학습용 영상을 시청 가능

영상의 특정 구간 대사가 자동 재생됨

사용자는 해당 대사를 녹음하여 섀도잉 훈련

녹음된 발화를 바탕으로 발음 분석

- 주요 버튼 기능

홈 버튼: 랜딩 페이지로 이동

Replay 버튼: 지정된 대사 구간 재생

녹음 버튼: 사용자 발화 녹음

분석 버튼: 녹음된 발화에 대한 분석 수행

Report 버튼: 분석 결과 리포트 창 열기

<br> 

✅ Report Page (리포트 페이지)

<img width="50%" alt="스크린샷 2025-06-17 오후 4 20 45" src="https://github.com/user-attachments/assets/744a4515-0352-4813-8364-7137ccf3e0d0" />

- 기능
  
사용자의 섀도잉 결과에 대한 피드백 제공

- 역할

세 가지 요소 (예: 음높이, 강세, 길이 등)에 대해 모델과 사용자의 발화를 분석 및 비교

시각적으로 비교 그래프나 수치 등으로 결과를 표현

중간 피드백도 반영하여, 사용자 발화 내용 시각화

사용자에게 학습 결과에 대한 종합적 피드백 제공

<hr>
본 프로젝트는 한양대학교 에리카 캠퍼스 인공지능학과 음성인식의 IC-PBL 프로젝트이다.

* Uiseong shin : tlsdmltjd01@hanynag.ac.kr 
