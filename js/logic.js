/*
 * @author Юрий Зотов
 *
 */

window.onload = function() {

	/**
	 * @var {Object} rows FROM FILE data.js
	 * @var {Object} filters FROM FILE data.js
	 *
	 */

	"use strict";

	var matrix = [];

    /**
     * Генерирует выпадающие списки
     *
	 * @param {string} selector
	 * @param {Object} data
	 *
     */
    function initDropdownList(selector, data) {
	    data.forEach((value) => {
	        $(selector).append('<option value="'+ value +'">'+ value +'</option>');
	    });
	}

	/**
     * Подсчитывает сумму каждой колонки матрицы
     *
	 * @param {Object} matrix
	 * @returns {Object} sums
	 *
     */
    function sumByEachColumn(matrix) {
    	let sums = [];
		for(let i=0; i<matrix.length; i++) {
			for(let j=0; j<matrix[i].params.length; j++) {
				sums[j] = (sums[j] || 0) + (+(matrix[i].params[j]) || 0);
			}
		}
		return sums;
    }

    /**
     * Суммирует все элементы массива
     *
	 * @param {Object} array
	 * @returns {number} sum
	 *
     */
    function arraySum(array) {
		let sum = 0;
		for(let i = 0; i < array.length; i++) {
		    sum += array[i];
		}
		return sum;
	}

	/**
     * Генерирует таблицу
	 *
     * Т.к функция наиболее общего плана, то на вход
     * подаются настройки для отображения таблицы с данными
     * 
	 * @param {Object} objTableSettings {
	 *                   {Object} matrix - матрица данных
	 *                   {Object} columnsSumResult - массив с суммой по каждому столбцу 
	 *                   {number} total - Итого
	 *                 }
     */
	function buildTable(objTableSettings) {
		var tableString = "";
		for (let row = 0; row < objTableSettings.matrix.length; row++) {
		    tableString += "<tr>";
		    tableString += "<td><input class=\"rowCheckbox\" type=\"checkbox\"></td>";
		    tableString += "<td class=\"table-item-name\"><a href=\"#\">"+ objTableSettings.matrix[row].name +"</a></td>";
		    tableString += "<td>";
		    tableString += "<div class=\"colorLine\"><span class=\"s1\"></span><span class=\"s2\"></span><span class=\"s3\"></span><span class=\"s4\">0%</span></div>";
		    tableString += "</td>";
		    for (let col = 0; col < objTableSettings.matrix[row].params.length; col++) {
		        tableString += "<td>"+ objTableSettings.matrix[row].params[col] + "</td>";
		    }
		    tableString += "</tr>";
		}

		var tableStringFoot = "<tr>";
		tableStringFoot += "<td></td>";
		tableStringFoot += "<td></td>";
		tableStringFoot += "<td>"+ "Итого ("+ objTableSettings.total +")" +"</td>";
	    for (let i = 0; i < objTableSettings.columnsSumResult.length; i++) {
	        tableStringFoot += "<td>"+ (objTableSettings.columnsSumResult[i]) + "</td>";
	    }
	    tableStringFoot+= "<td></td>";
	    tableStringFoot += "</tr>";
		//$("#targettable").find("thead").append(tableStringHead);
		$("#targettable").find("tbody").append(tableString);
		$("#targettable").find("tfoot").append(tableStringFoot);
	}

	/**
     * Очищает таблицу
     *
	 * @param {string} selector
	 *
     */
	function clearTable(selector) {
		$(selector).find("tbody").empty();
		$("#targettable").find("tfoot").empty();
	}

	/**
     * Вывод всех записей таблицы
     */
	function displayAll() {
	    for(let i=0; i<rows.length; i++) {
			matrix.push({
	    		name : rows[i].name, 
	    		params : rows[i].params
	    	});
		}
		if(matrix.length > 0) {
			var columnsSumResult = sumByEachColumn(matrix);
	    	var total = arraySum(columnsSumResult);
	    	buildTable({matrix, columnsSumResult, total});
		}
	}

	function displayFiltered(target) {
		matrix = [];
		clearTable("#targettable");
		var selectedFiltersData = [];
		selectedFiltersData.push($('#filter1').val());
		selectedFiltersData.push($('#filter2').val());
		selectedFiltersData.push($('#filter3').val());
		var mainFilter = $(target).val();
		for(let i=0; i<filters.length; i++) {
        	let mainFilterAttribute = filters[i].mainFilterAttribute;
        	let attributes = filters[i].attributes;
        	let exists = attributes.some(v => selectedFiltersData.includes(v));

        	if(exists || mainFilterAttribute === mainFilter) {
        		matrix.push({
        			name : rows[i].name, 
        			params : rows[i].params
        		});
        	}
        }
        if(matrix.length > 0) {
			var columnsSumResult = sumByEachColumn(matrix);
        	var total = arraySum(columnsSumResult);
	    	buildTable({matrix, columnsSumResult, total});
    	} else {
    		clearTable("#targettable");
    	}
	}
	
	$('#all_btn').on('click', function(){
		matrix = [];
		clearTable("#targettable");
		for(let i=0; i<rows.length; i++) {
    		matrix.push({
        		name : rows[i].name, 
        		params : rows[i].params
        	});
		}
		if(matrix.length > 0) {
			var columnsSumResult = sumByEachColumn(matrix);
        	var total = arraySum(columnsSumResult);
	    	buildTable({matrix, columnsSumResult, total});
    	}
	});

	$("input[name='mainFilter']").on('click', function() {
		displayFiltered(this);
	});

	$("select").on('change', function() {
		displayFiltered(this);
	});

	$("#tableSearchField").on('keyup', function() {
		var find = [];
		let searchValue =  $(this).val();
		if(searchValue || false) {
			for(let i=0; i<matrix.length; i++ ) {
				if(matrix[i].name.indexOf(searchValue) > -1) {
					find.push({
			    		name : matrix[i].name, 
			    		params : matrix[i].params
	    			});
				}
			}
			if(find.length > 0){
				clearTable("#targettable");
				let columnsSumResult = sumByEachColumn(find);
			    let total = arraySum(columnsSumResult);
				buildTable({
					matrix: find, 
					columnsSumResult, 
					total
				});
			}
		}
	});

	$("#checkAllRows").on('click', function() {
		if($(this).attr('checked')) {
			$(".rowCheckbox").each(function() {
				$(this).attr('checked', true);
			});
		} else {
			$(".rowCheckbox").each(function() {
				$(this).attr('checked', false);
			});
		}
	});

	initDropdownList($('#filter1'), ["A1", "B1", "C1"]);
	initDropdownList($('#filter2'), ["A2", "B2", "C2"]);
	initDropdownList($('#filter3'), ["A3", "B3", "C3"]);
    displayAll();
 	var tableStringHead = "";

 	// Не показываем гаголовок соответствующего столбца, 
 	// если в нем встречается хоть один символ "-"
	var emptyHeaderIndexes = [];
	matrix.forEach(obj=>{
		obj.params.forEach((value, key, arr) => {
			if(value == "-") {
				emptyHeaderIndexes.push(key);
			}
		});
	});

	// Генерация динамической части шапки таблицы (param1, param2, etc.)
	for (let col = 0; col < matrix[0].params.length; col++) {
    	if(emptyHeaderIndexes.includes(col) ) {
        		tableStringHead += "<td></td>";
    	} else {
    		tableStringHead += "<td>"+ "param" + (col+1) + "</td>";
    	}
    }
    $("#preMatrix").after(tableStringHead);
	
};