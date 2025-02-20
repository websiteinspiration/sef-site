$(function () {
    loadNavAndFooter('/assets/content/static');  //relative path to content directory
});

let mentors = []
let mentees = []
let years = []

//search mentors and mentees
$(document).ready(function () {
    $("#search").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#mentorProfiles tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
        $("#menteeProfiles tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    $$('div.tags').find('input:checkbox').live('click', function () {
        $('#mentorProfiles > tr').hide();
        $('#menteeProfiles > tr').hide();
        $('div.tags').find('input:checked').each(function () {
            $('#mentorProfiles > tr.' + $(this).val()).show();
        });
        $('div.tags').find('input:checked').each(function () {
            $('#menteeProfiles > tr.' + $(this).val()).show();
        });
    });
});

//mentor mentee transition
$(document).ready(function(){
    $('#selection').on('change', function(){
    	var selectedValue = $(this).val();
        if(selectedValue === "mentees"){
            $("#showMentees").show();
            $("#showMentors").hide();
            $("#university-filter").show();
            $("#industry-filter").hide();
        } else if(selectedValue === "mentors"){
            $("#showMentees").hide();
            $("#showMentors").show();
            $("#university-filter").hide();
            $("#industry-filter").show();
        }      
    });
});

const data_url = "https://script.google.com/macros/s/AKfycbxxuC5tlaEQpYBFnf09fsgxMgc6--97F6iOXo2mtxNgwwrp2ukzirlComP_GPjY8amN/exec";

async function getData() {
    const response = await fetch(data_url);
    const data = await response.json();
    return data;
}

async function loadData() {
    const {data}  = await getData();
    for(let i=0; i<data.length; i++){
        years.push(data[i].year)
        if (data[i].type == "mentor"){
            mentors.push(data[i])
        }else {
            mentees.push(data[i])
        }
    }
    years = [...new Set(years)]
    renderAllProfiles();
    renderCohortCheckboxes();
}
loadData();
function renderProfiles(mentorYear,menteeYear) {
    let mentorProfiles = Mustache.render($("#templateMentors").html(), { "mentorProfiles": mentorYear });
    let menteeProfiles = Mustache.render($("#templateMentees").html(), { "menteeProfiles": menteeYear });
    $("#mentorProfiles").html(mentorProfiles);
    $("#menteeProfiles").html(menteeProfiles);
}
function renderAllProfiles() {
    let mentorProfiles = Mustache.render($("#templateMentors").html(), { "mentorProfiles": mentors });
    let menteeProfiles = Mustache.render($("#templateMentees").html(), { "menteeProfiles": mentees });
    $("#mentorProfiles").html(mentorProfiles);
    $("#menteeProfiles").html(menteeProfiles);
}
function renderCohortCheckboxes(){
    const data = { checkboxes: years.map(function(year) {
        return { id: year };
    }) };
    let template = document.getElementById("cohort").innerHTML;
    let output = Mustache.render(template, data);
    document.getElementById("cohort-filters").innerHTML = output;
}
function filterByYear() {
    const selectedYears = years.filter((year) => document.getElementById(year).checked);
    if (selectedYears.length == 0 || selectedYears.length == years.length) {
       renderAllProfiles();
       return;
    }
    filteredMentors = mentors.filter((mentor) => selectedYears.includes(mentor.year));
    filteredMentees = mentees.filter((mentee) => selectedYears.includes(mentee.year));
    renderProfiles(filteredMentors, filteredMentees);
 }
