jQuery.holdReady( true );
jQuery(window).on('load', function(){
(function($) {
	$.fn.fbuilder = function(options){
		var opt = $.extend({},
				{
	   				typeList:new Array({id:"ftext",name:"Single Line Text"},{id:"fnumber",name:"Number"},{id:"femail",name:"Email"},{id:"fdate",name:"Date"},{id:"ftextarea",name:"Text Area"},{id:"fcheck",name:"Checkboxes"},{id:"fradio",name:"Radio Buttons"},{id:"fdropdown",name:"Dropdown"},{id:"ffile",name:"Upload file"},{id:"fpassword",name:"Password"},{id:"fPhone",name:"Phone field"},{id:"fCommentArea",name:"Instruct. Text"},{id:"fSectionBreak",name:"Section break"},{id:"fPageBreak",name:"Page break"}),
					pub:false,
					identifier:"",
					title:""
				},options, true);
		if (opt.pub)
		{
			opt.messages = $.extend({
						previous: "Previous",
						next: "Next",
						page: "Page",
						of: "of",
						required: "This field is required.",
						email: "Please enter a valid email address.",
						datemmddyyyy: "Please enter a valid date with this format(mm/dd/yyyy)",
						dateddmmyyyy: "Please enter a valid date with this format(dd/mm/yyyy)",
						number: "Please enter a valid number.",
						digits: "Please enter only digits.",
						maxlength: $.validator.format("Please enter no more than {0} characters"),
                        minlength: $.validator.format("Please enter at least {0} characters."),
                        equalTo: "Please enter the same value again.",
						max: $.validator.format("Please enter a value less than or equal to {0}."),
						min: $.validator.format("Please enter a value greater than or equal to {0}.")
				},opt.messages);
			opt.messages.max = $.validator.format(opt.messages.max);
			opt.messages.min = $.validator.format(opt.messages.min);
			$.extend($.validator.messages, opt.messages);
		}
		getNameByIdFromType = function(id){
			for (var i=0;i<opt.typeList.length;i++)
				if (opt.typeList[i].id == id)
					return opt.typeList[i].name;
			return "";
		}
		if (!opt.pub)
		{
		  for (var i=0;i<opt.typeList.length;i++)			
			  $("#tabs-1").append('<div class="button width40 '+(((i>5) || (i%2==1))?"n":"itemForm")+'" id="'+opt.typeList[i].id+'">'+opt.typeList[i].name+'</div>');
		  $("#tabs-1").append('<div class="clearer"></div>');
		}  
		if (!opt.pub) $( ".button").button();
		var items = new Array();
		var itemSelected = -2;
		editItem = function(id) {
			if (!opt.pub) $('#tabs').tabs("option", "active", 1);
			try { $('#tabs-2').html(items[id].showAllSettings()); } catch (e) {}
			itemSelected = id;
			$(".helpfbuilder").click(function(){
                alert($(this).attr("text"));
			});
            $("#sMinDate").change(function(){
                items[id].minDate = $(this).val();
                reloadItems();
            });
            $("#sMaxDate").change(function(){
                items[id].maxDate = $(this).val();
                reloadItems();
            });
            $("#sDefaultDate").change(function(){
                items[id].defaultDate = $(this).val();
                reloadItems();
            });
			$("#sTitle").keyup(function(){
				var str = $(this).val();
				items[id].title = str.replace(/\n/g,"<br />");
				reloadItems();
			});
			$("#sName").keyup(function(){
				items[id].name = $(this).val();
				reloadItems();
			});
			$("#sShortlabel").keyup(function(){
				items[id].shortlabel = $(this).val();
				reloadItems();
			});
			$("#sPredefined").keyup(function(){
				items[id].predefined = $(this).val();
				reloadItems();
			});
			$("#sPredefinedClick").click(function(){
				items[id].predefinedClick = $(this).is(':checked');
				reloadItems();
			});
            $("#sEq").keyup(function(){
                items[id].eq = $(this).val();
                reloadItems();
            });
                            $("#sSuffix").keyup(function(){
                items[id].suffix = $(this).val();
                reloadItems();
            });
            $("#sPrefix").keyup(function(){
                items[id].prefix = $(this).val();
                reloadItems();
            });
            $("#sDecimalSymbol").keyup(function(){
                items[id].decimalsymbol = $(this).val();
                reloadItems();
            });
            $("#sGroupingSymbol").keyup(function(){
                items[id].groupingsymbol = $(this).val();
                reloadItems();
            });
			$("#sDropdownRange").keyup(function(){
				items[id].dropdownRange = $(this).val();
				reloadItems();
			});
			$("#sRequired").click(function(){
				items[id].required = $(this).is(':checked');
				reloadItems();
			});
            $("#sReadOnly").click(function(){
                items[id].readonly = $(this).is(':checked');
                reloadItems();
            });
			$("#sShowDropdown").click(function(){
				items[id].showDropdown = $(this).is(':checked');
				if ($(this).is(':checked'))
				    $("#divdropdownRange").css("display","");
				else
				    $("#divdropdownRange").css("display","none");
				reloadItems();
			});
			$("#sSize").change(function(){
				items[id].size = $(this).val();
				reloadItems();
			});
			$("#sFormat").change(function(){
				items[id].dformat = $(this).val();
				reloadItems();
			});
			$("#sLayout").change(function(){
				items[id].layout = $(this).val();
				reloadItems();
			});
			$("#sMin").change(function(){
				items[id].min = $(this).val();
				reloadItems();
			});
			$("#sMax").change(function(){
				items[id].max = $(this).val();
				reloadItems();
			});
			$("#sMinlength").change(function(){
				items[id].minlength = $(this).val();
				reloadItems();
			});
			$("#sMaxlength").change(function(){
				items[id].maxlength = $(this).val();
				reloadItems();
			});
			$("#sEqualTo").change(function(){
				items[id].equalTo = $(this).val();
				reloadItems();
			});
			$(".showHideDependencies").click(function(){
			    if (items[id].showDep)
			    {
			        $(this).parent().removeClass("show");
			        $(this).parent().addClass("hide");
			        $(this).html("Show Dependencies");
			        items[id].showDep = false;
			    }
			    else
			    {
			        $(this).parent().addClass("show");
			        $(this).parent().removeClass("hide");
			        $(this).html("Hide Dependencies");
			        items[id].showDep = true;
			    }
			    return false;
			});
			$(".choice_remove").click(function(){
				if (items[id].choices.length==1)
				{
					items[id].choices[0]="";
					items[id].choicesVal[0]="";
					items[id].choicesDep[0]=new Array();
				}
				else
				{
					items[id].choices.splice($(this).attr("i"),1);
					items[id].choicesVal.splice($(this).attr("i"),1);
					items[id].choicesDep.splice($(this).attr("i"),1);
				}
				if (items[id].ftype=="fcheck")
				{
					if (items[id].choiceSelected.length==1)
						items[id].choiceSelected[0]="";
					else
						items[id].choiceSelected.splice($(this).attr("i"),1);
				}
				editItem(id);
				reloadItems();
			});
			$(".choice_add").click(function(){
				items[id].choices.splice($(this).attr("i")*1+1,0,"");
				items[id].choicesVal.splice($(this).attr("i")*1+1,0,"");
				items[id].choicesDep.splice($(this).attr("i")*1+1,0,new Array());
				if (items[id].ftype=="fcheck")
					items[id].choiceSelected.splice($(this).attr("i")*1+1,0,false);
				editItem(id);
				reloadItems();
			});
			$(".choice_text").keyup(function(){
			    if (items[id].choices[$(this).attr("i")] == items[id].choicesVal[$(this).attr("i")])
			    {
				    $("#"+$(this).attr("id")+"V"+$(this).attr("i")).val($(this).val());
				    items[id].choicesVal[$(this).attr("i")]= $(this).val();
				}
				items[id].choices[$(this).attr("i")]= $(this).val();
				reloadItems();
			});
			$(".choice_value").keyup(function(){
			    items[id].choicesVal[$(this).attr("i")]= $(this).val();
			    reloadItems();
			});
			$(".choice_radio").click(function(){
				if ($(this).is(':checked'))
					items[id].choiceSelected = items[id].choicesVal[$(this).attr("i")];
				reloadItems();
			});
			$(".choice_select").click(function(){
				if ($(this).is(':checked'))
					items[id].choiceSelected = items[id].choicesVal[$(this).attr("i")];
				reloadItems();
			});
			$(".choice_check").click(function(){
				if ($(this).is(':checked'))
					items[id].choiceSelected[$(this).attr("i")] = true;
				else
					items[id].choiceSelected[$(this).attr("i")] = false;
				reloadItems();
			});
			$("#sUserhelp").keyup(function(){
				items[id].userhelp = $(this).val();
				reloadItems();
			});
			$("#sUserhelpTooltip").click(function(){
				items[id].userhelpTooltip = $(this).is(':checked');
				reloadItems();
			});
			$("#sCsslayout").keyup(function(){
				items[id].csslayout = $(this).val();
				reloadItems();
			});
			$('.equalTo').each(function(){
			    var str = '<option value="" '+(("" == $(this).attr("dvalue"))?"selected":"")+'></option>';
			    for (var i=0;i<items.length;i++)
			    	if ((items[i].ftype=="ftext" || items[i].ftype=="femail" || items[i].ftype=="fpassword") && (items[i].name != $(this).attr("dname")))
			    		str += '<option value="'+items[i].name+'" '+((items[i].name == $(this).attr("dvalue"))?"selected":"")+'>'+(items[i].title)+'</option>';
			    $(this).html(str);
			});
			$('.dependencies').each(function(){
			    var str = '<option value="" '+(("" == $(this).attr("dvalue"))?"selected":"")+'></option>';
			    for (var i=0;i<items.length;i++)
			    	if (items[i].name != $(this).attr("dname"))
			    		str += '<option value="'+items[i].name+'" '+((items[i].name == $(this).attr("dvalue"))?"selected":"")+'>'+(items[i].title)+'</option>';
			    $(this).html(str);
			});
			$('.dependencies').change(function(){
			    items[id].choicesDep[$(this).attr("i")][$(this).attr("j")] = $(this).val();
				reloadItems();
			});
			$(".choice_removeDep").click(function(){
				if (items[id].choices.length==1)
					items[id].choicesDep[$(this).attr("i")][0]="";
				else
					items[id].choicesDep[$(this).attr("i")].splice($(this).attr("j"),1);
				editItem(id);
				reloadItems();
			});
			$(".choice_addDep").click(function(){
				items[id].choicesDep[$(this).attr("i")].splice($(this).attr("j")*1+1,0,"");
				editItem(id);
				reloadItems();
			});
		};
		editForm = function() {
			$('#tabs-3').html(theForm.showAllSettings());
			itemSelected = -1;
			$("#fTitle").keyup(function(){
				theForm.title = $(this).val();
				reloadItems();
			});
			$("#fDescription").keyup(function(){
				theForm.description = $(this).val();
				reloadItems();
			});
			$("#fLayout").change(function(){
				theForm.formlayout = $(this).val();
				reloadItems();
			});

		};
		removeItem = function(index) {
			items.splice(index,1);
			for (var i=0;i<items.length;i++)
				items[i].index = i;
			$('#tabs').tabs("option", "active", 0);
			reloadItems();
		}
		reloadItems = function() {
			for (var i=0;i<showSettings.formlayoutList.length;i++)
				$("#fieldlist"+opt.identifier).removeClass(showSettings.formlayoutList[i].id);
			$("#fieldlist"+opt.identifier).addClass(theForm.formlayout);
			$("#formheader"+opt.identifier).html(theForm.display());
			$("#fieldlist"+opt.identifier).html("");
			if (parseInt(itemSelected)==-1)
				$(".fform").addClass("ui-selected");
			else
				$(".fform").removeClass("ui-selected");
			for (var i=0;i<items.length;i++)
			{
				items[i].index = i;
				$("#fieldlist"+opt.identifier).append(items[i].display());
				if (i==itemSelected)
					$("#field"+opt.identifier+"-"+i).addClass("ui-selected");
				else
					$("#field"+opt.identifier+"-"+i).removeClass("ui-selected");
				$(".fields").mouseover(function() {
					$(this).addClass("ui-over");
				}).mouseout(function(){
					$(this).removeClass("ui-over")
				}).click(function(){
					editItem($(this).attr("id").replace("field"+opt.identifier+"-",""));
					$(this).siblings().removeClass("ui-selected");
					$(this).addClass("ui-selected");
				});
				$(".field").focus(function(){
					$(this).blur();
				});
				$("#field"+opt.identifier+"-"+i+" .remove").click(function(){
					removeItem($(this).parent().attr("id").replace("field"+opt.identifier+"-",""));
				});
			}
			if ($("#fieldlist"+opt.identifier).html() == "")
				$("#saveForm").css("display","none");
			else
				$("#saveForm").css("display","none"); // changed "inline" to "none"
			$(".fform").mouseover(function() {
				$(this).addClass("ui-over");
			}).mouseout(function(){
				$(this).removeClass("ui-over")
			}).click(function(){
				$('#tabs').tabs("option", "active", 2);
				editForm();
				$(this).siblings().removeClass("ui-selected");
				$(this).addClass("ui-selected");
			});
			ffunct.saveData("form_structure");
			//email list
			var str = "";
			for (var i=0;i<items.length;i++)
				if (items[i].ftype=="femail")
					str += '<option value="'+items[i].name+'" '+((items[i].name == $('#cu_user_email_field').attr("def"))?"selected":"")+'>'+(items[i].title)+'</option>';
			$('#cu_user_email_field').html(str);
            //field list for paypal request
            if (($('#request_cost').length > 0) && ($('#request_cost').is('select')))
            {
                var str = "";
                for (var i=0;i<items.length;i++)
                    str += '<option value="'+items[i].name+'" '+((items[i].name == $('#request_cost').attr("def"))?"selected":"")+'>'+items[i].name+'('+(items[i].title)+')</option>';
                $('#request_cost').html(str);
            }
            //request amount list
            if ($('#paypal_price_field').length > 0)
            {
			    var str = '<option value="" '+(('' == $('#paypal_price_field').attr("def"))?"selected":"")+'> ---- No ---- </option>';
			    for (var i=0;i<items.length;i++)
			    		str += '<option value="'+items[i].name+'" '+((items[i].name == $('#paypal_price_field').attr("def"))?"selected":"")+'>'+(items[i].title)+'</option>';
			    $('#paypal_price_field').html(str);
		    }
		}
		function htmlEncode(value){
		  value = $('<div/>').text(value).html()
          value = value.replace(/"/g, "&quot;");;
          return value;
        }
        function showHideDep(){
            function inArray(needle, haystack) {
                for(var i = 0; i < haystack.length; i++) {
                    if(haystack[i] == needle) return true;
                }
                return false;
            }
            function removeFromArray(needle, haystack) {
                for(var i = 0; i < haystack.length; i++) {
                    if(haystack[i] == needle)
                    {
                        haystack.splice(i,1);
                        i--;
                    }
                }
                return haystack;
            }
            var used = new Array();
            var hideArray = new Array();
            $(".depItem").each(function() {
                var item = $(this);
                try {
                    if ((item.parents("#fieldlist"+opt.identifier).length==1) && item.attr("dep") && item.attr("dep")!="" )
                    {
                        var d = item.attr("dep").split(",");
                        for (i=0;i<d.length;i++)
		                {
		                    if (d[i]!="") d[i] = d[i]+opt.identifier;
		                    if (d[i]!="" && !inArray(d[i],used) )//&& !inArray(d[i],hideArray)
		                    {
		                        try {
		                            if ((item.is(':checked') || item.is(':selected') ) && (!inArray(  ((item.hasClass("field"))?item.attr("id"):item.parents(".field").attr("id"))   ,hideArray))   )
		                            {
		                                $("#"+d[i]).parents(".fields").css("display","");
		                                $("#"+d[i]).parents(".fields").find(".field").each(function(){if (!$(this).hasClass("ignorepb"))$(this).removeClass("ignore");});
		                                used[used.length] = d[i];
		                                removeFromArray(d[i],hideArray);
		                            }
		                            else
		                            {
		                                $("#"+d[i]).parents(".fields").css("display","none");
		                                $("#"+d[i]).parents(".fields").find(".field").each(function(){$(this).addClass("ignore");});
		                                hideArray[hideArray.length] = d[i];
		                            }
		                        }catch(e){}
		                    }
		                }
		            }
		        }catch(e){}
		    });
        }
		reloadItemsPublic = function() {
			for (var i=0;i<showSettings.formlayoutList.length;i++)
				$("#fieldlist"+opt.identifier).removeClass(showSettings.formlayoutList[i].id);
			$("#fieldlist"+opt.identifier).html("").addClass(theForm.formlayout);
			$("#formheader"+opt.identifier).html(theForm.show());
			var page = 0;
			$("#fieldlist"+opt.identifier).append('<div class="pb'+page+' pbreak" page="'+page+'"></div>');
			var itemsDates = new Array();
			for (var i=0;i<items.length;i++)
			{
				items[i].index = i;
				if (items[i].ftype=="fPageBreak")
				{
				    page++;
				    $("#fieldlist"+opt.identifier).append('<div class="pb'+page+' pbreak" page="'+page+'"></div>');
				}
				else
				{
				    $("#fieldlist"+opt.identifier+" .pb"+page).append(items[i].show());
				    if (items[i].predefinedClick)
				    {
				        var cl = $("#fieldlist"+opt.identifier+" .pb"+page).find("#"+items[i].name).attr("class")+" predefinedClick";
				        $("#fieldlist"+opt.identifier+" .pb"+page).find("#"+items[i].name).attr("class",cl);
				        $("#fieldlist"+opt.identifier+" .pb"+page).find("#"+items[i].name).attr("predefined",items[i].predefined);
				    }
				    if (items[i].userhelpTooltip)
				    {
				        var uh = $("#fieldlist"+opt.identifier+" .pb"+page).find("#"+items[i].name).parents(".fields");
				        uh.find(".uh").css("display","none");
				        if (uh.find(".uh").text()!="")
				            uh.attr("uh",uh.find(".uh").text());
				    }
				}
				$(".fields").mouseover(function() {
					$(this).addClass("ui-over");
				}).mouseout(function(){
					$(this).removeClass("ui-over")
				}).click(function(){
					editItem($(this).attr("id").replace("field"+opt.identifier+"-",""));
					$(this).siblings().removeClass("ui-selected");
					$(this).addClass("ui-selected");
				});

				if (items[i].ftype=="fdate")
				    itemsDates[itemsDates.length] = items[i];
			}
			if (page>0)
			{
			    $("#fieldlist"+opt.identifier+" .pb"+page).addClass("pbEnd");
			    $("#fieldlist"+opt.identifier+" .pbreak").find(".field").addClass("ignore").addClass("ignorepb");
			    $("#fieldlist"+opt.identifier+" .pb0").find(".field").removeClass("ignore").removeClass("ignorepb");
			    $("#fieldlist"+opt.identifier+" .pbreak").each(function(index) {
			        var code = $(this).html();
			        var bSubmit = '';
			        if (index == page)
			        {
			            if ($("#cpcaptchalayer"+opt.identifier).html())
			            {
			                code += '<div>'+$("#cpcaptchalayer"+opt.identifier).html()+'</div>';
			                $("#cpcaptchalayer"+opt.identifier).html("");
			            }
			            if ($("#cp_subbtn"+opt.identifier).html())
			                bSubmit = '<div class="pbSubmit">'+$("#cp_subbtn"+opt.identifier).html()+'</div>';
			        }
			        $(this).html('<fieldset><legend>'+opt.messages.page+' '+(index+1)+' '+opt.messages.of+' '+(page+1)+'</legend>'+code+'<div class="pbPrevious">'+opt.messages.previous+'</div><div class="pbNext">'+opt.messages.next+'</div>'+bSubmit+'<div class="clearer"></div></fieldset>');
			    });
			    $(".pbPrevious,.pbNext").bind("click", function() {
			        if ($(this).parents("form").valid())
			        {
			            var page = parseInt($(this).parents(".pbreak").attr("page"));
			            (($(this).hasClass("pbPrevious"))?page--:page++);
			            $("#fieldlist"+opt.identifier+" .pbreak").css("display","none");
			            $("#fieldlist"+opt.identifier+" .pbreak").find(".field").addClass("ignore").addClass("ignorepb");

			            $("#fieldlist"+opt.identifier+" .pb"+page).css("display","block");
			            $("#fieldlist"+opt.identifier+" .pb"+page).find(".field").removeClass("ignore").removeClass("ignorepb");
			            showHideDep();
			        }
			        return false;
			    });
			}
			else
			{
			    if ($("#cpcaptchalayer"+opt.identifier).html())
			    {
			        $("#fieldlist"+opt.identifier+" .pb"+page).append('<div>'+$("#cpcaptchalayer"+opt.identifier).html()+'</div>');
			        $("#cpcaptchalayer"+opt.identifier).html("");
			    }
			    if ($("#cp_subbtn"+opt.identifier).html())
			        $("#fieldlist"+opt.identifier+" .pb"+page).append('<div class="pbSubmit">'+$("#cp_subbtn"+opt.identifier).html()+'</div>');
			}
			$(".pbSubmit").bind("click", function() {
			    $(this).parents("#fieldlist"+opt.identifier).parents("form").submit();
			});
			$("#fieldlist"+opt.identifier+" .predefinedClick").bind("click", function() {
			    if ($(this).attr("predefined") == $(this).val())
			        $(this).val("");
			});
			$("#fieldlist"+opt.identifier+" .predefinedClick").blur("click", function() {
			    if ($(this).val()=="")
			        $(this).val($(this).attr("predefined"));
			});
			if (i>0)
			{
			    for (var k=0;k<itemsDates.length;k++)
				{
				    if (itemsDates[k].showDropdown)
					    $( "#"+itemsDates[k].name ).datepicker({changeMonth: true,changeYear: true,yearRange: itemsDates[k].dropdownRange,dateFormat: itemsDates[k].dformat.replace(/yyyy/g,"yy")});
					else
					    $( "#"+itemsDates[k].name ).datepicker({ dateFormat: itemsDates[k].dformat.replace(/yyyy/g,"yy")});
                    $( "#"+itemsDates[k].name ).datepicker( "option", "minDate", itemsDates[k].minDate );
                    $( "#"+itemsDates[k].name ).datepicker( "option", "maxDate", itemsDates[k].maxDate );
                    $( "#"+itemsDates[k].name ).datepicker( "option", "defaultDate", itemsDates[k].defaultDate );
				}
                //$(".depItem").each(function() {
			        showHideDep();
			    //});
                $.validator.addMethod("dateddmmyyyy", function(value, element) {
				  return this.optional(element) || /^(?:[1-9]|0[1-9]|1[0-9]|2[0-9]|3[0-1])[\/\-](?:[1-9]|0[1-9]|1[0-2])[\/\-]\d{4}$/.test(value);
				});

				$.validator.addMethod("datemmddyyyy", function(value, element) {
				  return this.optional(element) || /^(?:[1-9]|0[1-9]|1[0-2])[\/\-](?:[1-9]|0[1-9]|1[0-9]|2[0-9]|3[0-1])[\/\-]\d{4}$/.test(value);
				});//{required: true, range: [11, 22]}



				$(".depItemSel,.depItem").bind("change", function() {
			        showHideDep();
			    });
			    try {
			    $( "#fbuilder"+opt.identifier ).tooltip({show: false,hide:false,tooltipClass:"uh-tooltip",position: { my: "left top", at: "left bottom", collision: "none"  },items: "[uh]",content: function (){return $(this).attr("uh");} });
			    } catch(e){}
			    
			}
		}
		var showSettings= {
			sizeList:new Array({id:"small",name:"Small"},{id:"medium",name:"Medium"},{id:"large",name:"Large"}),
			layoutList:new Array({id:"one_column",name:"One Column"},{id:"two_column",name:"Two Column"},{id:"three_column",name:"Three Column"},{id:"side_by_side",name:"Side by Side"}),
			formlayoutList:new Array({id:"top_aligned",name:"Top Aligned"},{id:"left_aligned",name:"Left Aligned"},{id:"right_aligned",name:"Right Aligned"}),
			showTitle: function(f,v) {
				var str = '<label>Field Label</label><textarea class="large" name="sTitle" id="sTitle">'+v+'</textarea>';
			    if (v=="Page Break") str = "";
				return '<label>Field Type: '+getNameByIdFromType(f)+'</label><br /><br />'+str;
			},
			showName: function(v1,v2) {
				return '<div><label>Short label (optional) [<a class="helpfbuilder" text="The short label is used at title for the column when exporting the form data to CSV files.\n\nIf the short label is empty then, the field label will be used for the CSV file.">help?</a>] :</label><input class="large" name="sShortlabel" id="sShortlabel" value="'+v2+'" /></div>'+
				       '<div><label>Field tag for the message (optional):</label><input readonly="readonly" class="large" name="sNametag" id="sNametag" value="&lt;%'+v1+'%&gt;" />'+
				       '<input style="display:none" readonly="readonly" class="large" name="sName" id="sName" value="'+v1+'" /></div>';
			},
			showPredefined: function(v,c) {
				return '<div><label>Predefined Value</label><textarea class="large" name="sPredefined" id="sPredefined">'+v+'</textarea><br /><input type="checkbox" name="sPredefinedClick" id="sPredefinedClick" '+((c)?"checked":"")+' value="1" > Hide predefined value on click.</div>';
			},
			showEqualTo: function(v,name) {
			    return '<div><label>Equal to [<a class="helpfbuilder" text="Use this field to create password confirmation field or email confirmation fields.\n\nSpecify this setting ONLY into the confirmation field, not in the original field.">help?</a>]</label><br /><select class="equalTo" name="sEqualTo" id="sEqualTo" dvalue="'+v+'" dname="'+name+'"></select></div>';
			},
			showRequired: function(v) {
				return '<div><input type="checkbox" name="sRequired" id="sRequired" '+((v)?"checked":"")+'><label>Required</label></div>';
			},
			showSize: function(v) {
				var str = "";
				for (var i=0;i<this.sizeList.length;i++)
					str += '<option value="'+this.sizeList[i].id+'" '+((this.sizeList[i].id==v)?"selected":"")+'>'+this.sizeList[i].name+'</option>';
				return '<label>Field Size</label><br /><select name="sSize" id="sSize">'+str+'</select>';
			},
			showLayout: function(v) {
				var str = "";
				for (var i=0;i<this.layoutList.length;i++)
					str += '<option value="'+this.layoutList[i].id+'" '+((this.layoutList[i].id==v)?"selected":"")+'>'+this.layoutList[i].name+'</option>';
				return '<label>Field Layout</label><br /><select name="sLayout" id="sLayout">'+str+'</select>';
			},
			showUserhelp: function(v,c) {
				return '<div><label>Instructions for User</label><textarea class="large" name="sUserhelp" id="sUserhelp">'+v+'</textarea><br /><input type="checkbox" name="sUserhelpTooltip" id="sUserhelpTooltip" '+((c)?"checked":"")+' value="1" > Show as floating tooltip.</div>';
			},
			showCsslayout: function(v) {
				return '<label>Add Css Layout Keywords</label><input class="large" name="sCsslayout" id="sCsslayout" value="'+v+'" />';
			}
		};
		var fform=function(){};
		$.extend(fform.prototype,{
				title:"Untitled Form",
				description:"This is my form. Please fill it out. It's awesome!",
				formlayout:"top_aligned",
				display:function(){
					return '<div class="fform" id="field"><div class="arrow ui-icon ui-icon-play "></div><h1>'+this.title+'</h1><span>'+this.description+'</span></div>';
				},
				show:function(){
					return '<div class="fform" id="field"><h1>'+this.title+'</h1><span>'+this.description+'</span></div>';
				},
				showAllSettings:function(){
					var str = "";
					for (var i=0;i<showSettings.formlayoutList.length;i++)
						str += '<option value="'+showSettings.formlayoutList[i].id+'" '+((showSettings.formlayoutList[i].id==this.formlayout)?"selected":"")+'>'+showSettings.formlayoutList[i].name+'</option>';
					return '<div><label>Form Name</label><input class="large" name="fTitle" id="fTitle" value="'+htmlEncode(this.title)+'" /></div><div><label>Description</label><textarea class="large" name="fDescription" id="fDescription">'+this.description+'</textarea></div><div><label>Label Placement</label><br /><select name="fLayout" id="fLayout">'+str+'</select></div>';
				}

		});
		var theForm = new fform();
		var ffields=function(){};
		$.extend(ffields.prototype, {
				name:"",
				shortlabel:"",
				index:-1,
				ftype:"",
				userhelp:"",
				userhelpTooltip:false,
				csslayout:"",
				init:function(){
				},
				showSpecialData:function(){
					if(typeof this.showSpecialDataInstance != 'undefined')
						return this.showSpecialDataInstance();
					else
						return "";
				},
				showEqualTo:function(){
					if(typeof this.equalTo != 'undefined')
						return showSettings.showEqualTo(this.equalTo,this.name);
					else
						return "";
				},
				showPredefined:function(){
					if(typeof this.predefined != 'undefined')
						return showSettings.showPredefined(this.predefined,this.predefinedClick);
					else
						return "";
				},
				showRequired:function(){
				    if(typeof this.required != 'undefined')
						return showSettings.showRequired(this.required);
					else
						return "";
				},
				showSize:function(){
					if(typeof this.size != 'undefined')
						return showSettings.showSize(this.size);
					else
						return "";
				},
				showLayout:function(){
					if(typeof this.layout != 'undefined')
						return showSettings.showLayout(this.layout);
					else
						return "";
				},
				showRange:function(){
					if(typeof this.min != 'undefined')
						return this.showRangeIntance();
					else
						return "";
				},
				showFormat:function(){
					if(typeof this.dformat != 'undefined')
						try {
							return this.showFormatIntance();
						} catch(e) {return "";}
					else
						return "";
				},
				showChoice:function(){
					if(typeof this.choices != 'undefined')
						return this.showChoiceIntance();
					else
						return "";
				},
				showUserhelp:function(){
				    return ((this.ftype!="fPageBreak")?showSettings.showUserhelp(this.userhelp,this.userhelpTooltip):"");
				},
				showCsslayout:function(){
				    return ((this.ftype!="fPageBreak")?showSettings.showCsslayout(this.csslayout):"");
				},
				showAllSettings:function(){
						return this.showTitle()+this.showName()+this.showSize()+this.showLayout()+this.showFormat()+this.showRange()+this.showRequired()+this.showSpecialData()+this.showEqualTo()+this.showPredefined()+this.showChoice()+this.showUserhelp()+this.showCsslayout();
				},
				showTitle:function(){
				    return showSettings.showTitle(this.ftype,this.title);
				},
				showName:function(){
				    return ((this.ftype!="fPageBreak")?showSettings.showName(this.name,this.shortlabel):"");
				},
				display:function(){
					return 'Not available yet';
				},
				show:function(){
					return 'Not available yet';
				},
				toJSON:function(){
					str = '';
					$.each( this, function(i, n){
						if (typeof n!="function")
						{
							if (str!="")
								str += ",";
							str += '"'+i+'":'+n ;
						}
					});
					return str;
				}
		});
		var ftext=function(){};
		$.extend(ftext.prototype,ffields.prototype,{
				title:"Untitled",
				ftype:"ftext",
				predefined:"",
				predefinedClick:false,
				required:false,
				size:"medium",
				minlength:"",
				maxlength:"",
				equalTo:"",
				display:function(){
					return '<div class="fields" id="field'+opt.identifier+'-'+this.index+'"><div class="arrow ui-icon ui-icon-play "></div><div class="remove ui-icon ui-icon-trash "></div><label>'+this.title+''+((this.required)?"*":"")+'</label><div class="dfield"><input class="field disabled '+this.size+'" type="text" value="'+htmlEncode(this.predefined)+'"/><span class="uh">'+this.userhelp+'</span></div><div class="clearer"></div></div>';
				},
				show:function(){
					return '<div class="fields '+this.csslayout+'" id="field'+opt.identifier+'-'+this.index+'"><label>'+this.title+''+((this.required)?"*":"")+'</label><div class="dfield"><input id="'+this.name+'" name="'+this.name+'" minlength="'+(this.minlength)+'" maxlength="'+htmlEncode(this.maxlength)+'" '+((this.equalTo!="")?"equalTo=\"#"+htmlEncode(this.equalTo+opt.identifier)+"\"":"" )+' class="field '+this.size+((this.required)?" required":"")+'" type="text" value="'+htmlEncode(this.predefined)+'"/><span class="uh">'+this.userhelp+'</span></div><div class="clearer"></div></div>';
				},
                showSpecialDataInstance: function() {
                    return '<div class="column"><label>Min length/characters</label><br /><input name="sMinlength" id="sMinlength" value="'+this.minlength+'"></div><div class="column"><label>Max length/characters</label><br /><input name="sMaxlength" id="sMaxlength" value="'+this.maxlength+'"></div><div class="clearer"></div>';
                }
		});
		var fpassword=function(){};
		$.extend(fpassword.prototype,ffields.prototype,{
				title:"Untitled",
				ftype:"fpassword",
				predefined:"",
				predefinedClick:false,
				required:false,
				size:"medium",
				minlength:"",
				maxlength:"",
				equalTo:"",
				display:function(){
					return '<div class="fields" id="field'+opt.identifier+'-'+this.index+'"><div class="arrow ui-icon ui-icon-play "></div><div class="remove ui-icon ui-icon-trash "></div><label>'+this.title+''+((this.required)?"*":"")+'</label><div class="dfield"><input class="field disabled '+this.size+'" type="password" value="'+htmlEncode(this.predefined)+'"/><span class="uh">'+this.userhelp+'</span></div><div class="clearer"></div></div>';
				},
				show:function(){
					return '<div class="fields '+this.csslayout+'" id="field'+opt.identifier+'-'+this.index+'"><label>'+this.title+''+((this.required)?"*":"")+'</label><div class="dfield"><input id="'+this.name+'" name="'+this.name+'" minlength="'+(this.minlength)+'" maxlength="'+htmlEncode(this.maxlength)+'" '+((this.equalTo!="")?"equalTo=\"#"+htmlEncode(this.equalTo+opt.identifier)+"\"":"" )+' class="field '+this.size+((this.required)?" required":"")+'" type="password" value="'+htmlEncode(this.predefined)+'"/><span class="uh">'+this.userhelp+'</span></div><div class="clearer"></div></div>';
				},
                showSpecialDataInstance: function() {
                    return '<div class="column"><label>Min length/characters</label><br /><input name="sMinlength" id="sMinlength" value="'+this.minlength+'"></div><div class="column"><label>Max length/characters</label><br /><input name="sMaxlength" id="sMaxlength" value="'+this.maxlength+'"></div><div class="clearer"></div>';
                }
		});
		var femail=function(){};
		$.extend(femail.prototype,ffields.prototype,{
				title:"Email",
				ftype:"femail",
				predefined:"",
				predefinedClick:false,
				required:false,
				size:"medium",
				equalTo:"",
				display:function(){
					return '<div class="fields" id="field'+opt.identifier+'-'+this.index+'"><div class="arrow ui-icon ui-icon-play "></div><div class="remove ui-icon ui-icon-trash "></div><label>'+this.title+''+((this.required)?"*":"")+'</label><div class="dfield"><input class="field disabled '+this.size+'" type="text" value="'+htmlEncode(this.predefined)+'"/><span class="uh">'+this.userhelp+'</span></div><div class="clearer"></div></div>';
				},
				show:function(){
					return '<div class="fields '+this.csslayout+'" id="field'+opt.identifier+'-'+this.index+'"><label>'+this.title+''+((this.required)?"*":"")+'</label><div class="dfield"><input id="'+this.name+'" name="'+this.name+'" '+((this.equalTo!="")?"equalTo=\"#"+htmlEncode(this.equalTo+opt.identifier)+"\"":"" )+' class="field email '+this.size+((this.required)?" required":"")+'" type="text" value="'+htmlEncode(this.predefined)+'"/><span class="uh">'+this.userhelp+'</span></div><div class="clearer"></div></div>';
				},
                showSpecialDataInstance: function() {
                    var str = "";
                    return str;
                }
		});
		var fnumber=function(){};
		$.extend(fnumber.prototype,ffields.prototype,{
				title:"Number",
				ftype:"fnumber",
				predefined:"",
				predefinedClick:false,
				required:false,
				size:"small",
				min:"",
				max:"",
				dformat:"digits",
				formats:new Array("digits","number"),
				display:function(){
					return '<div class="fields" id="field'+opt.identifier+'-'+this.index+'"><div class="arrow ui-icon ui-icon-play "></div><div class="remove ui-icon ui-icon-trash "></div><label>'+this.title+''+((this.required)?"*":"")+'</label><div class="dfield"><input class="field disabled '+this.size+'" type="text" value="'+htmlEncode(this.predefined)+'"/><span class="uh">'+this.userhelp+'</span></div><div class="clearer"></div></div>';
				},
				show:function(){
					return '<div class="fields '+this.csslayout+'" id="field'+opt.identifier+'-'+this.index+'"><label>'+this.title+''+((this.required)?"*":"")+'</label><div class="dfield"><input id="'+this.name+'" name="'+this.name+'" min="'+this.min+'" max="'+this.max+'" class="field '+this.dformat+' '+this.size+((this.required)?" required":"")+'" type="text" value="'+htmlEncode(this.predefined)+'"/><span class="uh">'+this.userhelp+'</span></div><div class="clearer"></div></div>';
				},
				showFormatIntance: function() {
					var str = "";
					for (var i=0;i<this.formats.length;i++)
						str += '<option value="'+this.formats[i]+'" '+((this.formats[i]==this.dformat)?"selected":"")+'>'+this.formats[i]+'</option>';
					return '<div><label>Number Format</label><br /><select name="sFormat" id="sFormat">'+str+'</select></div>';
				},
				showRangeIntance: function() {
					return '<div class="column"><label>Min</label><br /><input name="sMin" id="sMin" value="'+this.min+'"></div><div class="column"><label>Max</label><br /><input name="sMax" id="sMax" value="'+this.max+'"></div><div class="clearer"></div>';
				}
		});
		var fdate=function(){};
		$.extend(fdate.prototype,ffields.prototype,{
				title:"Date",
				ftype:"fdate",
				predefined:"",
				predefinedClick:false,
				size:"medium",
				required:false,
				dformat:"mm/dd/yyyy",
				showDropdown:false,
				dropdownRange:"-10:+10",
                minDate:"",
                maxDate:"",
                defaultDate:"",
				formats:new Array("mm/dd/yyyy","dd/mm/yyyy"),
				display:function(){
					return '';
				},
				show:function(){
					return '';
				},
				showFormatIntance: function() {
					var str = "";
					for (var i=0;i<this.formats.length;i++)
						str += '<option value="'+this.formats[i]+'" '+((this.formats[i]==this.dformat)?"selected":"")+'>'+this.formats[i]+'</option>';
					return '<div><label>Date Format</label><br /><select name="sFormat" id="sFormat">'+str+'</select></div>';
				},
                showSpecialDataInstance: function() {
                    var str = "";
                    str += '<div><label>Default date [<a class="helpfbuilder" text="You can put one of the following type of values into this field:\n\nEmpty: Leave empty for current date.\n\nDate: A Fixed date with the same date format indicated in the &quot;Date Format&quot; drop-down field.\n\nNumber: A number of days from today. For example 2 represents two days from today and -1 represents yesterday.\n\nString: A smart text indicating a relative date. Relative dates must contain value (number) and period pairs; valid periods are &quot;y&quot; for years, &quot;m&quot; for months, &quot;w&quot; for weeks, and &quot;d&quot; for days. For example, &quot;+1m +7d&quot; represents one month and seven days from today.">help?</a>]</label><br /><input class="medium" name="sDefaultDate" id="sDefaultDate" value="'+this.defaultDate+'" /></div>';
                    str += '<div><label>Min date [<a class="helpfbuilder" text="You can put one of the following type of values into this field:\n\nEmpty: No min Date.\n\nDate: A Fixed date with the same date format indicated in the &quot;Date Format&quot; drop-down field.\n\nNumber: A number of days from today. For example 2 represents two days from today and -1 represents yesterday.\n\nString: A smart text indicating a relative date. Relative dates must contain value (number) and period pairs; valid periods are &quot;y&quot; for years, &quot;m&quot; for months, &quot;w&quot; for weeks, and &quot;d&quot; for days. For example, &quot;+1m +7d&quot; represents one month and seven days from today.">help?</a>]</label><br /><input class="medium" name="sMinDate" id="sMinDate" value="'+this.minDate+'" /></div>';
                    str += '<div><label>Max date [<a class="helpfbuilder" text="You can put one of the following type of values into this field:\n\nEmpty: No max Date.\n\nDate: A Fixed date with the same date format indicated in the &quot;Date Format&quot; drop-down field.\n\nNumber: A number of days from today. For example 2 represents two days from today and -1 represents yesterday.\n\nString: A smart text indicating a relative date. Relative dates must contain value (number) and period pairs; valid periods are &quot;y&quot; for years, &quot;m&quot; for months, &quot;w&quot; for weeks, and &quot;d&quot; for days. For example, &quot;+1m +7d&quot; represents one month and seven days from today.">help?</a>]</label><br /><input class="medium" name="sMaxDate" id="sMaxDate" value="'+this.maxDate+'" /></div>';
                    str += '<div><input type="checkbox" name="sShowDropdown" id="sShowDropdown" '+((this.showDropdown)?"checked":"")+'/><label>Show Dropdown Year and Month</label><div id="divdropdownRange" style="display:'+((this.showDropdown)?"":"none")+'">Year Range [<a class="helpfbuilder" text="The range of years displayed in the year drop-down: either relative to today\'s year (&quot;-nn:+nn&quot;), absolute (&quot;nnnn:nnnn&quot;), or combinations of these formats (&quot;nnnn:-nn&quot;)">help?</a>]: <input type="text" name="sDropdownRange" id="sDropdownRange" value="'+htmlEncode(this.dropdownRange)+'"/></div></div>';
                    return str;
                }
		});
		var ftextarea=function(){};
		$.extend(ftextarea.prototype,ffields.prototype,{
				title:"Untitled",
				ftype:"ftextarea",
				predefined:"",
				predefinedClick:false,
				required:false,
				size:"medium",
				minlength:"",
				maxlength:"",
				display:function(){
					return '<div class="fields" id="field'+opt.identifier+'-'+this.index+'"><div class="arrow ui-icon ui-icon-play "></div><div class="remove ui-icon ui-icon-trash "></div><label>'+this.title+''+((this.required)?"*":"")+'</label><div class="dfield"><textarea class="field disabled '+this.size+'">'+this.predefined+'</textarea><span class="uh">'+this.userhelp+'</span></div><div class="clearer"></div></div>';
				},
				show:function(){
					return '<div class="fields '+this.csslayout+'" id="field'+opt.identifier+'-'+this.index+'"><label>'+this.title+''+((this.required)?"*":"")+'</label><div class="dfield"><textarea id="'+this.name+'" name="'+this.name+'" minlength="'+(this.minlength)+'" maxlength="'+htmlEncode(this.maxlength)+'" class="field '+this.size+((this.required)?" required":"")+'">'+this.predefined+'</textarea><span class="uh">'+this.userhelp+'</span></div><div class="clearer"></div></div>';
				},
                showSpecialDataInstance: function() {
                    return '<div class="column"><label>Min length/characters</label><br /><input name="sMinlength" id="sMinlength" value="'+this.minlength+'"></div><div class="column"><label>Max length/characters</label><br /><input name="sMaxlength" id="sMaxlength" value="'+this.maxlength+'"></div><div class="clearer"></div>';
                }
		});
		var ffile=function(){};
		$.extend(ffile.prototype,ffields.prototype,{
				title:"Untitled",
				ftype:"ffile",
				required:false,
				size:"medium",
				display:function(){
					return '<div class="fields" id="field'+opt.identifier+'-'+this.index+'"><div class="arrow ui-icon ui-icon-play "></div><div class="remove ui-icon ui-icon-trash "></div><label>'+this.title+''+((this.required)?"*":"")+'</label><div class="dfield"><input type="file" class="field disabled '+this.size+'" /><span class="uh">'+this.userhelp+'</span></div><div class="clearer"></div></div>';
				},
				show:function(){
					return '<div class="fields '+this.csslayout+'" id="field'+opt.identifier+'-'+this.index+'"><label>'+this.title+''+((this.required)?"*":"")+'</label><div class="dfield"><input type="file" id="'+this.name+'" name="'+this.name+'" class="field '+this.size+((this.required)?" required":"")+'" /><span class="uh">'+this.userhelp+'</span></div><div class="clearer"></div></div>';
				}
		});
		var fSectionBreak=function(){};
		$.extend(fSectionBreak.prototype,ffields.prototype,{
				title:"Section Break",
				ftype:"fSectionBreak",
				userhelp:"A description of the section goes here.",
				display:function(){
					return '<div class="fields" id="field'+opt.identifier+'-'+this.index+'"><div class="arrow ui-icon ui-icon-play "></div><div class="remove ui-icon ui-icon-trash "></div><div class="section_break"></div><label>'+this.title+'</label><span class="uh">'+this.userhelp+'</span><div class="clearer"></div></div>';
				},
				show:function(){
                        return '<div class="fields '+this.csslayout+' section_breaks" id="field'+opt.identifier+'-'+this.index+'"><div class="section_break" id="'+this.name+'" ></div><label>'+this.title+'</label><span class="uh">'+this.userhelp+'</span><div class="clearer"></div></div>';
				}
		});
		var fPageBreak=function(){};
		$.extend(fPageBreak.prototype,ffields.prototype,{
				title:"Page Break",
				ftype:"fPageBreak",
				display:function(){
					return '<div class="fields" id="field'+opt.identifier+'-'+this.index+'"><div class="arrow ui-icon ui-icon-play "></div><div class="remove ui-icon ui-icon-trash "></div><div class="section_break"></div><label>'+this.title+'</label><span class="uh">'+this.userhelp+'</span><div class="clearer"></div></div>';
				},
				show:function(){
                        return '<div class="fields '+this.csslayout+' section_breaks" id="field'+opt.identifier+'-'+this.index+'"><div class="section_break" id="'+this.name+'" ></div><label>'+this.title+'</label><span class="uh">'+this.userhelp+'</span><div class="clearer"></div></div>';
				}
		});
		var fPhone=function(){};
		$.extend(fPhone.prototype,ffields.prototype,{
				title:"Phone",
				ftype:"fPhone",
				required:false,
				dformat:"### ### ####",
				predefined:"888 888 8888",
				display:function(){
				    var str = "";
				    var tmp = this.dformat.split(' ');
				    var tmpv = this.predefined.split(' ');
				    for (var i=0;i<tmpv.length;i++)
				        if ($.trim(tmpv[i])=="")
				            tmpv.splice(i,1);
				    for (var i=0;i<tmp.length;i++)
				        if ($.trim(tmp[i])!="")
				            str += '<div class="uh_phone" ><input type="text" class="field disabled" style="width:'+(15*$.trim(tmp[i]).length)+'px" value="'+((tmpv[i])?tmpv[i]:"")+'" maxlength="'+$.trim(tmp[i]).length+'" /><div class="l">'+$.trim(tmp[i])+'</div></div>';
					return '<div class="fields" id="field'+opt.identifier+'-'+this.index+'"><div class="arrow ui-icon ui-icon-play "></div><div class="remove ui-icon ui-icon-trash "></div><label>'+this.title+''+((this.required)?"*":"")+'</label><div class="dfield">'+str+'<span class="uh">'+this.userhelp+'</span></div><div class="clearer"></div></div>';
				},
				show:function(){
				    var str = "";
				    var tmp = this.dformat.split(' ');
				    var tmpv = this.predefined.split(' ');
				    for (var i=0;i<tmpv.length;i++)
				        if ($.trim(tmpv[i])=="")
				            tmpv.splice(i,1);
				    for (var i=0;i<tmp.length;i++)
				        if ($.trim(tmp[i])!="")
				            str += '<div class="uh_phone" ><input type="text" id="'+this.name+'_'+i+'" name="'+this.name+'_'+i+'" class="field digits '+((this.required)?" required":"")+'" style="width:'+(15*$.trim(tmp[i]).length)+'px" value="'+((tmpv[i])?tmpv[i]:"")+'" maxlength="'+$.trim(tmp[i]).length+'" minlength="'+$.trim(tmp[i]).length+'"/><div class="l">'+$.trim(tmp[i])+'</div></div>';
					return '<div class="fields '+this.csslayout+'" id="field'+opt.identifier+'-'+this.index+'"><label>'+this.title+''+((this.required)?"*":"")+'</label><div class="dfield"><input type="hidden" id="'+this.name+'" name="'+this.name+'" class="field " />'+str+'<span class="uh">'+this.userhelp+'</span></div><div class="clearer"></div></div>';
				},
				showFormatIntance: function() {
					return '<div><label>Number Format</label><br /><input type="text" name="sFormat" id="sFormat" value="'+this.dformat+'" /></div>';
				}
		});
		var fCommentArea=function(){};
		$.extend(fCommentArea.prototype,ffields.prototype,{
				title:"Comments here",
				ftype:"fCommentArea",
				userhelp:"A description of the section goes here.",
				display:function(){
					return '<div class="fields" id="field'+opt.identifier+'-'+this.index+'"><div class="arrow ui-icon ui-icon-play "></div><div class="remove ui-icon ui-icon-trash "></div><label>'+this.title+'</label><span class="uh">'+this.userhelp+'</span><div class="clearer"></div></div>';
				},
				show:function(){
                        return '<div class="fields '+this.csslayout+' comment_area" id="field'+opt.identifier+'-'+this.index+'"><label id="'+this.name+'">'+this.title+'</label><span class="uh">'+this.userhelp+'</span><div class="clearer"></div></div>';
				}
		});
		var fcheck=function(){};
		$.extend(fcheck.prototype,ffields.prototype,{
				title:"Check All That Apply",
				ftype:"fcheck",
				layout:"one_column",
				required:false,
				showDep:false,
				init:function(){
					this.choices = new Array("First Choice","Second Choice","Third Choice");
					this.choicesVal = new Array("First Choice","Second Choice","Third Choice");
					this.choiceSelected = new Array(false,false,false);
					this.choicesDep = new Array(new Array(),new Array(),new Array());
				},
				display:function(){
				    this.choicesVal = ((typeof(this.choicesVal) != "undefined" && this.choicesVal !== null)?this.choicesVal:this.choices.slice(0));
					var str = "";
					for (var i=0;i<this.choices.length;i++)
						str += '<div class="'+this.layout+'"><input class="field" disabled="true" type="checkbox" '+((this.choiceSelected[i])?"checked":"")+'/> '+this.choices[i]+'</div>';
					return '<div class="fields" id="field'+opt.identifier+'-'+this.index+'"><div class="arrow ui-icon ui-icon-play "></div><div class="remove ui-icon ui-icon-trash "></div><label>'+this.title+''+((this.required)?"*":"")+'</label><div class="dfield">'+str+'<span class="uh">'+this.userhelp+'</span></div><div class="clearer"></div></div>';
				},
				show:function(){
				    this.choicesVal = ((typeof(this.choicesVal) != "undefined" && this.choicesVal !== null)?this.choicesVal:this.choices.slice(0));
					var str = "";
					if (!(typeof(this.choicesDep) != "undefined" && this.choicesDep !== null))
					{
					    this.choicesDep = new Array();
					    for (var i=0;i<this.choices.length;i++)
					        this.choicesDep[i] = new Array();
					}
					for (var i=0;i<this.choices.length;i++)
					{
					    var classDep = "",attrDep = "";
					    var d = this.choicesDep;
					    if (d[i].length>0)
					    {
					        classDep = " depItem";
					        for (var j=0;j<d[i].length;j++)
					        {
					            attrDep += ","+d[i][j];
					        }
					    }
						str += '<div class="'+this.layout+'"><input name="'+this.name+'[]" '+((classDep!="")?"dep=\""+attrDep+"\"":"")+' id="'+this.name+'" class="field depItem group '+((this.required)?" required":"")+'" value="'+htmlEncode(this.choicesVal[i])+'" type="checkbox" '+((this.choiceSelected[i])?"checked":"")+'/> <span>'+this.choices[i]+'</span></div>';
					}
					return '<div class="fields '+this.csslayout+'" id="field'+opt.identifier+'-'+this.index+'"><label>'+this.title+''+((this.required)?"*":"")+'</label><div class="dfield">'+str+'<span class="uh">'+this.userhelp+'</span></div><div class="clearer"></div></div>';
				},
				showChoiceIntance: function() {
				    this.choicesVal = ((typeof(this.choicesVal) != "undefined" && this.choicesVal !== null)?this.choicesVal:this.choices.slice(0));
					var l = this.choices;
					var lv = this.choicesVal;
					var v = this.choiceSelected;
					if (!(typeof(this.choicesDep) != "undefined" && this.choicesDep !== null))
					{
					    this.choicesDep = new Array();
					    for (var i=0;i<l.length;i++)
					        this.choicesDep[i] = new Array();
					}
					var d = this.choicesDep;
					var str = "";
					for (var i=0;i<l.length;i++)
					{
						str += '<div class="choicesEdit"><input class="choice_check" i="'+i+'" type="checkbox" '+((this.choiceSelected[i])?"checked":"")+'/><input class="choice_text" i="'+i+'" type="text" name="sChoice'+this.name+'" id="sChoice'+this.name+'" value="'+htmlEncode(l[i])+'"/><input class="choice_value" i="'+i+'" type="text" name="sChoice'+this.name+'V'+i+'" id="sChoice'+this.name+'V'+i+'" value="'+htmlEncode(lv[i])+'"/><a class="choice_add ui-icon ui-icon-circle-plus" i="'+i+'" title="Add another choice."></a><a class="choice_remove ui-icon ui-icon-circle-minus" i="'+i+'" title="Delete this choice."></a></div>';
						for (var j=0;j<d[i].length;j++)
						    str += '<div class="choicesEditDep">If selected show: <select class="dependencies" i="'+i+'" j="'+j+'" dname="'+this.name+'" dvalue="'+d[i][j]+'" ></select><a class="choice_addDep ui-icon ui-icon-circle-plus" i="'+i+'" j="'+j+'" title="Add another dependency."></a><a class="choice_removeDep ui-icon ui-icon-circle-minus" i="'+i+'" j="'+j+'" title="Delete this dependency."></a></div>';
						if (d[i].length==0)
						    str += '<div class="choicesEditDep">If selected show: <select class="dependencies" i="'+i+'" j="'+d[i].length+'" dname="'+this.name+'" dvalue="" ></select><a class="choice_addDep ui-icon ui-icon-circle-plus" i="'+i+'" j="'+d[i].length+'" title="Add another dependency."></a><a class="choice_removeDep ui-icon ui-icon-circle-minus" i="'+i+'" j="'+d[i].length+'" title="Delete this dependency."></a></div>';
					}
					return '<div class="choicesSet '+((this.showDep)?"show":"hide")+'"><label>Choices</label> <a class="helpfbuilder dep" text="Dependencies are used to show/hide other fields depending of the option selected in this field.">help?</a> <a href="" class="showHideDependencies">'+((this.showDep)?"Hide":"Show")+' Dependencies</a><div><div class="t">Text</div><div class="t">Value</div><div class="clearer"></div></div>'+str+'</div>';
				}
		});
		var fradio=function(){};
		$.extend(fradio.prototype,ffields.prototype,{
				title:"Select a Choice",
				ftype:"fradio",
				layout:"one_column",
				required:false,
				choiceSelected:null,
				showDep:false,
				init:function(){
					this.choices = new Array("First Choice","Second Choice","Third Choice");
					this.choicesVal = new Array("First Choice","Second Choice","Third Choice");
					this.choicesDep = new Array(new Array(),new Array(),new Array());
				},
				display:function(){
				    this.choicesVal = ((typeof(this.choicesVal) != "undefined" && this.choicesVal !== null)?this.choicesVal:this.choices.slice(0));
					var str = "";
					for (var i=0;i<this.choices.length;i++)
						str += '<div class="'+this.layout+'"><input class="field" disabled="true" type="radio" i="'+i+'"  '+((this.choicesVal[i]==this.choiceSelected)?"checked":"")+'/> '+this.choices[i]+'</div>';
					return '<div class="fields" id="field'+opt.identifier+'-'+this.index+'"><div class="arrow ui-icon ui-icon-play "></div><div class="remove ui-icon ui-icon-trash "></div><label>'+this.title+''+((this.required)?"*":"")+'</label><div class="dfield">'+str+'<span class="uh">'+this.userhelp+'</span></div><div class="clearer"></div></div>';
				},
				show:function(){
				    this.choicesVal = ((typeof(this.choicesVal) != "undefined" && this.choicesVal !== null)?this.choicesVal:this.choices.slice(0));
					var str = "";
					if (!(typeof(this.choicesDep) != "undefined" && this.choicesDep !== null))
					{
					    this.choicesDep = new Array();
					    for (var i=0;i<this.choices.length;i++)
					        this.choicesDep[i] = new Array();
					}
					for (var i=0;i<this.choices.length;i++)
					{
					    var classDep = "",attrDep = "";
					    var d = this.choicesDep;
					    if (d[i].length>0)
					    {
					        classDep = " depItem";
					        for (var j=0;j<d[i].length;j++)
					        {
					            attrDep += ","+d[i][j];
					        }
					    }
					    str += '<div class="'+this.layout+'"><input name="'+this.name+'" id="'+this.name+'" '+((classDep!="")?"dep=\""+attrDep+"\"":"")+' class="field depItem group '+((this.required)?" required":"")+'" value="'+htmlEncode(this.choicesVal[i])+'" type="radio" i="'+i+'"  '+((this.choicesVal[i]==this.choiceSelected)?"checked":"")+'/> <span>'+this.choices[i]+'</span></div>';
					}
					return '<div class="fields '+this.csslayout+'" id="field'+opt.identifier+'-'+this.index+'"><label>'+this.title+''+((this.required)?"*":"")+'</label><div class="dfield">'+str+'<span class="uh">'+this.userhelp+'</span></div><div class="clearer"></div></div>';
				},
				showChoiceIntance: function() {
				    this.choicesVal = ((typeof(this.choicesVal) != "undefined" && this.choicesVal !== null)?this.choicesVal:this.choices.slice(0));
					var l = this.choices;
					var lv = this.choicesVal;
					var v = this.choiceSelected;
					if (!(typeof(this.choicesDep) != "undefined" && this.choicesDep !== null))
					{
					    this.choicesDep = new Array();
					    for (var i=0;i<l.length;i++)
					        this.choicesDep[i] = new Array();
					}
					var d = this.choicesDep;
					var str = "";
					for (var i=0;i<l.length;i++)
					{
						str += '<div class="choicesEdit"><input class="choice_radio" i="'+i+'" type="radio" '+((this.choiceSelected==lv[i])?"checked":"")+' name="choice_radio" /><input class="choice_text" i="'+i+'" type="text" name="sChoice'+this.name+'" id="sChoice'+this.name+'" value="'+htmlEncode(l[i])+'"/><input class="choice_value" i="'+i+'" type="text" name="sChoice'+this.name+'V'+i+'" id="sChoice'+this.name+'V'+i+'" value="'+htmlEncode(lv[i])+'"/><a class="choice_add ui-icon ui-icon-circle-plus" i="'+i+'" title="Add another choice."></a><a class="choice_remove ui-icon ui-icon-circle-minus" i="'+i+'" title="Delete this choice."></a></div>';
						for (var j=0;j<d[i].length;j++)
						    str += '<div class="choicesEditDep">If selected show: <select class="dependencies" i="'+i+'" j="'+j+'" dname="'+this.name+'" dvalue="'+d[i][j]+'" ></select><a class="choice_addDep ui-icon ui-icon-circle-plus" i="'+i+'" j="'+j+'" title="Add another dependency."></a><a class="choice_removeDep ui-icon ui-icon-circle-minus" i="'+i+'" j="'+j+'" title="Delete this dependency."></a></div>';
						if (d[i].length==0)
						    str += '<div class="choicesEditDep">If selected show: <select class="dependencies" i="'+i+'" j="'+d[i].length+'" dname="'+this.name+'" dvalue="" ></select><a class="choice_addDep ui-icon ui-icon-circle-plus" i="'+i+'" j="'+d[i].length+'" title="Add another dependency."></a><a class="choice_removeDep ui-icon ui-icon-circle-minus" i="'+i+'" j="'+d[i].length+'" title="Delete this dependency."></a></div>';
					}
					return '<div class="choicesSet '+((this.showDep)?"show":"hide")+'"><label>Choices</label> <a class="helpfbuilder dep" text="Dependencies are used to show/hide other fields depending of the option selected in this field.">help?</a> <a href="" class="showHideDependencies">'+((this.showDep)?"Hide":"Show")+' Dependencies</a><div><div class="t">Text</div><div class="t">Value</div><div class="clearer"></div></div>'+str+'</div>';
				}
		});
		var fdropdown=function(){};
		$.extend(fdropdown.prototype,ffields.prototype,{
				title:"Select a Choice",
				ftype:"fdropdown",
				size:"medium",
				required:false,
				choiceSelected:"",
				showDep:false,
				init:function(){
					this.choices = new Array("First Choice","Second Choice","Third Choice");
					this.choicesVal = new Array("First Choice","Second Choice","Third Choice");
					this.choicesDep = new Array(new Array(),new Array(),new Array());
				},
				display:function(){
				    this.choicesVal = ((typeof(this.choicesVal) != "undefined" && this.choicesVal !== null)?this.choicesVal:this.choices.slice(0));
					return '<div class="fields" id="field'+opt.identifier+'-'+this.index+'"><div class="arrow ui-icon ui-icon-play "></div><div class="remove ui-icon ui-icon-trash "></div><label>'+this.title+''+((this.required)?"*":"")+'</label><div class="dfield"><select class="field disabled '+this.size+'" ><option>'+this.choiceSelected+'</option></select><span class="uh">'+this.userhelp+'</span></div><div class="clearer"></div></div>';
				},
				show:function(){
				    this.choicesVal = ((typeof(this.choicesVal) != "undefined" && this.choicesVal !== null)?this.choicesVal:this.choices.slice(0));
					var l = this.choices;
					var v = this.choiceSelected;
					var str = "";
					if (!(typeof(this.choicesDep) != "undefined" && this.choicesDep !== null))
					{
					    this.choicesDep = new Array();
					    for (var i=0;i<this.choices.length;i++)
					        this.choicesDep[i] = new Array();
					}
					for (var i=0;i<this.choices.length;i++)
					{
					    var classDep = "",attrDep = "";
					    var d = this.choicesDep;
					    if (d[i].length>0)
					    {
					        classDep = " depItem";
					        for (var j=0;j<d[i].length;j++)
					        {
					            attrDep += ","+d[i][j];
					        }
					    }
					    str += '<option '+((classDep!="")?"dep=\""+attrDep+"\"":"")+' '+((this.choiceSelected==this.choicesVal[i])?"selected":"")+' class="depItem" value="'+htmlEncode(this.choicesVal[i])+'">'+l[i]+'</option>';
					}
					return '<div class="fields '+this.csslayout+'" id="field'+opt.identifier+'-'+this.index+'"><label>'+this.title+''+((this.required)?"*":"")+'</label><div class="dfield"><select id="'+this.name+'" name="'+this.name+'" class="field depItemSel '+this.size+((this.required)?" required":"")+'" >'+str+'</select><span class="uh">'+this.userhelp+'</span></div><div class="clearer"></div><div class="clearer"></div></div>';
				},
				showChoiceIntance: function() {
				    this.choicesVal = ((typeof(this.choicesVal) != "undefined" && this.choicesVal !== null)?this.choicesVal:this.choices.slice(0));
					var l = this.choices;
					var lv = this.choicesVal;
					var v = this.choiceSelected;
					if (!(typeof(this.choicesDep) != "undefined" && this.choicesDep !== null))
					{
					    this.choicesDep = new Array();
					    for (var i=0;i<l.length;i++)
					        this.choicesDep[i] = new Array();
					}
					var d = this.choicesDep;
					var str = "";
					for (var i=0;i<l.length;i++)
					{
						str += '<div class="choicesEdit"><input class="choice_select" i="'+i+'" type="radio" '+((this.choiceSelected==lv[i])?"checked":"")+' name="choice_select" /><input class="choice_text" i="'+i+'" type="text" name="sChoice'+this.name+'" id="sChoice'+this.name+'" value="'+htmlEncode(l[i])+'"/><input class="choice_value" i="'+i+'" type="text" name="sChoice'+this.name+'V'+i+'" id="sChoice'+this.name+'V'+i+'" value="'+htmlEncode(lv[i])+'"/><a class="choice_add ui-icon ui-icon-circle-plus" i="'+i+'" title="Add another choice."></a><a class="choice_remove ui-icon ui-icon-circle-minus" i="'+i+'" title="Delete this choice."></a></div>';
					    for (var j=0;j<d[i].length;j++)
						    str += '<div class="choicesEditDep">If selected show: <select class="dependencies" i="'+i+'" j="'+j+'" dname="'+this.name+'" dvalue="'+d[i][j]+'" ></select><a class="choice_addDep ui-icon ui-icon-circle-plus" i="'+i+'" j="'+j+'" title="Add another dependency."></a><a class="choice_removeDep ui-icon ui-icon-circle-minus" i="'+i+'" j="'+j+'" title="Delete this dependency."></a></div>';
						if (d[i].length==0)
						    str += '<div class="choicesEditDep">If selected show: <select class="dependencies" i="'+i+'" j="'+d[i].length+'" dname="'+this.name+'" dvalue="" ></select><a class="choice_addDep ui-icon ui-icon-circle-plus" i="'+i+'" j="'+d[i].length+'" title="Add another dependency."></a><a class="choice_removeDep ui-icon ui-icon-circle-minus" i="'+i+'" j="'+d[i].length+'" title="Delete this dependency."></a></div>';
					}
					return '<div class="choicesSet '+((this.showDep)?"show":"hide")+'"><label>Choices</label> <a class="helpfbuilder dep" text="Dependencies are used to show/hide other fields depending of the option selected in this field.">help?</a> <a href="" class="showHideDependencies">'+((this.showDep)?"Hide":"Show")+' Dependencies</a><div><div class="t">Text</div><div class="t">Value</div><div class="clearer"></div></div>'+str+'</div>';
				}
		});
		if (!opt.pub)
		{
			$("#fieldlist"+opt.identifier).sortable({
			   start: function(event, ui) {
				   var start_pos = ui.item.index();
				   ui.item.data('start_pos', start_pos);
			   },
			   stop: function(event, ui) {
				   var end_pos = parseInt(ui.item.index());
				   var start_pos = parseInt(ui.item.data('start_pos'));
				   var tmp = items[start_pos];
				   if (end_pos > start_pos)
				   {
					   for (var i = start_pos; i<end_pos; i++)
						   items[i] = items[i+1];
				   }
				   else
				   {
					   for (var i = start_pos; i>end_pos; i--)
						   items[i] = items[i-1];
				   }
				   items[end_pos] = tmp;


				   reloadItems();
			   }
			});
		}
		if (!opt.pub)
		{
			$('#tabs').tabs({activate: function(event, ui) {
                   if ($(this).tabs( "option", "active" )!=1)
                   {
                       $(".fields").removeClass("ui-selected");
                       itemSelected = -2;
                       if ($(this).tabs( "option", "active" )==2)
                       {
                           $(".fform").addClass("ui-selected");
                           editForm();
                       }
                       else
                           $(".fform").removeClass("ui-selected");
                   }
				   else
				   {
					   $(".fform").removeClass("ui-selected");
					   if (itemSelected<0)
						   $('#tabs-2').html('<b>No Field Selected</b><br />Please click on a field in the form preview on the right to change its properties.');
				   }
			   }
		   });
		}
	   loadtmp = function(p)
	   {

		   if ( d = $.parseJSON(p))
		   {
			   if (d.length==2)
			   {
				   items = new Array();
				   for (var i=0;i<d[0].length;i++)
				   {
					   var obj = eval("new "+d[0][i].ftype+"();");
					   obj = $.extend(obj,d[0][i]);
					   obj.name = obj.name+opt.identifier;
					   items[items.length] = obj;
				   }
				   theForm = new fform();
				   theForm = $.extend(theForm,d[1][0]);
				   if (opt.pub)
					   reloadItemsPublic();
				   else
					   reloadItems();
			   }
		   }
	   }
	   var ffunct = {
		   getItems: function() {
			   return items;
		   },
		   addItem: function(id) {
			   var obj = eval("new "+id+"();")
			   obj.init();
			   var n = 0;
			   for (var i=0;i<items.length;i++)
			   {
				   n1 = parseInt(items[i].name.replace(/fieldname/g,""));
				   if (n1>n)
					   n = n1;
			   }
			   $.extend(obj,{name:"fieldname"+(n+1)});
			   items[items.length] = obj;
			   reloadItems();
		   },
		   saveData:function(f){
			   if (f!="")
				   $("#"+f).val("["+ $.stringifyXX(items,false)+",["+ $.stringifyXX(theForm,false)+"]]");
			   else
			   {
				   $.ajax({
					   type: "POST",
					   url: "process.php?act=save",
					   data: "items="+ $.stringifyXX(items,true)+"&theForm="+ $.stringifyXX(theForm,true),
					   dataType: "json",
					   success: function (result) {
						   alert("The form has been saved!!!");
					   }
				   });
			   }
		   },
		   loadData:function(f){

			   if (f!="")
				   loadtmp($("#"+f).val());
			   else
			   {
				   $.ajax({async:false,
					   url: "process.php?act=load",
					   success: function (result) {
						   loadtmp(result.toString());
					   }
				   });
			   }
		   },
		   removeItem: removeItem,
		   editItem:editItem
	   }
	   this.fBuild = ffunct;
	   return this;
	}

	var fcount = 1;
        var fnum = "_"+fcount;
        while (eval("typeof cp_contactformtoemail_fbuilder_config"+fnum+" != 'undefined'"))
        {
            try {
            var cp_contactformtoemail_fbuilder_config = eval("cp_contactformtoemail_fbuilder_config"+fnum);
            var f = $("#fbuilder"+fnum).fbuilder($.parseJSON(cp_contactformtoemail_fbuilder_config.obj));
            f.fBuild.loadData("form_structure"+fnum);
            $("#cp_contactformtoemail_pform"+fnum).validate({
                ignore:".ignore",
			    errorElement: "div",
			    errorPlacement: function(e, element) {
			        if (element.hasClass('group'))
                        element = element.parent();
                    e.insertBefore(element);
                    e.addClass('message'); // add a class to the wrapper
                    e.css('position', 'absolute');
                    e.css('left',0 );
                    e.css('top',element.parent().outerHeight(true));
			    }
     		});
     		} catch (e) {}
	    	fcount++;
	    	fnum = "_"+fcount;
	    }
})(jQuery);
jQuery.holdReady(false);
});