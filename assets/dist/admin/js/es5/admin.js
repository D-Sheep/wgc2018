"use strict";tinyMCE.baseURL=baseUrl+"/assets/dist/vendor/tinymce",tinymce.init({selector:".tinymce--simple",menubar:!1,plugins:"link code fullscreen paste nonbreaking",entity_encoding:"raw",relative_urls:!1,remove_script_host:!1,toolbar:["undo redo | bold italic | link | nonbreaking removeformat code fullscreen"],paste_as_text:!0});var FileManager={$modal:null,init:function(e){var t=this;this.$modal=$("#filemanager_modal").modal({onHidden:function(){$(this).empty()}}),$(e).click(function(e){e.preventDefault(),t.popModal($(e.target))})},popModal:function(e){var t=$("<iframe>",{css:{width:"100%",height:"80vh"},src:filemanagerPopupUrl+"/"+e.data("input-id")});this.$modal.append(t),this.$modal.modal("show").height("80%")},processSelectedFile:function(e,t){$("#"+t).val(e).trigger("change"),$("#"+t+"_img").prop("src",baseUrl+"/"+e),this.$modal.modal("hide")}};FileManager.init(".filemanager__trigger"),function(){var e=$(".ui.form"),t=$(".ui.dropdown");e.form({fields:{name:{identifier:"name",rules:[{type:"empty",prompt:"Please enter your name"}]},skills:{identifier:"skills",rules:[{type:"minCount[2]",prompt:"Please select at least two skills"}]},gender:{identifier:"gender",rules:[{type:"empty",prompt:"Please select a gender"}]},username:{identifier:"username",rules:[{type:"empty",prompt:"Please enter a username"}]},password:{identifier:"password",rules:[{type:"empty",prompt:"Please enter a password"},{type:"minLength[6]",prompt:"Your password must be at least {ruleValue} characters"}]},terms:{identifier:"terms",rules:[{type:"checked",prompt:"You must agree to the terms and conditions"}]}}}),t.dropdown()}();var DeleteResource={requests:[],init:function(e){this.bind(e)},bind:function(e){var t=this;$(e).click(function(e){e.preventDefault();var n=$(e.currentTarget);swal($.extend({},swalDefaults,{type:"question",title:"Opravdu chcete smazat "+n.data("name")+"?",confirmButtonClass:"ui green button",showCancelButton:!0,confirmButtonText:"Ano, smazat",cancelButtonText:"Nechci!"})).then(function(e){e.value&&t["delete"](n)})})},"delete":function(e){var t=this,n=e.attr("href");return n in this.requests?!1:void(this.requests[n]=$.ajax({url:n,method:"POST",headers:{"X-CSRF-TOKEN":csrfToken},data:{_method:"DELETE"},beforeSend:function(){e.addClass("disabled")}}).done(function(t){swal($.extend({},swalDefaults,{type:"success",title:"Smazáno"})),e.closest("tr").remove()}).fail(function(t){swal($.extend({},swalDefaults,{type:"error",title:"Chyba "+t.status+": ",text:t.responseJSON.message})),console.log(t),e.removeClass("disabled")}).always(function(){delete t.requests[n]}))}};DeleteResource.init(".delete-item");var swalDefaults={animation:!1,customClass:"fadeInDown",buttonsStyling:!1,confirmButtonClass:"ui blue button",cancelButtonClass:"ui red button",reverseButtons:!0};