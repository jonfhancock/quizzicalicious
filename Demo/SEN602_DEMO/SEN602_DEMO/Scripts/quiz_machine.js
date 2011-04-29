function Answer(answer, isCorrect, index) {
    this.id = index;
    this.text = answer;
    this.isCorrectAnswer = isCorrect;
}

function Question(question, index) {
    this.question = question;
    this.index = index;
    this.correctAnswer = -1;
    this.chosenAnswer = -1;
    this.answers = [];
}


Question.prototype.addAnswer = function (answer, isCorrect) {
    this.answers[this.answers.length] = new Answer(answer, isCorrect, this.answers.length);
    //Set the correct answer for the is question to save having to search for it later
    if(isCorrect === "true"){
    	this.correctAnswer = this.answers.length -1;
    }
}



var QuizMachine = (function($){

	var instance = {}
	
	instance.currentQuiz = [];
	instance.currentQuestionIndex = -1;
	instance.nextQuestionIndex = 0;
	
	function getCorrectAnswerCount()
	{
		var count = 0;
		$.each(instance.currentQuiz, function(index, value) { 
		
			if(value.correctAnswer == value.chosenAnswer){
			count += 1;
			}
		});
		return count;
	}
	
	instance.setSelectedAnswer = function(questionIndex,answerIndex)
	{
		if(questionIndex > -1 && answerIndex > -1)
		{
			var question = instance.currentQuiz[questionIndex];
			question.chosenAnswer = answerIndex;
		}
	};
	
	
	
	instance.moveNext = function()
	{
		if(instance.currentQuestionIndex < 9)
		{			
			var question = instance.currentQuiz[instance.nextQuestionIndex];
			instance.currentQuestionIndex = instance.nextQuestionIndex;
			instance.nextQuestionIndex = instance.nextQuestionIndex + 1;
			$( "#questionContainer" ).html('');
			$( "#questionNavigationContainer" ).html('');
			$( "#questionTemplate" ).tmpl(question).appendTo( "#questionContainer" );
			$( "#questionNavigationTemplate" ).tmpl(question).appendTo( "#questionNavigationContainer" );
			$( "#questionContainer" ).hide().show('fade','fast');
			$( "#questionNavigationContainer" ).hide().show('fade','fast');
			$("#progressbar").progressbar({value: (instance.nextQuestionIndex) * 10});	
			$("#progresstext").html("<p class='ScoreLabel'>Score:  "+ getCorrectAnswerCount() +"/10<p>");
			
		}
		else if(instance.currentQuestionIndex == 9)
		{
			$( "#questionContainer" ).html('');
			$( "#questionNavigationContainer" ).html('');
			$( "#questionTemplateComplete" ).tmpl(instance.currentQuiz,
			{				
				getChecked : function(questionIndex,answerIndex)
				{
					var result = '';
					if(instance.currentQuiz[questionIndex].chosenAnswer === answerIndex)
					{
						result = "checked='checked'";
					}
					return  result;
				}
			}).appendTo( "#questionContainer" );
		}
	
	};
	
	instance.startQuiz = function(level){
		instance.currentQuiz  = QuizLevelDataAccess.getLevelOneQuestions();
		$('#pageStart').hide('fade');
		$('#pageQuestions').show('slide');
		this.moveNext();
		
	};
	
	return instance;


}(jQuery));


var QuizLevelDataAccess = (function($){
	var instance = {}
	
	instance.getLevelOneQuestions = function()
	{
		var questionPool = [];
		var question = {};
		$.each(QuestionPoolLevelOne, function(index, value) { 
			question = new Question(value.question,questionPool.length);	
			question.addAnswer(value.answers[0].text,value.answers[0].isCorrectAnswer);
			question.addAnswer(value.answers[1].text,value.answers[1].isCorrectAnswer);
			question.addAnswer(value.answers[2].text,value.answers[2].isCorrectAnswer);
			question.addAnswer(value.answers[3].text,value.answers[3].isCorrectAnswer);
			questionPool[questionPool.length] = question;
		});
		return questionPool;	
	}	
	return instance;
}(jQuery));