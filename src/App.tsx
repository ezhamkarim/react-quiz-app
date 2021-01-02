import React, { useState } from "react";
import QuestionCard from "./components/QuestionCard";
import { fetchQuizQuestions } from "./API";
import { QuestionState, Difficulty } from "./API";
// styles

import { GlobalStyle , Wrapper} from "./App.styles";
export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const TOTAL_QUESTIONS = 10;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswer, setUserAnswer] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  console.log(question);
  const startFetchTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );

    setQuestion(newQuestions);

    setScore(0);
    setUserAnswer([]);
    setNumber(0);
    setLoading(false);
  };

  const checkAns = (event: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver){
      const answer = event.currentTarget.value;

      //Check answer 

      const correct = question[number].correct_answer === answer;
      //If correct, add to score
      if(correct) setScore(prev => prev+1);
      //create answer object
      const answerObject = {
        question: question[number].question,
        answer,
        correct,
        correctAnswer : question[number].correct_answer
      };
      //set to the state of all answer
      setUserAnswer(prev =>[...prev,answerObject])
    }

  };

  const nextQues = () => {
    // Move to next question

    const nextQuestion = number+1;

    if(nextQuestion === TOTAL_QUESTIONS){
      setGameOver(true);
    }else{
      setNumber(nextQuestion);
    }

  };  



  return (
<>
  <GlobalStyle/>
   <Wrapper>
      <h1>REACT QUIZ</h1>
      {gameOver || userAnswer.length === TOTAL_QUESTIONS ? (
        <button className="start" onClick={startFetchTrivia}>
          Start
        </button>
      ) : null}

      {!gameOver ? <p className="score"> Score : {score}</p> : null}
      {loading && <p>Loading question from API...</p>}
      {!loading && !gameOver && (
        <QuestionCard
          questionNumber={number + 1}
          totalQuestion={TOTAL_QUESTIONS}
          question={question[number].question}
          answer={question[number].answer}
          userAnswer={userAnswer ? userAnswer[number] : undefined}
          callback={checkAns}
        />
      )}

      {!gameOver &&
      !loading &&
      userAnswer.length === number + 1 &&
      number !== TOTAL_QUESTIONS - 1 ? (
        <button className="next" onClick={nextQues}>
          Next Question
        </button>
      ) : null}
    </Wrapper>
    </>
  );
};

export default App;
