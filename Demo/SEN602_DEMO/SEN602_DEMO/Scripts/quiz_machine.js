var currentQuizState = [];
function findCorrectAnswerIndex(question)
{
	var result = 0;
	$.each(question.answers, function(index, value) { 
  		if(value.isCorrectAnswer === "true")
  		{
  			result = index;
  			return false;
  		}
	});
	return result;
}

function startLevelOne()
{
	$.each(QuestionPoolLevelOne, function(index, value) { 
  		currentQuizState[currentQuizState.length] = {CorrectAnswerIndex:findCorrectAnswerIndex(value),ChosenAnswerIndex:""};
	});
	$('#pageStart').hide('fade');
	move(0);
	$('#pageQuestions').show('slide');
}

function getCorrectAnswerCount()
{
	var result = 0;
	$.each(currentQuizState, function(index, value) { 
	
		if(value.ChosenAnswerIndex === value.CorrectAnswerIndex)
		{
			result += 1;
		}
	});
	return result;
}

function move(index)
{
	if(index < 11)
	{
		$( "#questionContainer" ).html('');
		$( "#questionNavigationContainer" ).html('');
		$( "#questionTemplate" ).tmpl( QuestionPoolLevelOne[index] ).appendTo( "#questionContainer" );
		$( "#questionNavigationTemplate" ).tmpl( QuestionPoolLevelOne[index] ).appendTo( "#questionNavigationContainer" );
		$("#progressbar").progressbar({
				value: (index+1) * 10
			});	
		$("#progresstext").html("<p class='ScoreLabel'>Score:  "+ getCorrectAnswerCount() +"/10<p>");
	}
	else
	{
		$( "#questionContainer" ).html('');
		$( "#questionNavigationContainer" ).html('');
		$( "#questionTemplateComplete" ).tmpl( QuestionPoolLevelOne,
		{
			
			getChecked : function(questionIndex,answerIndex)
			{
				var result = '';
				if(currentQuizState[questionIndex].ChosenAnswerIndex === answerIndex)
				{
					result = "checked='checked'";
				}
				return  result;
			}
		}).appendTo( "#questionContainer" );
	}
}

function ScoreQuestion(questionIndex,chosenAnswerIndex)
{
	var result = false;
	currentQuizState[questionIndex].ChosenAnswerIndex = chosenAnswerIndex;
	if(QuestionPoolLevelOne !== null)
	{
		if(QuestionPoolLevelOne[questionIndex] !== null && QuestionPoolLevelOne[questionIndex].answers !== null)
		{
			if(QuestionPoolLevelOne[questionIndex].answers[chosenAnswerIndex] !== null)
			{
				var answer = QuestionPoolLevelOne[questionIndex].answers[chosenAnswerIndex];
				
				if(answer.isCorrectAnswer === "true")
				{
					result = (currentQuizState[questionIndex].ChosenAnswerIndex == currentQuizState[questionIndex].CorrectAnswerIndex);
					
				}
			}
		}
	}
	return result;
}
