import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

export default function Test() {
  const [questions, setQuestions] = useState([]);
  const [scores, setScores] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [isMultipleChoice, setIsMultipleChoice] = useState([]);
  const [testName, setTestName] = useState('');
  const [showAlert, setShowAlert] = useState(false); // Состояние для всплывающего сообщения

  const addQuestion = () => {
    setQuestions([...questions, '']);
    setScores([...scores, '']);
    setAnswers([...answers, ['']]);
    setCorrectAnswers([...correctAnswers, []]);
    setIsMultipleChoice([...isMultipleChoice, false]);
  };

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleScoreChange = (index, event) => {
    const newScores = [...scores];
    newScores[index] = event.target.value;
    setScores(newScores);
  };

  const addAnswer = (questionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = [...newAnswers[questionIndex], ''];
    setAnswers(newAnswers);
  };

  const removeAnswer = (questionIndex, answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex].splice(answerIndex, 1);
    setAnswers(newAnswers);

    const newCorrectAnswers = [...correctAnswers];
    newCorrectAnswers[questionIndex] = newCorrectAnswers[questionIndex].filter(
      (index) => index !== answerIndex
    );
    setCorrectAnswers(newCorrectAnswers);
  };

  const handleAnswerChange = (questionIndex, answerIndex, event) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex][answerIndex] = event.target.value;
    setAnswers(newAnswers);
  };

  const handleCorrectAnswerChange = (questionIndex, answerIndex) => {
    const newCorrectAnswers = [...correctAnswers];
    if (isMultipleChoice[questionIndex]) {
      if (newCorrectAnswers[questionIndex].includes(answerIndex)) {
        newCorrectAnswers[questionIndex] = newCorrectAnswers[questionIndex].filter(
          (index) => index !== answerIndex
        );
      } else {
        newCorrectAnswers[questionIndex].push(answerIndex);
      }
    } else {
      newCorrectAnswers[questionIndex] = [answerIndex];
    }
    setCorrectAnswers(newCorrectAnswers);
  };

  const handleAnswerTypeChange = (questionIndex, isMultiple) => {
    const newIsMultipleChoice = [...isMultipleChoice];
    newIsMultipleChoice[questionIndex] = isMultiple;
    setIsMultipleChoice(newIsMultipleChoice);

    const newCorrectAnswers = [...correctAnswers];
    newCorrectAnswers[questionIndex] = [];
    setCorrectAnswers(newCorrectAnswers);
  };

  // Функция для отправки данных
  const send = (event) => {
    event.preventDefault();
    setShowAlert(false); // Скрываем сообщение перед проверкой

    // Проверка на наличие правильного ответа для каждого вопроса
    for (let index = 0; index < questions.length; index++) {
      if (correctAnswers[index].length === 0) {
        setShowAlert(true); // Показываем сообщение, если нет правильного ответа
        return; // Прекратить выполнение, если нет правильного ответа
      }
    }

    const testData = {
      testName,
      questions: questions.map((question, index) => ({
        questionText: question,
        answers: answers[index].map((answer, answerIndex) => ({
          [answer]: correctAnswers[index].includes(answerIndex)
        })),
        score: scores[index],
        isMultipleChoice: isMultipleChoice[index]
      }))
    };

    console.log(testData);
    fetch(`${process.env.REACT_APP_URL}/tests/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json'

      },
      body: JSON.stringify(testData)
    })
    .catch(error => {
      console.error(error);
    });
  }

  const deleteQuestion = (questionIndex) => () => {
    setQuestions(questions.filter((_, index) => index !== questionIndex));
    setScores(scores.filter((_, index) => index !== questionIndex));
    setAnswers(answers.filter((_, index) => index !== questionIndex));
    setCorrectAnswers(correctAnswers.filter((_, index) => index !== questionIndex));
    setIsMultipleChoice(isMultipleChoice.filter((_, index) => index !== questionIndex));
  };
  

  return (
    <main>
      <section className='m-14'>
        <h1 className='text-3xl font-bold mb-6 text-gray-800'>Создание теста</h1>
        <form className='w-full' onSubmit={send}>
          <h2 className='text-xl text-gray-800 '>Название теста:</h2>
          <input 
            type="text" 
            className='border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
            name="name"
            placeholder="Введите название теста"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            required // Название теста обязательно
          />
          {questions.map((question, questionIndex) => (
            <div key={questionIndex} className='bg-gray-50 mt-4 border border-gray-300 p-5 rounded-lg shadow-md'>
              <div className='flex justify-between mb-2'>
              <label className="block text-lg font-semibold text-gray-700">Вопрос {questionIndex + 1}</label>

              <button
                className=" text-lg text-red-500 hover:opacity-70 transition font-semibold"
                onClick={deleteQuestion(questionIndex)}
                type="button"
              >
                Удалить вопрос 
              </button>
              </div>

              <TextareaAutosize
                minRows={2}
                className="border border-gray-300 p-3 w-full rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                value={question}
                onChange={(event) => handleQuestionChange(questionIndex, event)}
                placeholder={`Введите вопрос ${questionIndex + 1}`}
                required // Вопрос обязателен
              />

              <div className="flex space-x-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`answerType${questionIndex}`}
                    checked={!isMultipleChoice[questionIndex]}
                    onChange={() => handleAnswerTypeChange(questionIndex, false)}
                    className="hidden"
                  />
                  <span
                    className={`cursor-pointer px-4 py-2 rounded-lg ${!isMultipleChoice[questionIndex] ? 'bg-green-200' : 'bg-gray-200'} transition duration-200`}
                  >
                    Возможен только один вариант ответа
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`answerType${questionIndex}`}
                    checked={isMultipleChoice[questionIndex]}
                    onChange={() => handleAnswerTypeChange(questionIndex, true)}
                    className="hidden"
                  />
                  <span
                    className={`cursor-pointer px-4 py-2 rounded-lg ${isMultipleChoice[questionIndex] ? 'bg-green-200' : 'bg-gray-200'} transition duration-200`}
                  >
                    Возможны несколько вариантов ответа
                  </span>
                </label>
              </div>

              <div className="space-y-4">
                {answers[questionIndex].map((answer, answerIndex) => (
                  <div key={answerIndex} className='flex items-center space-x-2'>
                    <label className="text-gray-600 text-nowrap">Ответ {answerIndex + 1}:</label>
                    <TextareaAutosize 
                      minRows={1}
                      type="text"
                      className="border border-gray-300 p-2 w-full shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                      value={answer}
                      onChange={(event) => handleAnswerChange(questionIndex, answerIndex, event)}
                      placeholder={`Введите ответ ${answerIndex + 1}`}
                      required // Ответ обязателен
                    />
                    {isMultipleChoice[questionIndex] ? (
                      <input
                        type="checkbox"
                        checked={correctAnswers[questionIndex].includes(answerIndex)}
                        onChange={() => handleCorrectAnswerChange(questionIndex, answerIndex)}
                        id={`correctAnswer${questionIndex}-${answerIndex}`}
                        className="hidden"
                      />
                    ) : (
                      <input
                        type="radio"
                        name={`correctAnswer${questionIndex}`}
                        checked={correctAnswers[questionIndex][0] === answerIndex}
                        onChange={() => handleCorrectAnswerChange(questionIndex, answerIndex)}
                        id={`correctAnswer${questionIndex}-${answerIndex}`}
                        className="hidden"
                      />
                    )}
                    <label
                      htmlFor={`correctAnswer${questionIndex}-${answerIndex}`}
                      className={`cursor-pointer px-4 py-2 rounded-lg ${correctAnswers[questionIndex].includes(answerIndex) ? 'bg-green-200' : 'bg-gray-200'} transition duration-200 text-center py-0 px-0 text-nowrap`}
                    >
                      Верный ответ
                    </label>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 transition"
                      onClick={() => removeAnswer(questionIndex, answerIndex)}
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>

              <button
                className="mt-4 text-blue-600 font-semibold hover:text-blue-800 transition"
                onClick={() => addAnswer(questionIndex)}
                type="button"
              >
                + Добавить ответ
              </button>

              <div className="mt-6">
                <label className="block text-gray-600">Баллы за правильный ответ:</label>
                <input
                  type="number"
                  className="border border-gray-300 p-2 mt-2 w-24 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={scores[questionIndex]}
                  onChange={(event) => handleScoreChange(questionIndex, event)}
                  placeholder="5"
                  required // Поле с баллами обязательно
                />
              </div>
            </div>
          ))}

          <button
            className="w-full border-2 rounded-lg text-xl text-blue-600 border-blue-600 mt-6 py-2 hover:bg-blue-600 hover:text-white transition font-semibold"
            onClick={addQuestion}
            type="button"
          >
            + Добавить вопрос
          </button>

          {/* Кнопка отправки формы */}
          <button
            type="submit"
            className="w-full border-2 rounded-lg text-xl text-white bg-blue-600 mt-6 py-2 hover:bg-blue-700 transition font-semibold"
          >
            Создать тест
          </button>
        </form>

        {/* Всплывающее сообщение */}
        {showAlert && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold text-red-600">Ошибка</h2>
              <p className="mt-2">Пожалуйста, выберите правильный ответ для каждого вопроса.</p>
              <button
                onClick={() => setShowAlert(false)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
