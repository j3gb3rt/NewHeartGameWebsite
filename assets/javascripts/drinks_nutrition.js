var GAME_DURATION = 60;
var timer;
var time;
var question;
var score;
var question_data;
var question_history;
var skips;
var game_mode;
var running = false;
$(function(){
	$("#choiceA").click(function(){answer_question(0)});
	$("#choiceB").click(function(){answer_question(1)});
	$("#skip").click(function(){use_skip()});
});
function use_skip(){
	if(!running){
		$("#dialog").text("You will have 60 seconds to answer as many questions as possible about Drink Nutrition. Read each question and click on the picture of what you think is the correct answer.");
		$("#dialog").dialog({
			autoOpen: true,
			close: function(event, ui){
				$(this).text("");
			},
			buttons: {
				Easy: function() {
					$.getJSON('/resources/games/drinks/easy')
					.done(function(data){
						question_data = data;
						game_mode = "easy";
						start_game();
					})
					.fail(function(err){
						alert("Error, check your internet connection and refresh the page.");
					});
					$(this).dialog("close");
				}
			},
			width: 400,
			height:"auto"
		});
	} else if(skips > 0 && running){
		question_history[question_history.length - 1].answered = -1;
		change_question();
		skips--;
		$("#skips").text("Skips Left: " + skips);
	}
}
function start_game(){
	skips = 3;
	time = GAME_DURATION + 1;
	score = 0;
	clearTimeout(timer);
	question_history = new Array();
	
	change_question(question_data);
	$("#skip_label").text("SKIP");
	running = true;
	update_time();	
}

function generate_game_report(data){
	var report = "Your score was " + score + ". The correct answer is in <span style='border: 1px solid green'>green</span>. Your choice is <span style='font-weight:900'>bolded</span>. The numbers represent the amount of nutrient in the drink as related to the question.";
	if(typeof data !== 'undefined'){
		report += " Your high score on " + game_mode + " is " + data.score + ".";
	}
	report += "<table>"
	if(typeof question_history[0]["answered"] === 'undefined' && question_history.length == 1){
		report += "<tr><td>You answered no questions.</td></tr>";
	} else {
		report += "<tr><th width='50%'></th><th width='25%'></th><th width='25%'></th></tr>"
		for(var i = 0; i < question_history.length; i++){
			if(typeof question_history[i]["answered"] !== 'undefined'){
				report += "<tr>";
				report += "<td>" + question_history[i]["question"] + "</td>";
				var styles = style_question_choices_in_report(question_history[i]["answer"], question_history[i]["answered"]);
				var amounts = style_question_choices_amounts_in_report(question_history[i]);
				report += "<td><span style='" + styles["a"] + "'>" 
				+ question_history[i]["a"] 
				+ amounts["a"] + "</span>" 
				+ "</td>";

				report += "<td><span style='" + styles["b"] + "'>" 
				+ question_history[i]["b"] 
				+ amounts["b"] + "</span>"
				+ "</td>";
				report += "</tr>";
			}
		}
	}
	report += "</table>"
	return report;
}
function style_question_choices_amounts_in_report(question){
	var amount_a = "";
	var amount_b = "";
	if(question["question_type"] !== "true"){
		amount_a = ", " + question_data["answers"][question["question_category"]][question_data["answers"]["name"].indexOf(question["a"])];
		amount_b = ", " + question_data["answers"][question["question_category"]][question_data["answers"]["name"].indexOf(question["b"])];
	}
	return {"a" : amount_a, "b" : amount_b};
}
function style_question_choices_in_report(answer, answered){
	var style_a = "";
	var style_b = "";
	if(answer == 0){
		style_a += "border: 1px solid green;";
		style_b += "border: 1px solid red;";
	} else if(answer == 1){
		style_b += "border: 1px solid green;";
		style_a += "border: 1px solid red;";
	}
	if(answered == 0){
		style_a += "font-weight:900;";
		style_b += "font-weight:400;";
	} else if(answered == 1){
		style_b += "font-weight:900;";
		style_a += "font-weight:400;";
	}
	return {"a" : style_a, "b" : style_b};
}

function report_dialog(data){
	$("#dialog").html(generate_game_report(data));
	$("#dialog").dialog({
			autoOpen: true,
			close: function(event, ui){
				$(this).text("");
			},
			buttons: {
				Okay: function() {
					$(this).dialog("close");
				}
			},
			width: 800,
			height: 400
	});
}
function stop_game(){
	running = false;
	clearTimeout(timer);
	$("#skip_label").text("START");
	$.post('/api/games/drinks', {"score" : score, "mode" : game_mode})
	.done(function(data){
		if(data["status"] == "success"){
			report_dialog(data);
		} else {
			report_dialog();					
		}
	})
	.fail(function(){report_dialog();});
}


function answer_question(answer){
	if(running){
		question_history[question_history.length - 1].answered = answer;
		if(question["answer"] == answer){
			score += 10;
		} else {
			score -= 5;
		}
		$("#score").text("Score: " + score);
		change_question(question_data);
	}
}

function change_question(){		
	if(question_history.length < 1){
		question = generate_question(question_data);
	} else {
		while(repeat_question(question, question_history)){			
			question = generate_question(question_data);
		}
	}
	$("#question").text(question["question"]);
	var image_dir = "/assets/images/market/";
	question_history[question_history.length] = question;
	$("#choiceA").attr("src", image_dir + question["a"] + ".png");
	$("#choiceB").attr("src", image_dir + question["b"] + ".png");
	$("#choiceA_label").text(question["a"]);
	$("#choiceB_label").text(question["b"]);
}

function repeat_question(question, history){
	for(var i = 0; i < history.length;i++){
		if(same_question(question, history[history.length - 1]))
			return true;
	}
	return false;
}

function same_question(current, last){
	return current["question"] == last["question"] 
		&& ((current["a"] == last["a"] && current["b"] == last["b"]) 
			|| (current["a"] == last["b"] && current["b"] == last["a"]));
}

function number_of_options(obj){
	var sum = 0;
	for(var _ in obj){
		sum++;
	}
	return sum;
}
function property_by_index(obj, n){
	var counter = 0;
	for(var a in obj){
		if(counter == n) return a;
		counter++;
	}
	return null;
}
function random_property(obj){
	if( Object.prototype.toString.call(obj) === '[object Array]' ) {
		return obj[random_integer(obj.length)];
	} else {
		return property_by_index(obj, random_integer(number_of_options(obj)));
	}
}
function random_index_where_not_in_list(arr, list, a){
	var count = 0;
	var index = -1;
	for(var i = 0; i < arr.length; i++){
		if(!in_list(arr[i], list)){
			count++;
			if(random_integer(count) == count - 1){
				index = i;
			}
		}
	}
	return index;
}

function in_list(obj, arr){
	for(var i = 0; i < arr.length; i++){
		if(obj == arr[i])
			return true;
	}
	return false;
}

function generate_question(data){
	var question_type = random_property(data["questions"]);
	var question_format = random_property(data["questions"][question_type]);
	var question_category = random_property(data["questions"][question_type][question_format]);
	var question = question_format.replace("#", question_category);
	var category_choices = data["answers"][question_category]
	if(question_type == ">"){
		var answer_choice_a = random_index_where_not_in_list(category_choices, [0]);
		var answer_choice_b = random_index_where_not_in_list(category_choices, [0, category_choices[answer_choice_a]]);
		if(category_choices[answer_choice_a] > category_choices[answer_choice_b]){
			var answer = 0;
		} else {
			var answer = 1;
		}
	} else if (question_type == "true"){
		var answer_choice_a = random_index_where_not_in_list(category_choices, [], false);
		var answer_choice_b = random_index_where_not_in_list(category_choices, [category_choices[answer_choice_a]], true);
		if(category_choices[answer_choice_a] === 1){
			var answer = 0;
		} else if(category_choices[answer_choice_b] === 1){
			var answer = 1;
		} else {
			var answer = category_choices[answer_choice_b];
		}
	}
	return {"question" : question, 
			"question_type" : question_type, 
			"answer" : answer, 
			"question_category" : question_category,
			"a" : data["answers"]["name"][answer_choice_a],
			"b" : data["answers"]["name"][answer_choice_b]};
}
function random_integer(n){
	return Math.floor(Math.random() * n);
}
function update_time(){
	time--;
	$("#time").text("Time: " + time);
	if(time > 0){
		timer = setTimeout('update_time()',1000);
	} else {
		stop_game();
	}
}