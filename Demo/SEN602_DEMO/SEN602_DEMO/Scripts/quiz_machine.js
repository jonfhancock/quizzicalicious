function QuestionLevel(score,time,level){
	this.score = score;
	this.time = time;
	this.level = level;
	this.summary = "Quiz Not Yet Taken"
	if(time > 0){
		this.summary = '' + this.score +  ' \\ 10 in ' + getTimestampText(this.time);
	}
}

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
	instance.questionLevelOnePerformance = new QuestionLevel(0,0,1);
	instance.questionLevelTwoPerformance  = new QuestionLevel(0,0,2);
	instance.questionLevelThreePerformance = new QuestionLevel(0,0,3);
	
	
	instance.timeStarted = new Date();
	instance.timeStopped = new Date();
	instance.currentLevel = 0;
	instance.currentQuiz = [];
	instance.currentQuestionIndex = -1;
	instance.nextQuestionIndex = 0;
	
	function init()
	{
		instance.timeStarted = new Date();
		instance.timeStopped = new Date();
		instance.currentLevel = 0;
		instance.currentQuiz = [];
		instance.currentQuestionIndex = -1;
		instance.nextQuestionIndex = 0;
		$( "#elapsedtext" ).html('');
	}
	
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
			instance.timeStopped = new Date();
			var questionLevel = new QuestionLevel(getCorrectAnswerCount(),instance.timeStopped - instance.timeStarted,instance.currentLevel);
			switch(instance.currentLevel)
			{
				case 1:
				instance.questionLevelOnePerformance  = questionLevel;
				break;
				
				case 2:
				instance.questionLevelTwoPerformance  = questionLevel;
				break;
				
				case 3:
				instance.questionLevelThreePerformance  = questionLevel;
				break;
			}
			$( "#progresstext").html("<p class='ScoreLabel'>Score:  "+ getCorrectAnswerCount()  +"/10 " + "<p>");
			$( "#elapsedtext" ).html('Taken in ' + getTimestampText(questionLevel.time));
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
			$( "#menuTemplate" ).tmpl( [{"canMoveNext" : instance.currentLevel < 3}]).appendTo( "#questionContainer" );
		}
	
	};
	
	instance.startQuiz = function(level){
		init();
		instance.currentLevel = level;
		switch(level)
		{
			case 1:
			instance.currentQuiz  = QuizLevelDataAccess.getLevelOneQuestions();
			break;
			
			case 2:
			instance.currentQuiz  = QuizLevelDataAccess.getLevelTwoQuestions();
			break;
			
			case 3:
			instance.currentQuiz  = QuizLevelDataAccess.getLevelThreeQuestions();
			break;
		}
		
		$('#quizLevel').html(level);
		$( "#questionContainer" ).html('');
		$( "#questionNavigationContainer" ).html('');
		$('#pageStart').hide('fade');
		$('#pageQuestions').show('slide');
		this.moveNext();
		instance.timeStarted = new Date();
		
	};
	
	
	instance.prepareSummaryPage = function(){
		$('#pageStart').show('fade');
		$('#pageQuestions').hide('slide');
		$( "#levelContainer" ).html('');
		$( "#summaryTemplate" ).tmpl(instance.questionLevelOnePerformance).appendTo( "#levelContainer" );
		$( "#summaryTemplate" ).tmpl(instance.questionLevelTwoPerformance).appendTo( "#levelContainer" );
		$( "#summaryTemplate" ).tmpl(instance.questionLevelThreePerformance).appendTo( "#levelContainer" );
		
		
	};
	
	instance.startNextLevel = function()
	{
		if(instance.currentLevel < 3){
			instance.startQuiz(instance.currentLevel);
		}
		else{
			instance.prepareSummaryPage();
		}
	
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
	
	instance.getLevelTwoQuestions = function()
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
	
	instance.getLevelThreeQuestions = function()
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

function getTimestampText(time){
	var seconds = (time / 1000);
	var minutes = ((time / 1000)/60);
	var text = 'Cannot determined time';
	if(minutes < 1)
	{
		text = Math.floor(seconds) + ' Seconds';
	}
	else
	{
		text =  Math.floor(minutes) + ' Minutes' + Math.floor(seconds) + ' Seconds';
	}
	return text;
}
