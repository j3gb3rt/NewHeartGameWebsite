var selection = [0, 0, 0, 0, 0, 0, 0, 0];
$(function(){
	var groups = ["#skin", "#hair", "#shirt", "#pant", "#eye", "#hair_style", "#shoe_style"];
	for(var i = 0; i < groups.length; i++){
		$(groups[i] + " .color_selector").click(switch_selected(groups[i], i));
	}
	$(".avatar_image_button").click(function(){
		$(".avatar_image_button").removeClass('selected');
		$(this).addClass('selected');
		selection[7] = $(this).attr('data-id');
		update_selection();
	});
	$('#save_avatar').click(function(){ 
		var conf = confirm("Are you sure you are finished creating your avatar?");
		if(conf){
			$('#avatar_form').submit();
		}
	});
	$('.arrow_box_left').click(function(){
		var id = '#' + $(this).parent('.selector_box').attr('id');
		for(var i = 0; i < groups.length; i++){
			if(groups[i] == id){
				if(selection[i] < 1)
					return true;
				selection[i]--;
				$(id + ' .color_selector').removeClass('selected');
				$(id + ' .color_selector:nth-child(' + (selection[i] + 1) + ')').addClass('selected');
				update_selection();
				return true;
			}
		}
	});
	$('.arrow_box_right').click(function(){
		var id = '#' + $(this).parent('.selector_box').attr('id');
		for(var i = 0; i < groups.length; i++){
			if(groups[i] == id){
				if(selection[i] > 2)
					return true;
				selection[i]++;
				$(id + ' .color_selector').removeClass('selected');
				$(id + ' .color_selector:nth-child(' + (selection[i] + 1) + ')').addClass('selected');
				update_selection();
				return true;
			}
		}
	});
});
function switch_selected(group, group_num){
	return function(){
		$(group + " .color_selector").removeClass('selected');
		$(this).addClass('selected');
		selection[group_num] = $(this).attr('data-id');
		update_selection();
	};
}
function update_selection(){
	$("#avatar_url").val(selection.join(""));
	$("#avatar_image").attr('src', "/avatars/" + selection.join(""));
}